/******************************************
 * @name 每天60秒读懂世界
 * @channel https://t.me/yqc_123
 * @feedback https://t.me/yqc_777
 * @version 1.1.0
******************************************
## 更新日志

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

[@cheerio](https://github.com/cheeriojs/cheerio)

[@苍井灰灰](https://github.com/wf021325)

[@每天60秒读懂世界](https://www.zhihu.com/people/mt36501)

[@小竣博客](https://www.jun.la/60snews)

[@冷筱宇](https://www.789dl.cn/zb.html)

******************************************/
const $ = new Env('每天60秒看懂世界')
const notify = $.isNode() ? require('./sendNotify') : ''
// 由于Surge通知过长会遮挡且点击后无法跳转日志, 在此做截断, 并且点击通知会跳转页面展示详情
const MAX_MESSAGE_COUNT = 200 
!(async () => {
    await loadRemoteScriptByCache('https://cdn.jsdelivr.net/gh/Yuheng0101/X@main/Utils/cheerio.js', 'createCheerio', 'cheerio')
    const junla = new JunLa()
    let { title, thumb, content, openURL } = await junla.getContentBackup()
    openURL = openURL || (await junla.getImageBackup())
    const subTitle = content[content.length - 1] // 微语提前
    const message = chunkBySize(content, MAX_MESSAGE_COUNT)
    await showNotification(title, subTitle, message, { 'open-url': openURL, 'media-url': thumb })
})()
    .catch((e) => $.log('', $.name + '获取内容失败', e, ''))
    .finally(() => $.done({}))
/**
 * 按照指定大小分割数组
 * @param {Array} arr 数组
 * @param {String|Number} size 分割总字数
 * @returns
 */
function chunkBySize(arr, size = MAX_MESSAGE_COUNT) {
    arr = typeof arr === 'string' ? arr.split('\n') : arr
    const resultText = `\n【温馨提示】点击通知查看全部`
    let message = []
    if ($.isNode()) {
        message = arr.join('\n').replace(/\n$/, '')
    } else {
        for (const item of arr) {
            if (message.join('\n').length >= size) {
                break
            }
            message.push(item)
        }
        message = `${message.join('\n').replace(/\n$/, '')}${resultText}`
    }
    return message
}
/**
 * 远程脚本加载
 * @param {String} scriptUrl 远程链接
 * @param {String} functionName 脚本内函数名
 * @param {String} scriptName 全局变量名
 * @returns
 */
function loadRemoteScriptByCache(scriptUrl, functionName, scriptName) {
    const cacheName = `${scriptName}.js`
    const cache = $.getdata(cacheName) || ``
    return new Promise((resolve, reject) => {
        if (cache) {
            eval(cache), ($[scriptName] = eval(functionName)())
            $.log(`☑️ 缓存加载${functionName}成功`)
            resolve()
        } else {
            fetchData({ url: scriptUrl, useProxy: true })
                .then((script) => {
                    eval(script), ($[scriptName] = eval(functionName)())
                    $.log(`☑️ 远程加载${functionName}成功`)
                    $.setdata(script, cacheName)
                    $.log(`☑️ 缓存${functionName}成功`)
                    resolve()
                })
                .catch((err) => {
                    $.logErr(`⚠️ 远程加载${functionName}失败`, err)
                    reject(err)
                })
        }
    })
}
/**
 * 请求封装
 * @param {Object|String} e 请求参数相关
 * @param {String} e.url 请求地址
 * @param {String} e.type 请求类型
 * @param {Object} e.headers 请求头
 * @param {String|Object} e.body 请求体
 * @param {Object} e.params 请求参数
 * @param {String} e.dataType 数据类型
 * @param {String} e.deviceType 设备类型
 * @param {String} e.resultType 返回类型
 * @param {Number} e.timeout 超时时间
 * @param {Boolean} e.useProxy 是否使用代理
 * @returns
 */
