const $ = new Env("京东COOKIE同步青龙");
$.isNode() && require("dotenv").config();
let QL_HOST = $.isNode()
  ? process.env.QL_HOST
  : $.getdata("yuheng_ql_host") || "";
let QL_CLIENT_ID = $.isNode()
  ? process.env.QL_CLIENT_ID
  : $.getdata("yuheng_ql_clientid") || "";
let QL_CLIENT_SECRET = $.isNode()
  ? process.env.QL_CLIENT_SECRET
  : $.getdata("yuheng_ql_clientsecret") || "";
!(async () => {
  if (!QL_HOST || !QL_CLIENT_ID || !QL_CLIENT_SECRET) {
    $.log("请填写青龙面板地址和密钥");
    return;
  }
  ql = new QingLong(QL_HOST, QL_CLIENT_ID, QL_CLIENT_SECRET);
  try {
    await ql.checkLogin();
    if (ql.token) {
      $.msg("青龙面板", "", "✅测试连接成功！");
    } else {
      $.msg("青龙面板", "", "❌测试连接失败, 请检查账号密码是否正确!");
    }
  } catch (e) {
    throw e;
  }
})()
  .catch((e) => $.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, ""))
  .finally(() => $.done());
/*
对接青龙面板
适配 Node.js、QX、Loon、Surge等平台
*/
function QingLong(HOST, Client_ID, Client_Secret) {
  const Request = (options, method = "GET") => {
    if (
      $.isNode() &&
      options.hasOwnProperty("use_proxy") &&
      options.use_proxy
    ) {
      require("dotenv").config();
      const PROXY_HOST = process.env.PROXY_HOST || "127.0.0.1";
      const PROXY_PORT = process.env.PROXY_PORT || 7890;
      const tunnel = require("tunnel");
      const agent = {
        https: tunnel.httpsOverHttp({
          proxy: { host: PROXY_HOST, port: PROXY_PORT * 1 },
        }),
      };
      Object.assign(options, { agent });
    }
    return new Promise((resolve, reject) => {
      $.http[method.toLowerCase()](options)
        .then((response) => {
          var resp = response.body;
          try {
            resp = JSON.parse(resp);
          } catch (e) {}
          resolve(resp);
        })
        .catch((err) => reject(err));
    });
  };
  return new (class {
    /**
     * 对接青龙API
     * @param {*} HOST http://127.0.0.1:5700
     * @param {*} Client_ID xxx
     * @param {*} Client_Secret xxx
     */
    constructor(HOST, Client_ID, Client_Secret) {
      this.host = HOST ? (HOST.endsWith("/") ? HOST : HOST + "/") : "";
      this.clientId = Client_ID;
      this.clientSecret = Client_Secret;
      this.token = "";
      this.envs = [];
    }
    // 检查登录状态
    async checkLogin() {
      let tokenObj;
      try {
        tokenObj = JSON.parse($.getdata("yuheng_ql_token") || "{}");
      } catch (e) {
        console.log(`❌The token is invalid, please re-enter the token`);
        await this.getAuthToken();
        return false;
      }
      if (Object.keys(tokenObj).length > 0) {
        const { token, expiration } = tokenObj;
        const currentTime = new Date().getTime();
        if (currentTime > expiration) {
          $.log("❌The token has expired");
          await this.getAuthToken();
        } else {
          this.token = token;
          $.log(
            `✅The token is successfully obtained (${
              this.token
            }) from cache and is valid until ${$.time(
              "yyyy-MM-dd HH:mm:ss",
              expiration
            )}`
          );
        }
      } else {
        await this.getAuthToken();
      }
    }
    // 获取用户密钥
    async getAuthToken() {
      const options = {
        url: `${this.host}open/auth/token`,
        params: {
          client_id: this.clientId,
          client_secret: this.clientSecret,
        },
      };
      try {
        console.log(`传入参数: ${JSON.stringify(options)}`);
        const { code, data, message } = await Request(options);
        if (code === 200) {
          const { token, token_type, expiration } = data;
          $.log(
            `✅The token is successfully obtained: ${token} and is valid until ${$.time(
              "yyyy-MM-dd HH:mm:ss",
              expiration * 1e3
            )}`
          );
          this.token = `${token_type} ${token}`;
          $.setdata(
            JSON.stringify({
              token: this.token,
              expiration: expiration * 1e3,
            }),
            "yuheng_ql_token"
          );
        } else {
          throw message || "Failed to obtain user token.";
        }
      } catch (e) {
        throw e
          ? typeof e === "object"
            ? JSON.stringify(e)
            : e
          : "Network Error.";
      }
    }
    /**
     * 获取所有环境变量详情
     */
    async getEnvs() {
      const options = {
        url: `${this.host}open/envs`,
        headers: {
          Authorization: `${this.token}`,
        },
      };
      try {
        const { code, data, message } = await Request(options);
        if (code === 200) {
          this.envs = data;
          $.log(`✅Obtaining environment variables succeeded.`);
        } else {
          throw message || `Failed to obtain the environment variable.`;
        }
      } catch (e) {
        throw e
          ? typeof e === "object"
            ? JSON.stringify(e)
            : e
          : "Network Error.";
      }
    }
    checkEnvByName(name) {
      return this.envs.findIndex((item) => item.name === name);
    }
    checkEnvByRemarks(remarks) {
      return this.envs.findIndex((item) => item.remarks === remarks);
    }
    checkEnvByValue(value, regex) {
      const match = value.match(regex);
      if (match) {
        const index = this.envs.findIndex((item) =>
          item.value.includes(match[0])
        );
        if (index > -1) {
          $.log(`🆗${value} Matched: ${match[0]}`);
          return index;
        } else {
          $.log(`⭕${value} No Matched`);
          return -1;
        }
      } else {
        $.log(`⭕${value} No Matched`);
        return -1;
      }
    }
    /**
     * 添加环境变量
     * @param {*} array [{value:'变量值',name:'变量名',remarks:'备注'}]
     */
    async addEnv(array) {
      const options = {
        url: `${this.host}open/envs`,
        headers: {
          Authorization: `${this.token}`,
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(array),
      };
      try {
        const { code, message } = await Request(options, "post");
        if (code === 200) {
          $.log(`✅The environment variable was added successfully.`);
        } else {
          throw message || "Failed to add the environment variable.";
        }
      } catch (e) {
        throw e
          ? typeof e === "object"
            ? JSON.stringify(e)
            : e
          : "Network Error.";
      }
    }
    /**
     * 修改环境变量
     * @param {*} obj {value:'变量值',name:'变量名',remarks:'备注',id:0}
     */
    async updateEnv(obj) {
      const options = {
        url: `${this.host}open/envs`,
        method: "put",
        headers: {
          Authorization: `${this.token}`,
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(obj),
      };
      try {
        const { code, message } = await Request(options, "post");
        if (code === 200) {
          $.log(`✅The environment variable was updated successfully.`);
          await this.enableEnv([obj._id]);
        } else {
          throw message || "Failed to update the environment variable.";
        }
      } catch (e) {
        throw e
          ? typeof e === "object"
            ? JSON.stringify(e)
            : e
          : "Network Error.";
      }
    }
    /**
     * 删除环境变量
     * @param {*} ids [0,1,2] -> id数组
     */
    async deleteEnv(ids) {
      const options = {
        url: `${this.host}open/envs`,
        method: "delete",
        headers: {
          Authorization: `${this.token}`,
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(ids),
      };
      try {
        const { code, message } = await Request(options, "post");
        if (code === 200) {
          $.log(`✅The environment variable was deleted successfully.`);
        } else {
          throw message || "Failed to delete the environment variable.";
        }
      } catch (e) {
        throw e
          ? typeof e === "object"
            ? JSON.stringify(e)
            : e
          : "Network Error.";
      }
    }
    /**
     * 启用环境变量
     * @param {*} ids [0,1,2] -> id数组
     */
    async enableEnv(ids) {
      const options = {
        url: `${this.host}open/envs/enable`,
        method: "put",
        headers: {
          Authorization: `${this.token}`,
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(ids),
      };
      try {
        const { code, message } = await Request(options, "post");
        if (code === 200) {
          $.log(`✅The environment variable was enabled successfully.`);
        } else {
          throw message || "Failed to enable the environment variable.";
        }
      } catch (e) {
        throw e
          ? typeof e === "object"
            ? JSON.stringify(e)
            : e
          : "Network Error.";
      }
    }
    /**
     * 获取单个环境变量详情
     * @param {*} id
     * @returns 变量id
     */
    async getEnvById(id) {
      const options = {
        url: `${this.host}open/envs/${id}`,
        headers: {
          Authorization: `${this.token}`,
        },
      };
      try {
        const { code, data, message } = await Request(options);
        if (code === 200) {
          return data;
        } else {
          throw message || `Failed to get the environment variable.`;
        }
      } catch (e) {
        throw e
          ? typeof e === "object"
            ? JSON.stringify(e)
            : e
          : "Network Error.";
      }
    }
  })(HOST, Client_ID, Client_Secret);
}
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,a)=>{s.call(this,t,(t,s,r)=>{t?a(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}getEnv(){return"undefined"!=typeof $environment&&$environment["surge-version"]?"Surge":"undefined"!=typeof $environment&&$environment["stash-version"]?"Stash":"undefined"!=typeof module&&module.exports?"Node.js":"undefined"!=typeof $task?"Quantumult X":"undefined"!=typeof $loon?"Loon":"undefined"!=typeof $rocket?"Shadowrocket":void 0}isNode(){return"Node.js"===this.getEnv()}isQuanX(){return"Quantumult X"===this.getEnv()}isSurge(){return"Surge"===this.getEnv()}isLoon(){return"Loon"===this.getEnv()}isShadowrocket(){return"Shadowrocket"===this.getEnv()}isStash(){return"Stash"===this.getEnv()}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const a=this.getdata(t);if(a)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,a)=>e(a))})}runScript(t,e){return new Promise(s=>{let a=this.getdata("@chavy_boxjs_userCfgs.httpapi");a=a?a.replace(/\n/g,"").trim():a;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[i,o]=a.split("@"),n={url:`http://${o}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":i,Accept:"*/*"},timeout:r};this.post(n,(t,e,a)=>s(a))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),a=!s&&this.fs.existsSync(e);if(!s&&!a)return{};{const a=s?t:e;try{return JSON.parse(this.fs.readFileSync(a))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),a=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):a?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const a=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of a)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,a)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[a+1])>>0==+e[a+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,a]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,a,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,a,r]=/^@(.*?)\.(.*?)$/.exec(e),i=this.getval(a),o=a?"null"===i?null:i||"{}":"{}";try{const e=JSON.parse(o);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),a)}catch(e){const i={};this.lodash_set(i,r,t),s=this.setval(JSON.stringify(i),a)}}else s=this.setval(t,e);return s}getval(t){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.read(t);case"Quantumult X":return $prefs.valueForKey(t);case"Node.js":return this.data=this.loaddata(),this.data[t];default:return this.data&&this.data[t]||null}}setval(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.write(t,e);case"Quantumult X":return $prefs.setValueForKey(t,e);case"Node.js":return this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0;default:return this.data&&this.data[e]||null}}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){switch(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"],delete t.headers["content-type"],delete t.headers["content-length"]),t.params&&(t.url+="?"+this.queryStr(t.params)),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,a)=>{!t&&s&&(s.body=a,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,a)});break;case"Quantumult X":this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:a,headers:r,body:i,bodyBytes:o}=t;e(null,{status:s,statusCode:a,headers:r,body:i,bodyBytes:o},i,o)},t=>e(t&&t.error||"UndefinedError"));break;case"Node.js":let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:a,statusCode:r,headers:i,rawBody:o}=t,n=s.decode(o,this.encoding);e(null,{status:a,statusCode:r,headers:i,rawBody:o,body:n},n)},t=>{const{message:a,response:r}=t;e(a,r,r&&s.decode(r.rawBody,this.encoding))})}}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";switch(t.body&&t.headers&&!t.headers["Content-Type"]&&!t.headers["content-type"]&&(t.headers["content-type"]="application/x-www-form-urlencoded"),t.headers&&(delete t.headers["Content-Length"],delete t.headers["content-length"]),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,(t,s,a)=>{!t&&s&&(s.body=a,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,a)});break;case"Quantumult X":t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:a,headers:r,body:i,bodyBytes:o}=t;e(null,{status:s,statusCode:a,headers:r,body:i,bodyBytes:o},i,o)},t=>e(t&&t.error||"UndefinedError"));break;case"Node.js":let a=require("iconv-lite");this.initGotEnv(t);const{url:r,...i}=t;this.got[s](r,i).then(t=>{const{statusCode:s,statusCode:r,headers:i,rawBody:o}=t,n=a.decode(o,this.encoding);e(null,{status:s,statusCode:r,headers:i,rawBody:o,body:n},n)},t=>{const{message:s,response:r}=t;e(s,r,r&&a.decode(r.rawBody,this.encoding))})}}time(t,e=null){const s=e?new Date(e):new Date;let a={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in a)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?a[e]:("00"+a[e]).substr((""+a[e]).length)));return t}queryStr(t){let e="";for(const s in t){let a=t[s];null!=a&&""!==a&&("object"==typeof a&&(a=JSON.stringify(a)),e+=`${s}=${a}&`)}return e=e.substring(0,e.length-1),e}msg(e=t,s="",a="",r){const i=t=>{switch(typeof t){case void 0:return t;case"string":switch(this.getEnv()){case"Surge":case"Stash":default:return{url:t};case"Loon":case"Shadowrocket":return t;case"Quantumult X":return{"open-url":t};case"Node.js":return}case"object":switch(this.getEnv()){case"Surge":case"Stash":case"Shadowrocket":default:{let e=t.url||t.openUrl||t["open-url"];return{url:e}}case"Loon":{let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}case"Quantumult X":{let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl,a=t["update-pasteboard"]||t.updatePasteboard;return{"open-url":e,"media-url":s,"update-pasteboard":a}}case"Node.js":return}default:return}};if(!this.isMute)switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:$notification.post(e,s,a,i(r));break;case"Quantumult X":$notify(e,s,a,i(r));break;case"Node.js":}if(!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),a&&t.push(a),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:this.log("",`❗️${this.name}, 错误!`,t);break;case"Node.js":this.log("",`❗️${this.name}, 错误!`,t.stack)}}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;switch(this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:$done(t);break;case"Node.js":process.exit(1)}}}(t,e)}
