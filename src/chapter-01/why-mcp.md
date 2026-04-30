# 1.3 为什么需要 MCP？

## 传统 AI 的局限性

LLM 本身无法：
- 读取你的本地文件
- 执行代码
- 访问你的数据库
- 调用第三方 API
- 操作系统级别的操作

## MCP 的解决方案

MCP 充当 AI 和外部世界的**桥梁**：

```
传统 AI：
LLM → 只知道训练数据 → 输出文本

MCP 加持后：
LLM ← MCP Client ← MCP Server → 本地文件
LLM ← MCP Client ← MCP Server → 数据库
LLM ← MCP Client ← MCP Server → API
LLM ← MCP Client ← MCP Server → 命令行
```

## 实际例子

**没有 MCP**：AI 只能告诉你"如何备份文件"，但无法实际执行。

**有 MCP**：`obsidian_search` 工具让 AI 能：
1. 在你的 Obsidian 笔记库中搜索关键词
2. 读取找到的笔记内容
3. 基于你的实际笔记内容来回答问题

这才是 MCP 真正有价值的地方——**让 AI 访问 LLM 自己无法获取的本地数据**。