// prettier-ignore
async function fetchData(e){if("string"==typeof e&&(e={url:e}),!e?.url)throw new Error("[发送请求] 缺少 url 参数");try{let{url:o,type:r,headers:s={},body:n,params:i,dataType:a="form",deviceType:p="mobile",resultType:c="data",timeout:l=1e4,useProxy:u=!1,opts:m={}}=e;const y=r?r.toLowerCase():n?"post":"get";o+="post"===y&&i?`?${$.queryStr(i)}`:"",t=s,s=Object.fromEntries(Object.entries(t).map((([e,t])=>[e.toLowerCase(),t])));const h="pc"===p?"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299":"Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1";s["user-agent"]=s["user-agent"]||h,"json"===a&&(s["content-type"]="application/json;charset=UTF-8");const f={...e,url:o,method:y,headers:s,opts:m,timeout:$.isSurge()?l/1e3:l};if("get"===y&&i&&(f.params=i),"post"===y){const e="json"===a?$.toStr:$.queryStr;f.body=n&&("object"==typeof n?e(n):n)||n}if($.isNode()&&u){const{PROXY_HOST:e="127.0.0.1",PROXY_PORT:t=7890}=process.env,o=require("tunnel");f.agent={https:o.httpsOverHttp({proxy:{host:e,port:+t}})}}const w=new Promise(((e,t)=>{$[y](f,((r,s,n)=>{if(r){const e=n?`${$.toObj(n)?.message||n}`:"";console.log(`请求接口: ${o} 异常: ${e}`),t(new Error(e))}else e("response"===c?s:$.toObj(n)||n)}))}));return $.isQuanX()?await Promise.race([w,new Promise(((e,t)=>setTimeout((()=>t(new Error("网络开小差了~"))),l)))]):w}catch(e){throw new Error(e)}var t}
/**
 * 兼容多端通知
 * 2024/03/12: 已修复Loon/iOS16上存在媒体不通知的情况
 * @param {String} n 通知标题
 * @param {String} o 通知副标题
 * @param {String} i 通知详情
 * @param {Object|String} t 通知参数 {open-url: '', media-url: ''}
 */
