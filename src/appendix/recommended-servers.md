# 附录 A：真实 MCP Server 推荐

## 官方 Server

| Server | 来源 | 功能 |
|--------|------|------|
| `filesystem` | `@modelcontextprotocol/server-filesystem` | 文件系统读写 |
| `git` | `@modelcontextprotocol/server-git` | Git 操作 |
| `sentry` | `@modelcontextprotocol/server-sentry` | Sentry 错误监控 |
| `slack` | `@modelcontextprotocol/server-slack` | Slack 消息发送 |

## 社区 Server

| Server | 来源 | 功能 |
|--------|------|------|
| Brave Search | `brave-search-mcp-server` | 网页搜索 |
| Puppeteer | `@modelcontextprotocol/server-puppeteer` | 浏览器自动化 |
| PostgreSQL | `mcp-server-postgres` | 数据库查询 |
| SQLite | `mcp-server-sqlite` | 轻量数据库 |

## 安装方式

大多数 MCP Server 通过 npm 安装：

```bash
# 安装
npm install -g @modelcontextprotocol/server-filesystem

# 或者用 npx 直接运行（不需要全局安装）
npx @modelcontextprotocol/server-filesystem /path/to/directory
```

然后在 AI 工具的 MCP 配置中添加：

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "/your/path"]
    }
  }
}
```
