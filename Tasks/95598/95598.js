/******************************************
 * @name 网上国网🌏
 * @channel https://t.me/yqc_123/
 * @feedback https://t.me/yqc_777/
 * @author 𝒀𝒖𝒉𝒆𝒏𝒈
 * @update 20240331
 * @version 1.2.1
 *****************************************
脚本声明:
1. 本脚本仅用于学习研究，禁止用于商业用途
2. 本脚本不保证准确性、可靠性、完整性和及时性
3. 任何个人或组织均可无需经过通知而自由使用
4. 作者对任何脚本问题概不负责，包括由此产生的任何损失
5. 如果任何单位或个人认为该脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明、所有权证明，我将在收到认证文件确认后删除
6. 请勿将本脚本用于商业用途，由此引起的问题与作者无关
7. 本脚本及其更新版权归作者所有
 ******************************************/
const $ = new Env('网上国网', {
    logLevelPrefixs: {
        debug: '==============🛠️调试输出==============\n',
        info: '==============ℹ️日志输出==============\n',
        warn: '==============⚠️𝐖𝐀𝐑𝐍𝐈𝐍𝐆==============\n',
        error: '==============❌错误提示==============\n'
    }
}) // 建议一天查询一次即可, 无需频繁查询
// ------------------------------------------------------
// 数据定义区
const notify = $.isNode() ? require('./sendNotify') : ''
const BASE_URL = 'https://www.95598.cn' // 国网域名
const MY_SERVER = 'https://free.yuhengy17.me' // 感谢tg群友@woxihuanniya提供的服务器
// const MY_SERVER = 'http://192.168.31.240:7788' // 本地测试
// ------------------------------------------------------
// 处理boxjs存入的'true'|'false'
$.isTrue = (val) => val === 'true' || val === true
// 通知列表
$.message = []
// KEYCODE/PUBLICKEY
$.requestCyu
// 用户数据缓存
$.requestBizrt = $.toObj($.getdata('95598_bizrt'))
// 用户凭证码
$.authorizeCode
// 用户凭证
$.requestToke
// 用户绑定缓存
$.bindInfo = $.toObj($.getdata('95598_bindInfo'))
// 缓存定义区
// 是否开启调试模式
$.logLevel = $.isTrue($.isNode() ? process.env.WSGW_LOG_DEBUG : $.getdata('95598_log_debug')) ? 'debug' : 'info'
// 国网登录账号
const USERNAME = ($.isNode() ? process.env.WSGW_USERNAME : $.getdata('95598_username')) || ''
// 国网登录密码
const PASSWORD = ($.isNode() ? process.env.WSGW_PASSWORD : $.getdata('95598_password')) || ''
// 是否显示近期用电量
const SHOW_RECENT = $.isTrue($.isNode() ? process.env.WSGW_RECENT_ELC_FEE : $.getdata('95598_recent_elc_fee'))
// $.log(`🔐 是否显示近期用电量: ${SHOW_RECENT}`)
// 通知类型: 仅通知默认用户 | 通知所有用户 => 默认会显示所有用户信息
const NOTIFY_TYPE = $.isTrue($.isNode() ? process.env.WSGW_NOTIFY_TYPE : $.getdata('95598_notify_type'))
// $.log(`🔔 通知类型: ${NOTIFY_ALL ? '通知所有用户' : '仅通知默认用户'}`)
// 面板参数弃用
// ------------------------------------------------------
!(async () => {
    await getNotceAndShow()
    if (!USERNAME || !PASSWORD)
        return $.msg('网上国网', '请先配置网上国网账号密码!', '点击前往BoxJs配置', {
            'open-url': 'http://boxjs.com/#/sub/add/https%3A%2F%2Fraw.githubusercontent.com%2FYuheng0101%2FX%2Fmain%2FTasks%2Fboxjs.json'
        })

    const wsgw = new WSGW()
    await wsgw.getCode()
    if ($.requestBizrt) {
        const { token, userInfo } = $.requestBizrt
        $.debug(`🔑 用户凭证: ${token}`, `👤 用户信息: ${$.toStr(userInfo[0].loginAccount)}`)
    } else {
        await wsgw.refreshToken()
    }
    await wsgw.refreshAccessToken()
    if (!$.bindInfo) {
        await wsgw.getBindInfo()
    } else {
        $.debug(`🔑 用户绑定信息: ${$.toStr($.bindInfo)}`)
    }
    // (全|默认)通知
    if (!NOTIFY_TYPE) {
        $.bindInfo.powerUserList = $.bindInfo.powerUserList.filter((item) => item.isDefault === '1')
        if ($.bindInfo.powerUserList.length > 1) {
            $.bindInfo.powerUserList = $.bindInfo.powerUserList.filter((item) => item.elecTypeCode === '01')
        }
    }
    for (let i = 0; i < $.bindInfo.powerUserList.length; i++) {
        const [
            {
                date, // 截至日期
                totalPq, // 上月总用电量
                sumMoney, // 账户余额
                prepayBal, // 预存电费
                dayNum // 预计可用天数
            }
        ] = await wsgw.getElcFee(i)
        const {
            orgName, // 脱敏供电单位
            elecAddr_dst, // 脱敏具体地址
            consName_dst, // 脱敏主户名
            consNo_dst // 用电户号
        } = $.bindInfo.powerUserList[i]
        totalPq && $.message.push(`本期电量: ${totalPq}度${sumMoney ? `  账户余额: ${sumMoney}元` : ''}`)
        date && $.message.push(`截至日期: ${date}`)
        prepayBal && $.message.push(`预存电费: ${prepayBal}元`)
        dayNum && $.message.push(`预计可用: ${dayNum}天`)
        consNo_dst && $.message.push(`户号信息: ${consNo_dst}${consName_dst ? `|${consName_dst}` : ''}`)
        orgName && $.message.push(`供电单位: ${orgName}`)
        elecAddr_dst && $.message.push(`用电地址: ${elecAddr_dst}`)
        // 是否展示近期用电
        if (SHOW_RECENT) {
            var { sevenEleList, totalPq: totalPQ = 0 } = await wsgw.getRecentElcFee(i)
            if (sevenEleList.length > 0 && totalPQ > 0) {
                sevenEleList = sevenEleList.filter((item) => item?.thisVPq)
                if (sevenEleList.length > 6) sevenEleList = sevenEleList.slice(0, 6)
                $.message.push(`近期用电: ${totalPQ}度 ⚡️`)
                sevenEleList.map((item, index) => {
                    $.message.push(`${item.day}: ${item.dayElePq}度 ⚡️`)
                })
            }
        }
        await showMsg($.name, '', $.message.join('\n').replace(/\n$/, ''))
        ;($.subTitle = []), ($.message = [])
    }
})()
    .catch((e) => $.log(`❌ ${$.name}, 失败! 原因: ${e}`))
    .finally(() => $.done())
