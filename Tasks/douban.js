/******************************************
 * @name 豆瓣每日推荐
 * @channel https://t.me/yqc_123
 * @feedback https://t.me/yqc_777
 * @version 1.0.1
******************************************
## 更新日志
### 20231020
    1.优化代码

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
30 9 * * * https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/douban.js, tag=豆瓣每日推荐, img-url=https://is3-ssl.mzstatic.com/image/thumb/Purple126/v4/90/5d/f8/905df82a-0e2e-5a2c-2be6-cc690fb0bec0/AppIcon-0-0-1x_U007emarketing-0-0-0-6-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/144x144bb.png, enabled=true
```
### 配置 (Loon)
```properties
[Script]
cron "30 9 * * *" script-path=https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/douban.js, timeout=10, tag=豆瓣每日推荐, img-url=https://is3-ssl.mzstatic.com/image/thumb/Purple126/v4/90/5d/f8/905df82a-0e2e-5a2c-2be6-cc690fb0bec0/AppIcon-0-0-1x_U007emarketing-0-0-0-6-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/144x144bb.png
```
### 配置 (Surge)
```properties
豆瓣每日推荐 = type=cron,cronexp=0 30 9 * * *,wake-system=1,script-path=https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/douban.js,timeout=60
```
******************************************/
const scriptName = '豆瓣每日推荐'
const $ = new Env(scriptName)

!(async () => {
    const movieInfo = await getMovie()
    const searcher = new Searcher(movieInfo)
    const url = await searcher.start()
    Object.assign(movieInfo, { url })
    await toNotify(movieInfo)
})()
    .catch((e) => $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, ''))
    .finally(() => $.done())
