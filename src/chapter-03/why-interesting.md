# 3.1 为什么这个例子更有意义

## 计算和时间 LLM 自己做就行

`my-mcp-server.js` 里的 `calculate` 和 `get_time` 工具，LLM 本身就能完成：
- 问 LLM "100-30=?" → 直接回答 "70"
- 问 LLM "现在几点" → 直接回答时间

这没有体现 MCP 的价值。

## Obsidian 笔记库才是真正有意义的能力

**LLM 无法自己做到的事**：
- 读取你本地 Obsidian 笔记库中的文件
- 基于你的私人笔记内容来回答问题
- 在你的笔记库中搜索关键词

**Obsidian MCP Server 解决的就是这个问题**：
- AI 无法自己访问 `D:\Users\zyx\Documents\Obisidian_notes\` 下的文件
- 但通过 MCP Server 可以读取、搜索、列出笔记
- AI 可以结合你的实际笔记内容来回答更精准的问题

## 实际场景举例

**面试准备场景**：
- 你在 Obsidian 里整理了"智能体学习"笔记库
- AI 通过 `obsidian_search("MCP")` 找到相关笔记
- AI 读取 `算法题单.md`，发现你整理了错排问题的递推公式
- AI 基于你的实际笔记内容来帮你复习

这就是 MCP 的核心价值：**让 AI 能够操作 LLM 本身无法访问的本地资源**。
