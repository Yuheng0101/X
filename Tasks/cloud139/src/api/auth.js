/**
 * 认证模块
 * 负责通过单点登录 (SSO) 技术获取网盘的 access token，并换取用于业务调用的 JWT Token
 */
import { USER_AGENT } from "../common/client.js";
import { normalizeBasicAuthorization } from "../common/helpers.js";

const AUTH_ENDPOINTS = {
    ssoMcloud: "https://orches.yun.139.com/orchestration/auth-rebuild/token/v1.0/querySpecToken",
    ssoPortal: "https://user-njs.yun.139.com/user/querySpecToken",
    jwt: (ssoToken) =>
        `https://caiyun.feixin.10086.cn:7071/portal/auth/tyrzLogin.action?ssoToken=${encodeURIComponent(ssoToken)}`
};

/**
 * 创建授权相关的 API 集
 * @param {Object} ctx - 全局 API 上下文上下文
 */
export function createAuthApi(ctx) {
    return {
        ssoForMCloud,
        ssoForPortal,
        fetchJwt
    };

    /**
     * 通过 mCloud SSO 通道获取 token
     */
    async function ssoForMCloud() {
        const data = await ctx.requestJson({
            url: AUTH_ENDPOINTS.ssoMcloud,
            method: "post",
            headers: {
                Authorization: ctx.authorization,
                "User-Agent": USER_AGENT,
                "Content-Type": "application/json",
                Accept: "*/*",
                Host: "orches.yun.139.com"
            },
            data: {
                account: ctx.account,
                toSourceId: "001005"
            }
        });
        return data?.success ? data.data.token : null;
    }

    /**
     * 通过 Portal SSO 通道获取 token（备用方案）
     */
    async function ssoForPortal() {
        const data = await ctx.requestJson({
            url: AUTH_ENDPOINTS.ssoPortal,
            method: "post",
            headers: {
                Authorization: normalizeBasicAuthorization(ctx.authorization),
                "Content-Type": "application/json",
                Accept: "*/*",
                Host: "user-njs.yun.139.com",
                "User-Agent": USER_AGENT
            },
            data: {
                phoneNumber: ctx.account,
                toSourceId: "001003"
            }
        });
        return data?.success ? data.data.token : null;
    }

    /**
     * 使用 sso 解析来的 Token 置换换取 JWT Token
     * 这是大部分业务接口的通行证
     */
    async function fetchJwt(ssoToken) {
        return ctx.requestJson({
            url: AUTH_ENDPOINTS.jwt(ssoToken),
            method: "post",
            headers: ctx.jwtHeaders
        });
    }
}
