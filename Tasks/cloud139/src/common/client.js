/**
 * 网络请求客户端配置
 * - 基于 @nsnanocat/util 的 fetch 方法并在之上包了一层 Axios 的接口层 (以适配原有旧项目的习惯写法)
 * - 全局持有和配置基础的 Header 或超时时间
 */
import { fetch as utilFetch } from "@nsnanocat/util";
import cloud139Config from "../../cloud139.config.js";
import useAxios from "./axios.min.js";

export const USER_AGENT = cloud139Config.client.userAgent;
export const NOTE_HEADERS = cloud139Config.client.noteHeaders;

const { Axios } = useAxios();

export const client = new Axios({
    timeout: cloud139Config.client.defaultTimeout,
    adapter: async (request) =>
        utilFetch({
            ...request,
            timeout: typeof request.timeout === "number" ? Math.max(1, request.timeout * 1000) : request.timeout
        })
});
