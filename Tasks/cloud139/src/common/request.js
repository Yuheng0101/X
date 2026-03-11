import { wait } from "@nsnanocat/util";
/**
 * 请求错误处理和重试机制封装
 * 为底层的 Http Client 提供高阶功能：
 * 统一管理报错重拾（Retry）、统一抽取 JSON / Text 响应内容块等操作
 */
export function createRequestHelpers(client, getTimeout) {
  return {
    request,
    requestJson,
    requestText,
  };

  /**
   * 执行底层请求方法，遇到超时等异常时具备自动重试机制
   */
  async function request(config, retries = 3) {
    let lastError;

    for (let attempt = 0; attempt < retries; attempt += 1) {
      try {
        return await client.request({
          timeout: getTimeout(),
          responseType: "json",
          ...config,
        });
      } catch (error) {
        lastError = error;
        if (attempt < retries - 1) {
          await wait(1000);
        }
      }
    }

    throw lastError;
  }

  async function requestJson(config, retries = 3) {
    const response = await request(
      { responseType: "json", ...config },
      retries,
    );
    return response.data;
  }

  async function requestText(config, retries = 3) {
    const response = await request(
      { responseType: "text", ...config },
      retries,
    );
    return response.data;
  }
}
