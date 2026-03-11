/**
 * 抓包处理核心逻辑
 * - 分析拦截到的请求头
 * - 提取 Authorization 等包含鉴权信息的字段
 * - 支持多账号情况下的合并写入与存储机制
 */
import { Console, Storage, done, notification } from "@nsnanocat/util";
import packageJson from "../../package.json";
import cloud139Config from "../../cloud139.config.js";
import { normalizeBasicAuthorization, parsePhoneFromAuthorization, splitAccounts } from "../common/helpers.js";

const STORAGE_KEYS = cloud139Config.storage.authKeys;
const TITLE = packageJson.scriptMeta.notifyTitle;
const { captureMissingAuthorization, captureStored, captureSuccess } = cloud139Config.messages;

/**
 * 抓包主运行函数，仅在 MitM (中间人攻击) 环境下触发
 * 负责解析 URL 是否匹配并提取请求头写入缓存
 */
export function runRequestCapture() {
    if (typeof $request === "undefined" || !$request) {
        return false;
    }

    const url = String($request.url || "");
    const capturePattern = new RegExp(cloud139Config.capture.urlPattern);
    if (!capturePattern.test(url)) {
        return false;
    }

    const authorization = findAuthorization($request.headers || {});
    if (!authorization) {
        Console.warn(captureMissingAuthorization);
        done($request);
        return true;
    }

    const normalizedAuthorization = normalizeBasicAuthorization(authorization);
    const phone = parsePhoneFromAuthorization(normalizedAuthorization);
    const merged = mergeAuthorizationByPhone(readStoredAccounts(), normalizedAuthorization, phone);

    if (!merged.changed) {
        Console.log(`${TITLE}${captureSuccess}: ${phone} (无需更新)`);
        done($request);
        return true;
    }

    STORAGE_KEYS.forEach((key) => Storage.setItem?.(key, merged.value));
    Console.log(`${TITLE}${captureSuccess}: ${phone}`);
    notification?.(TITLE, captureSuccess, `[${phone}]${captureStored}: ${normalizedAuthorization}`);
    done($request);
    return true;
}

/**
 * 在请求头集合中不论大小写智能匹配并返回 authorization 值
 */
function findAuthorization(headers) {
    const directValue = headers.authorization || headers.Authorization;
    if (directValue) {
        return String(directValue);
    }

    for (const key of Object.keys(headers)) {
        if (String(key).toLowerCase() === "authorization") {
            return String(headers[key]);
        }
    }

    return "";
}

/**
 * 读取当前持久化存储中保存的所有已有账号列表
 */
function readStoredAccounts() {
    for (const key of STORAGE_KEYS) {
        const value = Storage.getItem?.(key);
        if (typeof value !== "undefined" && value !== null && value !== "") {
            return splitAccounts(value);
        }
    }
    return [];
}

/**
 * 判断提取到的鉴权信息属于哪个手机号，并在多账号列表中找出更新或追加存储
 * @returns {Object} 包含是否发生了数据变更与合并后的完整字符串
 */
function mergeAuthorizationByPhone(accounts, authorization, phone) {
    const nextAccounts = accounts.slice();
    const targetPhone = String(phone || "");

    for (let index = 0; index < nextAccounts.length; index += 1) {
        const currentAuthorization = normalizeBasicAuthorization(nextAccounts[index]);
        const currentPhone = parsePhoneFromAuthorization(currentAuthorization);

        if (currentPhone !== targetPhone) {
            continue;
        }

        if (currentAuthorization === authorization) {
            return { changed: false, value: nextAccounts.join("@") };
        }

        nextAccounts[index] = authorization;
        return { changed: true, value: nextAccounts.join("@") };
    }

    nextAccounts.push(authorization);
    return { changed: true, value: nextAccounts.join("@") };
}
