<#
初始化本地 Git 仓库并（可选）使用 GitHub CLI 创建远程仓库并推送到 GitHub。
要求：已安装 `git` 与 `gh`（可选，若未安装 gh 则只会初始化本地仓库）。

用法（在 myblog 目录下运行）：
  .\init-and-deploy.ps1 -RepoName your-repo-name -Public

示例：
  .\init-and-deploy.ps1 -RepoName mytech-blog -Public
#>

param(
  [string]$RepoName,
  [switch]$Public
)

if (-not $RepoName) {
  $RepoName = Read-Host '输入 GitHub 仓库名（例如 mytech-blog）'
}

function Check-Command($name){
  $p = Get-Command $name -ErrorAction SilentlyContinue
  return $null -ne $p
}

if (-not (Check-Command git)){
  Write-Error '未检测到 git，请先安装 git 并重试。'
  exit 1
}

if (-not (Test-Path .git)){
  git init
  git checkout -b main
  git add .
  git commit -m 'Initial commit: blog scaffold'
  Write-Output '已初始化本地 git 仓库并提交。'
} else {
  Write-Output '本地已存在 .git，跳过 git init。'
}

if (Check-Command gh) {
  if ($Public.IsPresent) { $visibility = '--public' } else { $visibility = '--private' }
  Write-Output "正在使用 gh 创建仓库：$RepoName ($visibility) 并推送到 origin/main..."
  gh repo create $RepoName $visibility --source=. --remote=origin --push
  if ($LASTEXITCODE -eq 0) {
    Write-Output '远程仓库创建并已推送。你可以在 GitHub 上查看仓库。'
  } else {
    Write-Warning 'gh 命令执行失败，请检查 gh 安装并手动执行推送。'
  }
} else {
  Write-Warning "未检测到 GitHub CLI (gh)。已初始化本地仓库。`n请手动在 GitHub 上创建仓库，然后运行：`n  git remote add origin https://github.com/USERNAME/REPO.git`n  git push -u origin main"
}
