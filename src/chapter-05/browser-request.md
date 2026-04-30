# 5.2 浏览器如何发送请求

## 前端代码做的事情

Inspector 的前端是一个 React 应用（编译后在 `client/dist/`）。当你在界面上点 "Run" 时，前端代码执行的是：

```javascript
// 伪代码，实际代码在编译后的 index-*.js 中
const sessionId = "xxx-xxx-xxx";  // SSE 建立时获取的 session ID

// 发送 JSON-RPC 请求
fetch("http://localhost:6277/mcp", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "MCP-Session-Id": sessionId,         // 用于路由到对应的 transport
    "MCP-Proxy-Auth-Token": "xxx",       // 认证 token
  },
  body: JSON.stringify({
    jsonrpc: "2.0",
    id: 5,
    method: "tools/call",
    params: {
      name: "obsidian_search",
      arguments: { vault: "智能体学习", keyword: "MCP", limit: 3 }
    }
  })
})
```

**这是普通的浏览器 HTTP 请求**——和网页调用后端 API 完全一样。前端代码中包含了 HTTP 客户端逻辑，封装在 `@modelcontextprotocol/sdk` 的 client 模块中。

## GET /stdio 建立长连接

页面加载时，前端先发送一个 GET 请求：

```javascript
fetch("http://localhost:6277/stdio?command=node&args=obsidian-mcp-server.js", {
  headers: {
    "MCP-Proxy-Auth-Token": "xxx",
  }
})
```

这个请求**不返回**，Response 一直挂着。服务器通过这个 HTTP 连接（**SSE 长连接**）可以随时向浏览器推送数据——比如 stderr 的日志内容。
