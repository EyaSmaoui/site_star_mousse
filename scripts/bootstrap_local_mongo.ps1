$ErrorActionPreference = 'Stop'

$mongoRoot = 'C:\mongodb'
$downloadUrl = 'https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.14.zip'
$zipPath = Join-Path $mongoRoot 'mongodb.zip'
$extractRoot = Join-Path $mongoRoot 'extract'
$dataDir = 'C:\data\db'
$logPath = 'C:\data\mongod.log'

New-Item -ItemType Directory -Force -Path $mongoRoot, $dataDir | Out-Null

function Get-MongoBinary {
    $candidate = Get-ChildItem -Path $extractRoot -Recurse -Filter 'mongod.exe' -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($candidate) { return $candidate.FullName }
    return $null
}

if (-not (Test-Path $zipPath) -or ((Get-Item $zipPath -ErrorAction SilentlyContinue).Length -lt 100MB)) {
    Write-Host 'Téléchargement de MongoDB Community Server...'
    Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath
}

if (-not (Test-Path $extractRoot)) {
    Write-Host 'Extraction de MongoDB...'
    Expand-Archive -Path $zipPath -DestinationPath $extractRoot -Force
}

$mongod = Get-MongoBinary
if (-not $mongod) {
    throw 'mongod.exe introuvable après extraction. Vérifiez la connexion et réessayez.'
}

$mongodRunning = Get-Process -Name 'mongod' -ErrorAction SilentlyContinue
if (-not $mongodRunning) {
    Write-Host 'Démarrage de MongoDB local...'
    Start-Process -FilePath $mongod -ArgumentList @(
        '--dbpath', $dataDir,
        '--logpath', $logPath,
        '--logappend',
        '--bind_ip', '127.0.0.1',
        '--port', '27017'
    ) -WindowStyle Hidden
}

$ready = $false
for ($i = 0; $i -lt 40; $i++) {
    try {
        $conn = Test-NetConnection -ComputerName 127.0.0.1 -Port 27017 -WarningAction SilentlyContinue
        if ($conn.TcpTestSucceeded) {
            $ready = $true
            break
        }
    } catch {}
    Start-Sleep -Seconds 1
}

if (-not $ready) {
    throw 'MongoDB n’a pas démarré dans le délai attendu.'
}

Write-Host 'MongoDB local prêt sur mongodb://127.0.0.1:27017'
