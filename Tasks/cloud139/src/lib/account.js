/**
 * 单个账号的业务执行器
 * - 负责解析单个账号的 cookie (包括 auth, jwt 等)
 * - 封装了具体各个任务环节的执行逻辑（签到、云朵大作战、摇一摇、上传分享等）
 */
import CryptoJS from "crypto-js";
import { wait } from "@nsnanocat/util";
import { createCloud139Api } from "../api/index.js";
import { client, NOTE_HEADERS, USER_AGENT } from "../common/client.js";
import {
    formatDate,
    maskPhone,
    parsePhoneFromAuthorization,
    randomHex,
    randomWait,
    randomWordArray,
    serializeError,
    shouldSkipTask
} from "../common/helpers.js";
import { createRequestHelpers } from "../common/request.js";

/**
 * 账号执行类，每个实例对应一个账号
 */
export class Cloud139Account {
    constructor(rawCookie, config, reporter) {
        this.rawCookie = String(rawCookie || "").trim();
        this.config = config;
        this.reporter = reporter;
        this.cookies = {};
        this.jwtHeaders = {
            "User-Agent": USER_AGENT,
            Accept: "*/*",
            Host: "caiyun.feixin.10086.cn:7071"
        };
        this.noteToken = "";
        this.noteAuth = "";
        this.notebookId = "";
        this.clickNum = config.clickNum;
        this.drawTimes = config.drawTimes;
        this.parseCookie();
        this.requester = createRequestHelpers(client, () => this.config.requestTimeout);

        const self = this;
        this.api = createCloud139Api({
            get authorization() {
                return self.authorization;
            },
            get account() {
                return self.account;
            },
            get authToken() {
                return self.authToken;
            },
            get config() {
                return self.config;
            },
            get jwtHeaders() {
                return self.jwtHeaders;
            },
            request: (...args) => self.request(...args),
            requestJson: (...args) => self.requestJson(...args),
            requestText: (...args) => self.requestText(...args),
            md5: (value) => CryptoJS.MD5(value).toString().toUpperCase(),
            randomHex,
            randomWordArray,
            formatDate
        });
    }

    /**
     * 解析包含在原始 Cookie 字符串中的 Authorization、账号和 Token 等信息
     */
    parseCookie() {
        if (this.rawCookie.includes("#")) {
            const [authorization, account, authToken] = this.rawCookie.split("#");
            this.authorization = authorization;
            this.account = account;
            this.authToken = authToken || "";
        } else {
            this.authorization = this.rawCookie;
            this.authToken = "00";
            this.account = parsePhoneFromAuthorization(this.authorization);
        }

        this.maskedAccount = maskPhone(this.account);
        this.cookies.sensors_stay_time = String(Date.now());
    }

    log(message) {
        this.reporter.line(`[${this.maskedAccount}] ${message}`);
    }

    /**
     * 核心运行逻辑：顺序执行单个账号下所有活动任务
     */
    async run() {
        try {
            const jwtReady = await this.jwt();
            if (!jwtReady) {
                this.reporter.invalid.push(this.maskedAccount);
                return;
            }

            await this.signinStatus();
            await this.clickTask();
            await this.processTaskList("sign_in_3", "cloud_app");
            await this.cloudGame();
            await this.wxSign();
            await this.shake();
            await this.surplusNum();
            await this.backupCloud();
            await this.openSend();
            await this.processTaskList("newsign_139mail", "email_app");
            await this.receive();

            if (this.config.uploadEnabled) await this.uploadLargeFile();
            if (this.config.shareEnabled) await this.shareFile();
        } catch (error) {
            this.reporter.errors.push(`${this.maskedAccount}: ${error.message || String(error)}`);
            this.log(`执行异常: ${serializeError(error)}`);
        }
    }

    async request(config, retries = 3) {
        return this.requester.request(config, retries);
    }

    async requestJson(config, retries = 3) {
        return this.requester.requestJson(config, retries);
    }

    async requestText(config, retries = 3) {
        return this.requester.requestText(config, retries);
    }

    async ssoForMCloud() {
        return this.api.ssoForMCloud();
    }

    async ssoForPortal() {
        return this.api.ssoForPortal();
    }

