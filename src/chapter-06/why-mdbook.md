# 6.1 为什么选择 MDBook + GitHub Pages

## 方案对比

| | MDBook + GitHub Pages | 纯 GitHub Pages（手动HTML） | Docsify |
|---|---|---|---|
| 成品颜值 | 🌟🌟🌟🌟🌟 专业电子书感 | 🌟🌟 原始markdown | 🌟🌟🌟 简洁博客风 |
| 安装难度 | 装一个二进制工具 | 零 | 需要 Node.js |
| 维护成本 | 写完 md 后 `mdbook build` | 每次手写 HTML/CSS | 写 md 即可 |
| 搜索功能 | 内置全文搜索 | 需额外配置 | 内置 |
| 导航 | 自动生成侧边栏 | 手动写 | 半自动 |
| **适合场景** | **系统化学习笔记** | 简单文档 | API 文档 |

## MDBook 的优势

1. **Rust 官方文档风格**：侧边栏导航 + 代码高亮 + 全文搜索 + 主题切换
2. **零依赖构建**：GitHub Actions 直接下载二进制，不依赖 Node.js 环境
3. **纯静态输出**：生成的 `_book/` 目录可以直接托管，无需服务器
4. **GitHub 原生支持**：官方提供了 CI 模板

## 为什么不用 Docsify

Docsify 需要 Node.js 环境，在 GitHub Actions 中需要 `npm install -g docsify-cli`，多一步构建依赖。MDBook 用预编译的二进制，下载即用，更简洁。
