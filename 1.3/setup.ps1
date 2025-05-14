# setup.ps1 - Script para preparar entorno y dependencias

Write-Host "Instalando dependencias Node.js..."
npm install

# Verificar Python
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Warning "Python no está instalado o no está en PATH. Instálalo para usar el convertidor Python."
} else {
    Write-Host "Python detectado."
}

# Verificar PyInstaller
try {
    python -m PyInstaller --version > $null 2>&1
    Write-Host "PyInstaller detectado."
} catch {
    Write-Warning "PyInstaller no está instalado. Instálalo con 'pip install pyinstaller'."
}

# Verificar .NET SDK
if (-not (Get-Command dotnet -ErrorAction SilentlyContinue)) {
    Write-Warning ".NET SDK no está instalado o no está en PATH. Instálalo para usar el convertidor C#."
} else {
    Write-Host ".NET SDK detectado."
}

# Verificar g++ (MinGW)
if (-not (Get-Command g++ -ErrorAction SilentlyContinue)) {
    Write-Warning "g++ no está instalado o no está en PATH. Instálalo para usar el convertidor C++."
} else {
    Write-Host "g++ detectado."
}

# Verificar rcedit para iconos
if (-not (Get-Command rcedit.exe -ErrorAction SilentlyContinue)) {
    Write-Warning "rcedit no está instalado o no está en PATH. El icono no se aplicará en C++."
} else {
    Write-Host "rcedit detectado."
}

Write-Host "Configuración completada. Ahora puedes ejecutar hapksz."
