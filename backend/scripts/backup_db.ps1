<#
  Simple MongoDB backup script using mongodump.
  Usage: .\backup_db.ps1 -uri "mongodb+srv://..." -out "C:\backups"
#>
param(
  [string]$uri = $env:URL_MONGODB,
  [string]$out = "./backups"
)

if (-not (Get-Command mongodump -ErrorAction SilentlyContinue)) {
  Write-Error "mongodump not found. Install MongoDB Database Tools or run backup manually."
  exit 2
}

if (-not $uri) {
  Write-Error "MongoDB URI not provided. Set URL_MONGODB in env or pass -uri parameter."
  exit 2
}

$timestamp = (Get-Date).ToString('yyyyMMdd_HHmmss')
$dest = Join-Path -Path $out -ChildPath "dump_$timestamp"
New-Item -ItemType Directory -Path $dest -Force | Out-Null

mongodump --uri="$uri" --archive="${dest}\dump.archive" --gzip
if ($LASTEXITCODE -eq 0) { Write-Output "Backup saved to ${dest}\dump.archive" } else { Write-Error "mongodump failed"; exit 1 }