    /**
     * 获取 JWT Token：优先使用 mCloud SSO，如果失败回退到 Portal SSO
     */
    async jwt() {
        const token = (await this.ssoForMCloud()) || (await this.ssoForPortal());
        if (!token) {
            this.log("获取 ssoToken 失败");
            return false;
        }

        const data = await this.api.fetchJwt(token);
        if (!data || data.code !== 0) {
            this.log(`获取 jwtToken 失败: ${data?.msg || "未知错误"}`);
            return false;
        }

        this.jwtHeaders.jwtToken = data.result.token;
        this.cookies.jwtToken = data.result.token;
        this.log("jwtToken 获取成功");
        return true;
    }

    /**
     * 执行每日签到并查询签到状态
     */
    async signinStatus() {
        await this.sleep();
        const data = await this.api.getSigninStatus();

        if (data?.msg !== "success") {
            this.log(`签到状态查询失败: ${data?.msg || "未知错误"}`);
            return;
        }

        if (data.result?.todaySignIn) {
            this.log("今日已签到");
            return;
        }

        const signData = await this.api.doSignin();
        this.log(signData?.msg === "success" ? "签到成功" : `签到失败: ${signData?.msg || "未知错误"}`);
    }

    async clickTask() {
        let success = 0;

        for (let index = 0; index < this.clickNum; index += 1) {
            try {
                const data = await this.api.clickTask(319);
                if (data?.result) {
                    success += 1;
                }
                await wait(200);
            } catch (_) {}
        }

        this.log(success > 0 ? `戳一下成功 ${success} 次` : `戳一下未获得奖励 x ${this.clickNum}`);
    }

    /**
     * 遍历并处理活动任务列表，根据不同类型（如签到、网盘APP、邮箱等）分发任务
     * @param {string} marketName - 任务市场名称
     * @param {string} appType - 对应的应用类型标记
     */
    async processTaskList(marketName, appType) {
        const data = await this.api.getTaskList(marketName);
        await this.sleep();
        const taskList = data?.result || {};

        for (const taskType of Object.keys(taskList)) {
            if (["new", "hidden", "hiddenabc"].includes(taskType)) {
                continue;
            }

            for (const task of taskList[taskType]) {
                if (shouldSkipTask(appType, taskType, task.id)) {
                    continue;
                }
                if (task.state === "FINISH") {
                    this.log(`已完成任务: ${task.name}`);
                    continue;
                }

                this.log(`去完成任务: ${task.name}`);
                await this.doTask(task.id, taskType, appType);
                await wait(2000);
            }
        }
    }

    async doTask(taskId, taskType, appType) {
        await this.sleep();
        await this.api.clickTask(taskId, { throwHttpErrors: false });

        if (appType !== "cloud_app" || taskType !== "day") {
            return;
        }

        switch (taskId) {
            case 106:
                await this.uploadZeroFile();
                break;
            case 107:
                await this.createDefaultNote();
                break;
            default:
                break;
        }
    }

    async refreshNoteToken() {
        if (!this.authToken || this.authToken === "00") {
            return false;
        }

        const response = await this.api.refreshNoteToken();
        this.noteToken = response.headers?.NOTE_TOKEN || response.headers?.note_token || "";
        this.noteAuth = response.headers?.APP_AUTH || response.headers?.app_auth || "";
        return !!(this.noteToken && this.noteAuth);
    }

    async createDefaultNote() {
        const refreshed = await this.refreshNoteToken();
        if (!refreshed) {
            this.log("跳过创建笔记: 缺少 authToken");
            return;
        }

        const headers = {
            ...NOTE_HEADERS,
            APP_NUMBER: this.account,
            APP_AUTH: this.noteAuth,
            NOTE_TOKEN: this.noteToken
        };
        const notebookData = await this.api.syncNotebook(headers);

        this.notebookId = notebookData?.notebooks?.[0]?.notebookId || "";
        if (!this.notebookId) {
            this.log("获取默认笔记本失败");
            return;
        }

        await this.api.createNote(headers, this.notebookId);
        this.log("创建笔记完成");
    }

    async uploadZeroFile() {
        await this.api.uploadSimpleFile();
        this.log("上传任务文件完成");
    }

    async wxSign() {
        await this.sleep();
        const data = await this.api.getWxSignInfo();
        this.log(data?.result?.todaySignIn ? "公众号签到成功" : `公众号签到失败: ${data?.msg || "可能未绑定公众号"}`);
    }

    async shake() {
        let success = 0;

        for (let index = 0; index < this.clickNum; index += 1) {
            try {
                const data = await this.api.doShake();
                if (data?.result?.shakePrizeconfig?.name) {
                    success += 1;
                    this.log(`摇一摇获得: ${data.result.shakePrizeconfig.name}`);
                }
                await wait(1000);
            } catch (_) {}
        }

        if (!success) {
            this.log(`摇一摇未中奖 x ${this.clickNum}`);
        }
    }

