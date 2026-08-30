param(
    [string]$email = 'yassine@starmousse.tn',
    [string]$password = 'Manager123'
)

$ErrorActionPreference = 'Stop'
$payload = @{ email = $email; password = $password } | ConvertTo-Json -Compress

try {
    $response = Invoke-RestMethod -Uri 'http://localhost:5000/api/users/login' -Method Post -ContentType 'application/json' -Body $payload
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Error $_.Exception.Message
    exit 1
}
