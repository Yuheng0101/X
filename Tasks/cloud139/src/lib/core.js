/**
 * 主流程核心控制器
 * - 负责解析并拆分多账号 Cookie
 * - 按顺序编排并执行各个账号的任务
 * - 收集所有运行结果并发送统一通知
 */
import { Console, notification } from "@nsnanocat/util";
import packageJson from "../../package.json";
import cloud139Config from "../../cloud139.config.js";
import { loadConfig } from "../common/config.js";
import { Reporter, randomWait, splitAccounts } from "../common/helpers.js";
import { Cloud139Account } from "./account.js";

const NAME = packageJson.scriptMeta.displayName;
const { missingCookie, runCompleted } = cloud139Config.messages;

/**
 * 执行中国移动云盘的主线任务
 * @param {Object} config - 包含用户配置(如cookie, upload选项等)的配置项对象
 * @returns {Promise<{summary: string, reporter: Reporter}>} 返回运行结果摘要和汇报对象
 */
export async function runCloud139(config = loadConfig()) {
    if (!config.cookie) throw new Error(missingCookie);

    const cookies = splitAccounts(config.cookie);
    const reporter = new Reporter();

    reporter.info(`${NAME} 共获取到 ${cookies.length} 个账号`);

    // 循环依次执行每个账号的签到任务
    for (let index = 0; index < cookies.length; index += 1) {
        reporter.section(`第 ${index + 1} 个账号`);
        const account = new Cloud139Account(cookies[index], config, reporter);
        await account.run();

        // 除了最后一个账号，其余账号执行完后随机延迟一段时间，防止并发风控
        if (index < cookies.length - 1) {
            await randomWait(5000, 10000);
        }
    }

    const summary = reporter.renderSummary();
    Console.log(summary);

    if (config.push) {
        notification?.(NAME, runCompleted, summary);
    }

    return { summary, reporter };
}

export { loadConfig } from "../common/config.js";
