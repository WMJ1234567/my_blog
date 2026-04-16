$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$out = Join-Path $scriptDir 'myblog.zip'
if (Test-Path $out) { Remove-Item $out -Force }
Compress-Archive -Path (Join-Path $scriptDir '*') -DestinationPath $out -Force
Write-Output "已生成：$out"
