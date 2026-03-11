/**
 * 笔记任务模块
 * 此模块专门用于办理任务列表里 “新建笔记” 或者相关同步类任务
 */
import { NOTE_HEADERS } from "../common/client.js";

const NOTE_ENDPOINTS = {
    refreshToken: "http://mnote.caiyun.feixin.10086.cn/noteServer/api/authTokenRefresh.do",
    syncNotebook: "http://mnote.caiyun.feixin.10086.cn/noteServer/api/syncNotebookV3.do",
    createNote: "http://mnote.caiyun.feixin.10086.cn/noteServer/api/createNote.do"
};

/**
 * 创建笔记模块的 API 集合
 */
export function createNoteApi(ctx) {
    return {
        refreshNoteToken,
        syncNotebook,
        createNote
    };

    /**
     * 刷新笔记系统的 token 授权
     */
    async function refreshNoteToken() {
        return ctx.request({
            url: NOTE_ENDPOINTS.refreshToken,
            method: "post",
            headers: NOTE_HEADERS,
            data: { authToken: ctx.authToken, userPhone: ctx.account },
            throwHttpErrors: false
        });
    }

    /**
     * 同步笔记本列表，并通常用它来获取默认笔记本信息
     */
    async function syncNotebook(headers) {
        return ctx.requestJson({
            url: NOTE_ENDPOINTS.syncNotebook,
            method: "post",
            headers,
            data: { addNotebooks: [], delNotebooks: [], notebookRefs: [], updateNotebooks: [] }
        });
    }

    /**
     * 在指定的笔记本中创建一条默认内容的无用空笔记用于完成任务
     */
    async function createNote(headers, notebookId) {
        const noteId = ctx.randomHex(32);
        const now = String(Date.now());

        return ctx.request({
            url: NOTE_ENDPOINTS.createNote,
            method: "post",
            headers,
            data: {
                archived: 0,
                attachmentdir: noteId,
                attachmentdirid: "",
                attachments: [],
                audioInfo: { audioDuration: 0, audioSize: 0, audioStatus: 0 },
                contentid: "",
                contents: [
                    { contentid: 0, data: '<font size="3">000000</font>', noteId, sortOrder: 0, type: "RICHTEXT" }
                ],
                cp: "",
                createtime: now,
                description: "android",
                expands: { noteType: 0 },
                latlng: "",
                location: "",
                noteid: noteId,
                notestatus: 0,
                remindtime: "",
                remindtype: 1,
                revision: "1",
                sharecount: "0",
                sharestatus: "0",
                system: "mobile",
                tags: [{ id: notebookId, orderIndex: "0", text: "默认笔记本" }],
                title: "00000",
                topmost: "0",
                updatetime: now,
                userphone: ctx.account,
                version: "1.00",
                visitTime: ""
            },
            throwHttpErrors: false
        });
    }
}
