$installPath = "C:\Program Files\hapksz"

if (-Not (Test-Path $installPath)) {
    Write-Host "Installation folder not found: $installPath"
    exit 1
}

$envPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
if (-Not ($envPath -split ';' | Where-Object { $_ -eq $installPath })) {
    $newPath = "$envPath;$installPath"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")
    Write-Host "hapksz path added to system PATH."
    Write-Host "Please restart your terminal or PC for changes to take effect."
} else {
    Write-Host "hapksz path is already in system PATH."
}
