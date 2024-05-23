/******************************************
 * @name 巴士论坛签到
 * @channel https://t.me/yqc_123/
 * @feedback https://t.me/yqc_777/
 * @update 20240523
 * @version 1.0.0
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
[mitm]
hostname = www.javbus.com

[rewrite_local]
# 巴士论坛获取Cookie
^https?:\/\/www\.javbus\.com\/forum\/home.php\?mod= url script-request-header https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/javbus.js

[task_local]
0 6 * * * https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/javbus.js, tag=巴士论坛签到, img-url=https://raw.githubusercontent.com/Yuheng0101/X/main/Assets/bus.png, enabled=true
******************************************
Loon配置:
[MITM]
hostname = www.javbus.com

[Script]
http-request ^https?:\/\/www\.javbus\.com\/forum\/home.php\?mod=, tag=巴士论坛获取Cookie, script-path=https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/javbus.js,requires-body=0

cron "0 6 * * *" script-path=https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/javbus.js, timeout=10, tag=巴士论坛签到, img-url=https://raw.githubusercontent.com/Yuheng0101/X/main/Assets/bus.png
******************************************
Surge配置:
[MITM]
hostname = %APPEND% www.javbus.com

[Script]
巴士论坛获取Cookie = type=http-request ^https?:\/\/www\.javbus\.com\/forum\/home.php\?mod=,requires-body=0,max-size=0,script-path=https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/javbus.js

巴士论坛签到 = type=cron,cronexp=0 6 * * *,wake-system=1,script-path=https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/javbus.js,timeout=60
******************************************/
const $ = new Env('巴士论坛', {
    scriptname: 'JAVBUS',
    logLevelPrefixs: {
        debug: '===🛠️调试输出===\n',
        info: '===ℹ️日志输出===\n',
        warn: '===⚠️𝐖𝐀𝐑𝐍𝐈𝐍𝐆===\n',
        error: '===❌错误提示===\n'
    },
    message: void 0
})
// 这里兼容iOS 16系统上有媒体链接Loon/Surge上不通知的问题
$.notifyWithMedia = $.toObj($.getdata(`${$.scriptname.toLowerCase()}_notify_with_media`)) ?? true
$.debug(`🔰 媒体通知: ${$.notifyWithMedia ? '开启' : '关闭'}`)
// 开发者模式
$.logLevel = $.toObj($.isNode() ? process.env[`${$.scriptname}_DEBUG`] : $.getdata(`${$.scriptname.toLowerCase()}_debug`)) ? 'debug' : 'info'
$.debug(`🔰 模式: ${$.logLevel == 'debug' ? '调试' : '常规'}`)
// 是否开启代理 => 用于拉取github依赖
$.useProxy = $.toObj($.isNode() && process.env[`${$.scriptname}_USE_PROXY`]) || false
$.isNode() && $.debug(`🔰 代理: ${$.useProxy ? '开启' : '关闭'}`)
$.userCookies = $.toObj($.isNode() ? process.env[`${$.scriptname}_DEBUG`] : $.getdata(`${$.scriptname.toLowerCase()}_users`)) || []
const instance = new HTTP({
    baseURL: 'https://www.javbus.com',
    headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/53',
        referer: 'https://www.javbus.com/'
    }
})
instance.interceptors.request = (config) => {
    if ($.isNode() && $.useProxy) {
        require('dotenv').config()
        const PROXY_HOST = process.env.PROXY_HOST
        const PROXY_PORT = process.env.PROXY_PORT
        if (!PROXY_HOST || !PROXY_PORT) {
            $.log(`请配置代理环境变量 PROXY_HOST 和 PROXY_PORT`)
            return config
        }
        const tunnel = require('tunnel')
        const agent = { https: tunnel.httpsOverHttp({ proxy: { host: PROXY_HOST, port: PROXY_PORT * 1 } }) }
        Object.assign(config, { agent })
    }
    return config
}
;(async () => {
    await showNotice()
    await loadRemoteScriptByCache('https://cdn.jsdelivr.net/gh/Yuheng0101/X@main/Utils/cheerio.js', 'createCheerio', 'cheerio')
    if (typeof $request !== 'undefined') return await getCookie()
    if (!$.userCookies.length) return $.msg($.name, '未找到用户Cookie,请先获取用户Cookie', '')
    for (let i = 0; i < $.userCookies.length; i++) {
        const { cookie, username } = $.userCookies[i]
        const signInfo = await javBus(cookie)
        $.message = `用户名: ${username}`
        if (!!signInfo) {
            signInfo?.totalCount && ($.message += `\n😎總次數: ${signInfo.totalCount}`)
            signInfo?.course && ($.message += ` 🚗里程: ${signInfo.course}`)
            signInfo?.money && ($.message += ` 💰金錢: ${signInfo.money}`)
            signInfo?.time && ($.message += `\n最後獎勵時間: ${signInfo.time}`)
            await showMsg($.name, '签到成功', $.message, {
                $media: `https://www.javbus.com/forum/static/image/common/logo_javbus.png`,
                $open: 'https://www.javbus.com/forum/'
            })
            $.message = ''
        }
    }
})()
    .catch((err) => $.logErr(err))
    .finally(() => $.done({}))
