# build_python.ps1
param (
    [string]$InputFile,
    [string]$OutputExe = "output.exe",
    [string]$IconPath = ".\assets\hapksz_icon.ico"
)

if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Error "Python is not installed or not in PATH."
    exit 1
}

if (-not (Get-Command pyinstaller -ErrorAction SilentlyContinue)) {
    Write-Error "PyInstaller is not installed. Install it with 'pip install pyinstaller'."
    exit 1
}

Write-Host "Building Python executable from $InputFile..."

# Run PyInstaller with --onefile, --noconsole, and icon options
pyinstaller --onefile --noconsole --icon="$IconPath" --name=([IO.Path]::GetFileNameWithoutExtension($OutputExe)) --clean $InputFile

# Move the exe from dist folder to output location
$distExe = Join-Path -Path "dist" -ChildPath ([IO.Path]::GetFileName($OutputExe))
if (Test-Path $distExe) {
    Move-Item -Path $distExe -Destination $OutputExe -Force
    Write-Host "Executable generated at $OutputExe"
} else {
    Write-Error "Failed to find generated executable."
    exit 1
}

# Clean build folders
Remove-Item -Recurse -Force build dist *.spec
