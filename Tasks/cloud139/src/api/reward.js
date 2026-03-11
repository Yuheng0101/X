/**
 * 零散奖励活动模块
 * - 摇一摇抽奖
 * - 重复云朵大作战游戏
 * - 公众号打卡及其他补偿奖励
 */
const REWARD_ENDPOINTS = {
    playoffic: {
        wxSign: "https://caiyun.feixin.10086.cn/market/playoffic/followSignInfo?isWx=true",
        drawInfo: "https://caiyun.feixin.10086.cn/market/playoffic/drawInfo",
        draw: "https://caiyun.feixin.10086.cn/market/playoffic/draw",
        shake: "https://caiyun.feixin.10086.cn:7071/market/shake-server/shake/shakeIt?flag=1"
    },
    game: {
        info: "https://caiyun.feixin.10086.cn/market/signin/hecheng1T/info?op=info",
        invite: "https://caiyun.feixin.10086.cn/market/signin/hecheng1T/beinvite",
        finish: "https://caiyun.feixin.10086.cn/market/signin/hecheng1T/finish?flag=true"
    },
    backup: {
        info: "https://caiyun.feixin.10086.cn/market/backupgift/info",
        receive: "https://caiyun.feixin.10086.cn/market/backupgift/receive"
    },
    msgPush: {
        status: "https://caiyun.feixin.10086.cn/market/msgPushOn/task/status",
        obtain: "https://caiyun.feixin.10086.cn/market/msgPushOn/task/obtain"
    }
};

/**
 * 创建一系列用于领取散杂奖励的 API 接口
 */
export function createRewardApi(ctx) {
    return {
        getWxSignInfo,
        getDrawInfo,
        doDraw,
        doShake,
        getCloudGameInfo,
        inviteCloudGame,
        finishCloudGame,
        getBackupInfo,
        receiveBackupReward,
        getMsgPushStatus,
        obtainMsgPushReward
    };

    /**
     * 获取微信公众号端的签到情况
     */
    async function getWxSignInfo() {
        return ctx.requestJson({ url: REWARD_ENDPOINTS.playoffic.wxSign, method: "get", headers: ctx.jwtHeaders });
    }

    async function getDrawInfo() {
        return ctx.requestJson({ url: REWARD_ENDPOINTS.playoffic.drawInfo, method: "get", headers: ctx.jwtHeaders });
    }

    async function doDraw() {
        return ctx.requestJson({ url: REWARD_ENDPOINTS.playoffic.draw, method: "get", headers: ctx.jwtHeaders });
    }

    /**
     * 执行摇一摇动作（每天特定频率有机会获得奖励）
     */
    async function doShake() {
        return ctx.requestJson({ url: REWARD_ENDPOINTS.playoffic.shake, method: "post", headers: ctx.jwtHeaders });
    }

    /**
     * 云朵大作战游戏：查询剩余可以玩的游戏次数
     */
    async function getCloudGameInfo() {
        return ctx.requestJson({ url: REWARD_ENDPOINTS.game.info, method: "get", headers: ctx.jwtHeaders });
    }

    async function inviteCloudGame() {
        return ctx.requestJson({ url: REWARD_ENDPOINTS.game.invite, method: "get", headers: ctx.jwtHeaders });
    }

    /**
     * 云朵大作战游戏：提交完成游戏的结果领取对应经验或云朵
     */
    async function finishCloudGame() {
        return ctx.requestJson({ url: REWARD_ENDPOINTS.game.finish, method: "get", headers: ctx.jwtHeaders });
    }

    async function getBackupInfo() {
        return ctx.requestJson({ url: REWARD_ENDPOINTS.backup.info, method: "get", headers: ctx.jwtHeaders });
    }

    async function receiveBackupReward() {
        return ctx.requestJson({ url: REWARD_ENDPOINTS.backup.receive, method: "get", headers: ctx.jwtHeaders });
    }

    async function getMsgPushStatus() {
        return ctx.requestJson({ url: REWARD_ENDPOINTS.msgPush.status, method: "get", headers: ctx.jwtHeaders });
    }

    async function obtainMsgPushReward(type) {
        return ctx.requestJson({
            url: REWARD_ENDPOINTS.msgPush.obtain,
            method: "post",
            headers: ctx.jwtHeaders,
            data: { type }
        });
    }
}
