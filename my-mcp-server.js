#!/usr/bin/env node
/**
 * =====================================================
 * 最简单的 MCP Server - 用于学习 MCP 原理
 * 
 * MCP 协议通信方式：stdin/stdout (stdio transport)
 * AI Client 把 JSON 消息写入这个进程的 stdin
 * 这个进程把响应写入 stdout
 * =====================================================
 */

process.stdin.setEncoding("utf8");

// ── 工具定义：这是我们要"暴露给AI"的能力 ─────────────────
const TOOLS = [
  {
    name: "calculate",
    description: "执行简单的数学运算（加减乘除）",
    inputSchema: {
      type: "object",
      properties: {
        a: { type: "number", description: "第一个数字" },
        b: { type: "number", description: "第二个数字" },
        op: {
          type: "string",
          enum: ["add", "sub", "mul", "div"],
          description: "运算符: add加 / sub减 / mul乘 / div除",
        },
      },
      required: ["a", "b", "op"],
    },
  },
  {
    name: "get_time",
    description: "返回当前系统时间",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

// ── 工具执行逻辑 ──────────────────────────────────────────
function executeTool(name, args) {
  if (name === "calculate") {
    const { a, b, op } = args;
    let result;
    switch (op) {
      case "add": result = a + b; break;
      case "sub": result = a - b; break;
      case "mul": result = a * b; break;
      case "div":
        if (b === 0) return { error: "除数不能为0" };
        result = a / b;
        break;
      default: return { error: "未知运算符" };
    }
    return { result, expression: `${a} ${op} ${b} = ${result}` };
  }

  if (name === "get_time") {
    const now = new Date();
    return {
      iso: now.toISOString(),
      local: now.toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" }),
    };
  }

  return { error: `工具 "${name}" 不存在` };
}

// ── MCP 消息处理核心 ──────────────────────────────────────
function handleRequest(msg) {
  const { id, method, params } = msg;

  // 【关键日志】打印每一条收到的请求，方便你观察调用
  process.stderr.write(`[MCP-SERVER] << 收到请求: method="${method}" id=${id}\n`);
  process.stderr.write(`[MCP-SERVER]    params: ${JSON.stringify(params)}\n`);

  let result;

  switch (method) {
    // 1. 握手：AI 启动时发的第一条消息
    case "initialize":
      result = {
        protocolVersion: "2024-11-05",
        serverInfo: { name: "my-learn-server", version: "1.0.0" },
        capabilities: { tools: {} },
      };
      break;

    // 2. 查询工具列表
    case "tools/list":
      result = { tools: TOOLS };
      break;

    // 3. 执行工具
    case "tools/call": {
      const { name, arguments: args } = params;
      process.stderr.write(`[MCP-SERVER] >> 执行工具: ${name}(${JSON.stringify(args)})\n`);
      const toolResult = executeTool(name, args || {});
      result = {
        content: [{ type: "text", text: JSON.stringify(toolResult, null, 2) }],
      };
      break;
    }

    // 4. 其他未实现的方法
    default:
      result = {};
  }

  // 构造 JSON-RPC 响应并写到 stdout（这就是返回给AI的答案）
  const response = { jsonrpc: "2.0", id, result };
  const responseStr = JSON.stringify(response);

  process.stderr.write(`[MCP-SERVER] >> 响应: ${responseStr}\n\n`);

  // MCP stdio 协议：每条消息用换行分隔
  process.stdout.write(responseStr + "\n");
}

// ── 启动：监听 stdin ──────────────────────────────────────
let buffer = "";

process.stdin.on("data", (chunk) => {
  buffer += chunk;
  // MCP 消息以换行符分隔
  const lines = buffer.split("\n");
  buffer = lines.pop(); // 最后一行可能不完整，留到下次
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const msg = JSON.parse(trimmed);
      handleRequest(msg);
    } catch (e) {
      process.stderr.write(`[MCP-SERVER] JSON解析失败: ${e.message}\n`);
    }
  }
});

process.stderr.write("[MCP-SERVER] 已启动！等待来自 AI Client 的 JSON-RPC 消息...\n");
process.stderr.write("[MCP-SERVER] 提示: 请求走 stdin, 响应走 stdout, 日志走 stderr\n\n");
