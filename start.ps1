$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$index = Join-Path $scriptDir 'index.html'
if (Test-Path $index) { Start-Process -FilePath $index } else { Write-Error "未找到 index.html：$index" }
