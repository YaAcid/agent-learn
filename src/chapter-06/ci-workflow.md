# 6.2 CI 工作流配置

## GitHub Actions 工作流文件

放在 `.github/workflows/deploy.yml`：

```yaml
name: Deploy MDBook to GitHub Pages

on:
  push:
    branches:
      - main  # 当 main 分支有新提交时触发
  workflow_dispatch:  # 允许手动触发

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Setup MDBook
        run: |
          curl -L https://github.com/h奈落/mdbook/releases/download/v0.1.5/mdbook-v0.1.5-x86_64-pc-windows-msvc.zip \
            -o mdbook.zip
          unzip mdbook.zip
          chmod +x mdbook

      - name: Build
        run: ./mdbook build

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: book/
          retention-days: 1

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 工作流执行流程

```
push 到 main 分支
     ↓
actions/checkout@v4（克隆代码）
     ↓
actions/configure-pages@v5（配置 Pages）
     ↓
下载并解压 mdbook 二进制
     ↓
mdbook build（构建书籍，输出到 book/）
     ↓
actions/upload-pages-artifact@v3（上传构建产物）
     ↓
actions/deploy-pages@v4（部署到 GitHub Pages）
     ↓
网站上线 → https://YaAcid.github.io/agent-learn/
```

## 关键配置说明

| 配置 | 说明 |
|------|------|
| `permissions` | GitHub Actions 需要读写 Pages 的权限 |
| `concurrency` | 防止多次 push 时部署冲突 |
| `retention-days: 1` | 减少存储空间使用 |
| `workflow_dispatch` | 允许手动在 GitHub 网页上触发部署 |
