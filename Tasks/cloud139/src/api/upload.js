/**
 * 云盘文件业务模块
 * 负责小文件/大文件的快速盲上传记录，以及文件分享创建等来完成相关的云盘使用任务
 */
import { normalizeBasicAuthorization } from "../common/helpers.js";

const UPLOAD_ENDPOINTS = {
    simple: "http://ose.caiyun.feixin.10086.cn/richlifeApp/devapp/IUploadAndDownload",
    large: "https://ose.caiyun.feixin.10086.cn/richlifeApp/devapp/IUploadAndDownload",
    fileList: "https://personal-kd-njs.yun.139.com/hcy/file/list",
    outLink: "https://yun.139.com/orchestration/personalCloud-rebuild/outlink/v1.0/getOutLink"
};

/**
 * 暴露文件上传及分享类的 API 集合
 */
export function createUploadApi(ctx) {
    return {
        uploadSimpleFile,
        uploadLargeFile,
        listPersonalFiles,
        createOutLink
    };

    /**
     * 完成一个非常小的虚拟文件上传（0 字节 / 1 字节）纯属应付小文件上传任务
     */
    async function uploadSimpleFile() {
        const xml = [
            "<pcUploadFileRequest>",
            `<ownerMSISDN>${ctx.account}</ownerMSISDN>`,
            "<fileCount>1</fileCount>",
            "<totalSize>1</totalSize>",
            '<uploadContentList length="1">',
            "<uploadContentInfo>",
            "<comlexFlag>0</comlexFlag>",
            "<contentDesc><![CDATA[]]></contentDesc>",
            "<contentName><![CDATA[000000.txt]]></contentName>",
            "<contentSize>1</contentSize>",
            "<contentTAGList></contentTAGList>",
            "<digest>C4CA4238A0B923820DCC509A6F75849B</digest>",
            "<exif/>",
            "<fileEtag>0</fileEtag>",
            "<fileVersion>0</fileVersion>",
            "<updateContentID></updateContentID>",
            "</uploadContentInfo>",
            "</uploadContentList>",
            "<newCatalogName></newCatalogName>",
            "<parentCatalogID></parentCatalogID>",
            "<operation>0</operation>",
            "<path></path>",
            "<manualRename>2</manualRename>",
            '<autoCreatePath length="0"/>',
            "<tagID></tagID>",
            "<tagType></tagType>",
            "</pcUploadFileRequest>"
        ].join("");

        return ctx.request({
            url: UPLOAD_ENDPOINTS.simple,
            method: "post",
            headers: {
                "x-huawei-uploadSrc": "1",
                "x-ClientOprType": "11",
                Connection: "keep-alive",
                "x-NetType": "6",
                "x-DeviceInfo":
                    "6|127.0.0.1|1|10.0.1|Xiaomi|M2012K10C|CB63218727431865A48E691BFFDB49A1|02-00-00-00-00-00|android 11|1080X2272|zh||||032|",
                "x-huawei-channelSrc": "10000023",
                "x-MM-Source": "032",
                "x-SvcType": "1",
                APP_NUMBER: ctx.account,
                Authorization: ctx.authorization,
                "X-Tingyun-Id": "p35OnrDoP8k;c=2;r=1955442920;u=43ee994e8c3a6057970124db00b2442c::8B3D3F05462B6E4C",
                Host: "ose.caiyun.feixin.10086.cn",
                "User-Agent": "okhttp/3.11.0",
                "Content-Type": "application/xml; charset=UTF-8",
                Accept: "*/*"
            },
            data: xml,
            responseType: "text",
            throwHttpErrors: false
        });
    }

    /**
     * 大文件预发上传：构造出伪造的大块（通常几MB）二进制特征以假装在大文件上传
     */
    async function uploadLargeFile() {
        const bytes = ctx.randomWordArray(ctx.config.uploadSizeMb * 1024 * 1024);
        const digest = ctx.md5(bytes);
        const xml = [
            "<pcUploadFileRequest>",
            `<ownerMSISDN>${ctx.account}</ownerMSISDN>`,
            "<fileCount>1</fileCount>",
            `<totalSize>${ctx.config.uploadSizeMb * 1024 * 1024}</totalSize>`,
            '<uploadContentList length="1">',
            "<uploadContentInfo>",
            `<contentName><![CDATA[${ctx.config.uploadFilename}]]></contentName>`,
            `<contentSize>${ctx.config.uploadSizeMb * 1024 * 1024}</contentSize>`,
            "<contentDesc></contentDesc>",
            "<contentTAGList></contentTAGList>",
            "<comlexFlag>0</comlexFlag>",
            "<comlexCID></comlexCID>",
            '<resCID length="0"></resCID>',
            `<digest>${digest}</digest>`,
            `<extInfo length="1"><entry><key>modifyTime</key><vaule>${ctx.formatDate(new Date())}</vaule></entry></extInfo>`,
            "</uploadContentInfo>",
            "</uploadContentList>",
            "<newCatalogName></newCatalogName>",
            `<parentCatalogID>${ctx.config.uploadDirId}</parentCatalogID>`,
            "<operation>0</operation>",
            "<path></path>",
            "<manualRename>2</manualRename>",
            "</pcUploadFileRequest>"
        ].join("");

        return ctx.request({
            url: UPLOAD_ENDPOINTS.large,
            method: "post",
            headers: {
                "x-huawei-uploadSrc": "1",
                "x-huawei-channelSrc": "10200153",
                "x-ClientOprType": "11",
                Connection: "keep-alive",
                "x-NetType": "6",
                "x-DeviceInfo":
                    "||11|8.2.1.20241205|PC|V0lOLUVQSUxVNjE1TUlI|D1EA1E8B761492DFF34B18F05A5876E0|| Windows 10 (10.0)|1366X738|RW5nbGlzaA==|||",
                "x-MM-Source": "032",
                "x-SvcType": "1",
                Authorization: normalizeBasicAuthorization(ctx.authorization),
                Host: "ose.caiyun.feixin.10086.cn",
                "User-Agent": "Mozilla/5.0",
                "Content-Type": "text/xml;UTF-8",
                Accept: "*/*"
            },
            data: xml,
            responseType: "text",
            throwHttpErrors: false
        });
    }

    /**
     * 获取用户个人云盘下指定目录的内容列表以便从中挑选文件执行分享
     */
    async function listPersonalFiles() {
        return ctx.requestJson({
            url: UPLOAD_ENDPOINTS.fileList,
            method: "post",
            headers: {
                "x-yun-op-type": "1",
                "x-yun-net-type": "1",
                "x-yun-module-type": "100",
                "x-yun-app-channel": "10214200",
                "x-yun-client-info":
                    "1||8|5.10.1|microsoft|microsoft|306d1d1c-016c-4251-9ea6-951dca||windows 10 x64|||||",
                "x-tingyun": "c=M|4Nl_NnGbjwY",
                authorization: normalizeBasicAuthorization(ctx.authorization),
                "x-yun-api-version": "v1",
                xweb_xhr: "1",
                "x-yun-tid": "cb8a2b4b-8eb7-4b05-b1c1-e41020",
                "content-type": "application/json"
            },
            data: {
                parentFileId: ctx.config.uploadDirId,
                pageInfo: {
                    pageSize: 40,
                    pageCursor:
                        "0|[9-1-0,11-0-1][JzIwMjQtMDMtMDlUMTA6MzM6MTguNzEyWic=,J0ZzSVEweF9NVVVDVmNqQ1plaTJ0SFZxSjVadjNsbEZ5bCc=]"
                },
                imageThumbnailStyleList: ["Big", "Small"],
                orderDirection: "DESC",
                orderBy: "updated_at"
            }
        });
    }

    /**
     * 为某个已上传文件创建公网分享链接（完成“分享一次”任务）
     */
    async function createOutLink(fileId, fileName) {
        return ctx.requestJson({
            url: UPLOAD_ENDPOINTS.outLink,
            method: "post",
            headers: {
                ...ctx.jwtHeaders,
                Authorization: normalizeBasicAuthorization(ctx.authorization)
            },
            data: {
                getOutLinkReq: {
                    subLinkType: 0,
                    encrypt: 1,
                    coIDLst: [fileId],
                    caIDLst: [],
                    pubType: 1,
                    dedicatedName: fileName,
                    periodUnit: 1,
                    viewerLst: [],
                    extInfo: { isWatermark: 0, shareChannel: "3001" },
                    period: 1,
                    commonAccountInfo: { account: ctx.account, accountType: 1 }
                }
            }
        });
    }
}
