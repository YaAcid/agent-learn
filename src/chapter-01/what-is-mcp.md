# 1.1 从你电脑上的真实配置说起

## 找到的第一个 MCP 配置文件

在 Codex 的插件目录里找到了这份真实的 MCP 配置：

```json
{
  "mcpServers": {
    "xcodebuildmcp": {
      "command": "npx",
      "args": ["-y", "xcodebuildmcp@latest", "mcp"],
      "env": {
        "XCODEBUILDMCP_ENABLED_WORKFLOWS": "simulator,ui-automation,debugging,logging"
      }
    }
  }
}
```

这是 Codex（VS Code 的 AI 编程插件）连接 MCP Server 的配置文件。

## 三行配置的含义

| 配置字段 | 值 | 含义 |
|---------|-----|------|
| `command` | `"npx"` | AI 调用时，系统启动一个子进程，运行 `npx` 命令 |
| `args` | `["-y", "xcodebuildmcp@latest", "mcp"]` | 子进程执行的命令和参数 |
| `env` | `{...}` | 传给 Server 的环境变量（配置参数） |

**核心本质**：当 Codex 需要某个能力时，操作系统拉起一个子进程，这个子进程通过 **stdin/stdout** 和 Codex 通信。子进程就是 MCP Server。

## 什么是"起一个本地服务"

```
AI（Codex）发起请求
     ↓ 操作系统
拉起子进程：npx -y xcodebuildmcp@latest mcp
     ↓ stdin/stdout（管道）
MCP Server 运行，返回结果
     ↓
AI 收到结果
```

这就是"起一个本地服务"的意思——不是传统的 HTTP 服务，而是**通过进程管道**提供服务。AI 通过写 stdin、读 stdout 来调用 Server。

## 你的电脑上已经有哪些 MCP Server

在 Codex 配置目录中找到的已安装 Server：

| Server 名称 | 功能 |
|------------|------|
| `xcodebuildmcp` | iOS 构建自动化 |
| `cloudflare` | Cloudflare API 操作 |

这些都配置在 `C:\Users\zyx\.codex\` 目录下的 `.mcp.json` 文件中。
