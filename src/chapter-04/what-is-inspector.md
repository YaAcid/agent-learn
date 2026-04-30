# 4.1 Inspector 是什么

## 定义

MCP Inspector 是官方 MCP SDK 团队提供的**调试工具**，用于测试和调试 MCP Server。

## 启动方式

```bash
npx @modelcontextprotocol/inspector -- node obsidian-mcp-server.js
```

启动后会自动打开浏览器，访问 `http://localhost:6274`。

## Inspector 的界面功能

| 区域 | 功能 |
|------|------|
| **Tools 面板** | 显示 Server 注册的所有工具，可选工具并填参数 |
| **Run 按钮** | 发送请求到 Server |
| **History** | 记录每次调用的编号（1, 2, 3...）|
| **Request/Response** | 显示选中的某次调用的发送请求和收到的响应 |
| **Server Notifications** | 显示 stderr 日志（`console.error()` 的输出）|
| **Connected ✅** | 表示与 Server 的连接状态 |

## 为什么需要 Inspector

- **不用写代码就能测试**：不用写测试脚本，直接点界面
- **可视化每次调用**：清楚看到 JSON-RPC 请求和响应的完整内容
- **实时日志观察**：stderr 输出直接显示在界面上
- **模拟 AI Client**：模拟 AI 会发送的 MCP 协议消息
