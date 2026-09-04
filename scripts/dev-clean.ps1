<#
  Limpia caché de Next.js + Turbopack y reinicia dev server.
  Uso: node scripts/dev-clean.mjs
#>

$ErrorActionPreference = "Continue"

$port = 3000
$project = "C:\Users\MSI\Desktop\demo estudiantes"

# 1. Matar dev server
$conn = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
if ($conn) {
  $proc = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
  if ($proc) {
    Write-Host "🛑 Deteniendo dev server (PID $($proc.Id))" -ForegroundColor Yellow
    Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
  }
}

# 2. Limpiar cachés
Write-Host "🧹 Limpiando .next..." -ForegroundColor Cyan
Remove-Item -LiteralPath "$project\.next" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "🧹 Limpiando node_modules\.cache..." -ForegroundColor Cyan
Remove-Item -LiteralPath "$project\node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue

# 3. Reiniciar dev server
Write-Host "🚀 Iniciando dev server..." -ForegroundColor Green
Start-Process -FilePath "npm.cmd" -ArgumentList "run","dev" -WorkingDirectory $project -WindowStyle Normal
Write-Host ""
Write-Host "✅ Listo. Abre http://localhost:3000" -ForegroundColor Green
Write-Host "   Si necesitas parar: ve a la ventana del servidor o ejecuta:" -ForegroundColor DarkGray
Write-Host "   Get-NetTCPConnection -LocalPort 3000 | %{ Stop-Process -Id `$_.OwningProcess -Force }"
