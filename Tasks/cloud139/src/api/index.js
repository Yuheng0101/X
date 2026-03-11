/**
 * API 请求聚合层
 * - 将散落在各个子模块下的 API 请求（认证、签到、资产奖励、笔记、上传）按功能组装整合
 * - 提供一致的上下文（context）以便各业务模块内部共用授权信息及网络客户端
 */
import { createAuthApi } from "./auth.js";
import { createNoteApi } from "./note.js";
import { createRewardApi } from "./reward.js";
import { createSignApi } from "./sign.js";
import { createUploadApi } from "./upload.js";

/**
 * 创建 Cloud139 综合 API 接口集合
 * @param {Object} ctx - 上下文环境对象，其中包含授权 headers 及 request 函数等
 */
export function createCloud139Api(ctx) {
    return {
        ...createAuthApi(ctx),
        ...createSignApi(ctx),
        ...createRewardApi(ctx),
        ...createNoteApi(ctx),
        ...createUploadApi(ctx)
    };
}
