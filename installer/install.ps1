$sourcePath = Resolve-Path ..\bin
$targetPath = "C:\Program Files\hapksz"

if (-Not (Test-Path $targetPath)) {
    New-Item -ItemType Directory -Path $targetPath -Force
}

Copy-Item -Path "$sourcePath\*" -Destination $targetPath -Recurse -Force

$envPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
if (-not $envPath.Contains($targetPath)) {
    $newPath = "$envPath;$targetPath"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")
    Write-Host "Path updated. You may need to restart your terminal."
} else {
    Write-Host "Path already contains hapksz directory."
}
