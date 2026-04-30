# 4.3 启动流程源码解析

## 启动命令的完整执行过程

当你运行：
```bash
npx @modelcontextprotocol/inspector -- node obsidian-mcp-server.js
```

实际上发生了以下步骤：

### 步骤1：npx 下载并执行 cli.js

`npx` 下载 `@modelcontextprotocol/inspector` 包，然后执行：
```
node cli/build/cli.js -- node obsidian-mcp-server.js
```

### 步骤2：cli.js 解析参数（`start.js` 第 226-276 行）

```javascript
// 解析命令行参数
for (let i = 0; i < args.length; i++) {
  if (arg === "--") {
    parsingFlags = false;  // "--" 之后的是要传给 MCP Server 的命令
    continue;
  }
  if (!command && !isDev) {
    command = arg;  // "node"
  } else if (!isDev) {
    mcpServerArgs.push(arg);  // "obsidian-mcp-server.js"
  }
}
```

### 步骤3：先启动后端代理（`startProdServer` 函数）

```javascript
// 启动 server/build/index.js，传入 MCP Server 的命令
spawnPromise("node", [
  inspectorServerPath,
  `--command=node`,
  `--args=obsidian-mcp-server.js`,
], {
  env: { SERVER_PORT: "6277", CLIENT_PORT: "6274", ... }
})
```

**结果**：后端代理进程在端口 6277 启动，等待连接。

### 步骤4：再启动前端（`startProdClient` 函数）

```javascript
// 启动前端静态文件服务
spawnPromise("node", [inspectorClientPath], {
  env: { CLIENT_PORT: "6274", INSPECTOR_URL: "http://localhost:6274?..." }
})
```

**结果**：前端在端口 6274 启动，浏览器访问这个端口即可看到调试界面。

### 步骤5：自动打开浏览器

```javascript
// start.js 第 169-173 行
setTimeout(() => {
  if (process.env.MCP_AUTO_OPEN_ENABLED !== "false") {
    open(url);  // 自动打开默认浏览器
  }
}, 3000);
```

## 完整时序

```
用户执行 npx 命令
     ↓
cli.js 解析参数：command="node", args=["obsidian-mcp-server.js"]
     ↓
启动后端代理（端口6277）
     ↓
启动前端（端口6274）
     ↓
等待2秒（确保后端已就绪）
     ↓
自动打开浏览器访问 localhost:6274
     ↓
用户看到调试界面
```
