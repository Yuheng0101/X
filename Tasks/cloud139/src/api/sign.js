/**
 * 核心签到流模块
 * 负责主线打卡以及在各个任务中心（Market）完成日常的点击、浏览任务领取云朵
 */
const SIGN_ENDPOINTS = {
    status: "https://caiyun.feixin.10086.cn/market/signin/page/info?client=app",
    action: "https://caiyun.feixin.10086.cn/market/manager/commonMarketconfig/getByMarketRuleName?marketName=sign_in_3",
    taskList: (marketName) => `https://caiyun.feixin.10086.cn/market/signin/task/taskList?marketname=${marketName}`,
    taskClick: (taskId) => `https://caiyun.feixin.10086.cn/market/signin/task/click?key=task&id=${taskId}`,
    receive: "https://caiyun.feixin.10086.cn/market/signin/page/receive",
    prizeLog: (timestamp) =>
        `https://caiyun.feixin.10086.cn/market/prizeApi/checkPrize/getUserPrizeLogPage?currPage=1&pageSize=15&_=${timestamp}`,
    taskExpansion: "https://caiyun.feixin.10086.cn/market/signin/page/taskExpansion",
    receiveTaskExpansion: (acceptDate) =>
        `https://caiyun.feixin.10086.cn/market/signin/page/receiveTaskExpansion?acceptDate=${acceptDate}`
};

/**
 * 创建签到业务 API 集
 */
export function createSignApi(ctx) {
    return {
        getSigninStatus,
        doSignin,
        getTaskList,
        clickTask,
        receiveClouds,
        getPrizeLog,
        getTaskExpansion,
        receiveTaskExpansion
    };

    async function getSigninStatus() {
        return ctx.requestJson({ url: SIGN_ENDPOINTS.status, method: "get", headers: ctx.jwtHeaders });
    }

    /**
     * 触发今日主动作签到，返回签到结果
     */
    async function doSignin() {
        return ctx.requestJson({ url: SIGN_ENDPOINTS.action, method: "get", headers: ctx.jwtHeaders });
    }

    /**
     * 拉取当前指定 MarketName 下全部的新手/日常任务列表
     */
    async function getTaskList(marketName) {
        return ctx.requestJson({
            url: SIGN_ENDPOINTS.taskList(marketName),
            method: "get",
            headers: ctx.jwtHeaders
        });
    }

    /**
     * 万能任务上报接口：大多数只需要点击按钮即可完结的任务均通过此接口触发
     */
    async function clickTask(taskId, options = {}) {
        return ctx.requestJson({
            url: SIGN_ENDPOINTS.taskClick(taskId),
            method: "get",
            headers: ctx.jwtHeaders,
            ...options
        });
    }

    /**
     * 一键领取所有已经完成任务但还未入账的云朵资产
     */
    async function receiveClouds() {
        return ctx.requestJson({ url: SIGN_ENDPOINTS.receive, method: "get", headers: ctx.jwtHeaders });
    }

    async function getPrizeLog(timestamp) {
        return ctx.requestJson({
            url: SIGN_ENDPOINTS.prizeLog(timestamp),
            method: "get",
            headers: ctx.jwtHeaders
        });
    }

    async function getTaskExpansion() {
        return ctx.requestJson({ url: SIGN_ENDPOINTS.taskExpansion, method: "get", headers: ctx.jwtHeaders });
    }

    async function receiveTaskExpansion(acceptDate) {
        return ctx.requestJson({
            url: SIGN_ENDPOINTS.receiveTaskExpansion(acceptDate),
            method: "get",
            headers: ctx.jwtHeaders
        });
    }
}