// prettier-ignore
async function showNotification(n,o="",i="",t={}){const e="undefined"!=typeof $app&&"undefined"!=typeof $http,s=t["open-url"],f=t["media-url"];if($.isQuanX()&&$notify(n,o,i,t),$.isSurge()&&$notification.post(n,o,i,{url:s}),$.isLoon()){const t={},$=$loon.split(" ")[1].split(".")[0];s&&(t.openUrl=s),f&&16!==Number($)&&(t.mediaUrl=f),"{}"===JSON.stringify(t)?$notification.post(n,o,i):$notification.post(n,o,i,t)}const c=`${i}${s?`\n点击跳转: ${s}`:""}${f?`\n多媒体: ${f}`:""}`;if(e){require("push").schedule({title:n,body:`${o?`${o}\n`:""}${c}`})}if($.isNode())try{await notify.sendNotify(`${n}\n${o}`,c)}catch(n){console.log("没有找到sendNotify.js文件 不发送通知")}console.log(`${n}\n${o}\n${c}\n`)}
// prettier-ignore
function JunLa(){return new (class {constructor(){this.today=$.time("yyyy年MM月dd",new Date)}async getContent(){try{const t=await fetchData("https://www.jun.la/news.html/"),e=$.cheerio.load(t),a=e(".entry-content"),n=a.find('p:contains("简报标题")').text().replace(/简报标题：/,""),i=a.find('p:contains("简报图片")').text().replace(/简报图片：/,""),c=a.find('p:contains("简报长文图片")').text().replace(/简报长文图片：/,"");return{title:n,thumb:i,content:a.find("p").slice(6).map(((t,a)=>e(a).text())).get().filter(Boolean),openURL:c}}catch(t){throw new Error(t)}}async getList(){try{const t=await fetchData("https://www.jun.la/60snews/"),e=$.cheerio.load(t);return e("article").map(((t,a)=>{let n=e(a);return{title:n.find("h2.entry-title a").text(),link:n.find("h2.entry-title a").attr("href"),date:`${n.find(".date").text()}${n.find(".timeline-time").text().replace(/\n|\t/g,"")}`}})).get()}catch(t){throw new Error(t)}}async getContentBackup(){try{const t=(await this.getList()).find((t=>t.date===this.today));if(!t)throw"未从列表中查询到今日早报, 被用接口失效, 请检查网站是否更新";const e=await fetchData(t.link),a=$.cheerio.load(e),n=a(".single-content"),i=a(".entry-title").text(),c=n.find("section p img").attr("src");return{title:i,thumb:c,content:n.find("section section p").map(((t,e)=>a(e).find("span").text())).get().filter(Boolean)}}catch(t){throw $.log(`备用内容获取失败: ${t}`),t}}async mainContent(){let t={};try{const e=await this.getList();t=await this.getContent(e)}catch(e){$.log(`首选接口错误: ${e}, 尝试备用接口`);try{t=await this.getContentBackup()}catch(t){throw $.log(`备用接口也出现错误: ${t}`),t}}finally{return console.log("处理结果: ",t),t}}async getImage(){const t="https://api.jun.la/60s.php?format=image";try{return await fetchData(t),$.log("✔️ 𝐈𝐧𝐭𝐞𝐫𝐟𝐚𝐜𝐞 𝐯𝐚𝐥𝐢𝐝."),t}catch(t){$.log("❌ 𝐈𝐧𝐭𝐞𝐫𝐟𝐚𝐜𝐞 𝐟𝐚𝐢𝐥𝐞𝐝.")}}async getImageBackup(){let t="";try{const{code:e,msg:a,imageUrl:n}=await fetchData("http://dwz.2xb.cn/zaob");200===e?t=n:$.log(`60s图片接口已挂: ${a}`)}catch(t){$.log("60s图片接口已挂")}finally{return t}}async mainImage(){let t="";try{t=await this.getImage()}catch(e){$.log(`首选图片接口错误: ${e}, 尝试备用接口`);try{t=await this.getImageBackup()}catch(t){throw $.log(`备用图片接口也出现错误: ${t}`),t}}finally{return console.log("处理结果: ",t),t}}})}
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,a)=>{s.call(this,t,(t,s,r)=>{t?a(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}getEnv(){return"undefined"!=typeof $environment&&$environment["surge-version"]?"Surge":"undefined"!=typeof $environment&&$environment["stash-version"]?"Stash":"undefined"!=typeof module&&module.exports?"Node.js":"undefined"!=typeof $task?"Quantumult X":"undefined"!=typeof $loon?"Loon":"undefined"!=typeof $rocket?"Shadowrocket":void 0}isNode(){return"Node.js"===this.getEnv()}isQuanX(){return"Quantumult X"===this.getEnv()}isSurge(){return"Surge"===this.getEnv()}isLoon(){return"Loon"===this.getEnv()}isShadowrocket(){return"Shadowrocket"===this.getEnv()}isStash(){return"Stash"===this.getEnv()}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const a=this.getdata(t);if(a)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,a)=>e(a))})}runScript(t,e){return new Promise(s=>{let a=this.getdata("@chavy_boxjs_userCfgs.httpapi");a=a?a.replace(/\n/g,"").trim():a;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[i,o]=a.split("@"),n={url:`http://${o}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":i,Accept:"*/*"},timeout:r};this.post(n,(t,e,a)=>s(a))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),a=!s&&this.fs.existsSync(e);if(!s&&!a)return{};{const a=s?t:e;try{return JSON.parse(this.fs.readFileSync(a))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),a=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):a?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const a=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of a)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,a)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[a+1])>>0==+e[a+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,a]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,a,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,a,r]=/^@(.*?)\.(.*?)$/.exec(e),i=this.getval(a),o=a?"null"===i?null:i||"{}":"{}";try{const e=JSON.parse(o);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),a)}catch(e){const i={};this.lodash_set(i,r,t),s=this.setval(JSON.stringify(i),a)}}else s=this.setval(t,e);return s}getval(t){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.read(t);case"Quantumult X":return $prefs.valueForKey(t);case"Node.js":return this.data=this.loaddata(),this.data[t];default:return this.data&&this.data[t]||null}}setval(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.write(t,e);case"Quantumult X":return $prefs.setValueForKey(t,e);case"Node.js":return this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0;default:return this.data&&this.data[e]||null}}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){switch(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"],delete t.headers["content-type"],delete t.headers["content-length"]),t.params&&(t.url+="?"+this.queryStr(t.params)),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,a)=>{!t&&s&&(s.body=a,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,a)});break;case"Quantumult X":this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:a,headers:r,body:i,bodyBytes:o}=t;e(null,{status:s,statusCode:a,headers:r,body:i,bodyBytes:o},i,o)},t=>e(t&&t.error||"UndefinedError"));break;case"Node.js":let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:a,statusCode:r,headers:i,rawBody:o}=t,n=s.decode(o,this.encoding);e(null,{status:a,statusCode:r,headers:i,rawBody:o,body:n},n)},t=>{const{message:a,response:r}=t;e(a,r,r&&s.decode(r.rawBody,this.encoding))})}}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";switch(t.body&&t.headers&&!t.headers["Content-Type"]&&!t.headers["content-type"]&&(t.headers["content-type"]="application/x-www-form-urlencoded"),t.headers&&(delete t.headers["Content-Length"],delete t.headers["content-length"]),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,(t,s,a)=>{!t&&s&&(s.body=a,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,a)});break;case"Quantumult X":t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:a,headers:r,body:i,bodyBytes:o}=t;e(null,{status:s,statusCode:a,headers:r,body:i,bodyBytes:o},i,o)},t=>e(t&&t.error||"UndefinedError"));break;case"Node.js":let a=require("iconv-lite");this.initGotEnv(t);const{url:r,...i}=t;this.got[s](r,i).then(t=>{const{statusCode:s,statusCode:r,headers:i,rawBody:o}=t,n=a.decode(o,this.encoding);e(null,{status:s,statusCode:r,headers:i,rawBody:o,body:n},n)},t=>{const{message:s,response:r}=t;e(s,r,r&&a.decode(r.rawBody,this.encoding))})}}time(t,e=null){const s=e?new Date(e):new Date;let a={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in a)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?a[e]:("00"+a[e]).substr((""+a[e]).length)));return t}queryStr(t){let e="";for(const s in t){let a=t[s];null!=a&&""!==a&&("object"==typeof a&&(a=JSON.stringify(a)),e+=`${s}=${a}&`)}return e=e.substring(0,e.length-1),e}msg(e=t,s="",a="",r){const i=t=>{switch(typeof t){case void 0:return t;case"string":switch(this.getEnv()){case"Surge":case"Stash":default:return{url:t};case"Loon":case"Shadowrocket":return t;case"Quantumult X":return{"open-url":t};case"Node.js":return}case"object":switch(this.getEnv()){case"Surge":case"Stash":case"Shadowrocket":default:{let e=t.url||t.openUrl||t["open-url"];return{url:e}}case"Loon":{let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}case"Quantumult X":{let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl,a=t["update-pasteboard"]||t.updatePasteboard;return{"open-url":e,"media-url":s,"update-pasteboard":a}}case"Node.js":return}default:return}};if(!this.isMute)switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:$notification.post(e,s,a,i(r));break;case"Quantumult X":$notify(e,s,a,i(r));break;case"Node.js":}if(!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),a&&t.push(a),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:this.log("",`❗️${this.name}, 错误!`,t);break;case"Node.js":this.log("",`❗️${this.name}, 错误!`,t.stack)}}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;switch(this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:$done(t);break;case"Node.js":process.exit(1)}}}(t,e)}
