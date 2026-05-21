const isQuanX = typeof $task !== 'undefined'
const StatusText = isQuanX ? 'HTTP/1.1 302 Redirect' : 302
const CDN_HOST = 'cdn.jsdelivr.net'

function rewrite(url) {
    const match = url.match(/^https?:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)\/(.*)/)
    if (!match) return null
    const [, user, repo, branch, path] = match
    return `https://${CDN_HOST}/gh/${user}/${repo}@${branch}/${path}`
}
const cdnUrl = rewrite($request.url)
const response = { status: StatusText, headers: { Location: cdnUrl } }
if (cdnUrl) {
    $done(isQuanX ? response : { response })
} else {
    $done({})
}
