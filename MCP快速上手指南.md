# MCP 快速上手指南（基于你电脑的真实环境）

> 学习日期：2026-04-30
> 文件位置：`D:\AAAagent\mcp-learn\`

---

## 一、MCP 是什么

**MCP = Model Context Protocol（模型上下文协议）**

它干的事情很简单：**让 AI Agent 能够调用外部工具**。

### 类比理解

想象你是一个领导（AI），你需要让秘书（Server）帮你查资料。传统做法是"秘书说什么你就只能用什么"；有了 MCP 之后，你和秘书之间有了一个**标准对话协议**，你只需按格式发问，秘书按标准格式回答。这个协议就是 MCP。

### 你的电脑上已经存在的真实例子

```
C:\Users\zyx\.codex\.tmp\plugins\plugins\build-ios-apps\.mcp.json
```

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

**三行配置的含义：**

| 字段 | 含义 |
|------|------|
| `command: "npx"` | 操作系统用 npx 命令启动一个子进程 |
| `args: [...]` | 子进程的命令行参数 |
| `env: {...}` | 环境变量（Server 的配置） |

这就是**"起一个本地服务"**的本质：AI 需要用某个工具 → 系统在后台拉起一个 Node.js/Python 进程 → 进程通过 `stdin/stdout` 和 AI 交换 JSON 数据。

---

## 二、MCP 调用链路图

```
┌─────────────────────────────────────────────────────┐
│                    AI Client (如 Codex)              │
│                                                      │
│  1. 发 initialize → 握手                              │
│  2. 发 tools/list   → 查询有哪些工具可用              │
│  3. 发 tools/call   → 让 Server 执行某个工具          │
│                                                      │
│  ← 收到 JSON-RPC 响应                                │
└────────────────┬────────────────────────────────────┘
                   │  stdio (标准输入/输出)
                   ▼
┌─────────────────────────────────────────────────────┐
│              MCP Server (子进程)                     │
│  - 监听 stdin                                        │
│  - 执行工具逻辑                                      │
│  - 把结果写入 stdout                                 │
│  - 调试日志写入 stderr                               │
└─────────────────────────────────────────────────────┘
```

---

## 三、协议核心：JSON-RPC 2.0

MCP 底层就是 JSON-RPC 2.0，每条消息是一个 JSON 对象。

### 三种核心方法

#### 1. initialize（握手，AI 启动时发一次）

**请求：**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "clientInfo": { "name": "codex", "version": "1.0" }
  }
}
```

**响应：**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2024-11-05",
    "serverInfo": { "name": "my-learn-server", "version": "1.0.0" },
    "capabilities": { "tools": {} }
  }
}
```

#### 2. tools/list（查询工具列表）

**请求：**
```json
{ "jsonrpc": "2.0", "id": 2, "method": "tools/list", "params": {} }
```

**响应：**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "tools": [
      {
        "name": "calculate",
        "description": "执行简单的数学运算",
        "inputSchema": {
          "type": "object",
          "properties": {
            "a": { "type": "number" },
            "b": { "type": "number" },
            "op": { "type": "string", "enum": ["add", "sub", "mul", "div"] }
          },
          "required": ["a", "b", "op"]
        }
      }
    ]
  }
}
```

#### 3. tools/call（执行工具）

**请求：**
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "calculate",
    "arguments": { "a": 100, "b": 30, "op": "sub" }
  }
}
```

**响应：**
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [
      { "type": "text", "text": "{\n  \"result\": 70,\n  \"expression\": \"100 sub 30 = 70\"\n}" }
    ]
  }
}
```

---

## 四、实战：你自己写一个 MCP Server

### 文件位置
`D:\AAAagent\mcp-learn\my-mcp-server.js`

### 运行方式

在终端中直接运行（无需任何参数）：
```bash
node D:\AAAagent\mcp-learn\my-mcp-server.js
```

### 手动测试（发送 JSON-RPC 消息）

```bash
# 测试握手
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","clientInfo":{"name":"test","version":"1"}}}' | node D:\AAAagent\mcp-learn\my-mcp-server.js

# 查询工具列表
echo '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' | node D:\AAAagent\mcp-learn\my-mcp-server.js

# 执行工具：计算 100 - 30
echo '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"calculate","arguments":{"a":100,"b":30,"op":"sub"}}}' | node D:\AAAagent\mcp-learn\my-mcp-server.js

# 执行工具：获取当前时间
echo '{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"get_time","arguments":{}}}' | node D:\AAAagent\mcp-learn\my-mcp-server.js
```

### 运行效果

stderr 会输出调试日志（你看到这些说明 Server 正常运行）：
```
[MCP-SERVER] 已启动！等待来自 AI Client 的 JSON-RPC 消息...
[MCP-SERVER] << 收到请求: method="tools/call" id=3
[MCP-SERVER]    params: {"name":"calculate","arguments":{"a":100,"b":30,"op":"sub"}}
[MCP-SERVER] >> 执行工具: calculate({"a":100,"b":30,"op":"sub"})
[MCP-SERVER] >> 响应: {"jsonrpc":"2.0","id":3, ...}
```

---

## 五、MCP Inspector 图形化调试

MCP Inspector 是官方调试工具，可以图形化查看每次 JSON-RPC 调用。

### 安装和启动

```bash
npx --yes @modelcontextprotocol/inspector@latest -- node D:\AAAagent\mcp-learn\my-mcp-server.js
```

启动后会打开一个浏览器窗口，左侧显示调用日志，右侧可以手动构造请求测试。

### 使用步骤

1. 启动后浏览器自动打开 `http://localhost:6274`
2. 在右侧输入框粘贴上面的 JSON-RPC 消息
3. 点击发送，观察左侧的请求/响应记录
4. 每条记录会显示完整的时间戳、请求内容、响应内容

