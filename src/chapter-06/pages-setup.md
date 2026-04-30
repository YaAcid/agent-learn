# 6.3 GitHub Pages 开启步骤

## 步骤1：设置仓库 Pages

在 GitHub 仓库页面：
1. 进入 **Settings** → **Pages**
2. **Source** 选择 **GitHub Actions**
3. （不再需要选择分支，因为工作流会自动处理）

## 步骤2：确保 workflow 文件存在

确认 `.github/workflows/deploy.yml` 已推送到 `main` 分支。推送后，Actions 会自动运行。

## 步骤3：查看部署状态

1. 进入仓库 **Actions** 页面
2. 可以看到 "Deploy MDBook to GitHub Pages" 工作流正在运行
3. 完成后，Pages URL 会显示在 **Settings → Pages** 页面

## 你的站点地址

```
https://YaAcid.github.io/agent-learn/
```

## 日常维护

**更新内容**：
1. 修改 `src/` 下的 `.md` 文件
2. `git add . && git commit -m "更新章节X"`
3. `git push`
4. GitHub Actions 自动构建并部署（1-2分钟）

**本地预览**（可选）：
```bash
# 下载 mdbook
# 构建并预览
mdbook build --open
```
