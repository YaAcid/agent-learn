# 附录 B：关键概念速查表

## MCP 协议

| 术语 | 含义 |
|------|------|
| MCP | Model Context Protocol，AI 调用外部工具的标准化协议 |
| JSON-RPC 2.0 | 轻量级 RPC 协议，所有消息是 JSON 格式 |
| stdio | 标准输入/输出，AI Client 和本地 Server 通信的方式 |
| SSE | Server-Sent Events，HTTP 长连接，Server 可以主动推送 |
| Transport | 传输层，MCP SDK 封装了 stdio/SSE/HTTP 的实现 |

## MCP Server 开发

| 术语 | 含义 |
|------|------|
| Server | MCP 服务端，提供 Tools/Resources/Prompts |
| Tool | AI 可调用的函数 |
| ListToolsRequestSchema | 查询工具列表的请求类型 |
| CallToolRequestSchema | 调用工具的请求类型 |
| StdioServerTransport | 通过 stdin/stdout 通信的传输层 |
| onmessage | 收到消息时的回调函数 |
| send() | 发送消息的方法 |

## Inspector 调试

| 术语 | 含义 |
|------|------|
| MCP Inspector | 官方调试工具，可视化测试 MCP Server |
| sessionId | 浏览器和后端代理之间的会话 ID |
| stderr | 调试日志输出流，在 Inspector 的 Notifications 区域显示 |
| mcpProxy | HTTP ↔ stdio 协议转换的核心模块 |

## GitHub Actions

| 术语 | 含义 |
|------|------|
| workflow | CI/CD 工作流，定义在 `.github/workflows/` |
| job | 工作流中的一个任务 |
| step | 任务中的具体步骤 |
| artifact | 构建产物（MDBook 输出到 `book/` 目录）|
| Pages | GitHub 静态网站托管服务 |
| `workflow_dispatch` | 允许手动触发 Actions |

## JSON-RPC 速查

```json
// 请求
{ "jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {} }

// 响应
{ "jsonrpc": "2.0", "id": 1, "result": { "tools": [...] } }

// 错误
{ "jsonrpc": "2.0", "id": 1, "error": { "code": -32600, "message": "..." } }
```