// ------------------------------------------------------
// prettier-ignore
function WSGW(){return new class{async getCode(){$.log("⏳ 获取keyCode和publicKey...");try{const e={url:"/api/oauth2/outer/c02/f02",method:"post",headers:{}},t=await fetchData(e);if(!t?.keyCode||!t?.publicKey)throw"获取KeyCode/PublicKey失败";$.requestCyu=await fetchData(e),$.log("✔️ 获取keyCode和publicKey成功"),$.debug(`🔑 KeyCode: ${$.requestCyu.keyCode}`,`🔑 PublicKey: ${$.requestCyu.publicKey}`)}catch(e){throw`: ${e}`}finally{$.log("🔚 获取keyCode和publicKey结束")}}async refreshToken(){const{code:e,loginKey:t}=await this.getVerifyCode();await this.doLogin(t,e)}async getVerifyCode(){$.log("⏳ 获取验证码...");try{const e={url:"/api/osg-web0004/open/c44/f05",method:"post",data:{password:PASSWORD,account:USERNAME,canvasHeight:200,canvasWidth:310},headers:{keyCode:$.requestCyu.keyCode,publicKey:$.requestCyu.publicKey}},t=await fetchData(e),{canvasSrc:o,ticket:r}=t;if(r){console.log(r),$.log("✔️ 获取滑块成功"),$.debug(`🔑 LoginKey: ${r}`);const e=await this.recognizeCode(o);return $.log("✔️ 识别验证码成功"),$.debug(`🔑 验证码: ${e}`),{code:e,loginKey:r}}console.log(t)}catch(e){throw"获取验证码失败"}finally{$.log("🔚 获取验证码结束")}}async recognizeCode(e){$.log("⏳ 识别验证码...");try{const t=await $.http.post({url:MY_SERVER+"/api/get_x",headers:{"Content-Type":"application/json"},body:JSON.stringify({yuheng:e})}),{data:o}=JSON.parse(t.body);return o}catch(e){throw"识别验证码失败, 请重试!"}finally{$.log("🔚 识别验证码结束")}}async doLogin(e,t){$.log("⏳ 登录中...");try{const o={url:"/api/osg-web0004/open/c44/f06",method:"post",headers:{keyCode:$.requestCyu.keyCode,publicKey:$.requestCyu.publicKey},data:{loginKey:e,code:t,params:{uscInfo:{devciceIp:"",tenant:"state_grid",member:"0902",devciceId:""},quInfo:{optSys:"android",pushId:"000000",addressProvince:"110100",password:PASSWORD,addressRegion:"110101",account:USERNAME,addressCity:"330100"}},Channels:"web"}},{bizrt:r}=await fetchData(o);if(!(r?.userInfo?.length>0))throw"获取用户信息失败, 请检查!";$.setdata($.toStr(r),"95598_bizrt"),$.requestBizrt=r,$.log("✔️ 登录成功"),$.debug(`🔑 用户凭证: ${$.requestBizrt.token}`,`👤 用户信息: ${$.toStr($.requestBizrt.userInfo[0].loginAccount)}`)}catch(e){if(/验证错误/.test(e))return console.log(`滑块验证出错, 重新登录: ${e}`),await this.refreshToken();throw"登录失败"}finally{$.log("🔚 登录结束")}}async getAuthcode(){$.log("⏳ 获取授权码...");try{const e={url:"/api/oauth2/oauth/authorize",method:"post",headers:{keyCode:$.requestCyu.keyCode,publicKey:$.requestCyu.publicKey,token:$.requestBizrt.token}},{redirect_url:t}=await fetchData(e);$.authorizeCode=t.split("?code=")[1],$.log("✔️ 获取授权码成功"),$.debug(`🔑 授权码: ${$.authorizeCode}`)}catch(e){throw"获取授权码失败"}finally{$.log("🔚 获取授权码结束")}}async getAccessToken(){$.log("⏳ 获取凭证...");try{const e={url:"/api/oauth2/outer/getWebToken",method:"post",headers:{keyCode:$.requestCyu.keyCode,publicKey:$.requestCyu.publicKey,token:$.requestBizrt.token,authorizecode:$.authorizeCode}};$.requestToken=await fetchData(e),$.log("✔️ 获取凭证成功"),$.debug(`🔑 AccessToken: ${$.requestToken.access_token}`)}catch(e){throw"获取凭证失败"}finally{$.log("🔚 获取凭证结束")}}async refreshAccessToken(){await this.getAuthcode(),await this.getAccessToken()}async verifyBind(){$.log("⏳ 验证绑定...");try{const e={url:"/api/osg-open-uc0001/member/c8/f72",method:"post",headers:{keyCode:$.requestCyu.keyCode,publicKey:$.requestCyu.publicKey,token:$.requestBizrt.token,acctoken:$.requestToken.access_token},data:{uscInfo:{tenant:"state_grid",member:"0902",devciceId:"",devciceIp:""},quInfo:{token:$.requestBizrt.token,userId:$.requestBizrt.userInfo[0].userId,fileId:$.requestBizrt.userInfo[0].photo}}};await fetchData(e);$.log("✔️ 验证绑定成功")}catch(e){throw"验证绑定失败"}finally{$.log("🔚 验证绑定结束")}}async getBindInfo(){$.log("⏳ 查询绑定信息...");try{await this.verifyBind();const e={url:"/api/osg-open-uc0001/member/c9/f02",method:"post",headers:{keyCode:$.requestCyu.keyCode,publicKey:$.requestCyu.publicKey,token:$.requestBizrt.token,acctoken:$.requestToken.access_token},data:{serviceCode:"01010049",source:"0902",target:"-1",uscInfo:{member:"0902",devciceIp:"",devciceId:"",tenant:"state_grid"},quInfo:{userId:$.requestBizrt.userInfo[0].userId},token:$.requestBizrt.token,Channels:"web"}},{bizrt:t}=await fetchData(e);$.bindInfo=t,$.setdata($.toStr(t),"95598_bindInfo"),$.log("✔️ 查询绑定信息成功"),$.debug(`🔑 用户绑定信息: ${$.toStr(t)}`)}catch(e){throw e||"查询绑定信息失败"}finally{$.log("🔚 查询绑定信息结束")}}async getElcFee(e){$.log("⏳ 查询电费...");try{const t={url:"/api/osg-open-bc0001/member/c05/f01",method:"post",headers:{keyCode:$.requestCyu.keyCode,publicKey:$.requestCyu.publicKey,token:$.requestBizrt.token,acctoken:$.requestToken.access_token},data:{data:{srvCode:"",serialNo:"",channelCode:"0902",funcCode:"WEBA1007200",acctId:$.requestBizrt.userInfo[0].userId,userName:$.requestBizrt.userInfo[0].loginAccount,promotType:"1",promotCode:"1",userAccountId:$.requestBizrt.userInfo[0].userId,list:[{consNoSrc:$.bindInfo.powerUserList[e].consNo_dst,proCode:$.bindInfo.powerUserList[e].proNo,sceneType:$.bindInfo.powerUserList[e].constType,consNo:$.bindInfo.powerUserList[e].consNo,orgNo:$.bindInfo.powerUserList[e].orgNo}]},serviceCode:"0101143",source:"SGAPP",target:$.bindInfo.powerUserList[e].proNo}},{list:o}=await fetchData(t);return $.log("✔️ 查询电费成功"),$.debug(`🔑 电费信息: ${$.toStr(o)}`),o}catch(e){throw"查询电费失败"}}async getRecentElcFee(e){$.log("⏳ 查询近期用电量...");try{const t=$.time("yyyy-MM-dd",(new Date).getTime()-864e5),o=$.time("yyyy-MM-dd",(new Date).getTime()-6048e5),r=$.time("yyyy",(new Date).getTime()),s={url:"/api/osg-web0004/member/c24/f01",method:"post",headers:{keyCode:$.requestCyu.keyCode,publicKey:$.requestCyu.publicKey,token:$.requestBizrt.token,acctoken:$.requestToken.access_token},data:{params1:{serviceCode:{order:"0101154",uploadPic:"0101296",pauseSCode:"0101250",pauseTCode:"0101251",listconsumers:"0101093",messageList:"0101343",submit:"0101003",sbcMsg:"0101210",powercut:"0104514",BkAuth01:"f15",BkAuth02:"f18",BkAuth03:"f02",BkAuth04:"f17",BkAuth05:"f05",BkAuth06:"f16",BkAuth07:"f01",BkAuth08:"f03"},source:"SGAPP",target:"32101",uscInfo:{member:"0902",devciceIp:"",devciceId:"",tenant:"state_grid"},quInfo:{userId:$.requestBizrt.userInfo[0].userId},token:$.requestBizrt.token},params3:{data:{acctId:$.requestBizrt.userInfo[0].userId,consNo:$.bindInfo.powerUserList[e].consNo_dst,consType:"01",endTime:t,orgNo:$.bindInfo.powerUserList[e].orgNo,queryYear:r,proCode:$.bindInfo.powerUserList[e].proNo,serialNo:"",srvCode:"",startTime:o,userName:$.requestBizrt.userInfo[0].loginAccount,funcCode:"WEBALIPAY_01",channelCode:"0902",clearCache:"11",promotCode:"1",promotType:"1"},serviceCode:"BCP_000026",source:"app",target:$.bindInfo.powerUserList[e].proNo},params4:"010103"}},a=await fetchData(s);return $.log("✔️ 查询近期用电量成功"),$.debug(`🔑 近期用电量: ${$.toStr(a)}`),a}catch(e){throw"查询近期用电量失败"}}}}
// ------------------------------------------------------
// 免责声明
async function getNotceAndShow() {
    let noticeArr = [
        '1. 本脚本仅用于学习研究，禁止用于商业用途。',
        '2. 本脚本不保证准确性、可靠性、完整性和及时性。',
        '3. 任何个人或组织均可无需经过通知而自由使用。',
        '4. 作者对任何脚本问题概不负责，包括由此产生的任何损失。',
        '5. 如果任何单位或个人认为该脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明、所有权证明，我将在收到认证文件确认后删除。',
        '6.请勿将本脚本用于商业用途，由此引起的问题与作者无关。',
        '7. 本脚本及其更新版权归作者所有。',
        ''
    ]
    $.log('', '==============📣免责声明📣==============', noticeArr.join('\n'))
}
// prettier-ignore
async function showMsg(n,o,s,i){if($.isNode()){const e=[s];i?.["open-url"]&&e.push(`🔗打开链接: ${i["open-url"]}`),i?.["media-url"]&&e.push(`🎬媒体链接: ${i["media-url"]}`),$.log(n,o,e.join("\n"));try{await notify.sendNotify(`${n}${o?'\n'+o:''}`,e.join("\n"))}catch(n){$.warn("没有找到sendNotify.js文件 不发送通知")}}else $.msg(n,o,s,i)}
// prettier-ignore
function fetchData(t){const e=t.hasOwnProperty("method")?t.method.toLocaleLowerCase():"get";if($.isNode()&&t.hasOwnProperty("use_proxy")&&t.use_proxy){require("dotenv").config();const e=process.env.PROXY_HOST||"127.0.0.1",s=process.env.PROXY_PORT||7890,o=require("tunnel"),r={https:o.httpsOverHttp({proxy:{host:e,port:1*s}})};Object.assign(t,{agent:r})}return new Promise(async(s,o)=>{const r=await EncryptReq(t);switch(t.url){case"/api/oauth2/oauth/authorize":Object.assign(r,{body:r.body.replace(/^\"|\"$/g,"")})}$.http[e](r).then(async e=>{var o=e.body;try{o=JSON.parse(o)}catch(t){}const c={config:{...t},data:o};switch(t.url){case"/api/oauth2/outer/c02/f02":Object.assign(c.config,{headers:{encryptKey:r.encryptKey}})}const a=await DecrtyptResp(c);s(a)}).catch(t=>o(t))})}
// ------------------------------------------------------
// 考虑该应用的安全性, 加解密暂不公开
// prettier-ignore
function EncryptReq(e){return new Promise((t,a)=>{$.post({url:MY_SERVER+"/api/encrypt",headers:{"Content-Type":"application/json"},body:JSON.stringify({yuheng:e})},(e,n,r)=>{if(e)a(e);else{n=JSON.parse(r).data;n.url=BASE_URL+n.url,n.body=JSON.stringify(n.data),delete n.data,t(n)}})})}
// prettier-ignore
function DecrtyptResp(e){return new Promise((t,a)=>{$.post({url:MY_SERVER+"/api/decrypt",headers:{"Content-Type":"application/json"},body:JSON.stringify({yuheng:e})},(e,n,r)=>{if(e)a(e);else{n=JSON.parse(r).data;var{code:i,message:o,data:r}=n;"1"===i.toString()?t(r):(/无效|失效|过期|重新获取/.test(o)&&($.setdata("","95598_bizrt"),$.setdata("","95598_bindInfo"),console.log("✔️ 清理登录信息成功, 请重新运行脚本!")),a(o))}})})}
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,o)=>{s.call(this,t,(t,s,r)=>{t?o(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.logLevels={debug:0,info:1,warn:2,error:3},this.logLevelPrefixs={debug:"[DEBUG] ",info:"[INFO] ",warn:"[WARN] ",error:"[ERROR] "},this.logLevel="info",this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}getEnv(){return"undefined"!=typeof $environment&&$environment["surge-version"]?"Surge":"undefined"!=typeof $environment&&$environment["stash-version"]?"Stash":"undefined"!=typeof module&&module.exports?"Node.js":"undefined"!=typeof $task?"Quantumult X":"undefined"!=typeof $loon?"Loon":"undefined"!=typeof $rocket?"Shadowrocket":void 0}isNode(){return"Node.js"===this.getEnv()}isQuanX(){return"Quantumult X"===this.getEnv()}isSurge(){return"Surge"===this.getEnv()}isLoon(){return"Loon"===this.getEnv()}isShadowrocket(){return"Shadowrocket"===this.getEnv()}isStash(){return"Stash"===this.getEnv()}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null,...s){try{return JSON.stringify(t,...s)}catch{return e}}getjson(t,e){let s=e;const o=this.getdata(t);if(o)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,o)=>e(o))})}runScript(t,e){return new Promise(s=>{let o=this.getdata("@chavy_boxjs_userCfgs.httpapi");o=o?o.replace(/\n/g,"").trim():o;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[i,a]=o.split("@"),n={url:`http://${a}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":i,Accept:"*/*"},timeout:r};this.post(n,(t,e,o)=>s(o))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),o=!s&&this.fs.existsSync(e);if(!s&&!o)return{};{const o=s?t:e;try{return JSON.parse(this.fs.readFileSync(o))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),o=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):o?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const o=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of o)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,o)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[o+1])>>0==+e[o+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,o]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,o,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,o,r]=/^@(.*?)\.(.*?)$/.exec(e),i=this.getval(o),a=o?"null"===i?null:i||"{}":"{}";try{const e=JSON.parse(a);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),o)}catch(e){const i={};this.lodash_set(i,r,t),s=this.setval(JSON.stringify(i),o)}}else s=this.setval(t,e);return s}getval(t){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.read(t);case"Quantumult X":return $prefs.valueForKey(t);case"Node.js":return this.data=this.loaddata(),this.data[t];default:return this.data&&this.data[t]||null}}setval(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.write(t,e);case"Quantumult X":return $prefs.setValueForKey(t,e);case"Node.js":return this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0;default:return this.data&&this.data[e]||null}}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){switch(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"],delete t.headers["content-type"],delete t.headers["content-length"]),t.params&&(t.url+="?"+this.queryStr(t.params)),void 0===t.followRedirect||t.followRedirect||((this.isSurge()||this.isLoon())&&(t["auto-redirect"]=!1),this.isQuanX()&&(t.opts?t.opts.redirection=!1:t.opts={redirection:!1})),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,o)=>{!t&&s&&(s.body=o,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,o)});break;case"Quantumult X":this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:o,headers:r,body:i,bodyBytes:a}=t;e(null,{status:s,statusCode:o,headers:r,body:i,bodyBytes:a},i,a)},t=>e(t&&t.error||"UndefinedError"));break;case"Node.js":let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:o,statusCode:r,headers:i,rawBody:a}=t,n=s.decode(a,this.encoding);e(null,{status:o,statusCode:r,headers:i,rawBody:a,body:n},n)},t=>{const{message:o,response:r}=t;e(o,r,r&&s.decode(r.rawBody,this.encoding))})}}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";switch(t.body&&t.headers&&!t.headers["Content-Type"]&&!t.headers["content-type"]&&(t.headers["content-type"]="application/x-www-form-urlencoded"),t.headers&&(delete t.headers["Content-Length"],delete t.headers["content-length"]),void 0===t.followRedirect||t.followRedirect||((this.isSurge()||this.isLoon())&&(t["auto-redirect"]=!1),this.isQuanX()&&(t.opts?t.opts.redirection=!1:t.opts={redirection:!1})),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,(t,s,o)=>{!t&&s&&(s.body=o,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,o)});break;case"Quantumult X":t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:o,headers:r,body:i,bodyBytes:a}=t;e(null,{status:s,statusCode:o,headers:r,body:i,bodyBytes:a},i,a)},t=>e(t&&t.error||"UndefinedError"));break;case"Node.js":let o=require("iconv-lite");this.initGotEnv(t);const{url:r,...i}=t;this.got[s](r,i).then(t=>{const{statusCode:s,statusCode:r,headers:i,rawBody:a}=t,n=o.decode(a,this.encoding);e(null,{status:s,statusCode:r,headers:i,rawBody:a,body:n},n)},t=>{const{message:s,response:r}=t;e(s,r,r&&o.decode(r.rawBody,this.encoding))})}}time(t,e=null){const s=e?new Date(e):new Date;let o={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in o)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?o[e]:("00"+o[e]).substr((""+o[e]).length)));return t}queryStr(t){let e="";for(const s in t){let o=t[s];null!=o&&""!==o&&("object"==typeof o&&(o=JSON.stringify(o)),e+=`${s}=${o}&`)}return e=e.substring(0,e.length-1),e}msg(e=t,s="",o="",r){const i=t=>{switch(typeof t){case void 0:return t;case"string":switch(this.getEnv()){case"Surge":case"Stash":default:return{url:t};case"Loon":case"Shadowrocket":return t;case"Quantumult X":return{"open-url":t};case"Node.js":return}case"object":switch(this.getEnv()){case"Surge":case"Stash":case"Shadowrocket":default:{let e=t.url||t.openUrl||t["open-url"];return{url:e}}case"Loon":{let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}case"Quantumult X":{let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl,o=t["update-pasteboard"]||t.updatePasteboard;return{"open-url":e,"media-url":s,"update-pasteboard":o}}case"Node.js":return}default:return}};if(!this.isMute)switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:$notification.post(e,s,o,i(r));break;case"Quantumult X":$notify(e,s,o,i(r));break;case"Node.js":}if(!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),o&&t.push(o),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}debug(...t){this.logLevels[this.logLevel]<=this.logLevels.debug&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.debug}${t.join(this.logSeparator)}`))}info(...t){this.logLevels[this.logLevel]<=this.logLevels.info&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.info}${t.join(this.logSeparator)}`))}warn(...t){this.logLevels[this.logLevel]<=this.logLevels.warn&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.warn}${t.join(this.logSeparator)}`))}error(...t){this.logLevels[this.logLevel]<=this.logLevels.error&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.error}${t.join(this.logSeparator)}`))}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:this.log("",`❗️${this.name}, 错误!`,e,t);break;case"Node.js":this.log("",`❗️${this.name}, 错误!`,e,void 0!==t.message?t.message:t,t.stack)}}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;switch(this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:$done(t);break;case"Node.js":process.exit(1)}}}(t,e)}
