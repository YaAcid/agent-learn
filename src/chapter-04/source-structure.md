# 4.2 源码结构：三个子项目

Inspector 源码解压后位于 `D:\AAAagent\mcp-learn\mcp-inspector-source\`，是一个**Monorepo**（多包仓库），包含三个子项目：

```
mcp-inspector-source/
├── package.json          # 根配置，定义 workspaces
├── cli/                  # 命令行入口
│   └── build/cli.js     # npx 调用的就是它
├── client/              # 前端（React）
│   ├── bin/
│   │   ├── start.js     # 启动前端的脚本
│   │   └── client.js
│   └── dist/            # 编译后的前端资源
│       ├── index.html   # 单页应用入口（14行）
│       ├── index-*.js   # 2.6MB，React 前端代码
│       └── index-*.css  # 样式
└── server/              # 后端代理（Node.js + Express）
    └── build/
        ├── index.js     # Express 服务器（800行）
        └── mcpProxy.js  # 消息转发核心逻辑（120行）
```

## package.json 中的关键配置

```json
{
  "bin": {
    "mcp-inspector": "cli/build/cli.js"  // npx 命令的入口
  },
  "workspaces": [
    "client",
    "server",
    "cli"
  ]
}
```

## 每个子项目的作用

| 子项目 | 技术栈 | 作用 |
|--------|--------|------|
| `cli` | Node.js | 解析命令行参数，启动 client 和 server |
| `client` | React + Vite | 提供浏览器调试界面 |
| `server` | Express | HTTP ↔ stdio 的协议转换 |

## 编译后的前端文件

`client/dist/` 中的文件是**编译产物**：

- `index.html`：只有 14 行，加载 JS 和 CSS
- `index-*.js`：2.6MB 的压缩 React 代码，不可读
- `index-*.css`：样式文件

**这是因为源码是 TypeScript + React，经过 Vite 编译后直接用于生产环境。** 如果想看可读的前端代码，需要 clone [GitHub 仓库](https://github.com/modelcontextprotocol/inspector) 并在开发模式下运行。
