# 3.3 预配置的笔记库与实测结果

## 预配置的笔记库

```javascript
const VAULT_PATHS = {
  "智能体学习": "D:\\Users\\zyx\\Documents\\Obisidian_notes\\智能体学习",
  "AAA算法设计": "D:\\Users\\zyx\\Documents\\Obisidian_notes\\AAA算法设计",
  "操作系统": "D:\\Users\\zyx\\Documents\\Obisidian_notes\\操作系统",
  "计算机网络": "D:\\Users\\zyx\\Documents\\Obisidian_notes\\计算机网络",
  "软件工程": "D:\\Users\\zyx\\Documents\\Obisidian_notes\\软件工程",
  "前端八股": "D:\\Users\\zx\\Documents\\Obisidian_notes\\前端八股+项目知识点",
  "数据结构": "D:\\Users\\zyx\\Documents\\Obisidian_notes\\数据结构",
  "计组": "D:\\Users\\zyx\\Documents\\Obisidian_notes\\计组with_yzy"
};
```

## 实测命令和结果

### 搜索 "算法" 在 AAA算法设计 笔记库

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"obsidian_search","arguments":{"vault":"AAA算法设计","keyword":"算法","limit":3}}}' | node obsidian-mcp-server.js
```

**结果**：找到 `算法题单.md`（文件名匹配），返回完整内容。

### 读取算法题单.md

```bash
echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"obsidian_read","arguments":{"vault":"AAA算法设计","filename":"算法题单.md"}}}' | node obsidian-mcp-server.js
```

**返回内容摘要**：
- 错排问题：递推公式 $f(n) = (n-1)[f(n-1) + f(n-2)]$
- 动态规划：数塔、零钱兑换
- 二叉树：遍历、重建
- 分治法：BFPRT、中位数
- Python 递归深度限制提示

### 列出操作系统笔记库

```bash
echo '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"obsidian_list","arguments":{"vault":"操作系统"}}}' | node obsidian-mcp-server.js
```

**结果**：返回该笔记库中所有 `.md` 文件列表。
