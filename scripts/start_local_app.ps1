$ErrorActionPreference = 'Stop'

$projectRoot = 'C:\site_star_mousse'

$bootstrap = Join-Path $projectRoot 'scripts\bootstrap_local_mongo.ps1'
if (Test-Path $bootstrap) {
    & $bootstrap
}

Push-Location $projectRoot
$env:MONGODB_FALLBACK_URI = 'mongodb://127.0.0.1:27017/site_star_mousse'
$env:ALLOW_NO_DB = 'true'

Write-Host 'Démarrage du backend et du frontend...'
Start-Process -FilePath 'npm' -ArgumentList 'run','dev' -WorkingDirectory $projectRoot -WindowStyle Normal

Start-Sleep -Seconds 5
Write-Host 'Le projet a été lancé.'
Write-Host 'API: http://localhost:5000'
Write-Host 'Frontend: http://localhost:5173'
Pop-Location
