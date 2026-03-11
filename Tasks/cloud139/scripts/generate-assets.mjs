import fs from "node:fs";
import path from "node:path";
import cloud139Config from "../cloud139.config.js";

const rootDir = path.resolve(import.meta.dirname, "..");
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, "package.json"), "utf8"));
const meta = packageJson.scriptMeta;
const generatedDir = path.join(rootDir, meta.generatedDir);
const isDevBuild = process.argv.includes("--dev");
const updateAt = buildUpdateAt(new Date());

fs.mkdirSync(generatedDir, { recursive: true });

const urls = {
    capture: {
        remote: resolveRemoteUrl(meta.captureFile),
        local: resolveLocalUrl(meta.captureFile)
    },
    execute: {
        remote: resolveRemoteUrl(meta.executeFile),
        local: resolveLocalUrl(meta.executeFile)
    },
    captureDev: {
        remote: resolveRemoteUrl(meta.captureDevFile),
        local: resolveLocalUrl(meta.captureDevFile)
    },
    executeDev: {
        remote: resolveRemoteUrl(meta.executeDevFile),
        local: resolveLocalUrl(meta.executeDevFile)
    }
};

writeFile(path.join(meta.generatedDir, meta.surgeModuleFile), buildSurgeModule(urls.capture.remote));
writeFile(path.join(meta.generatedDir, meta.qxSnippetFile), buildQxSnippet(urls.capture.remote));
writeFile(path.join(meta.generatedDir, meta.loonPluginFile), buildLoonPlugin(urls.capture.remote));

if (isDevBuild) {
    writeFile(path.join(meta.generatedDir, meta.surgeDevModuleFile), buildSurgeModule(urls.captureDev.local, true));
    writeFile(path.join(meta.generatedDir, meta.qxDevSnippetFile), buildQxSnippet(urls.captureDev.local, true));
    writeFile(path.join(meta.generatedDir, meta.loonDevPluginFile), buildLoonPlugin(urls.captureDev.local, true));
}

writeFile(
    path.join(meta.generatedDir, "local-links.json"),
    JSON.stringify(
        {
            updateAt,
            mode: isDevBuild ? "dev" : "prod",
            capture: buildLinkBundle(urls.capture.local, urls.capture.remote),
            execute: buildLinkBundle(urls.execute.local, urls.execute.remote),
            captureDev: buildLinkBundle(urls.captureDev.local, urls.captureDev.remote),
            executeDev: buildLinkBundle(urls.executeDev.local, urls.executeDev.remote)
        },
        null,
        2
    )
);

writeFile("README.md", buildReadme(urls));

function buildDirectoryTree(basePath, dirsToScan) {
    let result = "";

    function scanDir(currentPath, indent) {
        if (!fs.existsSync(currentPath)) return;
        const entries = fs.readdirSync(currentPath, { withFileTypes: true });

        entries.sort((a, b) => {
            if (a.isDirectory() === b.isDirectory()) {
                return a.name.localeCompare(b.name);
            }
            return a.isDirectory() ? -1 : 1;
        });

        for (const entry of entries) {
            if (entry.name.startsWith(".")) continue;
            if (entry.isDirectory()) {
                result += `${indent}${entry.name}/\n`;
                scanDir(path.join(currentPath, entry.name), indent + "  ");
            } else {
                result += `${indent}${entry.name}\n`;
            }
        }
    }

    for (const dir of dirsToScan) {
        const fullPath = path.join(basePath, dir);
        if (fs.existsSync(fullPath)) {
            result += `${dir}/\n`;
            scanDir(fullPath, "  ");
        }
    }

    return result.trimEnd();
}

function resolveRemoteUrl(fileName) {
    const remoteBase = process.env.SCRIPT_REMOTE_BASE?.trim();
    if (remoteBase) {
        return `${remoteBase.replace(/\/$/, "")}/${fileName}`;
    }

    const repository = process.env.GITHUB_REPOSITORY?.trim();
    const branch = process.env.GITHUB_REF_NAME?.trim() || "main";
    if (repository) {
        return `https://raw.githubusercontent.com/${repository}/${branch}/${meta.publishPath}/${meta.distDir}/${fileName}`;
    }

    const repositoryUrl = normalizeLinkUrl(String(packageJson.repository?.url || "")).replace(/\.git$/, "");
    const match = repositoryUrl.match(/github\.com\/([^/]+\/[^/]+)$/);
    const fallbackRepository = match ? match[1] : "Yuheng0101/X";
    return `https://raw.githubusercontent.com/${fallbackRepository}/main/${meta.publishPath}/${meta.distDir}/${fileName}`;
}

