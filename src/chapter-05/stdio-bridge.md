# 5.4 stdio 管道的翻译逻辑

## 核心文件：mcpProxy.js

这是整个 Inspector 最核心的 120 行代码，它在 `transportToClient`（SSE/HTTP）和 `transportToServer`（stdio）之间搭了一座桥。

```javascript
export default function mcpProxy({ transportToClient, transportToServer }) {

  // 方向1：浏览器发来消息 → 转发给 stdio
  transportToClient.onmessage = (message) => {
    transportToServer.send(message);
    //   实际发生的事：
    //   JSON.stringify(message) → 写入 node 子进程的 stdin
  };

  // 方向2：stdio 返回消息 → 转发给浏览器
  transportToServer.onmessage = (message) => {
    transportToClient.send(message);
    //   实际发生的事：
    //   从 node 子进程的 stdout 读取响应
    //   → 封装成 SSE 事件 → 通过 HTTP 长连接推送给浏览器
  };

  // 方向3：stderr 日志 → 推送给浏览器
  transportToServer.stderr.on("data", (chunk) => {
    const level = detectLogLevel(chunk.toString());  // 从内容判断日志级别
    transportToClient.send({
      jsonrpc: "2.0",
      method: "notifications/message",
      params: {
        level,
        logger: "stdio",
        data: { message: chunk.toString().trim() }
      }
    });
  });

  // 方向4：任意一方关闭 → 关闭另一方
  transportToClient.onclose = () => transportToServer.close();
  transportToServer.onclose = () => transportToClient.close();
}
```

## 翻译的核心

| 来自 | 去向 | 翻译动作 |
|------|------|---------|
| HTTP 请求 body（JSON） | stdin（字节流） | `transportToServer.send()` 写入管道 |
| stdout（字节流） | HTTP 响应 / SSE 事件 | `transportToServer.onmessage()` 读取后推送 |

**`send()` 方法**：MCP SDK 内部会把 JSON-RPC 对象序列化成 JSON 字符串，写入 `process.stdin`。
**`onmessage` 回调**：MCP SDK 内部从 `process.stdout` 读取数据，解析成 JSON-RPC 对象后触发回调。