    async surplusNum() {
        await this.sleep();
        const drawInfo = await this.api.getDrawInfo();

        const remain = drawInfo?.result?.surplusNumber || 0;
        this.log(`剩余抽奖次数: ${remain}`);
        if (remain <= 50 - this.drawTimes) {
            return;
        }

        for (let index = 0; index < this.drawTimes; index += 1) {
            await this.sleep();
            const drawData = await this.api.doDraw();
            this.log(drawData?.code === 0 ? `抽奖成功: ${drawData?.result?.prizeName || ""}` : "抽奖失败");
        }
    }

    async cloudGame() {
        const info = await this.api.getCloudGameInfo();
        const curr = info?.result?.info?.curr || 0;
        const rank = info?.result?.history?.["0"]?.rank || "";
        const count = info?.result?.history?.["0"]?.count || 0;
        this.log(`云朵大作战剩余 ${curr} 次, 排名 ${rank}, 合成 ${count} 次`);

        for (let index = 0; index < curr; index += 1) {
            await this.api.inviteCloudGame();
            await randomWait(10000, 15000);
            await this.api.finishCloudGame();
            this.log("云朵大作战完成一局");
        }
    }

    async receive() {
        const receiveData = await this.api.receiveClouds();
        await this.sleep();
        const prizeData = await this.api.getPrizeLog(Date.now());

        const pendingRewards = (prizeData?.result?.result || [])
            .filter((item) => item.flag === 1)
            .map((item) => item.prizeName)
            .join("、");
        const receive = receiveData?.result?.receive || 0;
        const total = receiveData?.result?.total || 0;

        this.reporter.amounts.push(
            `${this.maskedAccount}: 云朵 ${total}${pendingRewards ? `, 待领取 ${pendingRewards}` : ""}`
        );
        this.log(`当前待领取 ${receive} 云朵, 当前总数 ${total}`);
    }

    async backupCloud() {
        const backupData = await this.api.getBackupInfo();
        const state = backupData?.result?.state;

        if (state === 0) {
            const reward = await this.api.receiveBackupReward();
            this.log(`连续备份奖励: ${reward?.result?.result || ""}`);
        } else if (state === 1) {
            this.log("本月连续备份奖励已领取");
        }

        await this.sleep();
        const expandData = await this.api.getTaskExpansion();
        if (expandData?.result?.preMonthBackup && !expandData?.result?.curMonthBackupTaskAccept) {
            const receiveData = await this.api.receiveTaskExpansion(expandData.result.acceptDate);
            this.log(`膨胀云朵领取: ${receiveData?.result?.cloudCount || receiveData?.msg || ""}`);
        }
    }

    async openSend() {
        const data = await this.api.getMsgPushStatus();

        if (data?.result?.pushOn !== 1) {
            this.log("通知权限未开启");
            return;
        }

        for (const type of [1, 2]) {
            const key = type === 1 ? "firstTaskStatus" : "secondTaskStatus";
            if ([2, 3].includes(data.result[key])) {
                const reward = await this.api.obtainMsgPushReward(type);
                this.log(`通知奖励${type}: ${reward?.result?.description || "已处理"}`);
            }
        }
    }

    async uploadLargeFile() {
        if (!this.config.uploadDirId) {
            this.log("跳过大文件上传: 缺少 dirId");
            return;
        }

        await this.api.uploadLargeFile();
        this.log(`大文件上传任务已执行: ${this.config.uploadFilename}`);
    }

    async shareFile() {
        if (!this.config.shareFilename || !this.config.uploadDirId) {
            this.log("跳过分享任务: 缺少 shareFilename 或 dirId");
            return;
        }

        const fileList = await this.api.listPersonalFiles();
        const target = (fileList?.data?.items || []).find((item) =>
            String(item.name || "").includes(this.config.shareFilename)
        );

        if (!target) {
            this.log("未找到可分享文件");
            return;
        }

        const shareData = await this.api.createOutLink(target.fileId, target.name);
        const link = shareData?.data?.getOutLinkRes?.getOutLinkResSet?.[0]?.linkUrl || "";
        this.log(link ? `分享成功: ${link}` : "分享失败");
    }

    async sleep() {
        await randomWait(this.config.delayMin, this.config.delayMax);
    }
}
