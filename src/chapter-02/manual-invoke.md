# 2.3 手动触发调用：看真实协议消息

## 用 echo 模拟 AI Client

MCP Server 通过 stdin/stdout 通信，所以可以用 `echo` 直接发 JSON-RPC 消息：

```bash
# 方法1：initialize 握手
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","clientInfo":{"name":"test","version":"1"}}}' | node my-mcp-server.js

# 方法2：tools/list 查询工具
echo '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' | node my-mcp-server.js

# 方法3：tools/call 调用计算工具
echo '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"calculate","arguments":{"a":100,"b":30,"op":"sub"}}}' | node my-mcp-server.js
```

## 实际运行结果

**tools/list 的响应：**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "tools": [
      {
        "name": "calculate",
        "description": "数学计算",
        "inputSchema": { "type": "object", ... }
      },
      {
        "name": "get_time",
        "description": "获取当前时间",
        "inputSchema": { "type": "object", "properties": {} }
      }
    ]
  }
}
```

**tools/call (100 - 30) 的响应：**
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "100 - 30 = 70"
      }
    ]
  }
}
```

## stderr 和 stdout 的区别

| 流 | 用途 | 示例 |
|----|------|------|
| `stdout` | JSON-RPC 响应（返回给 AI） | `{"jsonrpc":"2.0","id":1,...}` |
| `stderr` | 调试日志（不进入协议） | `console.error()` 的输出 |

在 Inspector 中，stderr 的内容会被捕获并显示在 "Server Notifications" 区域。
