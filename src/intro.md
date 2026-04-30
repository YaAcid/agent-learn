# 先导：这份笔记是怎么来的

这是一份**完全基于真实对话**整理的学习笔记，记录了一次从零理解 MCP（Model Context Protocol）的完整过程。

## 背景

学习者在准备 AI Agent 方向面试，面试核心知识包括 RAG、MCP、多 Agent 架构等。其中 MCP 是当前 AI 编程工具（Cursor、VS Code Agent、Claude Code、Codex 等）的核心基础设施。

## 学习路径

这次学习的特别之处在于：**不是从文档开始，而是从自己电脑上的真实环境开始**。

```
第 1 步：发现 Codex 的 MCP 配置
         ↓
第 2 步：找到 JSON-RPC 日志，理解调用链路
         ↓
第 3 步：手写第一个 MCP Server（原理演示）
         ↓
第 4 步：意识到原理演示太简单，换成 Obsidian 笔记库
         ↓
第 5 步：下载 Inspector 源码，看前（浏览器）后（Node进程）端联调
         ↓
第 6 步：整理成 MDBook，推送到 GitHub Pages
```

## 关键文件

| 文件 | 作用 |
|------|------|
| `obsidian-mcp-server.js` | 连接真实 Obsidian 笔记库，支持搜索/读取/列表 |
| `my-mcp-server.js` | 最简原理演示，包含完整注释 |
| `mcp-inspector-source/` | Inspector 源码（从 npm 包解压） |
| `MCP快速上手指南.md` | 原始完整指南文档 |

## 你能从这份笔记里学到什么

- **MCP 协议是什么**：JSON-RPC over stdio 的本质
- **如何写一个 MCP Server**：用 Node.js 10 分钟实现
- **MCP Inspector 怎么工作**：HTTP/SSE/stdio 三层架构
- **前后端联调的网络流程**：浏览器 → Express → stdio → Node 进程
- **如何用 GitHub Actions 自动构建 MDBook 并部署 Pages**
