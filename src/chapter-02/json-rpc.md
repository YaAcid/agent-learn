# 2.1 JSON-RPC 协议基础

## 什么是 JSON-RPC

JSON-RPC 是一个轻量级的**远程过程调用（RPC）协议**，所有数据用 JSON 格式表示。

## 三种消息类型

### 1. 请求（Request）

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}
```

| 字段 | 说明 |
|------|------|
| `jsonrpc` | 协议版本，固定为 `"2.0"` |
| `id` | 请求编号，用于匹配响应 |
| `method` | 要调用的方法名 |
| `params` | 方法参数 |

### 2. 响应（Response）

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "calculate",
        "description": "数学计算",
        "inputSchema": { ... }
      }
    ]
  }
}
```

### 3. 错误（Error）

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32600,
    "message": "Invalid Request"
  }
}
```

## MCP 的核心方法

| 方法 | 方向 | 说明 |
|------|------|------|
| `initialize` | Client → Server | 握手，建立连接 |
| `tools/list` | Client → Server | 查询可用工具列表 |
| `tools/call` | Client → Server | 调用某个工具 |
| `notifications/message` | Server → Client | 服务端推送消息（如日志） |