function resolveLocalUrl(fileName) {
    const protocol = meta.localProtocol || "http";
    const host = meta.localHost || "127.0.0.1";
    const port = meta.localPort ? `:${meta.localPort}` : "";
    const defaultPath = [meta.publishPath, meta.distDir].filter(Boolean).join("/");
    const localPath = String(meta.localPath || defaultPath).replace(/^\/+|\/+$/g, "");
    const baseUrl = `${protocol}://${host}${port}`;
    return localPath ? `${baseUrl}/${localPath}/${fileName}` : `${baseUrl}/${fileName}`;
}

function buildQrUrl(url) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(url)}`;
}

function buildLinkBundle(localUrl, remoteUrl) {
    return {
        localUrl,
        localQrUrl: buildQrUrl(localUrl),
        remoteUrl
    };
}

function buildReadme(urls) {
    const { capture, runtime } = cloud139Config;
    const infoItems = [
        `- 名称：\`${meta.displayName}\``,
        `- 描述：\`${packageJson.description}\``,
        `- 作者：\`${packageJson.author}\``,
        `- 仓库：${renderMarkdownLink(packageJson.repository?.url)}`,
        `- 主页：${renderMarkdownLink(packageJson.homepage)}`,
        `- 分类：\`${meta.category}\``,
        `- 频道：${renderMarkdownLink(meta.channel)}`,
        `- 反馈：${renderMarkdownLink(meta.feedback)}`,
        `- 版本：\`${packageJson.version}\``,
        `- 发布目录：\`${meta.publishPath}\``,
        `- 更新时间：\`${updateAt}\``
    ].join("\n");
    const localItems = [
        `- 开发抓取脚本：[capture.dev.js](${urls.captureDev.local})`,
        `- 开发执行脚本：[cloud139.dev.js](${urls.executeDev.local})`,
        `- 开发抓取二维码：[扫码打开](${buildQrUrl(urls.captureDev.local)})`,
        `- 开发执行二维码：[扫码打开](${buildQrUrl(urls.executeDev.local)})`
    ].join("\n");
    const remoteItems = [
        `- 正式抓取脚本：[capture.js](${urls.capture.remote})`,
        `- 正式执行脚本：[cloud139.js](${urls.execute.remote})`
    ].join("\n");
    const thanks =
        Array.isArray(meta.thanks) && meta.thanks.length > 0
            ? `\n## 特别致谢\n\n${meta.thanks.map((link) => `- ${renderMarkdownLink(link)}`).join("\n")}\n`
            : "";

    const directoryTree = buildDirectoryTree(rootDir, ["src", "scripts", meta.generatedDir, meta.distDir]);

    return `# ${meta.displayName}

${packageJson.description}

## 信息

${infoItems}

## 功能

- 抓取 \`https://user-njs.yun.139.com/user/getUser\` 请求头中的 \`authorization\`
- 自动写入持久化存储键 \`ydyp_ck\`
- 执行签到、任务、云朵、上传、分享等流程

## 目录结构

\`\`\`text
${directoryTree}
\`\`\`

## 使用方式

### 抓取授权

- 在代理工具中对 \`${capture.hostnames.join(", ")}\` 开启 MITM
- 正式脚本：\`${meta.distDir}/${meta.captureFile}\`
- 开发脚本：\`${meta.distDir}/${meta.captureDevFile}\`

### 直接执行

- 正式脚本：\`${meta.distDir}/${meta.executeFile}\`
- 开发脚本：\`${meta.distDir}/${meta.executeDevFile}\`

## 本地测试

${localItems}

## 配置项

- \`ydyp_ck\`
- \`upload\`
- \`share\`
- \`push\`
- \`dirId\`
- \`uploadFilename\`
- \`uploadSizeMb\`
- \`shareFilename\`
- \`clickNum\`
- \`drawTimes\`
- \`delayMin\`
- \`delayMax\`
- \`timeout\`

## 环境变量

- \`${runtime.envPrefix}_TIMEOUT\`
- \`${runtime.envPrefix}_PUSH\`
- \`${runtime.envPrefix}_UPLOAD\`
- \`${runtime.envPrefix}_SHARE\`

## 平台配置文件

- Surge: \`${meta.generatedDir}/${meta.surgeModuleFile}\`
- Quantumult X: \`${meta.generatedDir}/${meta.qxSnippetFile}\`
- Loon: \`${meta.generatedDir}/${meta.loonPluginFile}\`
- Surge Dev: \`${meta.generatedDir}/${meta.surgeDevModuleFile}\`
- Quantumult X Dev: \`${meta.generatedDir}/${meta.qxDevSnippetFile}\`
- Loon Dev: \`${meta.generatedDir}/${meta.loonDevPluginFile}\`
${thanks}

## 远程脚本链接

${remoteItems}
`;
}

