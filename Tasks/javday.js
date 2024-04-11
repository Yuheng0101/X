/******************************************
 * @name 𝐉𝐀𝐕𝐃𝐚𝐲每日推荐
 * @channel https://t.me/yqc_123/
 * @feedback https://t.me/yqc_777/
 * @update 20240411
 * @version 1.0.1
 ******************************************
脚本声明:
1. 本脚本仅用于学习研究，禁止用于商业用途
2. 本脚本不保证准确性、可靠性、完整性和及时性
3. 任何个人或组织均可无需经过通知而自由使用
4. 作者对任何脚本问题概不负责，包括由此产生的任何损失
5. 如果任何单位或个人认为该脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明、所有权证明，我将在收到认证文件确认后删除
6. 请勿将本脚本用于商业用途，由此引起的问题与作者无关
7. 本脚本及其更新版权归作者所有
******************************************
BoxJs订阅地址:
 - https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/boxjs.json

******************************************
QuantumultX配置:

[task_local]
0 22 * * * https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/javday.js, tag=𝐉𝐀𝐕𝐃𝐚𝐲每日推荐, img-url=https://raw.githubusercontent.com/Yuheng0101/X/main/Assets/javday.png, enabled=true
******************************************
Loon配置:

[Script]
cron "0 22 * * *" script-path=https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/javday.js, timeout=10, tag=𝐉𝐀𝐕𝐃𝐚𝐲每日推荐, img-url=https://raw.githubusercontent.com/Yuheng0101/X/main/Assets/javday.png
******************************************
Surge配置:

[Script]
𝐉𝐀𝐕𝐃𝐚𝐲每日推荐 = type=cron,cronexp=0 22 * * *,wake-system=1,script-path=https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/javday.js,timeout=60
******************************************
青龙配置:
# 是否开启调试模式
export JAVDAY_DEBUG = 'false'
# 是否开启代理（国内机选配） => 用于拉取github依赖
export JAVDAY_USE_PROXY = 'false'
# 类型选择
export JAVDAY_TYPE = '人氣系列'
******************************************/
const $ = new Env('𝐉𝐀𝐕𝐃𝐚𝐲', {
    logLevelPrefixs: {
        debug: '==============🛠️调试输出==============\n',
        info: '==============ℹ️日志输出==============\n',
        warn: '==============⚠️𝐖𝐀𝐑𝐍𝐈𝐍𝐆==============\n',
        error: '==============❌错误提示==============\n'
    }
})
const MAPs = {
    最新更新: '/label/new/',
    人氣系列: '/label/hot/',
    新作上市: '/category/new-release/',
    國產AV: '/category/chinese-av/',
    糖心VLOG: '/index.php/category/txvlog/',
    蘿莉社: '/index.php/category/luolisheus/'
}
// -------------------------------------
// 数据定义区
const notify = $.isNode() ? require('../../utils/sendNotify') : ''
const baseURL = 'https://javday.tv'
// -------------------------------------
// 开发者模式
$.logLevel = $.toObj($.isNode() ? process.env.JAVDAY_DEBUG : $.getdata('javday_wrold_debug')) ? 'debug' : 'info'
$.debug(`🔰 模式: ${$.logLevel == 'debug' ? '调试' : '常规'}`)
// 是否开启代理 => 用于拉取github依赖
$.useProxy = $.toObj($.isNode() && process.env.JAVDAY_USE_PROXY) || false
$.debug(`🔰 代理: ${$.useProxy ? '开启' : '关闭'}`)
// 通知列表
$.message = []
// 统一 headers 请求头
$.headers = { 'user-agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36` }
// -------------------------------------
// 缓存区域
const USER_TYPE = ($.isNode() ? process.env.JAVDAY_TYPE : $.getdata('javday_type')) || '人氣系列'
$.debug(`🔰 用户选择: ${USER_TYPE}`)
class JAVDay {
    async getList() {
        try {
            const opts = {
                url: `${baseURL}${MAPs[USER_TYPE]}`,
                headers: $.headers
            }
            const data = await fetchData(opts)
            const $_ = $.cheerio.load(data)
            this.list = $_('.video-wrapper .videoBox')
                .map((_, el) => {
                    const link = $_(el).attr('href')
                    const thumb = $_(el)
                        .find('.videoBox-cover')
                        .attr('style')
                        .match(/url\(\"?([^"\)]*)\"?\)/)?.[1]
                    const title = $_(el).find('.videoBox-info .title').text()
                    return { title, thumb, link }
                })
                .get()
            $.debug($.toStr(this.list))
        } catch (e) {
            $.error(`🔴 获取热门列表异常: ${e}`)
        }
    }
    async getDetail() {
        const { title, thumb, link } = this.list[0]
        $.debug(`🔰 获取详情: ${title}`)
        try {
            const otps = {
                url: `${baseURL}${link}`,
                headers: $.headers
            }
            const data = await fetchData(otps)
            const $_ = $.cheerio.load(data)
            this.info = $_('#videoInfo .leftBox .list-item')
                .map((_, el) => {
                    const tag = $_(el).find('span').eq(0).text().trim()
                    switch (true) {
                        case /女優/.test(tag):
                            return {
                                actor: $_(el).find('.vod_actor a').text()
                            }
                        case /番號/.test(tag):
                            return {
                                code: $_(el).find('.jpnum').text()
                            }
                        case /標籤/.test(tag):
                            return {
                                tags: $_(el)
                                    .find('.tag a')
                                    .map((_, el) => '#' + $_(el).text())
                                    .filter(Boolean)
                                    .get()
                                    .join(' ')
                            }
                        case /廠商/.test(tag):
                            return {
                                studio: $_(el).find('.producer a').text()
                            }
                        default:
                            return {}
                    }
                })
                .get()
                .filter((item) => Object.keys(item).length > 0)
                .reduce((prev, next) => ({ ...prev, ...next }), {})
            Object.assign(this.info, { title })
            thumb && Object.assign(this.info, { thumb: baseURL + thumb })
            link && Object.assign(this.info, { link: baseURL + link })
            $.debug(JSON.stringify(this.info, null, 2))
        } catch (e) {
            $.error(`🔴 获取详情异常: ${e}`)
        }
    }
}
;(async () => {
    await showNotice()
    await loadRemoteScriptByCache('https://cdn.jsdelivr.net/gh/Yuheng0101/X@main/Utils/cheerio.js', 'createCheerio', 'cheerio')
    const jav = new JAVDay()
    await jav.getList()
    await jav.getDetail()
    // $.message.push(`🎬标题: ${}`)
    jav?.info?.actor && $.message.push(`演员: ${jav.info.actor}`)
    jav?.info?.code && $.message.push(`密码: ${jav.info.code}`)
    jav?.info?.tags && $.message.push(`标签: ${jav.info.tags}`)
    jav?.info?.studio && $.message.push(`片商: ${jav.info.studio}`)
    const title = jav.info.title
        .toUpperCase()
        .replace(jav?.info?.code ?? '', '')
        .replace(jav?.info?.actor ?? '', '')
        .replace(jav?.info?.studio ?? '', '')
        .replace(/^\s+|\s+$/g, '')
    const desc = $.message.join('\n').replace(/\n$/, '')
    await showMsg($.name, title, desc, {
        'open-url': jav.info.link,
        'media-url': jav.info.thumb,
        // 在一段指定时间后自动消除该通知，单位为秒，默认为 0，即持续存在。
        'auto-dismiss': 300
    })
})().finally(() => $.done({ ok: 1 }))
// -------------------------------------
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
        const content = [i]
        t?.['open-url'] && content.push(`🔗打开链接: ${t['open-url']}`)
        t?.['media-url'] && content.push(`🎬媒体链接: ${t['media-url']}`)
        $.log('==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3==============', n, o, content.join('\n'))
        try {
            await notify.sendNotify(`${n}\n${o}`, content.join('\n'))
        } catch (e) {
            $.warn('没有找到sendNotify.js文件 不发送通知')
        }
    }
    // 新版surge
    else if ($.isSurge()) {
        if (typeof t === 'object') {
            if (t?.['text']) {
                Object.assign(t, { action: 'clipboard', text: t['text'] })
            } else if (t?.['open-url']) {
                Object.assign(t, { action: 'open-url', url: t['open-url'] })
            }
            $notification.post(n, o, i, t)
        } else {
            $.msg(n, o, i, t)
        }
    }
    // iOS16存在媒体链接不通知
    else if ($.isLoon()) {
        t = $loon.split(' ')[1].split('.')[0] === '16' ? { ...t, 'media-url': undefined } : t
        $.msg(n, o, i, t)
    } else {
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
                'user-agent':
                    deviceType === 'pc'
                        ? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299'
                        : 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
            })
        // 根据jsonType处理headers
        dataType === 'json' && Object.assign(headers, { 'content-type': 'application/json;charset=UTF-8' })
        const options = { ...o }
        Object.assign(options, {
            url,
            method,
            headers,
            'binary-mode': resultType == 'buffer',
            // responseType: resultType == 'buffer' ? 'arraybuffer' : 'text',
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
                        const decoder = new TextDecoder($.encoding)
                        return decoder.decode(new Uint8Array(buffer))
                    }
                    resolve(
                        resultType === 'buffer'
                            ? $.isQuanX()
                                ? response.body
                                : _decode(response)
                            : resultType === 'response'
                            ? response
                            : $.toObj(data) || data
                    )
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
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,o)=>{s.call(this,t,(t,s,r)=>{t?o(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.logLevels={debug:0,info:1,warn:2,error:3},this.logLevelPrefixs={debug:"[DEBUG] ",info:"[INFO] ",warn:"[WARN] ",error:"[ERROR] "},this.logLevel="info",this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}getEnv(){return"undefined"!=typeof $environment&&$environment["surge-version"]?"Surge":"undefined"!=typeof $environment&&$environment["stash-version"]?"Stash":"undefined"!=typeof module&&module.exports?"Node.js":"undefined"!=typeof $task?"Quantumult X":"undefined"!=typeof $loon?"Loon":"undefined"!=typeof $rocket?"Shadowrocket":void 0}isNode(){return"Node.js"===this.getEnv()}isQuanX(){return"Quantumult X"===this.getEnv()}isSurge(){return"Surge"===this.getEnv()}isLoon(){return"Loon"===this.getEnv()}isShadowrocket(){return"Shadowrocket"===this.getEnv()}isStash(){return"Stash"===this.getEnv()}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null,...s){try{return JSON.stringify(t,...s)}catch{return e}}getjson(t,e){let s=e;const o=this.getdata(t);if(o)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,o)=>e(o))})}runScript(t,e){return new Promise(s=>{let o=this.getdata("@chavy_boxjs_userCfgs.httpapi");o=o?o.replace(/\n/g,"").trim():o;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[i,a]=o.split("@"),n={url:`http://${a}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":i,Accept:"*/*"},timeout:r};this.post(n,(t,e,o)=>s(o))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),o=!s&&this.fs.existsSync(e);if(!s&&!o)return{};{const o=s?t:e;try{return JSON.parse(this.fs.readFileSync(o))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),o=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):o?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const o=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of o)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,o)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[o+1])>>0==+e[o+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,o]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,o,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,o,r]=/^@(.*?)\.(.*?)$/.exec(e),i=this.getval(o),a=o?"null"===i?null:i||"{}":"{}";try{const e=JSON.parse(a);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),o)}catch(e){const i={};this.lodash_set(i,r,t),s=this.setval(JSON.stringify(i),o)}}else s=this.setval(t,e);return s}getval(t){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.read(t);case"Quantumult X":return $prefs.valueForKey(t);case"Node.js":return this.data=this.loaddata(),this.data[t];default:return this.data&&this.data[t]||null}}setval(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.write(t,e);case"Quantumult X":return $prefs.setValueForKey(t,e);case"Node.js":return this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0;default:return this.data&&this.data[e]||null}}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.cookie&&void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar)))}get(t,e=(()=>{})){switch(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"],delete t.headers["content-type"],delete t.headers["content-length"]),t.params&&(t.url+="?"+this.queryStr(t.params)),void 0===t.followRedirect||t.followRedirect||((this.isSurge()||this.isLoon())&&(t["auto-redirect"]=!1),this.isQuanX()&&(t.opts?t.opts.redirection=!1:t.opts={redirection:!1})),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,o)=>{!t&&s&&(s.body=o,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,o)});break;case"Quantumult X":this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:o,headers:r,body:i,bodyBytes:a}=t;e(null,{status:s,statusCode:o,headers:r,body:i,bodyBytes:a},i,a)},t=>e(t&&t.error||"UndefinedError"));break;case"Node.js":let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:o,statusCode:r,headers:i,rawBody:a}=t,n=s.decode(a,this.encoding);e(null,{status:o,statusCode:r,headers:i,rawBody:a,body:n},n)},t=>{const{message:o,response:r}=t;e(o,r,r&&s.decode(r.rawBody,this.encoding))})}}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";switch(t.body&&t.headers&&!t.headers["Content-Type"]&&!t.headers["content-type"]&&(t.headers["content-type"]="application/x-www-form-urlencoded"),t.headers&&(delete t.headers["Content-Length"],delete t.headers["content-length"]),void 0===t.followRedirect||t.followRedirect||((this.isSurge()||this.isLoon())&&(t["auto-redirect"]=!1),this.isQuanX()&&(t.opts?t.opts.redirection=!1:t.opts={redirection:!1})),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,(t,s,o)=>{!t&&s&&(s.body=o,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,o)});break;case"Quantumult X":t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:o,headers:r,body:i,bodyBytes:a}=t;e(null,{status:s,statusCode:o,headers:r,body:i,bodyBytes:a},i,a)},t=>e(t&&t.error||"UndefinedError"));break;case"Node.js":let o=require("iconv-lite");this.initGotEnv(t);const{url:r,...i}=t;this.got[s](r,i).then(t=>{const{statusCode:s,statusCode:r,headers:i,rawBody:a}=t,n=o.decode(a,this.encoding);e(null,{status:s,statusCode:r,headers:i,rawBody:a,body:n},n)},t=>{const{message:s,response:r}=t;e(s,r,r&&o.decode(r.rawBody,this.encoding))})}}time(t,e=null){const s=e?new Date(e):new Date;let o={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in o)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?o[e]:("00"+o[e]).substr((""+o[e]).length)));return t}queryStr(t){let e="";for(const s in t){let o=t[s];null!=o&&""!==o&&("object"==typeof o&&(o=JSON.stringify(o)),e+=`${s}=${o}&`)}return e=e.substring(0,e.length-1),e}msg(e=t,s="",o="",r){const i=t=>{switch(typeof t){case void 0:return t;case"string":switch(this.getEnv()){case"Surge":case"Stash":default:return{url:t};case"Loon":case"Shadowrocket":return t;case"Quantumult X":return{"open-url":t};case"Node.js":return}case"object":switch(this.getEnv()){case"Surge":case"Stash":case"Shadowrocket":default:{let e=t.url||t.openUrl||t["open-url"];return{url:e}}case"Loon":{let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}case"Quantumult X":{let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl,o=t["update-pasteboard"]||t.updatePasteboard;return{"open-url":e,"media-url":s,"update-pasteboard":o}}case"Node.js":return}default:return}};if(!this.isMute)switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:$notification.post(e,s,o,i(r));break;case"Quantumult X":$notify(e,s,o,i(r));break;case"Node.js":}if(!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t.push(e),s&&t.push(s),o&&t.push(o),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}debug(...t){this.logLevels[this.logLevel]<=this.logLevels.debug&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.debug}${t.join(this.logSeparator)}`))}info(...t){this.logLevels[this.logLevel]<=this.logLevels.info&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.info}${t.join(this.logSeparator)}`))}warn(...t){this.logLevels[this.logLevel]<=this.logLevels.warn&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.warn}${t.join(this.logSeparator)}`))}error(...t){this.logLevels[this.logLevel]<=this.logLevels.error&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.error}${t.join(this.logSeparator)}`))}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,e,t);break;case"Node.js":this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,e,void 0!==t.message?t.message:t,t.stack)}}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;switch(this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:$done(t);break;case"Node.js":process.exit(1)}}}(t,e)}
