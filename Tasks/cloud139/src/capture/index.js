/**
 * 抓包入口文件
 * 主要用于在各类代理软件（如 Surge, Quantumult X, Loon）中拦截含有鉴权信息的网络请求
 */
import { runRequestCapture } from "./handler.js";

runRequestCapture();
