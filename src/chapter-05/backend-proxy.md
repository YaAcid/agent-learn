# 5.3 后端代理做了什么

## 核心职责

后端代理（`server/build/index.js`）充当 **HTTP ↔ stdio** 的桥梁。它的核心职责是：

1. **解析请求**：从 HTTP 请求中提取 JSON-RPC 消息
2. **找到 Transport**：通过 sessionId 找到对应的 stdio transport
3. **转发**：把 HTTP 请求写入 stdio，等待响应后返回

## 认证中间件

```javascript
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["x-mcp-proxy-auth"];
  if (!authHeaderValue || !authHeaderValue.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const providedToken = authHeaderValue.substring(7);  // 去掉 "Bearer " 前缀
  if (!timingSafeEqual(Buffer.from(providedToken), Buffer.from(expectedToken))) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
};
```

**Token 生成**：每次启动 Inspector 时，用 `randomBytes(32).toString("hex")` 生成一个 64 字符的随机字符串，作为认证 token。打印在终端上，前端自动携带。

## Stream 转换

浏览器中的 `EventSource` API（用于 SSE）只认 Web 标准的 `ReadableStream`。但后端代理用的是 Node.js 的 `ReadableStream`。所以需要转换：

```javascript
const createWebReadableStream = (nodeStream) => {
  return new ReadableStream({
    start(controller) {
      nodeStream.on("data", (chunk) => controller.enqueue(chunk));
      nodeStream.on("end", () => controller.close());
      nodeStream.on("error", (err) => controller.error(err));
    }
  });
};
```
