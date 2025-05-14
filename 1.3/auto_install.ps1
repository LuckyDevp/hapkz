# auto_install.ps1
# Automated installer for hapksz dependencies and tools on Windows using winget and pip

Write-Host "Starting automatic installation of hapksz dependencies..." -ForegroundColor Cyan

# Function to check if a command exists
function CommandExists($cmd) {
    return (Get-Command $cmd -ErrorAction SilentlyContinue) -ne $null
}

# Function to install app with winget if available
function InstallWithWinget($appId, $friendlyName) {
    Write-Host "Installing $friendlyName via winget..."
    winget install --id $appId --accept-source-agreements --accept-package-agreements -e
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Failed to install $friendlyName via winget."
    } else {
        Write-Host "$friendlyName installed successfully."
    }
}

# Check for winget
if (-not (CommandExists "winget")) {
    Write-Warning "winget (Windows Package Manager) is not installed or not in PATH. Please install it manually from Microsoft Store."
    exit 1
}

# 1. Install Node.js if missing
if (-not (CommandExists "node")) {
    InstallWithWinget "OpenJS.NodeJS.LTS" "Node.js LTS"
} else {
    Write-Host "Node.js is already installed."
}

# 2. Install Python if missing
if (-not (CommandExists "python")) {
    InstallWithWinget "Python.Python.3" "Python 3"
} else {
    Write-Host "Python is already installed."
}

# 3. Install .NET SDK if missing
if (-not (CommandExists "dotnet")) {
    InstallWithWinget "Microsoft.DotNet.SDK.7" ".NET SDK 7"
} else {
    Write-Host ".NET SDK is already installed."
}

# 4. Install MinGW (g++) if missing
if (-not (CommandExists "g++")) {
    InstallWithWinget "GnuWin32.GnuWin32" "MinGW (g++)"
} else {
    Write-Host "g++ compiler is already installed."
}

# 5. Install rcedit if missing (for icon editing)
if (-not (CommandExists "rcedit.exe")) {
    Write-Host "Installing rcedit..."
    $rceditUrl = "https://github.com/electron/rcedit/releases/download/v1.1.1/rcedit-x64.exe"
    $rceditPath = "$env:USERPROFILE\AppData\Local\rcedit.exe"
    Invoke-WebRequest -Uri $rceditUrl -OutFile $rceditPath
    # Add rcedit folder to PATH temporarily for current session
    $env:PATH += ";$env:USERPROFILE\AppData\Local"
    Write-Host "rcedit downloaded to $rceditPath"
} else {
    Write-Host "rcedit is already installed."
}

# 6. Install PyInstaller via pip if missing
try {
    python -m PyInstaller --version > $null 2>&1
    Write-Host "PyInstaller is already installed."
} catch {
    Write-Host "Installing PyInstaller via pip..."
    python -m pip install --upgrade pip
    python -m pip install pyinstaller
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Failed to install PyInstaller via pip."
    } else {
        Write-Host "PyInstaller installed successfully."
    }
}

# 7. Install Node.js dependencies
Write-Host "Installing Node.js dependencies (npm install)..."
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Warning "npm install failed. Please check your Node.js and npm installation."
} else {
    Write-Host "Node.js dependencies installed successfully."
}

Write-Host "All installations complete. You can now run hapksz." -ForegroundColor Green
