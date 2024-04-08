/******************************************
 * @name 支付宝收取能量提示
 * @description 支付宝收取能量提示|优化代码
 * @statement 修改自网络 删减一部分功能 仅自用 原脚本未标注作者
 * @author 𝒀𝒖𝒉𝒆𝒏𝒈
 * @update 20230713
 * @version 1.0.0
******************************************

[task_local]
55 7 * * * https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/energy-collection.js, tag=蚂蚁森林收能量

******************************************/
const $ = new Tools('🐜🌲收能量~'); $.notify("支付宝", "收能量啦", ">_ 点击通知跳转至🐜🌲", "alipay://platformapi/startapp?appId=60000002"), $.done()
// prettier-ignore
function Tools(scriptName) { this.startTime = (new Date).getTime(), this.name = scriptName, this.isQuanX = "undefined" != typeof $task, this.isLoon = "undefined" != typeof $loon, this.isSurge = "undefined" != typeof $httpClient && "undefined" != typeof $utils, this.isNode = "function" == typeof require, this.log = (...logs) => console.log([...logs].join("\n")), this.getEnv = () => this.isQuanX ? "QuanX" : this.isSurge ? "Surge" : this.isLoon ? "Loon" : this.isNode ? "Node" : void 0, this.log("", `🔔${this.name}, 开始!`), this.log("", `==============当前环境:${this.getEnv()}==============`), this.notify = (title = this.name, subtitle = "", content = "", options = {}) => { "string" == typeof options && /:\/\//.test(options) && (options = { "open-url": options }); const openURL = options["open-url"] || "", mediaURL = options["media-url"] || "", { isQuanX: isQuanX, isSurge: isSurge, isLoon: isLoon, isNode: isNode } = this; if (Object.keys(options).length > 0 && Object.keys(options).forEach(key => (!options[key] || !/:\/\//.test(options[key])) && delete options[key]), isNode) { let logs = ["", "==============📣系统通知📣=============="]; logs.push(title), subtitle && logs.push(subtitle), content && logs.push(content + (openURL ? `\n点击跳转: ${openURL}` : "") + (mediaURL ? `\n多媒体: ${mediaURL}` : "")), console.log(logs.join("\n")) } isQuanX && $notify(title, subtitle, content, options), isSurge && $notification.post(title, subtitle, content + `${mediaURL ? "\n多媒体:" + mediaURL : ""}`, { url: openURL }), isLoon && (0 === Object.keys(options).length ? $notification.post(title, subtitle, content) : $notification.post(title, subtitle, content, { openUrl: openURL, mediaUrl: mediaURL })) }, this.done = (val = {}) => { const endTime = (new Date).getTime(), costTime = (endTime - this.startTime) / 1e3; switch (this.log("", `🔔${this.name}, 结束! 🕛 ${costTime} 秒`), this.getEnv()) { case "QuanX": case "Surge": case "Loon": default: $done(val); break; case "Node": process.exit(1) } } }