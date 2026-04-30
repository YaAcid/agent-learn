# 3.2 完整源码解析

## 核心功能

这个 Server 提供了三个工具：

| 工具名 | 作用 | 为什么 LLM 自己做不到 |
|--------|------|---------------------|
| `obsidian_search` | 在笔记库中模糊搜索关键词 | LLM 没有本地文件访问权限 |
| `obsidian_read` | 读取指定笔记的完整内容 | 同上 |
| `obsidian_list` | 列出笔记库中的所有文件 | 同上 |

## 关键代码片段

### 工具定义

```javascript
const TOOLS = [
  {
    name: "obsidian_search",
    description: "在笔记库中搜索包含关键词的文档（模糊搜索文件名和内容）",
    inputSchema: {
      type: "object",
      properties: {
        vault: { type: "string", description: "笔记库名称" },
        keyword: { type: "string", description: "搜索关键词" },
        limit: { type: "number", description: "返回结果数量限制", default: 5 }
      },
      required: ["vault", "keyword"]
    }
  },
  // ... obsidian_read, obsidian_list 类似
];
```

### 笔记库路径配置

```javascript
const VAULT_PATHS = {
  "智能体学习": "D:\\Users\\zyx\\Documents\\Obisidian_notes\\智能体学习",
  "AAA算法设计": "D:\\Users\\zyx\\Documents\\Obisidian_notes\\AAA算法设计",
  "操作系统": "D:\\Users\\zyx\\Documents\\Obisidian_notes\\操作系统",
  // ... 更多笔记库
};
```

### 搜索实现

```javascript
function searchObsidian(vaultName, keyword, limit = 5) {
  const vaultPath = VAULT_PATHS[vaultName];
  if (!vaultPath) return { error: `笔记库 "${vaultName}" 未配置。可用库: ${Object.keys(VAULT_PATHS).join(", ")}` };

  const files = fs.readdirSync(vaultPath).filter(f => f.endsWith(".md"));
  const results = [];
  const kw = keyword.toLowerCase();

  for (const file of files) {
    // 1. 文件名匹配
    if (file.toLowerCase().includes(kw)) {
      results.push({ file, matchedIn: "文件名" });
      continue;
    }
    // 2. 文件内容匹配
    const content = fs.readFileSync(path.join(vaultPath, file), "utf8");
    const preview = findPreview(content, kw);
    if (preview) {
      results.push({ file, matchedIn: "文件内容", preview });
    }
  }
  return { results: results.slice(0, limit), total: results.length };
}
```

### 预览内容提取

```javascript
function findPreview(content, keyword) {
  const lines = content.split("\n");
  for (const line of lines) {
    if (line.toLowerCase().includes(keyword)) {
      return line.trim().substring(0, 150) + (line.length > 150 ? "..." : "");
    }
  }
  return null;
}
```
