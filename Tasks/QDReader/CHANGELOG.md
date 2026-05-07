# Changelog

本文档记录起点读书签到脚本的主要变更。

## 2026-05-07

- Cookie 抓取改为存储完整原始 Cookie，区分新增与更新，无变化时跳过通知。
- Cookie 抓取兼容无 QDHeader 场景，支持从响应体 `Data.UserId` 识别账号。
- 修复 Node.js 环境下未读取本地缓存导致提示"未配置任何账号"的问题。
- 修复签名服务在 QDHeader deviceHash 为空时未回退 QDH 解密的问题。
- 补充 Surge / Loon / Quantumult X 配置文件，更新线上脚本地址。
- Loon / Quantumult X 抓取改为响应体触发，提升无 QDHeader 用户的兼容性。
- README 补充使用说明、订阅链接、通知参数和风险说明。
- 新增 `.env.example`，补充 Node.js / 青龙面板通知渠道配置示例。

## 2026-05-05

- 支持多账号自动签到，已签到自动跳过。
- 支持 Cookie 抓取，自动识别账号并持久化存储。
- 超时请求自动重试，默认 3 次。
- 通知包含账号昵称、签到时间和状态。
- 支持 Surge / Loon / Quantumult X 订阅。
- 支持 Node.js / 青龙面板运行，兼容多种通知渠道。
