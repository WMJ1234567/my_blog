# MyTech 博客模板

这是一个轻量静态博客骨架（暗色、科技感），包含：

- `index.html`：首页
- `resume.html`：简历页（占位）
- `bookmarks.html`：收藏页
- `css/styles.css`：样式
- `js/script.js`：交互脚本
- `icons/`：SVG 图标

预览（PowerShell）：

```powershell
cd d:\\vscode_my\\myblog
.\start.ps1
```

打包为 zip：

```powershell
cd d:\\vscode_my\\myblog
.\package.ps1
```

部署建议：

- 快速：把仓库推到 GitHub，启用 GitHub Pages（`main` 分支，Root 或 `docs/`）。
- 更专业：使用 `gh-pages` 分支或 Netlify / Vercel 做自动部署。

需要我帮你把这个目录初始化为 Git 仓库并生成 GitHub Pages 的部署脚本/步骤吗？

自动初始化与部署脚本：

- `init-and-deploy.ps1` — 在本地初始化 git，并（若安装 `gh`）使用 GitHub CLI 创建仓库并推送到 GitHub。
- `.github/workflows/deploy.yml` — GitHub Actions 工作流：当你把代码推送到 `main` 分支时，自动部署到 GitHub Pages。

使用示例（PowerShell，已在 `myblog` 目录）：

```powershell
# 初始化并在 GitHub 上创建远端仓库（需要 gh）
.\init-and-deploy.ps1 -RepoName mytech-blog -Public

# 或者手动：
git init
git add .
git commit -m "Initial commit"
# 在 GitHub 创建仓库后：
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

注意：GitHub Actions 工作流依赖 `main` 分支触发，请确保你的默认分支为 `main` 并已推送到 GitHub。若想改为 `gh-pages` 或其他部署方式，我可以帮你调整工作流。

本地后端（可选）
-----------------

项目包含一个简易 Node.js 后端（用于演示 API）：

- `server.js`：Express 服务，提供 `/api/resume` 和 `/api/bookmarks`（GET/POST/DELETE），并托管静态文件。
- `data/resume.json`、`data/bookmarks.json`：示例数据。

本地运行方法（需已安装 Node.js）：

```powershell
cd d:\\vscode_my\\myblog
npm install
npm start
# 然后访问 http://localhost:3000
```

API 示例：

- `GET /api/resume` — 返回 JSON 简历
- `GET /api/bookmarks` — 返回收藏列表
- `POST /api/bookmarks` — 添加收藏（JSON body: {"title":"...","url":"..."}）

注意：该后端为示例用途，文件写入使用本地 `data/*.json`，适合个人使用或开发测试。如需生产部署或数据库支持，我可以帮你改造为更安全的实现。

