# 检查常见 Node 安装位置并临时加入 PATH，随后安装依赖并启动服务
$nodePaths = @('C:\Program Files\nodejs', "$env:LOCALAPPDATA\\Programs\\nodejs")
$found = $false
foreach ($p in $nodePaths) {
  $nodeExe = Join-Path $p 'node.exe'
  if (Test-Path $nodeExe) {
    $env:Path = $p + ';' + $env:Path
    Write-Host "Found node at: $nodeExe"
    $found = $true
    break
  }
}
if (-not $found) {
  Write-Host 'Node.js not found in common locations. Please install Node.js (includes npm).'
  Write-Host 'Example:'
  Write-Host '  winget install OpenJS.NodeJS.LTS'
  Read-Host 'Press Enter to exit'
  exit 1
}

Set-Location -Path 'd:\\vscode_my\\myblog'
Write-Host '正在安装依赖（npm install）...'
try {
  npm install
} catch {
  Write-Host 'npm install failed:' $_.Exception.Message
  Read-Host 'Press Enter to exit'
  exit 1
}

Write-Host '安装完成，启动服务器（npm start）...'
try {
  npm start
} catch {
  Write-Host 'npm start failed:' $_.Exception.Message
  Read-Host 'Press Enter to exit'
  exit 1
}
