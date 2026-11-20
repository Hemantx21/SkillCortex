$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

Write-Host "Starting AJ model service on http://127.0.0.1:8001 ..."
Start-Process -FilePath python -ArgumentList "-m","uvicorn","ai.service.main:app","--host","127.0.0.1","--port","8001" -WorkingDirectory $root -WindowStyle Minimized

Start-Sleep -Seconds 15

Write-Host "Starting SkillCortex API on http://127.0.0.1:5000 ..."
Start-Process -FilePath node -ArgumentList "index.js" -WorkingDirectory (Join-Path $root "server") -WindowStyle Minimized

Start-Sleep -Seconds 8
Write-Host "AJ service health:"
try { (Invoke-WebRequest -Uri "http://127.0.0.1:8001/health" -UseBasicParsing).Content } catch { Write-Host "not ready yet" }
Write-Host "API health:"
try { (Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/health" -UseBasicParsing).Content } catch { Write-Host "not ready yet" }
Write-Host "Start the frontend with: cd client; npm run dev"