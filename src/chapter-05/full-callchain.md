# 5.5 完整调用链路图解

## 场景：你点击 "Run" 发送一次搜索请求

```
① 你在浏览器页面填参数，点 "Run"

② 前端 React 代码执行 fetch():
   POST http://localhost:6277/mcp
   Content-Type: application/json
   MCP-Session-Id: abc-123
   MCP-Proxy-Auth-Token: xxx
   Body: {"jsonrpc":"2.0","id":5,"method":"tools/call","params":{...}}

③ Express 收到 POST /mcp:
   app.post("/mcp", (req, res) => {
     const sessionId = req.headers["mcp-session-id"];
     const transport = webAppTransports.get(sessionId);
     await transport.handleRequest(req, res);  // ← 关键转发
   })

④ mcpProxy 收到消息:
   transportToServer.send(message)
   → MCP SDK 把 JSON 序列化
   → 写入 node obsidian-mcp-server.js 的 stdin

⑤ obsidian-mcp-server.js:
   process.stdin.on("data", (raw) => {
     const msg = JSON.parse(raw.toString());  // 解析 JSON-RPC
     // 执行 obsidian_search 逻辑
     // fs.readdirSync() + fs.readFileSync()
     const response = { jsonrpc: "2.0", id: 5, result: {...} };
     process.stdout.write(JSON.stringify(response));  // 写入 stdout
   })

⑥ mcpProxy 收到响应:
   transportToServer.onmessage = (message) => {
     transportToClient.send(message);  // 通过 SSE 推给浏览器
   }

⑦ 浏览器收到 SSE 事件:
   前端更新 History 面板
   显示响应内容

⑧ stderr 日志（如果有）:
   console.error("搜索完成，共找到3条结果")
   → serverTransport.stderr.on("data", ...)
   → 转成 notifications/message 事件
   → SSE 推给浏览器
   → Inspector 下方 "Server Notifications" 显示
```

## 时序图

```
浏览器        后端代理(6277)      MCP SDK           MCP Server
  │                 │                │                  │
  │── GET /stdio ──→│                │                  │
  │                 │── start() ────→│── spawn("node") → │
  │                 │                │←── stdout ────────│
  │←──────── SSE 长连接建立 ──────────────────────────────────│
  │                 │                │                  │
  │── POST /mcp ──→│── send(msg) ──→│── stdin写入 ─────→│
  │                 │                │←─ stdout读出 ─────│
  │←── SSE 事件 ───│←─ onmessage ──│                  │
  │                 │                │                  │
```