async function getMovie() {
    // 参数来源@Honye
    const apiKey = '0ab215a8b1977939201640fa14c66bab'
    const dateStr = $.time('yyyy-MM-dd')
    const opts = {
        url: `https://frodo.douban.com/api/v2/calendar/today?apikey=${apiKey}&date=${dateStr}&alt=json&_sig=tuOyn%2B2uZDBFGAFBLklc2GkuQk4%3D&_ts=1610703479`,
        method: 'GET',
        headers: {
            'User-Agent': 'api-client/0.1.3 com.douban.frodo/8.0.0'
        }
    }
    try {
        const { comment, subject } = await Request(opts)
        const { title, year, directors, actors, pubdate, card_subtitle, rating } = subject
        return {
            title,
            year,
            directors: directors.map((item) => item.name).join('/'),
            actors:
                actors
                    .slice(0, 4)
                    .map((item) => item.name)
                    .join('/') + '...',
            poster: comment.poster,
            pubdate: pubdate.join('/'),
            card_subtitle: card_subtitle.split('\n')[0],
            rating: rating.value
        }
    } catch (e) {
        throw e || '获取今日推荐影片失败'
    }
}
async function toNotify(movieInfo) {
    const { title, year, directors, actors, poster, pubdate, card_subtitle, rating, url } = movieInfo
    const subTitle = `《${title}(${year})》\t${card_subtitle}`
    var msg = `导演: ${directors}\n主演: ${actors}\n上映: ${pubdate}\n评分: ${rating}`
    if ($.isQuanX() || $.isLoon()) {
        $.msg(scriptName, subTitle, msg, {
            'open-url': url || 'https://movie.douban.com/top250',
            'media-url': poster.replace('webp', 'jpg')
        })
    } else if ($.isSurge()) {
        var jumpUrl = url || 'https://movie.douban.com/top250'
        $.msg(scriptName, subTitle, msg, jumpUrl)
    } else {
        if (url) msg += `\n🔗链接：${url}`
        $.msg(scriptName, subTitle, msg)
    }
}
// prettier-ignore
function Searcher(movieInfo){return new class{constructor(movie){this.sourceList=[{name:"高清资源",searchUrl:"https://api.1080zyku.com/inc/apijson.php/"},{name:"红牛资源",searchUrl:"https://www.hongniuzy2.com/api.php/provide/vod/from/hnm3u8/"},{name:"非凡资源",searchUrl:"http://cj.ffzyapi.com/api.php/provide/vod/"},{name:"量子资源",searchUrl:"https://cj.lziapi.com/api.php/provide/vod/"},{name:"ikun资源",searchUrl:"https://ikunzyapi.com/api.php/provide/vod/from/ikm3u8/at/json/"},{name:"光速资源",searchUrl:"https://api.guangsuapi.com/api.php/provide/vod/from/gsm3u8/"}],this.movie=movie}async start(){let playURL="";for(const item of this.sourceList){console.log(`⏩正在使用${item.name}搜索资源`);var result=await this.toQurey(item.searchUrl);if(result){playURL=result,console.log(`✅已在${item.name}搜索到资源: ${playURL}`);break}console.log(`❌未在${item.name}搜索到资源`)}return playURL||console.log("❌所有资源遍历完毕, 未搜索到资源"),playURL}toQurey(prefix){var result="";return new Promise(async resolve=>{const options={url:`${prefix}?ac=detail&wd=${encodeURI(this.movie.title)}`};try{var response=await Request(options);result=this.handleResponse(response)}catch(e){console.log(e)}finally{resolve(result)}})}handleResponse(response){if(!response||0===response.list.length)throw"没有搜索到结果";var current=response.list.find(item=>{if(item.vod_year==this.movie.year&&item.vod_actor.split(",").includes(this.movie.actors.split("/")[0]))return!0});if(!current)throw"没有找到相关影片";return current.vod_play_url.replace(/.*?\$(.*)/,"$1")}}(movieInfo)}
// prettier-ignore
function Request(options){const method=options.hasOwnProperty("method")?options.method.toLocaleLowerCase():"get";if($.isNode()&&options.hasOwnProperty("use_proxy")&&options.use_proxy){const tunnel=require("tunnel"),agent={https:tunnel.httpsOverHttp({proxy:{host:"127.0.0.1",port:7890}})};Object.assign(options,{agent:agent})}return new Promise((resolve,reject)=>{$.http[method](options).then(response=>{var resp=response.body;"string"==typeof resp&&(resp=JSON.parse(resp)),resolve(resp)}).catch(err=>reject(err))})}
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,a)=>{s.call(this,t,(t,s,r)=>{t?a(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}getEnv(){return"undefined"!=typeof $environment&&$environment["surge-version"]?"Surge":"undefined"!=typeof $environment&&$environment["stash-version"]?"Stash":"undefined"!=typeof module&&module.exports?"Node.js":"undefined"!=typeof $task?"Quantumult X":"undefined"!=typeof $loon?"Loon":"undefined"!=typeof $rocket?"Shadowrocket":void 0}isNode(){return"Node.js"===this.getEnv()}isQuanX(){return"Quantumult X"===this.getEnv()}isSurge(){return"Surge"===this.getEnv()}isLoon(){return"Loon"===this.getEnv()}isShadowrocket(){return"Shadowrocket"===this.getEnv()}isStash(){return"Stash"===this.getEnv()}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const a=this.getdata(t);if(a)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,a)=>e(a))})}runScript(t,e){return new Promise(s=>{let a=this.getdata("@chavy_boxjs_userCfgs.httpapi");a=a?a.replace(/\n/g,"").trim():a;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[i,o]=a.split("@"),n={url:`http://${o}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":i,Accept:"*/*"},timeout:r};this.post(n,(t,e,a)=>s(a))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),a=!s&&this.fs.existsSync(e);if(!s&&!a)return{};{const a=s?t:e;try{return JSON.parse(this.fs.readFileSync(a))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),a=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):a?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const a=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of a)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,a)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[a+1])>>0==+e[a+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,a]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,a,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,a,r]=/^@(.*?)\.(.*?)$/.exec(e),i=this.getval(a),o=a?"null"===i?null:i||"{}":"{}";try{const e=JSON.parse(o);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),a)}catch(e){const i={};this.lodash_set(i,r,t),s=this.setval(JSON.stringify(i),a)}}else s=this.setval(t,e);return s}getval(t){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.read(t);case"Quantumult X":return $prefs.valueForKey(t);case"Node.js":return this.data=this.loaddata(),this.data[t];default:return this.data&&this.data[t]||null}}setval(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.write(t,e);case"Quantumult X":return $prefs.setValueForKey(t,e);case"Node.js":return this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0;default:return this.data&&this.data[e]||null}}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){switch(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"],delete t.headers["content-type"],delete t.headers["content-length"]),t.params&&(t.url+="?"+this.queryStr(t.params)),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,a)=>{!t&&s&&(s.body=a,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,a)});break;case"Quantumult X":this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:a,headers:r,body:i,bodyBytes:o}=t;e(null,{status:s,statusCode:a,headers:r,body:i,bodyBytes:o},i,o)},t=>e(t&&t.error||"UndefinedError"));break;case"Node.js":let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:a,statusCode:r,headers:i,rawBody:o}=t,n=s.decode(o,this.encoding);e(null,{status:a,statusCode:r,headers:i,rawBody:o,body:n},n)},t=>{const{message:a,response:r}=t;e(a,r,r&&s.decode(r.rawBody,this.encoding))})}}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";switch(t.body&&t.headers&&!t.headers["Content-Type"]&&!t.headers["content-type"]&&(t.headers["content-type"]="application/x-www-form-urlencoded"),t.headers&&(delete t.headers["Content-Length"],delete t.headers["content-length"]),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,(t,s,a)=>{!t&&s&&(s.body=a,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,a)});break;case"Quantumult X":t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:a,headers:r,body:i,bodyBytes:o}=t;e(null,{status:s,statusCode:a,headers:r,body:i,bodyBytes:o},i,o)},t=>e(t&&t.error||"UndefinedError"));break;case"Node.js":let a=require("iconv-lite");this.initGotEnv(t);const{url:r,...i}=t;this.got[s](r,i).then(t=>{const{statusCode:s,statusCode:r,headers:i,rawBody:o}=t,n=a.decode(o,this.encoding);e(null,{status:s,statusCode:r,headers:i,rawBody:o,body:n},n)},t=>{const{message:s,response:r}=t;e(s,r,r&&a.decode(r.rawBody,this.encoding))})}}time(t,e=null){const s=e?new Date(e):new Date;let a={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in a)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?a[e]:("00"+a[e]).substr((""+a[e]).length)));return t}queryStr(t){let e="";for(const s in t){let a=t[s];null!=a&&""!==a&&("object"==typeof a&&(a=JSON.stringify(a)),e+=`${s}=${a}&`)}return e=e.substring(0,e.length-1),e}msg(e=t,s="",a="",r){const i=t=>{switch(typeof t){case void 0:return t;case"string":switch(this.getEnv()){case"Surge":case"Stash":default:return{url:t};case"Loon":case"Shadowrocket":return t;case"Quantumult X":return{"open-url":t};case"Node.js":return}case"object":switch(this.getEnv()){case"Surge":case"Stash":case"Shadowrocket":default:{let e=t.url||t.openUrl||t["open-url"];return{url:e}}case"Loon":{let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}case"Quantumult X":{let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl,a=t["update-pasteboard"]||t.updatePasteboard;return{"open-url":e,"media-url":s,"update-pasteboard":a}}case"Node.js":return}default:return}};if(!this.isMute)switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:$notification.post(e,s,a,i(r));break;case"Quantumult X":$notify(e,s,a,i(r));break;case"Node.js":}if(!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),a&&t.push(a),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:this.log("",`❗️${this.name}, 错误!`,t);break;case"Node.js":this.log("",`❗️${this.name}, 错误!`,t.stack)}}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;switch(this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:$done(t);break;case"Node.js":process.exit(1)}}}(t,e)}
