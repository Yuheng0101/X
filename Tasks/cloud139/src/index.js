/**
 * 正式脚本入口文件
 * 主要用于加载全局配置并启动脚本主体流程
 */
import { Console, done } from "@nsnanocat/util";
import packageJson from "../package.json";
import cloud139Config from "../cloud139.config.js";
import { loadConfig } from "./common/config.js";
import { runCloud139 } from "./lib/core.js";

const NAME = packageJson.scriptMeta.displayName;
const { runStart, runFailed } = cloud139Config.messages;

/**
 * 脚本主执行函数
 * - 加载配置
 * - 捕获全局异常
 * - 输出通知机制
 */
async function main() {
  try {
    Console.log(`\n${NAME} ${runStart}`);
    await runCloud139(loadConfig());
  } catch (error) {
    Console.log(`${NAME} ${runFailed}: ${error?.message || String(error)}`);
    Console.error(error instanceof Error ? error : new Error(String(error)));
  } finally {
    done({});
  }
}

main();
