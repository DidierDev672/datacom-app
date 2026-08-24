# Fija el contexto de build en datacom-app (evita error "package.json not found")
Set-Location $PSScriptRoot

Write-Host "Build frontend desde: $PWD"
docker compose build --no-cache frontend

if ($LASTEXITCODE -eq 0) {
    Write-Host "OK. Levantar solo frontend: docker compose up -d"
    Write-Host "Stack completo (requiere ../datacom-backend): docker compose -f docker-compose.full.yml up -d --build"
}
