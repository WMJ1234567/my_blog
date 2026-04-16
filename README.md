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

注意：该后端为示例用途，文件写入使用本地 `data/*.json`，适合个人使用或开发测试。
