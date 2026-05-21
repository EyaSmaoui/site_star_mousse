param(
  [string]$email = 'yassine@starmousse.tn',
  [string]$password = 'Manager123'
)
try {
  $body = @{ email = $email; password = $password } | ConvertTo-Json
  $login = Invoke-RestMethod -Uri 'http://localhost:3000/api/users/login' -Method Post -ContentType 'application/json' -Body $body -ErrorAction Stop
  Write-Host "LOGIN RESPONSE:`n" ($login | ConvertTo-Json -Depth 5)
} catch {
  Write-Host "ERROR:`n" $_.Exception.Message
}
