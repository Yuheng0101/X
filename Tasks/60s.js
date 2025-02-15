/******************************************
 * @name 每天60秒读懂世界
 * @channel https://t.me/yqc_123
 * @feedback https://t.me/yqc_777
 * @version 1.6.0
******************************************
## 更新日志

### 20250215
    使用git监听

### 20250206
    c_1715391799055720448 该专栏已不再更新, 转为监听 速阅天下事[98-18-69-57]

### 20241213
    使用 `https://www.zhihu.com/column/c_1715391799055720448` 栏目来进行通知
    新增原文/全图选择开关

### 20241104
    修复图片源失效的问题

### 20240716
    1.重构代码
    2.修改通知变量名(青龙环境请将sendNotify放置于脚本同目录)
    3.增加备用接口
    4.不再使用缓存模块 - cheerio.js [可进行搜索并赋值为空]

### 20240512
    1.优化通知
    2.适配新版surge图片通知

### 20240312

    1.优化在Surge上的通知
    2.修复Loon在iOS16上存在媒体不通知的情况

###

    使用补齐版cheerio，感谢 @苍井灰灰 灰佬提供的转换思路。

### 20231123

    增加一条备用地址, 以防止接口挂掉。

### 20231121

    考虑到【微语】几乎展示不出来，提前到副标题。

### 20231114

    1.因知乎原帖作者已不在维护, 只得另辟蹊径, 目前使用的是非官方相关内容, 故同步时间会有所延迟, 建议将定时调到 `9:30` 以后。
    2.适配青龙通知, 自行调整 `sendNotify.js` 的位置。

### 20231024

    1.适配通知, 只展示可可用长度的内容, 点击通知查看详细内容。

## 脚本声明

    1.此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
    2.由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
    3.请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
    4.此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
    5.本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
    6.如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
    7.所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明, 本人保留随时更改或补充此声明的权利, 一旦您使用或复制了此脚本，即视为您已接受此免责声明。

## 使用方法

### 配置 (QuanX)

```properties
[task_local]
30 9 * * * https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/60s.js, tag=每天60秒读懂世界, img-url=https://raw.githubusercontent.com/Yuheng0101/X/main/Assets/60s.png, enabled=true
```

### 配置 (Loon)

```properties
[Script]
cron "30 9 * * *" script-path=https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/60s.js, timeout=10, tag=每天60秒读懂世界, img-url=https://raw.githubusercontent.com/Yuheng0101/X/main/Assets/60s.png
```

### 配置 (Surge)

```properties
每天60秒读懂世界 = type=cron,cronexp=0 30 9 * * *,wake-system=1,script-path=https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/60s.js,timeout=60
```

### 致谢

[@vikiboss](https://github.com/vikiboss/60s)

[@速阅天下事](https://www.zhihu.com/people/98-18-69-57)

[@二喵带你看世界](https://www.zhihu.com/column/c_1715391799055720448)

[@virgilClyne](github.com/virgilClyne)

[@cheerio](https://github.com/cheeriojs/cheerio)

[@苍井灰灰](https://github.com/wf021325)

[@每天60秒读懂世界](https://www.zhihu.com/people/mt36501)

[@小竣博客](https://www.jun.la/60snews)

[@设计导航](https://www.designnavs.com/60s)

[@冷筱宇](https://www.789dl.cn/zb.html)

******************************************/
(()=>{"use strict";var e={},t={};function a(s){var o=t[s];if(void 0!==o)return o.exports;var r=t[s]={exports:{}};return e[s](r,r.exports,a),r.exports}a.rv=function(){return"1.1.5"},a.ruid="bundler=rspack@1.1.5";const s=(()=>{const e=Object.keys(globalThis);switch(!0){case e.includes("$task"):return"Quantumult X";case e.includes("$loon"):return"Loon";case e.includes("$rocket"):return"Shadowrocket";case"undefined"!=typeof module:return"Node.js";case e.includes("Egern"):return"Egern";case e.includes("$environment"):return $environment["surge-version"]?"Surge":$environment["stash-version"]?"Stash":void 0;default:return}})();class o{static#e=new Map([]);static#t=[];static#a=new Map([]);static clear=()=>{};static count=(e="default")=>{switch(o.#e.has(e)){case!0:o.#e.set(e,o.#e.get(e)+1);break;case!1:o.#e.set(e,0)}o.log(`${e}: ${o.#e.get(e)}`)};static countReset=(e="default")=>{switch(o.#e.has(e)){case!0:o.#e.set(e,0),o.log(`${e}: ${o.#e.get(e)}`);break;case!1:o.warn(`Counter "${e}" doesn’t exist`)}};static debug=(...e)=>{o.#s<4||(e=e.map((e=>`🅱️ ${e}`)),o.log(...e))};static error(...e){if(!(o.#s<1)){switch(s){case"Surge":case"Loon":case"Stash":case"Egern":case"Shadowrocket":case"Quantumult X":default:e=e.map((e=>`❌ ${e}`));break;case"Node.js":e=e.map((e=>`❌ ${e.stack}`))}o.log(...e)}}static exception=(...e)=>o.error(...e);static group=e=>o.#t.unshift(e);static groupEnd=()=>o.#t.shift();static info(...e){o.#s<3||(e=e.map((e=>`ℹ️ ${e}`)),o.log(...e))}static#s=2;static get logLevel(){switch(o.#s){case 0:return"OFF";case 1:return"ERROR";case 2:default:return"WARN";case 3:return"INFO";case 4:return"DEBUG";case 5:return"ALL"}}static set logLevel(e){switch(typeof e){case"string":e=e.toLowerCase();break;case"number":break;default:e="warn"}switch(e){case 0:case"off":o.#s=0;break;case 1:case"error":o.#s=1;break;case 2:case"warn":case"warning":default:o.#s=2;break;case 3:case"info":o.#s=3;break;case 4:case"debug":o.#s=4;break;case 5:case"all":o.#s=5}}static log=(...e)=>{0!==o.#s&&(e=e.map((e=>{switch(typeof e){case"object":e=JSON.stringify(e);break;case"bigint":case"number":case"boolean":case"string":e=e.toString()}return e})),o.#t.forEach((t=>{e=e.map((e=>`  ${e}`)),e.unshift(`▼ ${t}:`)})),e=["",...e],console.log(e.join("\n")))};static time=(e="default")=>o.#a.set(e,Date.now());static timeEnd=(e="default")=>o.#a.delete(e);static timeLog=(e="default")=>{const t=o.#a.get(e);t?o.log(`${e}: ${Date.now()-t}ms`):o.warn(`Timer "${e}" doesn’t exist`)};static warn(...e){o.#s<2||(e=e.map((e=>`⚠️ ${e}`)),o.log(...e))}}class r{static get(e={},t="",a=void 0){Array.isArray(t)||(t=r.toPath(t));const s=t.reduce(((e,t)=>Object(e)[t]),e);return void 0===s?a:s}static set(e,t,a){return Array.isArray(t)||(t=r.toPath(t)),t.slice(0,-1).reduce(((e,a,s)=>Object(e[a])===e[a]?e[a]:e[a]=/^\d+$/.test(t[s+1])?[]:{}),e)[t[t.length-1]]=a,e}static unset(e={},t=""){Array.isArray(t)||(t=r.toPath(t));const a=t.reduce(((e,a,s)=>s===t.length-1?(delete e[a],!0):Object(e)[a]),e);return a}static toPath(e){return e.replace(/\[(\d+)\]/g,".$1").split(".").filter(Boolean)}static escape(e){const t={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};return e.replace(/[&<>"']/g,(e=>t[e]))}static unescape(e){const t={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'"};return e.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g,(e=>t[e]))}}const i={100:"HTTP/1.1 100 Continue",101:"HTTP/1.1 101 Switching Protocols",102:"HTTP/1.1 102 Processing",103:"HTTP/1.1 103 Early Hints",200:"HTTP/1.1 200 OK",201:"HTTP/1.1 201 Created",202:"HTTP/1.1 202 Accepted",203:"HTTP/1.1 203 Non-Authoritative Information",204:"HTTP/1.1 204 No Content",205:"HTTP/1.1 205 Reset Content",206:"HTTP/1.1 206 Partial Content",207:"HTTP/1.1 207 Multi-Status",208:"HTTP/1.1 208 Already Reported",226:"HTTP/1.1 226 IM Used",300:"HTTP/1.1 300 Multiple Choices",301:"HTTP/1.1 301 Moved Permanently",302:"HTTP/1.1 302 Found",304:"HTTP/1.1 304 Not Modified",307:"HTTP/1.1 307 Temporary Redirect",308:"HTTP/1.1 308 Permanent Redirect",400:"HTTP/1.1 400 Bad Request",401:"HTTP/1.1 401 Unauthorized",402:"HTTP/1.1 402 Payment Required",403:"HTTP/1.1 403 Forbidden",404:"HTTP/1.1 404 Not Found",405:"HTTP/1.1 405 Method Not Allowed",406:"HTTP/1.1 406 Not Acceptable",407:"HTTP/1.1 407 Proxy Authentication Required",408:"HTTP/1.1 408 Request Timeout",409:"HTTP/1.1 409 Conflict",410:"HTTP/1.1 410 Gone",411:"HTTP/1.1 411 Length Required",412:"HTTP/1.1 412 Precondition Failed",413:"HTTP/1.1 413 Content Too Large",414:"HTTP/1.1 414 URI Too Long",415:"HTTP/1.1 415 Unsupported Media Type",416:"HTTP/1.1 416 Range Not Satisfiable",417:"HTTP/1.1 417 Expectation Failed",418:"HTTP/1.1 418 I'm a teapot",421:"HTTP/1.1 421 Misdirected Request",422:"HTTP/1.1 422 Unprocessable Entity",423:"HTTP/1.1 423 Locked",424:"HTTP/1.1 424 Failed Dependency",425:"HTTP/1.1 425 Too Early",426:"HTTP/1.1 426 Upgrade Required",428:"HTTP/1.1 428 Precondition Required",429:"HTTP/1.1 429 Too Many Requests",431:"HTTP/1.1 431 Request Header Fields Too Large",451:"HTTP/1.1 451 Unavailable For Legal Reasons",500:"HTTP/1.1 500 Internal Server Error",501:"HTTP/1.1 501 Not Implemented",502:"HTTP/1.1 502 Bad Gateway",503:"HTTP/1.1 503 Service Unavailable",504:"HTTP/1.1 504 Gateway Timeout",505:"HTTP/1.1 505 HTTP Version Not Supported",506:"HTTP/1.1 506 Variant Also Negotiates",507:"HTTP/1.1 507 Insufficient Storage",508:"HTTP/1.1 508 Loop Detected",510:"HTTP/1.1 510 Not Extended",511:"HTTP/1.1 511 Network Authentication Required"};const c=e=>{const t={};switch(typeof e){case void 0:break;case"string":case"number":case"boolean":switch(s){case"Surge":case"Stash":case"Egern":default:t.url=e;break;case"Loon":case"Shadowrocket":t.openUrl=e;break;case"Quantumult X":t["open-url"]=e;case"Node.js":}break;case"object":{const a=e.open||e["open-url"]||e.url||e.openUrl,o=e.copy||e["update-pasteboard"]||e.updatePasteboard,r=e.media||e["media-url"]||e.mediaUrl;switch(s){case"Surge":case"Stash":case"Egern":case"Shadowrocket":default:if(a&&(t.action="open-url",t.url=a),o&&(t.action="clipboard",t.text=o),r)switch(!0){case r.startsWith("http"):t["media-url"]=r;break;case r.startsWith("data:"):{const a=/^data:(?<MIME>\w+\/\w+);base64,(?<Base64>.+)/,{MIME:s,Base64:o}=r.match(a).groups;t["media-base64"]=o,t["media-base64-mime"]=e.mime||s;break}default:switch(t["media-base64"]=r,!0){case r.startsWith("CiVQREYt"):case r.startsWith("JVBERi0"):t["media-base64-mime"]="application/pdf";break;case r.startsWith("R0lGODdh"):case r.startsWith("R0lGODlh"):t["media-base64-mime"]="image/gif";break;case r.startsWith("iVBORw0KGgo"):t["media-base64-mime"]="image/png";break;case r.startsWith("/9j/"):t["media-base64-mime"]="image/jpg";break;case r.startsWith("Qk02U"):t["media-base64-mime"]="image/bmp"}}e["auto-dismiss"]&&(t["auto-dismiss"]=e["auto-dismiss"]),e.sound&&(t.sound=e.sound);break;case"Loon":a&&(t.openUrl=a),r?.startsWith("http")&&(t.mediaUrl=r);break;case"Quantumult X":a&&(t["open-url"]=a),r?.startsWith("http")&&(t["media-url"]=r),o&&(t["update-pasteboard"]=o);case"Node.js":}break}default:o.error("不支持的通知参数类型: "+typeof e,"")}return t};async function n(e,t){switch(e.constructor){case Object:e={...t,...e};break;case String:e={...t,url:e}}e.method||(e.method="GET",(e.body??e.bodyBytes)&&(e.method="POST")),delete e.headers?.Host,delete e.headers?.[":authority"],delete e.headers?.["Content-Length"],delete e.headers?.["content-length"];const a=e.method.toLocaleLowerCase();switch(s){case"Loon":case"Surge":case"Stash":case"Egern":case"Shadowrocket":default:if(e.timeout)switch(e.timeout=Number.parseInt(e.timeout,10),s){case"Loon":case"Shadowrocket":case"Stash":case"Egern":default:e.timeout=e.timeout/1e3;case"Surge":}if(e.policy)switch(s){case"Loon":e.node=e.policy;break;case"Stash":r.set(e,"headers.X-Stash-Selected-Proxy",encodeURI(e.policy));break;case"Shadowrocket":r.set(e,"headers.X-Surge-Proxy",e.policy)}switch("boolean"==typeof e.redirection&&(e["auto-redirect"]=e.redirection),e.bodyBytes&&!e.body&&(e.body=e.bodyBytes,e.bodyBytes=void 0),(e.headers?.Accept||e.headers?.accept)?.split(";")?.[0]){case"application/protobuf":case"application/x-protobuf":case"application/vnd.google.protobuf":case"application/vnd.apple.flatbuffer":case"application/grpc":case"application/grpc+proto":case"application/octet-stream":e["binary-mode"]=!0}return await new Promise(((t,s)=>{$httpClient[a](e,((a,o,r)=>{a?s(a):(o.ok=/^2\d\d$/.test(o.status),o.statusCode=o.status,r&&(o.body=r,1==e["binary-mode"]&&(o.bodyBytes=r)),t(o))}))}));case"Quantumult X":return e.policy&&r.set(e,"opts.policy",e.policy),"boolean"==typeof e["auto-redirect"]&&r.set(e,"opts.redirection",e["auto-redirect"]),e.body instanceof ArrayBuffer?(e.bodyBytes=e.body,e.body=void 0):ArrayBuffer.isView(e.body)?(e.bodyBytes=e.body.buffer.slice(e.body.byteOffset,e.body.byteLength+e.body.byteOffset),e.body=void 0):e.body&&(e.bodyBytes=void 0),await $task.fetch(e).then((e=>{switch(e.ok=/^2\d\d$/.test(e.statusCode),e.status=e.statusCode,(e.headers?.["Content-Type"]??e.headers?.["content-type"])?.split(";")?.[0]){case"application/protobuf":case"application/x-protobuf":case"application/vnd.google.protobuf":case"application/vnd.apple.flatbuffer":case"application/grpc":case"application/grpc+proto":case"application/octet-stream":e.body=e.bodyBytes}return e.bodyBytes=void 0,e}),(e=>Promise.reject(e.error)));case"Node.js":{const t=require("iconv-lite"),s=globalThis.got?globalThis.got:require("got"),r=globalThis.cktough?globalThis.cktough:require("tough-cookie"),i=globalThis.ckjar?globalThis.ckjar:new r.CookieJar;e&&(e.headers=e.headers?e.headers:{},void 0===e.headers.Cookie&&void 0===e.cookieJar&&(e.cookieJar=i));const{url:c,...n}=e;return await s[a](c,n).on("redirect",((e,t)=>{try{if(e.headers["set-cookie"]){const a=e.headers["set-cookie"].map(r.Cookie.parse).toString();a&&i.setCookieSync(a,null),t.cookieJar=i}}catch(e){o.error(e)}})).then((e=>(e.statusCode=e.status,e.body=t.decode(e.rawBody,"utf-8"),e.bodyBytes=e.rawBody,e)),(e=>Promise.reject(e.message)))}}}class d{static data=null;static dataFile="box.dat";static#o=/^@(?<key>[^.]+)(?:\.(?<path>.*))?$/;static getItem(e,t=null){let a=t;switch(e.startsWith("@")){case!0:{const{key:t,path:s}=e.match(d.#o)?.groups;e=t;let o=d.getItem(e,{});"object"!=typeof o&&(o={}),a=r.get(o,s);try{a=JSON.parse(a)}catch(e){}break}default:switch(s){case"Surge":case"Loon":case"Stash":case"Egern":case"Shadowrocket":a=$persistentStore.read(e);break;case"Quantumult X":a=$prefs.valueForKey(e);break;case"Node.js":d.data=d.#r(d.dataFile),a=d.data?.[e];break;default:a=d.data?.[e]||null}try{a=JSON.parse(a)}catch(e){}}return a??t}static setItem(e=new String,t=new String){let a=!1;if("object"==typeof t)t=JSON.stringify(t);else t=String(t);switch(e.startsWith("@")){case!0:{const{key:s,path:o}=e.match(d.#o)?.groups;e=s;let i=d.getItem(e,{});"object"!=typeof i&&(i={}),r.set(i,o,t),a=d.setItem(e,i);break}default:switch(s){case"Surge":case"Loon":case"Stash":case"Egern":case"Shadowrocket":a=$persistentStore.write(t,e);break;case"Quantumult X":a=$prefs.setValueForKey(t,e);break;case"Node.js":d.data=d.#r(d.dataFile),d.data[e]=t,d.#i(d.dataFile),a=!0;break;default:a=d.data?.[e]||null}}return a}static removeItem(e){let t=!1;switch(e.startsWith("@")){case!0:{const{key:a,path:s}=e.match(d.#o)?.groups;e=a;let o=d.getItem(e);"object"!=typeof o&&(o={}),keyValue=r.unset(o,s),t=d.setItem(e,o);break}default:switch(s){case"Surge":case"Loon":case"Stash":case"Egern":case"Shadowrocket":case"Node.js":default:t=!1;break;case"Quantumult X":t=$prefs.removeValueForKey(e)}}return t}static clear(){let e=!1;switch(s){case"Surge":case"Loon":case"Stash":case"Egern":case"Shadowrocket":case"Node.js":default:e=!1;break;case"Quantumult X":e=$prefs.removeAllValues()}return e}static#r=e=>{if("Node.js"!==s)return{};{this.fs=this.fs?this.fs:require("node:fs"),this.path=this.path?this.path:require("node:path");const t=this.path.resolve(e),a=this.path.resolve(process.cwd(),e),s=this.fs.existsSync(t),o=!s&&this.fs.existsSync(a);if(!s&&!o)return{};{const e=s?t:a;try{return JSON.parse(this.fs.readFileSync(e))}catch(e){return{}}}}};static#i=(e=this.dataFile)=>{if("Node.js"===s){this.fs=this.fs?this.fs:require("node:fs"),this.path=this.path?this.path:require("node:path");const t=this.path.resolve(e),a=this.path.resolve(process.cwd(),e),s=this.fs.existsSync(t),o=!s&&this.fs.existsSync(a),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):o?this.fs.writeFileSync(a,r):this.fs.writeFileSync(t,r)}}}const u=e=>{try{return JSON.parse(e)}catch{return e}},l=(e,...t)=>{if("string"==typeof e)return e;try{return JSON.stringify(e,...t)}catch{return e}};const p="undefined"!=typeof $argument?"object"==typeof $argument?$argument:Object.fromEntries($argument.split("&").map((e=>e.split("=")))):{},h="每天60秒读懂世界",b=((e,t=null)=>{const a=t?new Date(t):new Date;let s={"M+":a.getMonth()+1,"d+":a.getDate(),"H+":a.getHours(),"m+":a.getMinutes(),"s+":a.getSeconds(),"q+":Math.floor((a.getMonth()+3)/3),S:a.getMilliseconds()};/(y+)/.test(e)&&(e=e.replace(RegExp.$1,(a.getFullYear()+"").substr(4-RegExp.$1.length)));for(let t in s)new RegExp("("+t+")").test(e)&&(e=e.replace(RegExp.$1,1==RegExp.$1.length?s[t]:("00"+s[t]).substr((""+s[t]).length)));return e})("yyyy-MM-dd"),g=()=>"Node.js"===s;!function(){const e=["本脚本仅用于学习研究，禁止用于商业用途","本脚本不保证准确性、可靠性、完整性和及时性","任何个人或组织均可无需经过通知而自由使用","作者对任何脚本问题概不负责，包括由此产生的任何损失","如有单位或个人认为本脚本侵权，请通知并提供证明，我将删除","请勿将本脚本用于商业用途，由此引起的问题与作者无关","本脚本及其更新版权归作者所有","",`⌚ ${(new Date).toLocaleString("zh-CN",{timeZone:"PRC"})}`];o.log("==============📣免责声明📣==============",...e)}(),o.logLevel="true"==`${g()?process.env.ZAOBAO_DEBUG:p.debug||d.getItem("zaobao_debug")}`?"debug":"info",o.info(`日志等级: ${o.logLevel}`);const y="true"==`${d.getItem("zaobao_original_url")}`,f=g()?process.env.ZAOBAO_BARK_KEY:d.getItem("zaobao_bark_key");async function m(){const e=await n(`https://raw.githubusercontent.com/vikiboss/60s-static-host/main/static/60ss/${b}.json`);let t,a,r,i=h,d=await Promise.race([n("https://api.03c3.cn/api/zb").then((()=>"https://api.03c3.cn/api/zb")),n("https://api.2xb.cn/zaob").then((e=>u(e.body)?.imageUrl))]);if(e.ok){const s=u(e.body);i=h,t=s.tip,a=s.news.map(((e,t)=>`【${(e=>{const t=["𝟎","𝟏","𝟐","𝟑","𝟒","𝟓","𝟔","𝟕","𝟖","𝟗","𝐚","𝐛","𝐜","𝐝","𝐞","𝐟","𝐠","𝐡","𝐢","𝐣","𝐤","𝐥","𝐦","𝐧","𝐨","𝐩","𝐪","𝐫","𝐬","𝐭","𝐮","𝐯","𝐰","𝐱","𝐲","𝐳","𝐀","𝐁","𝐂","𝐃","𝐄","𝐅","𝐆","𝐇","𝐈","𝐉","𝐊","𝐋","𝐌","𝐍","𝐎","𝐏","𝐐","𝐑","𝐒","𝐓","𝐔","𝐕","𝐖","𝐗","𝐘","𝐙"],a={48:0,49:1,50:2,51:3,52:4,53:5,54:6,55:7,56:8,57:9,65:36,66:37,67:38,68:39,69:40,70:41,71:42,72:43,73:44,74:45,75:46,76:47,77:48,78:49,79:50,80:51,81:52,82:53,83:54,84:55,85:56,86:57,87:58,88:59,89:60,90:61,97:10,98:11,99:12,100:13,101:14,102:15,103:16,104:17,105:18,106:19,107:20,108:21,109:22,110:23,111:24,112:25,113:26,114:27,115:28,116:29,117:30,118:31,119:32,120:33,121:34,122:35};return e.replace(/[0-9A-z]/g,(e=>t[a[e.charCodeAt(0)]]))})(`${t+1}`.padStart(2,"0"))}】${e}`)),r=s.cover,y&&(d=s.link),o.group("📰content"),o.debug(...a),o.groupEnd()}else{t=await Promise.race([n("https://v1.hitokoto.cn/?c=a&encode=text").then((e=>e.body)),n("https://api.2xb.cn/RainbowWord").then((e=>e.body))]);const e="文字版接口暂未更新, 可尝试点击横幅跳转图文链接查看";o.warn(e),a=["⚠️ 异常通知",e]}o.group("🔈notification"),o.debug(i,t,d,r),o.groupEnd(),await async function(e,t,a,r){f?await async function(e,t,a,s={}){const r=s?.["open-url"]||s?.openUrl||s?.$open||s?.url||"",i=s?.["update-pasteboard"]||s?.updatePasteboard||s?.$copy||s?.copy||"",c=s?.["media-url"]||s?.mediaUrl||s?.$media||"";["open-url","openUrl","$open","url","update-pasteboard","updatePasteboard","$copy","copy","media-url","mediaUrl","$media"].forEach((e=>delete s[e])),t&&(a=t+"\n"+a);const d={...s,url:r,copy:i,icon:c,title:e,body:a},u={url:"https://api.day.app/"+f,headers:{"content-type":"application/json; charset=utf-8"},body:l(d)};for(let t=0;t<3;t++){o.info(`Bark第${t+1}次推送尝试`);const s=await n(u);if(s.ok){const t=["=========📣推送成功📣=========",e,a];r&&t.push(`跳转链接: ${r}`),i&&t.push(`复制内容: ${i}`),c&&t.push(`媒体链接: ${c}`),o.log(...t);break}o.warn("Bark推送失败",s.body||"")}}(e,t,a,r):function(e=`ℹ️ ${s} 通知`,t="",a="",r={}){switch(s){case"Surge":case"Loon":case"Stash":case"Egern":case"Shadowrocket":default:$notification.post(e,t,a,c(r));break;case"Quantumult X":$notify(e,t,a,c(r));case"Node.js":}o.log("==============📣系统通知📣==============",e,t,a,JSON.stringify(c(r),null,2))}(e,t,a,r)}(i,t,a.join("\n").replace(/\n$/,""),{mediaUrl:r,openUrl:d})}o.debug(f?"Bark密钥: "+f:"未开启Bark推送"),(async()=>{await m()})().catch((e=>{let t="";t=e instanceof Error?e.message:e,o.error(t)})).finally((function(e={}){switch(s){case"Surge":e.policy&&r.set(e,"headers.X-Surge-Policy",e.policy),o.log("🚩 执行结束!",`🕛 ${(new Date).getTime()/1e3-$script.startTime} 秒`),$done(e);break;case"Loon":e.policy&&(e.node=e.policy),o.log("🚩 执行结束!",`🕛 ${(new Date-$script.startTime)/1e3} 秒`),$done(e);break;case"Stash":e.policy&&r.set(e,"headers.X-Stash-Selected-Proxy",encodeURI(e.policy)),o.log("🚩 执行结束!",`🕛 ${(new Date-$script.startTime)/1e3} 秒`),$done(e);break;case"Egern":case"Shadowrocket":default:o.log("🚩 执行结束!"),$done(e);break;case"Quantumult X":switch(e.policy&&r.set(e,"opts.policy",e.policy),e["auto-redirect"]=void 0,e["auto-cookie"]=void 0,e["binary-mode"]=void 0,e.charset=void 0,e.host=void 0,e.insecure=void 0,e.method=void 0,e.ok=void 0,e.opt=void 0,e.path=void 0,e.policy=void 0,e["policy-descriptor"]=void 0,e.scheme=void 0,e.sessionIndex=void 0,e.statusCode=void 0,e.timeout=void 0,typeof e.status){case"number":e.status=i[e.status];break;case"string":case"undefined":break;default:e.status=void 0}e.body instanceof ArrayBuffer?(e.bodyBytes=e.body,e.body=void 0):ArrayBuffer.isView(e.body)?(e.bodyBytes=e.body.buffer.slice(e.body.byteOffset,e.body.byteLength+e.body.byteOffset),e.body=void 0):e.body&&(e.bodyBytes=void 0),o.log("🚩 执行结束!"),$done(e);break;case"Node.js":o.log("🚩 执行结束!"),process.exit(1)}}))})();