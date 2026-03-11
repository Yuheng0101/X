/**
 * 配置读取模块
 * - 支持从不同客户端环境 (如 Surge/QX/Loon 的 $argument) 读取配置
 * - 支持按优先级从环境变量 (Node.js)、持久化存储 (@nsnanocat/util Storage) 以及默认值中读取配置
 */
import { $argument, Storage } from "@nsnanocat/util";
import cloud139Config from "../../cloud139.config.js";
import { toBoolean, toNumber } from "./helpers.js";

/**
 * 加载并聚合系统和用户配置
 * @returns {Object} 包含 cookie、上传参数等核心配置选项的字典
 */
export function loadConfig() {
    const args = $argument;
    const defaults = cloud139Config.runtime.defaults;
    const envPrefix = cloud139Config.runtime.envPrefix;

    return {
        cookie: firstValue(args, cloud139Config.storage.cookieKeys, readValue(cloud139Config.storage.cookieKeys, "")),
        uploadEnabled: toBoolean(
            firstValue(args, ["upload"], readValue([`${envPrefix}_UPLOAD`, "cloud139_upload"], defaults.upload))
        ),
        uploadDirId: String(
            firstValue(
                args,
                ["dirId", "dir_id"],
                readValue([`${envPrefix}_DIR_ID`, "cloud139_dir_id", "DIR_ID"], defaults.uploadDirId)
            ) || ""
        ),
        uploadFilename: String(
            firstValue(
                args,
                ["uploadFilename"],
                readValue([`${envPrefix}_UPLOAD_FILENAME`, "cloud139_upload_filename"], defaults.uploadFilename)
            ) || defaults.uploadFilename
        ),
        uploadSizeMb: toNumber(
            firstValue(
                args,
                ["uploadSizeMb"],
                readValue([`${envPrefix}_UPLOAD_SIZE_MB`, "cloud139_upload_size_mb"], defaults.uploadSizeMb)
            ),
            defaults.uploadSizeMb
        ),
        shareEnabled: toBoolean(
            firstValue(args, ["share"], readValue([`${envPrefix}_SHARE`, "cloud139_share"], defaults.share))
        ),
        shareFilename: String(
            firstValue(
                args,
                ["shareFilename"],
                readValue([`${envPrefix}_SHARE_FILENAME`, "cloud139_share_filename"], defaults.shareFilename)
            ) || ""
        ),
        push: toBoolean(firstValue(args, ["push"], readValue([`${envPrefix}_PUSH`, "cloud139_push"], defaults.push))),
        clickNum: toNumber(
            firstValue(args, ["clickNum"], readValue([`${envPrefix}_CLICK_NUM`, "cloud139_click_num"], defaults.clickNum)),
            defaults.clickNum
        ),
        drawTimes: toNumber(
            firstValue(args, ["drawTimes"], readValue([`${envPrefix}_DRAW_TIMES`, "cloud139_draw_times"], defaults.drawTimes)),
            defaults.drawTimes
        ),
        delayMin: toNumber(
            firstValue(args, ["delayMin"], readValue([`${envPrefix}_DELAY_MIN`, "cloud139_delay_min"], defaults.delayMin)),
            defaults.delayMin
        ),
        delayMax: toNumber(
            firstValue(args, ["delayMax"], readValue([`${envPrefix}_DELAY_MAX`, "cloud139_delay_max"], defaults.delayMax)),
            defaults.delayMax
        ),
        requestTimeout: toNumber(
            firstValue(args, ["timeout"], readValue([`${envPrefix}_TIMEOUT`, "cloud139_timeout"], defaults.timeout)),
            defaults.timeout
        )
    };
}

/**
 * 从对象中找到第一个匹配 key 的有效值，若无则使用回退值
 */
function firstValue(object, keys, fallback) {
    for (const key of keys) {
        const value = object[key];
        if (typeof value !== "undefined" && value !== null && value !== "") {
            return value;
        }
    }
    return fallback;
}

/**
 * 从环境变量或持久化存储中读取值，优先尝试 Node.js 环境变量
 */
function readValue(keys, fallback) {
    ensureDotEnvLoaded();
    const envObject = getRuntimeEnv();

    for (const key of keys) {
        if (typeof envObject[key] !== "undefined" && envObject[key] !== null && envObject[key] !== "") {
            return envObject[key];
        }

        try {
            const storageValue = Storage.getItem?.(key);
            if (typeof storageValue !== "undefined" && storageValue !== null && storageValue !== "") {
                return storageValue;
            }
        } catch (_) {}
    }

    return fallback;
}

function getRuntimeEnv() {
    return typeof process !== "undefined" && process.env ? process.env : {};
}

let dotEnvLoaded = false;

function ensureDotEnvLoaded() {
    if (dotEnvLoaded) return;
    dotEnvLoaded = true;

    if (typeof process === "undefined" || !process.versions?.node || typeof process.loadEnvFile !== "function") {
        return;
    }

    try {
        process.loadEnvFile(".env");
    } catch (_) {}
}
