# 3.4 如何扩展新工具

## 添加新笔记库

在 `VAULT_PATHS` 对象中添加一行：

```javascript
"408复习": "D:\\你的实际路径\\408复习"
```

## 添加新工具

### 步骤1：在 TOOLS 数组中添加定义

```javascript
{
  name: "obsidian_write",
  description: "向笔记追加内容",
  inputSchema: {
    type: "object",
    properties: {
      vault: { type: "string", description: "笔记库名称" },
      filename: { type: "string", description: "文件名" },
      content: { type: "string", description: "追加的内容" }
    },
    required: ["vault", "filename", "content"]
  }
}
```

### 步骤2：在 executeTool() 中添加处理逻辑

```javascript
if (name === "obsidian_write") {
  const { vault, filename, content } = args;
  const vaultPath = VAULT_PATHS[vault];
  if (!vaultPath) {
    return { content: [{ type: "text", text: `笔记库 "${vault}" 未配置` }] };
  }
  const filePath = path.join(vaultPath, filename);
  fs.appendFileSync(filePath, content + "\n", "utf8");
  return { content: [{ type: "text", text: `已追加到 ${filename}` }] };
}
```

## 调试建议

用 MCP Inspector 来测试新工具：
1. 在 Inspector 界面中填参数
2. 点 "Run" 观察请求和响应
3. 查看 "Server Notifications" 中的 stderr 日志
