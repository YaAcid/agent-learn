# 目录

- [先导：这份笔记是怎么来的](./intro.md)

# 第一章：什么是 MCP？

- [1.1 从你电脑上的真实配置说起](./chapter-01/what-is-mcp.md)
- [1.2 MCP 的核心概念](./chapter-01/core-concepts.md)
- [1.3 为什么需要 MCP？](./chapter-01/why-mcp.md)

# 第二章：手写第一个 MCP Server

- [2.1 JSON-RPC 协议基础](./chapter-02/json-rpc.md)
- [2.2 最简 Server 代码逐行解析](./chapter-02/minimal-server.md)
- [2.3 手动触发调用：看真实协议消息](./chapter-02/manual-invoke.md)

# 第三章：Obsidian 笔记库 MCP Server 实战

- [3.1 为什么这个例子更有意义](./chapter-03/why-interesting.md)
- [3.2 完整源码解析](./chapter-03/obsidian-server-code.md)
- [3.3 预配置的笔记库与实测结果](./chapter-03/vaults-and-results.md)
- [3.4 如何扩展新工具](./chapter-03/extend-tools.md)

# 第四章：MCP Inspector 工作原理深度解析

- [4.1 Inspector 是什么](./chapter-04/what-is-inspector.md)
- [4.2 源码结构：三个子项目](./chapter-04/source-structure.md)
- [4.3 启动流程源码解析](./chapter-04/startup-flow.md)
- [4.4 后端代理的三个核心路由](./chapter-04/backend-routes.md)

# 第五章：网络通信与进程间调用详解

- [5.1 整体架构：三个进程](./chapter-05/architecture.md)
- [5.2 浏览器如何发送请求](./chapter-05/browser-request.md)
- [5.3 后端代理做了什么](./chapter-05/backend-proxy.md)
- [5.4 stdio 管道的翻译逻辑](./chapter-05/stdio-bridge.md)
- [5.5 完整调用链路图解](./chapter-05/full-callchain.md)
- [5.6 网络知识点总结](./chapter-05/network-summary.md)

# 第六章：GitHub Actions 自动化部署

- [6.1 为什么选择 MDBook + GitHub Pages](./chapter-06/why-mdbook.md)
- [6.2 CI 工作流配置](./chapter-06/ci-workflow.md)
- [6.3 GitHub Pages 开启步骤](./chapter-06/pages-setup.md)

# 附录

- [附录 A：真实 MCP Server 推荐](./appendix/recommended-servers.md)
- [附录 B：关键概念速查表](./appendix/cheatsheet.md)
