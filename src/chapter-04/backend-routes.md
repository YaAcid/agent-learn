# 4.4 后端代理的三个核心路由

后端代理（`server/build/index.js`）是一个 Express 服务器，监听 6277 端口，有三个核心路由：

## 路由1：GET /stdio —— 建立长连接

**作用**：前端页面加载时，先请求这个路由，建立 **SSE（Server-Sent Events）长连接**。

```javascript
app.get("/stdio", authMiddleware, async (req, res) => {
  // 1. 解析命令行参数，创建 stdio transport
  const { transport: serverTransport } = await createTransport(req);
  //   createTransport 里执行：
  //   new StdioClientTransport({ command: "node", args: ["obsidian-mcp-server.js"] })
  //   await transport.start()  // ← 启动子进程

  // 2. 建立 SSE 通道，res 是 Express Response 对象
  const webAppTransport = new SSEServerTransport(endpoint, res);

  // 3. 绑定消息转发
  mcpProxy({
    transportToClient: webAppTransport,   // SSE 通道
    transportToServer: serverTransport,    // stdio 管道
  });

  // 4. 监听 stderr（调试日志）
  serverTransport.stderr.on("data", (chunk) => {
    // console.error() 的内容转成 notifications/message 事件
    webAppTransport.send({
      jsonrpc: "2.0",
      method: "notifications/message",
      params: { level: "info", data: { message: chunk.toString() } }
    });
  });
});
```

**关键理解**：Express 的 `res` 对象被传给了 `SSEServerTransport`。这个传输层通过 HTTP 长连接（不返回，一直挂着）保持和浏览器的通信。

## 路由2：POST /mcp —— 发送请求

**作用**：前端点击 "Run" 时，通过这个路由发送 JSON-RPC 请求。

```javascript
app.post("/mcp", authMiddleware, async (req, res) => {
  const sessionId = req.headers["mcp-session-id"];
  // 通过 sessionId 找到之前在 /stdio 建立的那个 transport
  const transport = webAppTransports.get(sessionId);
  // 把 HTTP 请求转发给 stdio 管道
  await transport.handleRequest(req, res);
})
```

## 路由3：DELETE /mcp —— 断开连接

**作用**：关闭连接，清理资源。

```javascript
app.delete("/mcp", authMiddleware, async (req, res) => {
  const sessionId = req.headers["mcp-session-id"];
  await serverTransport.terminateSession();
  await serverTransport.close();
  webAppTransports.delete(sessionId);
  serverTransports.delete(sessionId);
  res.status(200).end();
})
```

## Session 管理

```javascript
const webAppTransports = new Map();    // sessionId → SSE transport
const serverTransports = new Map();     // sessionId → stdio transport
```

每个浏览器连接都有一个唯一的 `sessionId`，用于在多个路由之间找到对应的 transport。