function javBus(cookie) {
    return instance
        .request({ url: '/forum/home.php?mod=spacecp&ac=credit&op=log&suboperation=creditrulelog', headers: { cookie } })
        .then((html) => {
            if (/每天登錄/.test(html)) {
                const _$ = $.cheerio.load(html)
                const main = _$('td:contains("每天登錄")').parent()
                // 總次數
                const totalCount = _$(main).find('td').eq(1).text().trim()
                // 里程
                const course = _$(main).find('td').eq(3).text().trim()
                // 金錢
                const money = _$(main).find('td').eq(4).text().trim()
                // 	最後獎勵時間
                const time = _$(main).find('td').eq(5).text().trim()
                return {
                    totalCount,
                    course,
                    money,
                    time
                }
            } else {
                $.msg($.name, '签到失败', `Cookie可能失效了, 请重新获取`)
            }
        })
        .catch((e) => {
            $.logErr(e)
        })
}
function getCookie() {
    const updateCookie = (username, cookie) => {
        const users = $.getjson(`${$.scriptname.toLowerCase()}_users`, []).filter(
            (user, index, self) => self.findIndex((u) => u.username === user.username) === index
        )
        const index = users.findIndex((user) => user.username === encodeURIComponent(username))
        if (index !== -1) {
            if (users[index]?.cookie === cookie) {
                $.info(`与缓存Cookie一致, 不做修改`)
                return
            }
            users[index].cookie = cookie
            $.msg($.name, username, 'Cookie更新成功')
        } else {
            users.push({ username: encodeURIComponent(username), cookie })
            $.msg($.name, username, `Cookie添加成功`)
        }
        $.setjson(users, `${$.scriptname.toLowerCase()}_users`)
    }
    let cookie = Object.fromEntries(Object.entries($request.headers).map(([k, v]) => [k.toLowerCase(), v]))?.cookie
    if (!cookie) return $.msg($.name, '获取Cookie失败', ``)
    const auth = cookie.match(/4fJN_2132_auth=(.*?)($|;)/)?.[1]
    const saltkey = cookie.match(/4fJN_2132_saltkey=(.*?)($|;)/)?.[1]
    if (!auth || !saltkey) return $.msg($.name, '获取Cookie失败', `请先登录后再获取`)
    cookie = `4fJN_2132_saltkey=${saltkey}; 4fJN_2132_auth=${auth};`
    $.info(`用户凭证: ${cookie}`)
    return instance
        .request({
            url: '/forum/member.php?mod=logging&action=login',
            headers: {
                cookie
            }
        })
        .then((html) => {
            const _$ = $.cheerio.load(html)
            const username = _$('.member-name').text().trim() || '神秘用户~'
            $.info(`用户名: ${username}`)
            updateCookie(username, cookie)
        })
        .catch((e) => {
            $.logErr(e)
        })
}
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
            instance
                .request(scriptUrl)
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
        const notify = $.isNode() ? require('./sendNotify') : ''
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
        !$.notifyWithMedia && ['media-url', 'mediaUrl', '$media'].map((key) => delete t[key])
        $.msg(n, o, i, t)
    }
}
// prettier-ignore
function HTTP(e){return new class{constructor(e){this.defaults=e;this.interceptors={request:e=>e,response:e=>e}}mergeOptions(e,t){if(typeof t!=="object"||t==null)return e;return Object.assign(e,t)}async request(e,t){try{return await this._request(e,t)}catch(t){if(t instanceof Error){let e;Error.captureStackTrace?Error.captureStackTrace(e={}):e=new Error;const r=e.stack?e.stack.replace(/^.+\n/,""):"";try{if(!t.stack){t.stack=r}else if(r&&!String(t.stack).endsWith(r.replace(/^.+\n.+\n/,""))){t.stack+="\n"+r}}catch(e){}}throw t}}async _request(e,u){if(typeof e==="string"){u=u||{};u.url=e}else{u=e||{}}u=this.mergeOptions(this.defaults,u);if(!u.url.startsWith("http")&&u.baseURL){u.url=u.baseURL+u.url;}if(u?.params){u.url+=(u.url.includes("?")?"&":"?")+$.queryStr(u.params);delete u.params}u.headers={...u?.headers||{}};const t=(u?.method||(u?.body?"POST":"GET")).toLocaleLowerCase();if(t=="post"){const a=u?.headers?.[`Content-Type`]??u?.headers?.[`content-type`]?.split(";")?.[0];switch(a){case undefined:case"application/x-www-form-urlencoded":if(typeof u?.body=="object")u.body=$.queryStr(u.body);break;case"text/json":case"application/json":if(typeof u?.body=="object")u.body=$.toStr(u.body);break}}const r=u?.timeout?$.isSurge()?u.timeout/1e3:u.timeout:5e3;const s=this.interceptors.request(u);const o=new Promise((c,i)=>{$[t](s,(t,r,s)=>{if(t){let e=$.toStr(t,Object.getOwnPropertyNames(t));if(r){e+=`状态码: ${r.statusCode}`}if(s){e+=$.toObj(s)?.message||s}i(`[网络请求出错啦~] (${u.url}) 异常: ${e}`)}else{let e=undefined;const o=u?.["binary-mode"]?"binary":u?.resultType;switch(o){case undefined:case"data":e=$.toObj(s)||s;break;case"response":e=r;break;case"binary":if(typeof TextDecoder=="undefined"){$.logErr(`${$.getEnv()}不支持TextDecoder, 请检查环境或者更新工具!`);e="";break}const n=r.rawBody??r.body;const a=new TextDecoder($.encoding);e=a.decode(new Uint8Array(n));break}c(e)}})});const n=o.then(this.interceptors.response);return $.isQuanX()?await Promise.race([new Promise((_,t)=>setTimeout(()=>t(new Error("请求超时, 网络开小差了~")),r)),n]):n}}(e)}
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;"POST"===e&&(s=this.post);const i=new Promise(((e,i)=>{s.call(this,t,((t,s,o)=>{t?i(t):e(s)}))}));return t.timeout?((t,e=1e3)=>Promise.race([t,new Promise(((t,s)=>{setTimeout((()=>{s(new Error("请求超时"))}),e)}))]))(i,t.timeout):i}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.logLevels={debug:0,info:1,warn:2,error:3},this.logLevelPrefixs={debug:"[DEBUG] ",info:"[INFO] ",warn:"[WARN] ",error:"[ERROR] "},this.logLevel="info",this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}getEnv(){return"undefined"!=typeof $environment&&$environment["surge-version"]?"Surge":"undefined"!=typeof $environment&&$environment["stash-version"]?"Stash":"undefined"!=typeof module&&module.exports?"Node.js":"undefined"!=typeof $task?"Quantumult X":"undefined"!=typeof $loon?"Loon":"undefined"!=typeof $rocket?"Shadowrocket":void 0}isNode(){return"Node.js"===this.getEnv()}isQuanX(){return"Quantumult X"===this.getEnv()}isSurge(){return"Surge"===this.getEnv()}isLoon(){return"Loon"===this.getEnv()}isShadowrocket(){return"Shadowrocket"===this.getEnv()}isStash(){return"Stash"===this.getEnv()}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null,...s){try{return JSON.stringify(t,...s)}catch{return e}}getjson(t,e){let s=e;if(this.getdata(t))try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise((e=>{this.get({url:t},((t,s,i)=>e(i)))}))}runScript(t,e){return new Promise((s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let o=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");o=o?1*o:20,o=e&&e.timeout?e.timeout:o;const[r,a]=i.split("@"),n={url:`http://${a}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:o},headers:{"X-Key":r,Accept:"*/*"},policy:"DIRECT",timeout:o};this.post(n,((t,e,i)=>s(i)))})).catch((t=>this.logErr(t)))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),o=JSON.stringify(this.data);s?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(e,o):this.fs.writeFileSync(t,o)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return s;return o}lodash_set(t,e,s){return Object(t)!==t||(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce(((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{}),t)[e[e.length-1]]=s),t}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),o=s?this.getval(s):"";if(o)try{const t=JSON.parse(o);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(e),r=this.getval(i),a=i?"null"===r?null:r||"{}":"{}";try{const e=JSON.parse(a);this.lodash_set(e,o,t),s=this.setval(JSON.stringify(e),i)}catch(e){const r={};this.lodash_set(r,o,t),s=this.setval(JSON.stringify(r),i)}}else s=this.setval(t,e);return s}getval(t){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.read(t);case"Quantumult X":return $prefs.valueForKey(t);case"Node.js":return this.data=this.loaddata(),this.data[t];default:return this.data&&this.data[t]||null}}setval(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.write(t,e);case"Quantumult X":return $prefs.setValueForKey(t,e);case"Node.js":return this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0;default:return this.data&&this.data[e]||null}}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.cookie&&void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar)))}get(t,e=(()=>{})){switch(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"],delete t.headers["content-type"],delete t.headers["content-length"]),t.params&&(t.url+="?"+this.queryStr(t.params)),void 0===t.followRedirect||t.followRedirect||((this.isSurge()||this.isLoon())&&(t["auto-redirect"]=!1),this.isQuanX()&&(t.opts?t.opts.redirection=!1:t.opts={redirection:!1})),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,((t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,i)}));break;case"Quantumult X":this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then((t=>{const{statusCode:s,statusCode:i,headers:o,body:r,bodyBytes:a}=t;e(null,{status:s,statusCode:i,headers:o,body:r,bodyBytes:a},r,a)}),(t=>e(t&&t.error||"UndefinedError")));break;case"Node.js":let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",((t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}})).then((t=>{const{statusCode:i,statusCode:o,headers:r,rawBody:a}=t,n=s.decode(a,this.encoding);e(null,{status:i,statusCode:o,headers:r,rawBody:a,body:n},n)}),(t=>{const{message:i,response:o}=t;e(i,o,o&&s.decode(o.rawBody,this.encoding))}));break}}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";switch(t.body&&t.headers&&!t.headers["Content-Type"]&&!t.headers["content-type"]&&(t.headers["content-type"]="application/x-www-form-urlencoded"),t.headers&&(delete t.headers["Content-Length"],delete t.headers["content-length"]),void 0===t.followRedirect||t.followRedirect||((this.isSurge()||this.isLoon())&&(t["auto-redirect"]=!1),this.isQuanX()&&(t.opts?t.opts.redirection=!1:t.opts={redirection:!1})),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,((t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,i)}));break;case"Quantumult X":t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then((t=>{const{statusCode:s,statusCode:i,headers:o,body:r,bodyBytes:a}=t;e(null,{status:s,statusCode:i,headers:o,body:r,bodyBytes:a},r,a)}),(t=>e(t&&t.error||"UndefinedError")));break;case"Node.js":let i=require("iconv-lite");this.initGotEnv(t);const{url:o,...r}=t;this.got[s](o,r).then((t=>{const{statusCode:s,statusCode:o,headers:r,rawBody:a}=t,n=i.decode(a,this.encoding);e(null,{status:s,statusCode:o,headers:r,rawBody:a,body:n},n)}),(t=>{const{message:s,response:o}=t;e(s,o,o&&i.decode(o.rawBody,this.encoding))}));break}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}queryStr(t){let e="";for(const s in t){let i=t[s];null!=i&&""!==i&&("object"==typeof i&&(i=JSON.stringify(i)),e+=`${s}=${i}&`)}return e=e.substring(0,e.length-1),e}msg(e=t,s="",i="",o={}){const r=t=>{const{$open:e,$copy:s,$media:i,$mediaMime:o}=t;switch(typeof t){case void 0:return t;case"string":switch(this.getEnv()){case"Surge":case"Stash":default:return{url:t};case"Loon":case"Shadowrocket":return t;case"Quantumult X":return{"open-url":t};case"Node.js":return}case"object":switch(this.getEnv()){case"Surge":case"Stash":case"Shadowrocket":default:{const r={};let a=t.openUrl||t.url||t["open-url"]||e;a&&Object.assign(r,{action:"open-url",url:a});let n=t["update-pasteboard"]||t.updatePasteboard||s;if(n&&Object.assign(r,{action:"clipboard",text:n}),i){let t,e,s;if(i.startsWith("http"))t=i;else if(i.startsWith("data:")){const[t]=i.split(";"),[,o]=i.split(",");e=o,s=t.replace("data:","")}else{e=i,s=(t=>{const e={JVBERi0:"application/pdf",R0lGODdh:"image/gif",R0lGODlh:"image/gif",iVBORw0KGgo:"image/png","/9j/":"image/jpg"};for(var s in e)if(0===t.indexOf(s))return e[s];return null})(i)}Object.assign(r,{"media-url":t,"media-base64":e,"media-base64-mime":o??s})}return Object.assign(r,{"auto-dismiss":t["auto-dismiss"],sound:t.sound}),r}case"Loon":{const s={};let o=t.openUrl||t.url||t["open-url"]||e;o&&Object.assign(s,{openUrl:o});let r=t.mediaUrl||t["media-url"];return i?.startsWith("http")&&(r=i),r&&Object.assign(s,{mediaUrl:r}),console.log(JSON.stringify(s)),s}case"Quantumult X":{const o={};let r=t["open-url"]||t.url||t.openUrl||e;r&&Object.assign(o,{"open-url":r});let a=t["media-url"]||t.mediaUrl;i?.startsWith("http")&&(a=i),a&&Object.assign(o,{"media-url":a});let n=t["update-pasteboard"]||t.updatePasteboard||s;return n&&Object.assign(o,{"update-pasteboard":n}),console.log(JSON.stringify(o)),o}case"Node.js":return}default:return}};if(!this.isMute)switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:$notification.post(e,s,i,r(o));break;case"Quantumult X":$notify(e,s,i,r(o));break;case"Node.js":break}if(!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}debug(...t){this.logLevels[this.logLevel]<=this.logLevels.debug&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.debug}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}info(...t){this.logLevels[this.logLevel]<=this.logLevels.info&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.info}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}warn(...t){this.logLevels[this.logLevel]<=this.logLevels.warn&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.warn}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}error(...t){this.logLevels[this.logLevel]<=this.logLevels.error&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.error}${t.map((t=>t??String(t))).join(this.logSeparator)}`))}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.map((t=>t??String(t))).join(this.logSeparator))}logErr(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:this.log("",`❗️${this.name}, 错误!`,e,t);break;case"Node.js":this.log("",`❗️${this.name}, 错误!`,e,void 0!==t.message?t.message:t,t.stack);break}}wait(t){return new Promise((e=>setTimeout(e,t)))}done(t={}){const e=((new Date).getTime()-this.startTime)/1e3;switch(this.log("",`🔔${this.name}, 结束! 🕛 ${e} 秒`),this.log(),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:$done(t);break;case"Node.js":process.exit(1)}}}(t,e)}
