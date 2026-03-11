/**
 * 共享基础工具函数库
 * - Reporter (通知汇报组装者)
 * - 数据转换及格式化相关功能
 * - Token 截取与安全机制相关的辅助方法
 */
import CryptoJS from "crypto-js";
import { Console, wait } from "@nsnanocat/util";

/**
 * 汇报总结构建工具
 * 用于收集单个或多个账户执行时所产生的日志，状态及汇总通知的拼装
 */
export class Reporter {
    constructor() {
        this.lines = [];
        this.errors = [];
        this.amounts = [];
        this.invalid = [];
    }

    info(message) {
        this.lines.push(message);
        Console.log(message);
    }

    line(message) {
        this.lines.push(message);
        Console.log(message);
    }

    section(title) {
        this.info(`\n======== ${title} ========`);
    }

    renderSummary() {
        const parts = [];
        if (this.invalid.length) parts.push(`失效账号:\n${this.invalid.join("\n")}`);
        if (this.amounts.length) parts.push(`云朵统计:\n${this.amounts.join("\n")}`);
        if (this.errors.length) parts.push(`异常信息:\n${this.errors.join("\n")}`);
        return parts.join("\n\n") || "执行完成";
    }
}

export function splitAccounts(value) {
    return String(value)
        .split(/[@\n]/)
        .map((item) => item.trim())
        .filter(Boolean);
}

export function toBoolean(value) {
    if (typeof value === "boolean") return value;
    return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
}

export function toNumber(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

export function normalizeBasicAuthorization(value) {
    return String(value || "").startsWith("Basic ") ? String(value) : `Basic ${value}`;
}

/**
 * 从基础的 Basic Auth Authorization 值中反向破解/解析出其中的手机号
 * 方便展示或用于后续的多账号查重
 */
export function parsePhoneFromAuthorization(value) {
    try {
        const encoded = String(value || "").replace(/^Basic\s+/i, "");
        const decoded = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(encoded));
        const parts = decoded.split(":");
        return parts[1] || "13800138000";
    } catch (_) {
        return "13800138000";
    }
}

export function maskPhone(phone) {
    const value = String(phone || "未知账号");
    return value.length >= 7 ? `${value.slice(0, 3)}****${value.slice(7)}` : value;
}

/**
 * 分析指定任务 id 根据设定跳过部分耗时任务或目前存在风险的任务
 */
export function shouldSkipTask(appType, taskType, taskId) {
    if (appType === "cloud_app" && taskType === "month") return [110, 113, 417, 409].includes(taskId);
    if (appType === "cloud_app" && taskType === "day") return taskId === 404;
    if (appType === "email_app" && taskType === "month") return [1004, 1005, 1015, 1020].includes(taskId);
    return false;
}

export function serializeError(error) {
    if (error instanceof Error) return `${error.name}: ${error.message}`;
    try {
        return JSON.stringify(error);
    } catch (_) {
        return String(error);
    }
}

export function formatDate(date) {
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
        String(date.getHours()).padStart(2, "0"),
        String(date.getMinutes()).padStart(2, "0"),
        String(date.getSeconds()).padStart(2, "0")
    ].join("");
}

export function randomHex(length) {
    const chars = "19f3a063d67e4694ca63a4227ec9a94a19088404f9a28084e3e486b928039a299bf756ebc77aa4f6bfa250308ec6a8be8b63b5271a00350d136d117b8a72f39c5bd15cdfd350cba4271dc797f15412d9f269e666aea5039f5049d00739b320bb9e8585a008b52c1cbd86970cae9476446f3e41871de8d9f6112db94b05e5dc7ea0a942a9daf145ac8e487d3d5cba7cea145680efc64794d43dd15c5062b81e1cda7bf278b9bc4e1b8955846e6bc4b6a61c28f831f81b2270289e5a8a677c3141ddc9868129060c0c3b5ef507fbd46c004f6de346332ef7f05c0094215eae1217ee7c13c8dca6d174cfb49c716dd42903bb4b02d823b5f1ff93c3f88768251b56cc";
    let result = "";
    for (let index = 0; index < length; index += 1) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export function randomWordArray(byteLength) {
    const words = [];
    for (let index = 0; index < byteLength; index += 4) {
        words.push((Math.random() * 4294967296) | 0);
    }
    return CryptoJS.lib.WordArray.create(words, byteLength);
}

export async function randomWait(min, max) {
    const timeout = Math.floor(Math.random() * (max - min + 1)) + min;
    await wait(timeout);
}