---

## 六、如何配置到你的 AI 工具中

### 配置到 Codex

在项目根目录创建 `.mcp.json`：

```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["D:\\AAAagent\\mcp-learn\\my-mcp-server.js"]
    }
  }
}
```

### 配置到 Cursor

在 `C:\Users\zyx\.cursor\mcp.json` 中添加相同的配置，然后重启 Cursor。

### 配置到 WorkBuddy（当前工具）

在 `C:\Users\zyx\.workbuddy\mcp.json` 中添加配置。

---

## 七、真正有意义的例子：Obsidian 笔记 MCP Server

上面 `my-mcp-server.js` 的计算/时间例子只是为了讲原理。真正有意义的是**让 AI 访问 LLM 无法自己获取的本地数据**。

### 文件位置
`D:\AAAagent\mcp-learn\obsidian-mcp-server.js`

### 功能：三个工具

| 工具名 | 作用 | 为什么 LLM 自己做不到 |
|--------|------|----------------------|
| `obsidian_search` | 在笔记库中模糊搜索关键词 | LLM 没有你本地文件的访问权限 |
| `obsidian_read` | 读取指定笔记的完整内容 | 同上 |
| `obsidian_list` | 列出笔记库中的所有文件 | 同上 |

### 预配置的笔记库（你电脑上的实际路径）

```
智能体学习  →  D:\Users\zyx\Documents\Obisidian_notes\智能体学习
AAA算法设计 →  D:\Users\zyx\Documents\Obisidian_notes\AAA算法设计
操作系统    →  D:\Users\zyx\Documents\Obisidian_notes\操作系统
计算机网络  →  D:\Users\zyx\Documents\Obisidian_notes\计算机网络
数据结构    →  D:\Users\zyx\Documents\Obisidian_notes\数据结构
计组        →  D:\Users\zyx\Documents\Obisidian_notes\计组with_yzy
前端八股    →  D:\Users\zx\Documents\Obisidian_notes\前端八股+项目知识点
软件工程    →  D:\Users\zyx\Documents\Obisidian_notes\软件工程
```

### 实操演示

```bash
# 1. 搜索关键词（比如你在准备面试，搜 "MCP"）
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"obsidian_search","arguments":{"vault":"智能体学习","keyword":"MCP","limit":3}}}' | node D:\AAAagent\mcp-learn\obsidian-mcp-server.js

# 2. 直接读取某篇笔记
echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"obsidian_read","arguments":{"vault":"AAA算法设计","filename":"算法题单.md"}}}' | node D:\AAAagent\mcp-learn\obsidian-mcp-server.js

# 3. 列出某个笔记库的所有文件
echo '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"obsidian_list","arguments":{"vault":"操作系统"}}}' | node D:\AAAagent\mcp-learn\obsidian-mcp-server.js
```

### 实际运行结果（2026-04-30 实测）

**搜索 "算法"**：在 `AAA算法设计` 中找到 `算法题单.md`（文件名匹配），返回了完整内容，包含：
- 错排问题（递推公式 $f(n) = (n-1)[f(n-1) + f(n-2)]$）
- 动态规划、数塔、零钱兑换
- 二叉树、分治法（BFPRT、中位数）
- Python 递归深度限制提示

这意味着：**当你在面试中遇到算法问题，AI 可以直接调取你之前整理的做题笔记来帮你复习。**

### 如何扩展

在 `VAULT_PATHS` 对象中添加新笔记库：
```javascript
"408复习": "D:\\你的实际路径\\408复习"
```

添加新工具（修改 `TOOLS` 数组 + `executeTool()` 函数），比如：
- `obsidian_write`：向笔记追加内容
- `obsidian_create`：创建新笔记

---

## 八、自己扩展 Server 功能

在 `my-mcp-server.js` 中，工具定义在 `TOOLS` 数组，执行逻辑在 `executeTool()` 函数。

### 添加新工具示例

在 TOOLS 数组中添加：
```javascript
{
  name: "read_file",
  description: "读取文件内容",
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string", description: "文件路径" }
    },
    required: ["path"]
  }
}
```

在 `executeTool()` 中添加：
```javascript
if (name === "read_file") {
  const fs = require("fs");
  const content = fs.readFileSync(args.path, "utf8");
  return { content, length: content.length };
}
```

---

## 八、关键概念速查表

| 概念 | 说明 |
|------|------|
| **MCP Server** | 一个暴露工具能力的程序，通过 stdin/stdout 与 AI 通信 |
| **stdio transport** | 标准输入输出传输，Server 是子进程，消息走管道 |
| **HTTP transport** | Server 是 HTTP 服务，通过 POST/GET 通信 |
| **tools/list** | AI 查询可用工具列表 |
| **tools/call** | AI 让 Server 执行某个工具 |
| **JSON-RPC 2.0** | MCP 的底层协议格式 |
| **inputSchema** | 工具参数的定义（告诉 AI 怎么调用） |

---

## 九、关键概念速查表

| Server | 功能 | 命令 |
|--------|------|------|
| `github` | GitHub API 操作 | `npx -y @modelcontextprotocol/server-github` |
| `filesystem` | 文件读写 | `npx -y @modelcontextprotocol/server-filesystem` |
| `fetch` | HTTP 请求 | `npx -y @modelcontextprotocol/server-fetch` |
| `sqlite` | SQLite 数据库 | `npx -y @modelcontextprotocol/server-sqlite` |
| `puppeteer` | 浏览器自动化 | `npx -y @modelcontextprotocol/server-puppeteer` |

在 `.mcp.json` 中配置示例：
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "D:\\"]
    }
  }
}
```
