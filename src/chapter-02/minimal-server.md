# 2.2 最简 Server 代码逐行解析

## 完整代码

```javascript
#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

// 1. 定义工具列表
const TOOLS = [
  {
    name: "calculate",
    description: "数学计算",
    inputSchema: {
      type: "object",
      properties: {
        a: { type: "number", description: "第一个数" },
        b: { type: "number", description: "第二个数" },
        op: { type: "string", description: "运算符 (+, -, *, /)" }
      },
      required: ["a", "b", "op"]
    }
  },
  {
    name: "get_time",
    description: "获取当前时间",
    inputSchema: { type: "object", properties: {} }
  }
];

// 2. 创建 Server 实例
const server = new Server(
  { name: "calc-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// 3. 注册工具列表处理器
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS
}));

// 4. 注册工具调用处理器
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "calculate") {
    const { a, b, op } = args;
    let result;
    switch (op) {
      case "+": result = a + b; break;
      case "-": result = a - b; break;
      case "*": result = a * b; break;
      case "/": result = b !== 0 ? a / b : "Error: 除数不能为0"; break;
      default: return { content: [{ type: "text", text: `未知运算符: ${op}` }] };
    }
    return { content: [{ type: "text", text: `${a} ${op} ${b} = ${result}` }] };
  }

  if (name === "get_time") {
    return { content: [{ type: "text", text: new Date().toLocaleString("zh-CN") }] };
  }

  return { content: [{ type: "text", text: `未知工具: ${name}` }] };
});

// 5. 启动 Server（连接 stdio）
const transport = new StdioServerTransport();
await server.connect(transport);
```

## 核心逻辑图

```
AI Client 发送 JSON-RPC 请求
     ↓ stdin
process.stdin 事件被 SDK 捕获
     ↓
Server.setRequestHandler 路由分发
     ↓
executeTool() 执行具体逻辑
     ↓
返回 JSON-RPC 响应对象
     ↓ stdout
AI Client 读取 stdout 得到结果
```

## 用官方 SDK vs 纯手写

上面用的是 `@modelcontextprotocol/sdk`，它是官方提供的封装库，帮你处理了：
- JSON-RPC 协议的解析和序列化
- stdin/stdout 的读写
- 错误处理和规范化

**纯手写版本**（不用 SDK）也可以，就是自己监听 `process.stdin`、解析 JSON、手动 `process.stdout.write()`。

官方 SDK 的优势是让你**专注于业务逻辑**，不用关心协议细节。
