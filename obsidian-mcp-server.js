#!/usr/bin/env node
/**
 * =====================================================
 * Obsidian MCP Server - 让 AI 直接读你的笔记
 *
 * 这个工具 LLM 自己做不到：访问你本地文件系统中的笔记
 * =====================================================
 */

const fs = require("fs");
const path = require("path");

// ── 工具定义 ──────────────────────────────────────────────
const TOOLS = [
  {
    name: "obsidian_search",
    description: "在笔记库中搜索包含关键词的文档（模糊搜索文件名和内容）",
    inputSchema: {
      type: "object",
      properties: {
        vault: {
          type: "string",
          description: "笔记库名称，如 '智能体学习'、'AAA算法设计'、'操作系统'",
        },
        keyword: {
          type: "string",
          description: "搜索关键词",
        },
        limit: {
          type: "number",
          description: "最多返回几条结果，默认5",
        },
      },
      required: ["vault", "keyword"],
    },
  },
  {
    name: "obsidian_read",
    description: "读取指定笔记的完整内容",
    inputSchema: {
      type: "object",
      properties: {
        vault: {
          type: "string",
          description: "笔记库名称",
        },
        filename: {
          type: "string",
          description: "笔记文件名（不含路径），如 '算法题单.md'",
        },
      },
      required: ["vault", "filename"],
    },
  },
  {
    name: "obsidian_list",
    description: "列出某个笔记库中的所有笔记文件",
    inputSchema: {
      type: "object",
      properties: {
        vault: {
          type: "string",
          description: "笔记库名称",
        },
      },
      required: ["vault"],
    },
  },
];

// ── 笔记库路径映射表（你电脑上的实际路径）─────────────────
const VAULT_PATHS = {
  "智能体学习": "D:\\Users\\zyx\\Documents\\Obisidian_notes\\智能体学习",
  "AAA算法设计": "D:\\Users\\zyx\\Documents\\Obisidian_notes\\AAA算法设计",
  "操作系统": "D:\\Users\\zyx\\Documents\\Obisidian_notes\\操作系统",
  "计算机网络": "D:\\Users\\zyx\\Documents\\Obisidian_notes\\计算机网络",
  "软件工程": "D:\\Users\\zyx\\Documents\\Obisidian_notes\\软件工程",
  "前端八股": "D:\\Users\\zyx\\Documents\\Obisidian_notes\\前端八股+项目知识点",
  "数据结构": "D:\\Users\\zyx\\Documents\\Obisidian_notes\\数据结构",
  "计组": "D:\\Users\\zyx\\Documents\\Obisidian_notes\\计组with_yzy",
};

// ── 工具执行逻辑 ──────────────────────────────────────────
function executeTool(name, args) {
  try {
    switch (name) {
      case "obsidian_list": {
        const vaultPath = getVaultPath(args.vault);
        const files = fs.readdirSync(vaultPath)
          .filter(f => f.endsWith(".md"))
          .map(f => {
            const stats = fs.statSync(path.join(vaultPath, f));
            return { name: f, size: stats.size, modified: stats.mtime.toISOString() };
          });
        return {
          vault: args.vault,
          vaultPath,
          total: files.length,
          files: files.slice(0, 20), // 最多返回20条
        };
      }

      case "obsidian_read": {
        const vaultPath = getVaultPath(args.vault);
        const filePath = path.join(vaultPath, args.filename);
        if (!fs.existsSync(filePath)) {
          return { error: `文件不存在: ${args.filename}` };
        }
        const content = fs.readFileSync(filePath, "utf8");
        const stats = fs.statSync(filePath);
        return {
          vault: args.vault,
          filename: args.filename,
          path: filePath,
          size: stats.size,
          modified: stats.mtime.toISOString(),
          lines: content.split("\n").length,
          content: content,
        };
      }

      case "obsidian_search": {
        const vaultPath = getVaultPath(args.vault);
        const keyword = args.keyword.toLowerCase();
        const limit = args.limit || 5;
        const files = fs.readdirSync(vaultPath).filter(f => f.endsWith(".md"));
        const results = [];

        for (const file of files) {
          const filePath = path.join(vaultPath, file);
          const content = fs.readFileSync(filePath, "utf8");
          const lines = content.split("\n");

          // 文件名匹配
          if (file.toLowerCase().includes(keyword)) {
            results.push({
              filename: file,
              matchType: "文件名匹配",
              snippet: content.substring(0, 200),
              score: 10,
            });
            continue;
          }

          // 内容匹配：找到包含关键词的行
          const matchedLines = lines
            .map((line, i) => ({ line: line.trim(), num: i + 1 }))
            .filter(({ line }) => line.toLowerCase().includes(keyword));

          if (matchedLines.length > 0) {
            const firstMatch = matchedLines[0];
            results.push({
              filename: file,
              matchType: `内容匹配（${matchedLines.length}处）`,
              matchLine: firstMatch.num,
              snippet: firstMatch.line.substring(0, 200),
              score: matchedLines.length,
            });
          }
        }

        // 按匹配分数排序
        results.sort((a, b) => b.score - a.score);
        return {
          vault: args.vault,
          keyword: args.keyword,
          totalMatches: results.length,
          results: results.slice(0, limit),
        };
      }

      default:
        return { error: `未知工具: ${name}` };
    }
  } catch (e) {
    return { error: e.message };
  }
}

function getVaultPath(vaultName) {
  const p = VAULT_PATHS[vaultName];
  if (!p) {
    throw new Error(`笔记库 "${vaultName}" 未配置。可用库: ${Object.keys(VAULT_PATHS).join(", ")}`);
  }
  if (!fs.existsSync(p)) {
    throw new Error(`笔记库路径不存在: ${p}`);
  }
  return p;
}

// ── MCP 消息处理核心（与上一个Server完全相同）────────────
process.stdin.setEncoding("utf8");
let buffer = "";

function handleRequest(msg) {
  const { id, method, params } = msg;
  process.stderr.write(`[Obsidian-MCP] << "${method}" id=${id}\n`);

  let result;

  switch (method) {
    case "initialize":
      result = {
        protocolVersion: "2024-11-05",
        serverInfo: { name: "obsidian-reader", version: "1.0.0" },
        capabilities: { tools: {} },
      };
      break;

    case "tools/list":
      result = { tools: TOOLS };
      break;

    case "tools/call": {
      const { name, arguments: args } = params;
      process.stderr.write(`[Obsidian-MCP] >> 执行: ${name}(${JSON.stringify(args)})\n`);
      try {
        result = { content: [{ type: "text", text: JSON.stringify(executeTool(name, args || {}), null, 2) }] };
      } catch (e) {
        result = { content: [{ type: "text", text: JSON.stringify({ error: e.message }) }] };
      }
      break;
    }

    default:
      result = {};
  }

  const response = { jsonrpc: "2.0", id, result };
  process.stdout.write(JSON.stringify(response) + "\n");
}

process.stdin.on("data", (chunk) => {
  buffer += chunk;
  const lines = buffer.split("\n");
  buffer = lines.pop();
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      handleRequest(JSON.parse(trimmed));
    } catch (e) {
      process.stderr.write(`[Obsidian-MCP] 解析失败: ${e.message}\n`);
    }
  }
});

process.stderr.write("[Obsidian-MCP] 已启动！笔记库: " + Object.keys(VAULT_PATHS).join(", ") + "\n");
process.stderr.write("[Obsidian-MCP] 提示: 现在 AI 可以直接搜索和读取你的 Obsidian 笔记了\n\n");
