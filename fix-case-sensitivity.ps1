# PowerShell script to fix case sensitivity issues
# Run this script in PowerShell: .\fix-case-sensitivity.ps1

Write-Host "Clearing Next.js cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "Cleared .next folder" -ForegroundColor Green
}

Write-Host "Clearing node_modules cache..." -ForegroundColor Yellow
if (Test-Path "node_modules\.cache") {
    Remove-Item -Recurse -Force "node_modules\.cache"
    Write-Host "Cleared node_modules cache" -ForegroundColor Green
}

Write-Host "Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force
Write-Host "Cleared npm cache" -ForegroundColor Green

Write-Host ""
Write-Host "Please verify your project path uses consistent casing:" -ForegroundColor Cyan
Write-Host "Current path: $PWD" -ForegroundColor White
Write-Host ""
Write-Host "If your path has mixed casing (e.g., Documents vs documents), consider:" -ForegroundColor Yellow
Write-Host "1. Moving project to a simpler path like C:\projects\morva-hr" -ForegroundColor White
Write-Host "2. Or ensure all references use the same casing" -ForegroundColor White

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Close your IDE/editor" -ForegroundColor White
Write-Host "2. Reopen the project" -ForegroundColor White
Write-Host "3. Run: npm install" -ForegroundColor White
Write-Host "4. Run: npm run dev" -ForegroundColor White

