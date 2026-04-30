# 5.6 网络知识点总结

## 涉及的计算机网络知识

| 知识点 | 在这里怎么体现 |
|--------|--------------|
| **HTTP 长连接（SSE）** | `/stdio` 的 GET 请求不返回，Response 一直挂着，Server 随时往里写数据推送 |
| **进程间管道（IPC）** | `spawn("node", ...)` 后，父进程和子进程通过 stdin/stdout 通信，操作系统级别的管道 |
| **CORS** | `app.use(cors())` 允许跨域，前端 6274 和后端 6277 端口不同 |
| **Session 管理** | `Map<sessionId, transport>` 维护多个并发连接的状态 |
| **认证 Token** | 32字节随机 hex 字符串，每次启动生成，通过 `X-MCP-Proxy-Auth: Bearer xxx` 头传递 |
| **流转换** | `createWebReadableStream()` 把 Node.js 的 `ReadableStream` 转成 Web 标准 `ReadableStream` |
| **HTTP 状态码** | 200(成功)、401(未授权)、404(session不存在)、500(服务端错误) |
| **Timing Attack 防护** | `timingSafeEqual()` 用于比较 token，防止时序攻击 |

## 你最容易混淆的点：stdio 怎么变成网络的

```
传统的 MCP Server（没有 Inspector）：
  stdin  ← JSON-RPC 请求 ← AI Client（直接是同一个进程）
  stdout → JSON-RPC 响应 → AI Client
  （Client 和 Server 在同一个机器上，通过管道直接通信）

Inspector 模式（加入了代理层）：
  浏览器 ← HTTP/SSE → 代理进程（端口6277）← stdio → node 子进程 → 你的 Server

代理进程干的事情：
  HTTP 请求（网络字节）
      ↓ 解析
  JSON 对象
      ↓ transportToServer.send()
  stdin（管道字节）
      ↓ node 子进程处理
  stdout（管道字节）
      ↓ transportToServer.onmessage()
  JSON 对象
      ↓ transportToClient.send()
  SSE 事件（网络字节）
      ↓
  浏览器收到
```

**核心翻译动作**：`mcpProxy.js` 的 `onmessage` 回调就是那个翻译器。它把来自不同传输层的消息互相转发，让浏览器（HTTP/SSE）和本地进程（stdio）能够通信。
