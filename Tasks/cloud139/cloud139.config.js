const cloud139Config = {
    client: {
        defaultTimeout: 5000,
        userAgent:
            "Mozilla/5.0 (Linux; Android 11; M2012K10C Build/RP1A.200720.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/90.0.4430.210 Mobile Safari/537.36 MCloudApp/10.0.1",
        noteHeaders: {
            "X-Tingyun-Id": "p35OnrDoP8k;c=2;r=1122634489;u=43ee994e8c3a6057970124db00b2442c::8B3D3F05462B6E4C",
            Charset: "UTF-8",
            Connection: "Keep-Alive",
            "User-Agent": "mobile",
            APP_CP: "android",
            CP_VERSION: "3.2.0",
            "x-huawei-channelsrc": "10001400",
            Host: "mnote.caiyun.feixin.10086.cn",
            "Content-Type": "application/json; charset=UTF-8",
            Accept: "*/*"
        }
    },
    messages: {
        missingCookie: "‼️缺少授权字段, 请抓取(填写)相关参数后再执行脚本",
        runStart: "开始执行",
        runFailed: "执行失败",
        runCompleted: "任务执行完成",
        captureMissingAuthorization: "‼️未在请求头中找到 Authorization",
        captureSuccess: "授权抓取成功",
        captureStored: "已写入 Authorization"
    },
    storage: {
        cookieKeys: ["ydyp_ck", "cookie", "cloud139_cookie"],
        authKeys: ["ydyp_ck", "cloud139_authorization"]
    },
    capture: {
        urlPattern: "^https?:\\/\\/user-njs\\.yun\\.139\\.com\\/user\\/getUser",
        hostnames: ["user-njs.yun.139.com"]
    },
    runtime: {
        envPrefix: "CLOUD139",
        defaults: {
            upload: false,
            share: false,
            push: true,
            clickNum: 15,
            drawTimes: 1,
            delayMin: 1000,
            delayMax: 1500,
            timeout: 5000,
            uploadFilename: "7",
            uploadSizeMb: 7,
            uploadDirId: "",
            shareFilename: ""
        }
    }
};

export default cloud139Config;
