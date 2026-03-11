/**
 * 开发调试专用的抓包入口
 * 与正式版抓包逻辑完全一致，主要便于开发者本地构建测试时不污染正式发布文件
 */
import { runRequestCapture } from "./handler.js";

runRequestCapture();