function parseNamedLink(value) {
    const text = String(value || "").trim();
    const match = text.match(/^【([^:]+):(.+)】$/);
    if (match) {
        return { name: match[1].trim(), url: match[2].trim() };
    }
    return { name: "", url: text };
}

function renderMarkdownLink(value) {
    const { name, url } = parseNamedLink(value);
    if (!url) {
        return "`-`";
    }
    const label = name || simplifyLinkLabel(url);
    return `[${label}](${normalizeLinkUrl(url)})`;
}

function simplifyLinkLabel(url) {
    return String(url)
        .replace(/^git\+/, "")
        .replace(/^https?:\/\//, "")
        .replace(/\/$/, "");
}

function normalizeLinkUrl(url) {
    return String(url).replace(/^git\+/, "");
}

function buildSurgeModule(captureUrl, isDev = false) {
    const { capture } = cloud139Config;
    const suffix = isDev ? " Dev" : "";
    return [
        `#!name=${meta.displayName}${suffix}`,
        `#!desc=${packageJson.description}${isDev ? " (dev)" : ""}`,
        `#!category=${meta.category}`,
        `#!channel=${normalizeLinkUrl(meta.channel)}`,
        `#!feedback=${normalizeLinkUrl(meta.feedback)}`,
        `#!author=${packageJson.author}`,
        `#!homepage=${normalizeLinkUrl(packageJson.homepage)}`,
        `#!updateAt=${updateAt}`,
        `#!version=${packageJson.version}`,
        "",
        "[Script]",
        `中国移动云盘抓取${suffix} = type=http-request,pattern=${capture.urlPattern},script-path=${captureUrl},timeout=60`,
        "",
        "[MITM]",
        `hostname = %APPEND% ${capture.hostnames.join(", ")}`
    ].join("\n");
}

function buildQxSnippet(captureUrl, isDev = false) {
    const { capture } = cloud139Config;
    return [
        "/******************************************",
        ` * @name ${meta.displayName}${isDev ? " Dev" : ""}`,
        ` * @description ${packageJson.description}${isDev ? " (dev)" : ""}`,
        ` * @author ${packageJson.author}`,
        ` * @homepage ${normalizeLinkUrl(packageJson.homepage)}`,
        ` * @updateAt ${updateAt}`,
        ` * @channel ${normalizeLinkUrl(meta.channel)}`,
        ` * @feedback ${normalizeLinkUrl(meta.feedback)}`,
        ` * @version ${packageJson.version}`,
        ` * @category ${meta.category}`,
        " ******************************************/",
        "",
        "[rewrite_local]",
        `${capture.urlPattern} url script-request-header ${captureUrl}`,
        "",
        "[mitm]",
        `hostname = ${capture.hostnames.join(", ")}`
    ].join("\n");
}

function buildLoonPlugin(captureUrl, isDev = false) {
    const { capture } = cloud139Config;
    const suffix = isDev ? " Dev" : "";
    return [
        `#!name=${meta.displayName}${suffix}`,
        `#!desc=${packageJson.description}${isDev ? " (dev)" : ""}`,
        `#!category=${meta.category}`,
        `#!channel=${normalizeLinkUrl(meta.channel)}`,
        `#!feedback=${normalizeLinkUrl(meta.feedback)}`,
        `#!author=${packageJson.author}`,
        `#!homepage=${normalizeLinkUrl(packageJson.homepage)}`,
        `#!updateAt=${updateAt}`,
        `#!version=${packageJson.version}`,
        "",
        "[Script]",
        `http-request ${capture.urlPattern} script-path=${captureUrl}, timeout=60, tag=中国移动云盘抓取${suffix}`,
        "",
        "[MITM]",
        `hostname = ${capture.hostnames.join(", ")}`
    ].join("\n");
}

function writeFile(relativePath, content) {
    const filePath = path.join(rootDir, relativePath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, "utf8");
}

function buildUpdateAt(date) {
    const formatter = new Intl.DateTimeFormat("sv-SE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: meta.generatedTimezone || "Asia/Shanghai"
    });
    const parts = Object.fromEntries(
        formatter
            .formatToParts(date)
            .filter(({ type }) => type !== "literal")
            .map(({ type, value }) => [type, value])
    );
    return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
}
