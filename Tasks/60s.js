/******************************************
 * @name 每天60秒读懂世界
 * @channel https://t.me/yqc_123
 * @feedback https://t.me/yqc_777
 * @version 1.1.1
******************************************
## 更新日志

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

[@cheerio](https://github.com/cheeriojs/cheerio)

[@苍井灰灰](https://github.com/wf021325)

[@每天60秒读懂世界](https://www.zhihu.com/people/mt36501)

[@小竣博客](https://www.jun.la/60snews)

[@冷筱宇](https://www.789dl.cn/zb.html)

******************************************/
const $ = new Env('每天60秒看懂世界', {
    scriptname: '60S',
    logLevelPrefixs: {
        debug: '===🛠️调试输出===\n',
        info: '===ℹ️日志输出===\n',
        warn: '===⚠️𝐖𝐀𝐑𝐍𝐈𝐍𝐆===\n',
        error: '===❌错误提示===\n'
    },
    notifyPath: '../../utils/sendNotify', // NodeJS环境通知依赖
    message: [] // 存储通知消息
})
// 由于Surge通知过长会遮挡且点击后无法跳转日志, 在此做截断, 并且点击通知会跳转页面展示详情
const MAX_MESSAGE_COUNT = 175
// 这里兼容iOS 16系统上有媒体链接Loon/Surge上不通知的问题
// $.notifyWithMedia = $.toObj($.getdata(`${$.scriptname.toLowerCase()}_notify_with_media`)) || true
// $.debug(`🔰 媒体通知: ${$.notifyWithMedia ? '开启' : '关闭'}`)
!(async () => {
    await showNotice()
    await loadRemoteScriptByCache('https://cdn.jsdelivr.net/gh/Yuheng0101/X@main/Utils/cheerio.js', 'createCheerio', 'cheerio')
    const junla = new JunLa()
    let { title, thumb, content, openURL } = await junla.getContentBackup()
    openURL = openURL || (await junla.getImageBackup())
    const { subTitle, message } = chunkBySize(content, MAX_MESSAGE_COUNT)
    await showMsg(title, subTitle, message, { $open: openURL, $media: thumb })
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
    const operator = (t) => t.replace(/[0-9A-z]/g, (match) => ['𝟎', '𝟏', '𝟐', '𝟑', '𝟒', '𝟓', '𝟔', '𝟕', '𝟖', '𝟗']?.[match] || match)
    const _arr = arr.map((it) => it.replace(/^(\d+)[、.]/, (match, p1) => `【${operator(p1)}】`))
    // .replace(/【微语】/, '[微语]')
    const subTitle = _arr[_arr.length - 1]
    let message = []
    if ($.isNode()) {
        message = _arr
    } else {
        for (const item of _arr) {
            if (message.join('\n').length >= size) {
                break
            }
            message.push(item)
        }
        message = [...message, resultText]
    }
    return {
        subTitle,
        message: message.join('\n').replace(/\n$/, '').replace(/^\n/, '')
    }
}
// ------------
// 免责声明
async function showNotice() {
    $.log('==============📣免责声明📣==============')
    $.log('1. 本脚本仅用于学习研究，禁止用于商业用途')
    $.log('2. 本脚本不保证准确性、可靠性、完整性和及时性')
    $.log('3. 任何个人或组织均可无需经过通知而自由使用')
    $.log('4. 作者对任何脚本问题概不负责，包括由此产生的任何损失')
    $.log('5. 如果任何单位或个人认为该脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明、所有权证明，我将在收到认证文件确认后删除')
    $.log('6. 请勿将本脚本用于商业用途，由此引起的问题与作者无关')
    $.log('7. 本脚本及其更新版权归作者所有')
    $.log('')
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
    // ------------
    // 统一旧版 cheerio 缓存名
    $.getdata(`cheerio__code`) && $.setdata(``, `cheerio__code`)
    // ------------
    return new Promise((resolve, reject) => {
        if (cache) {
            eval(cache), ($[scriptName] = eval(functionName)())
            $.debug(`☑️ 缓存加载${functionName}成功`)
            resolve()
        } else {
            fetchData({ url: scriptUrl, useProxy: $.useProxy })
                .then((script) => {
                    eval(script), ($[scriptName] = eval(functionName)())
                    $.debug(`☑️ 远程加载${functionName}成功`)
                    $.setdata(script, cacheName)
                    $.debug(`☑️ 缓存${functionName}成功`)
                    resolve()
                })
                .catch((err) => {
                    $.error(`⚠️ 远程加载${functionName}失败`, err)
                    reject(err)
                })
        }
    })
}
// 消息通知
async function showMsg(n, o, i, t) {
    if ($.isNode()) {
        const notify = $.isNode() ? require($.notifyPath) : ''
        const content = [i]
        const openUrl = t?.['open-url'] || t?.url || t?.mediaUrl || t?.$open
        const mediaUrl = t?.['media-url'] || t?.mediaUrl || t?.$media
        openUrl && content.push(`🔗打开链接: ${openUrl}`)
        mediaUrl && content.push(`🎬媒体链接: ${mediaUrl}`)
        $.log('==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3==============', n, o, content.join('\n'))
        try {
            await notify.sendNotify(`${n}\n${o}`, content.join('\n'))
        } catch (e) {
            $.warn('没有找到sendNotify.js文件 不发送通知')
        }
    } else {
        // !$.notifyWithMedia && ['media-url', 'mediaUrl', '$media'].map((key) => delete t[key])
        $.msg(n, o, i, t)
    }
}
/**
 * 网络请求基于env.js的二次封装
 * @param {*} o 相关参数
 * @param {string} o.url 请求地址
 * @param {string} o.type 请求类型
 * @param {object} o.headers 请求头
 * @param {object} o.params 请求参数
 * @param {object} o.body 请求体 post => json
 * @param {object} o.deviceType 设备类型 pc | mobile
 * @param {object} o.dataType 数据类型 json | form
 * @param {object} o.responseType 返回数据类型 response | data
 * @param {object} o.timeout 超时时间
 * @returns {Promise}
 */
async function fetchData(o) {
    // 对象大写转小写
    const ObjectKeys2LowerCase = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k.toLowerCase(), v]))
    typeof o === 'string' && (o = { url: o })
    if (!o?.url) throw new Error('[发送请求] 缺少 url 参数')
    try {
        const {
            url: u, // 请求地址
            type, // 请求类型
            headers: h, // 请求头
            body: b, // 请求体 ➟ post
            params, // 请求参数 ➟ get/psot
            dataType = 'form', // 请求数据类型
            deviceType = 'mobile', // 设备类型
            resultType = 'data', // 返回数据类型
            timeout = 1e4, // 超时时间
            useProxy = $.useProxy, // 是否使用代理
            autoCookie = false, // 是否自动携带cookie
            followRedirect = false, // 是否重定向
            opts = {}
        } = o
        // type => 因为env中使用method处理post的特殊请求(put/delete/patch), 所以这里使用type
        const method = type ? type.toLowerCase() : b ? 'post' : 'get'
        // post请求需要处理params参数(get不需要, env已经处理)
        const url = u.concat(method === 'post' ? '?' + $.queryStr(params) : '')
        const headers = ObjectKeys2LowerCase(h || {})
        // 根据deviceType给headers添加默认UA
        headers?.['user-agent'] ||
            Object.assign(headers, {
                'user-agent': deviceType === 'pc' ? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299' : 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
            })
        // 根据jsonType处理headers
        dataType === 'json' && Object.assign(headers, { 'content-type': 'application/json;charset=UTF-8' })
        const options = { ...o }
        Object.assign(options, {
            url,
            method,
            headers,
            'binary-mode': resultType == 'buffer',
            // Surge/Loon新增字段
            'auto-cookie': autoCookie,
            // env.js默认重定向字段
            followRedirect,
            // Quantumult X特殊字段
            opts
        })
        // 处理params参数
        method === 'get' && params && Object.assign(options, { params })
        // 超时处理兼容Surge => 单位是s
        Object.assign(options, { timeout: $.isSurge() ? timeout / 1e3 : timeout })
        // post请求处理body
        const body = method === 'post' && b && ((o.dataType === 'json' ? $.toStr : $.queryStr)(typeof b === 'object' ? b : '') || b)
        method === 'post' && body && Object.assign(options, { body })
        // 是否使用代理
        if ($.isNode() && useProxy) {
            const PROXY_HOST = process.env.PROXY_HOST || '127.0.0.1'
            const PROXY_PORT = process.env.PROXY_PORT || 7890
            if (PROXY_HOST && PROXY_PORT) {
                const tunnel = require('tunnel')
                const agent = { https: tunnel.httpsOverHttp({ proxy: { host: PROXY_HOST, port: PROXY_PORT * 1 } }) }
                Object.assign(options, { agent })
            } else {
                $.log(`⚠️ 请填写正确的代理地址和端口`)
            }
        }
        // console.log(options)
        const promise = new Promise((resolve, reject) => {
            $[method](options, (err, response, data) => {
                if (err) {
                    let errorMsg = ''
                    if (response) {
                        // errorMsg = `状态码: ${response.statusCode}`
                        $.log(`状态码: ${response.statusCode}`)
                    }
                    if (data) {
                        errorMsg += $.toObj(data)?.message || data
                    }
                    $.log(`请求接口: ${u} 异常: ${errorMsg}`)
                    reject(errorMsg)
                } else {
                    const _decode = (resp) => {
                        const buffer = resp.rawBody ?? resp.body
                        return $.Buffer.from(buffer).toString('base64')
                    }
                    resolve(resultType === 'buffer' ? ($.isQuanX() ? response.body : _decode(response)) : resultType === 'response' ? response : $.toObj(data) || data)
                }
            })
        })
        // 使用Promise.race来给Quantumult X强行加入超时处理
        return $.isQuanX() ? await Promise.race([new Promise((_, r) => setTimeout(() => r(new Error('网络开小差了~')), timeout)), promise]) : promise
    } catch (e) {
        throw new Error(e)
    }
}
// prettier-ignore
function JunLa(){return new (class {constructor(){this.today=$.time("yyyy年MM月dd",new Date)}async getContent(){try{const t=await fetchData("https://www.jun.la/news.html/"),e=$.cheerio.load(t),a=e(".entry-content"),n=a.find('p:contains("简报标题")').text().replace(/简报标题：/,""),i=a.find('p:contains("简报图片")').text().replace(/简报图片：/,""),c=a.find('p:contains("简报长文图片")').text().replace(/简报长文图片：/,"");return{title:n,thumb:i,content:a.find("p").slice(6).map(((t,a)=>e(a).text())).get().filter(Boolean),openURL:c}}catch(t){throw new Error(t)}}async getList(){try{const t=await fetchData("https://www.jun.la/60snews/"),e=$.cheerio.load(t);return e("article").map(((t,a)=>{let n=e(a);return{title:n.find("h2.entry-title a").text(),link:n.find("h2.entry-title a").attr("href"),date:`${n.find(".date").text()}${n.find(".timeline-time").text().replace(/\n|\t/g,"")}`}})).get()}catch(t){throw new Error(t)}}async getContentBackup(){try{const t=(await this.getList()).find((t=>t.date===this.today));if(!t)throw"未从列表中查询到今日早报, 被用接口失效, 请检查网站是否更新";const e=await fetchData(t.link),a=$.cheerio.load(e),n=a(".single-content"),i=a(".entry-title").text(),c=n.find("section p img").attr("src");return{title:i,thumb:c,content:n.find("section section p").map(((t,e)=>a(e).find("span").text())).get().filter(Boolean)}}catch(t){throw $.log(`备用内容获取失败: ${t}`),t}}async mainContent(){let t={};try{const e=await this.getList();t=await this.getContent(e)}catch(e){$.log(`首选接口错误: ${e}, 尝试备用接口`);try{t=await this.getContentBackup()}catch(t){throw $.log(`备用接口也出现错误: ${t}`),t}}finally{return console.log("处理结果: ",t),t}}async getImage(){const t="https://api.jun.la/60s.php?format=image";try{return await fetchData(t),$.log("✔️ 𝐈𝐧𝐭𝐞𝐫𝐟𝐚𝐜𝐞 𝐯𝐚𝐥𝐢𝐝."),t}catch(t){$.log("❌ 𝐈𝐧𝐭𝐞𝐫𝐟𝐚𝐜𝐞 𝐟𝐚𝐢𝐥𝐞𝐝.")}}async getImageBackup(){let t="";try{const{code:e,msg:a,imageUrl:n}=await fetchData("http://dwz.2xb.cn/zaob");200===e?t=n:$.log(`60s图片接口已挂: ${a}`)}catch(t){$.log("60s图片接口已挂")}finally{return t}}async mainImage(){let t="";try{t=await this.getImage()}catch(e){$.log(`首选图片接口错误: ${e}, 尝试备用接口`);try{t=await this.getImageBackup()}catch(t){throw $.log(`备用图片接口也出现错误: ${t}`),t}}finally{return console.log("处理结果: ",t),t}}})}
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;"POST"===e&&(s=this.post);const i=new Promise(((e,i)=>{s.call(this,t,((t,s,o)=>{t?i(t):e(s)}))}));return t.timeout?((t,e=1e3)=>Promise.race([t,new Promise(((t,s)=>{setTimeout((()=>{s(new Error("请求超时"))}),e)}))]))(i,t.timeout):i}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.logLevels={debug:0,info:1,warn:2,error:3},this.logLevelPrefixs={debug:"[DEBUG] ",info:"[INFO] ",warn:"[WARN] ",error:"[ERROR] "},this.logLevel="info",this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}getEnv(){return"undefined"!=typeof $environment&&$environment["surge-version"]?"Surge":"undefined"!=typeof $environment&&$environment["stash-version"]?"Stash":"undefined"!=typeof module&&module.exports?"Node.js":"undefined"!=typeof $task?"Quantumult X":"undefined"!=typeof $loon?"Loon":"undefined"!=typeof $rocket?"Shadowrocket":void 0}isNode(){return"Node.js"===this.getEnv()}isQuanX(){return"Quantumult X"===this.getEnv()}isSurge(){return"Surge"===this.getEnv()}isLoon(){return"Loon"===this.getEnv()}isShadowrocket(){return"Shadowrocket"===this.getEnv()}isStash(){return"Stash"===this.getEnv()}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null,...s){try{return JSON.stringify(t,...s)}catch{return e}}getjson(t,e){let s=e;if(this.getdata(t))try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise((e=>{this.get({url:t},((t,s,i)=>e(i)))}))}runScript(t,e){return new Promise((s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let o=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");o=o?1*o:20,o=e&&e.timeout?e.timeout:o;const[r,a]=i.split("@"),n={url:`http://${a}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:o},headers:{"X-Key":r,Accept:"*/*"},policy:"DIRECT",timeout:o};this.post(n,((t,e,i)=>s(i)))})).catch((t=>this.logErr(t)))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),o=JSON.stringify(this.data);s?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(e,o):this.fs.writeFileSync(t,o)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return s;return o}lodash_set(t,e,s){return Object(t)!==t||(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce(((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{}),t)[e[e.length-1]]=s),t}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),o=s?this.getval(s):"";if(o)try{const t=JSON.parse(o);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(e),r=this.getval(i),a=i?"null"===r?null:r||"{}":"{}";try{const e=JSON.parse(a);this.lodash_set(e,o,t),s=this.setval(JSON.stringify(e),i)}catch(e){const r={};this.lodash_set(r,o,t),s=this.setval(JSON.stringify(r),i)}}else s=this.setval(t,e);return s}getval(t){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.read(t);case"Quantumult X":return $prefs.valueForKey(t);case"Node.js":return this.data=this.loaddata(),this.data[t];default:return this.data&&this.data[t]||null}}setval(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.write(t,e);case"Quantumult X":return $prefs.setValueForKey(t,e);case"Node.js":return this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0;default:return this.data&&this.data[e]||null}}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.cookie&&void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar)))}get(t,e=(()=>{})){switch(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"],delete t.headers["content-type"],delete t.headers["content-length"]),t.params&&(t.url+="?"+this.queryStr(t.params)),void 0===t.followRedirect||t.followRedirect||((this.isSurge()||this.isLoon())&&(t["auto-redirect"]=!1),this.isQuanX()&&(t.opts?t.opts.redirection=!1:t.opts={redirection:!1})),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,((t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,i)}));break;case"Quantumult X":this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then((t=>{const{statusCode:s,statusCode:i,headers:o,body:r,bodyBytes:a}=t;e(null,{status:s,statusCode:i,headers:o,body:r,bodyBytes:a},r,a)}),(t=>e(t&&t.error||"UndefinedError")));break;case"Node.js":let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",((t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}})).then((t=>{const{statusCode:i,statusCode:o,headers:r,rawBody:a}=t,n=s.decode(a,this.encoding);e(null,{status:i,statusCode:o,headers:r,rawBody:a,body:n},n)}),(t=>{const{message:i,response:o}=t;e(i,o,o&&s.decode(o.rawBody,this.encoding))}));break}}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";switch(t.body&&t.headers&&!t.headers["Content-Type"]&&!t.headers["content-type"]&&(t.headers["content-type"]="application/x-www-form-urlencoded"),t.headers&&(delete t.headers["Content-Length"],delete t.headers["content-length"]),void 0===t.followRedirect||t.followRedirect||((this.isSurge()||this.isLoon())&&(t["auto-redirect"]=!1),this.isQuanX()&&(t.opts?t.opts.redirection=!1:t.opts={redirection:!1})),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,((t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,i)}));break;case"Quantumult X":t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then((t=>{const{statusCode:s,statusCode:i,headers:o,body:r,bodyBytes:a}=t;e(null,{status:s,statusCode:i,headers:o,body:r,bodyBytes:a},r,a)}),(t=>e(t&&t.error||"UndefinedError")));break;case"Node.js":let i=require("iconv-lite");this.initGotEnv(t);const{url:o,...r}=t;this.got[s](o,r).then((t=>{const{statusCode:s,statusCode:o,headers:r,rawBody:a}=t,n=i.decode(a,this.encoding);e(null,{status:s,statusCode:o,headers:r,rawBody:a,body:n},n)}),(t=>{const{message:s,response:o}=t;e(s,o,o&&i.decode(o.rawBody,this.encoding))}));break}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}queryStr(t){let e="";for(const s in t){let i=t[s];null!=i&&""!==i&&("object"==typeof i&&(i=JSON.stringify(i)),e+=`${s}=${i}&`)}return e=e.substring(0,e.length-1),e}msg(e=t,s="",i="",o={}){const r=t=>{const{$open:e,$copy:s,$media:i,$mediaMime:o}=t;switch(typeof t){case void 0:return t;case"string":switch(this.getEnv()){case"Surge":case"Stash":default:return{url:t};case"Loon":case"Shadowrocket":return t;case"Quantumult X":return{"open-url":t};case"Node.js":return}case"object":switch(this.getEnv()){case"Surge":case"Stash":case"Shadowrocket":default:{const r={};let a=t.openUrl||t.url||t["open-url"]||e;a&&Object.assign(r,{action:"open-url",url:a});let n=t["update-pasteboard"]||t.updatePasteboard||s;if(n&&Object.assign(r,{action:"clipboard",text:n}),i){let t,e,s;if(i.startsWith("http"))t=i;else if(i.startsWith("data:")){const[t]=i.split(";"),[,o]=i.split(",");e=o,s=t.replace("data:","")}else{e=i,s=(t=>{const e={JVBERi0:"application/pdf",R0lGODdh:"image/gif",R0lGODlh:"image/gif",iVBORw0KGgo:"image/png","/9j/":"image/jpg"};for(var s in e)if(0===t.indexOf(s))return e[s];return null})(i)}Object.assign(r,{"media-url":t,"media-base64":e,"media-base64-mime":o??s})}return Object.assign(r,{"auto-dismiss":t["auto-dismiss"],sound:t.sound}),r}case"Loon":{const s={};let o=t.openUrl||t.url||t["open-url"]||e;o&&Object.assign(s,{openUrl:o});let r=t.mediaUrl||t["media-url"];return i?.startsWith("http")&&(r=i),r&&Object.assign(s,{mediaUrl:r}),console.log(JSON.stringify(s)),s}case"Quantumult X":{const o={};let r=t["open-url"]||t.url||t.openUrl||e;r&&Object.assign(o,{"open-url":r});let a=t["media-url"]||t.mediaUrl;i?.startsWith("http")&&(a=i),a&&Object.assign(o,{"media-url":a});let n=t["update-pasteboard"]||t.updatePasteboard||s;return n&&Object.assign(o,{"update-pasteboard":n}),console.log(JSON.stringify(o)),o}case"Node.js":return}default:return}};if(!this.isMute)switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:$notification.post(e,s,i,r(o));break;case"Quantumult X":$notify(e,s,i,r(o));break;case"Node.js":break}if(!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}debug(...t){this.logLevels[this.logLevel]<=this.logLevels.debug&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.debug}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}info(...t){this.logLevels[this.logLevel]<=this.logLevels.info&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.info}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}warn(...t){this.logLevels[this.logLevel]<=this.logLevels.warn&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.warn}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}error(...t){this.logLevels[this.logLevel]<=this.logLevels.error&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.error}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.map((t=>t??String(t))).join(this.logSeparator))}logErr(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:this.log("",`❗️${this.name}, 错误!`,e,t);break;case"Node.js":this.log("",`❗️${this.name}, 错误!`,e,void 0!==t.message?t.message:t,t.stack);break}}wait(t){return new Promise((e=>setTimeout(e,t)))}done(t={}){const e=((new Date).getTime()-this.startTime)/1e3;switch(this.log("",`🔔${this.name}, 结束! 🕛 ${e} 秒`),this.log(),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:$done(t);break;case"Node.js":process.exit(1)}}}(t,e)}
