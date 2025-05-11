$installPath = "C:\Program Files\hapksz"

if (Test-Path $installPath) {
    Remove-Item -Path $installPath -Recurse -Force
    Write-Host "hapksz installation folder removed."
} else {
    Write-Host "hapksz installation folder not found."
}

$envPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
$paths = $envPath -split ';'
$newPaths = $paths | Where-Object { $_ -ne $installPath }

if ($newPaths.Length -ne $paths.Length) {
    $newPathString = [string]::Join(';', $newPaths)
    [Environment]::SetEnvironmentVariable("Path", $newPathString, "Machine")
    Write-Host "hapksz path removed from system PATH."
    Write-Host "Please restart your terminal or PC for changes to take effect."
} else {
    Write-Host "hapksz path not found in system PATH."
}
