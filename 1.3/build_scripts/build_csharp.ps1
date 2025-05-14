# build_csharp.ps1
param (
    [string]$InputFile,
    [string]$OutputExe = "output.exe",
    [string]$IconPath = ".\assets\hapksz_icon.ico"
)

if (-not (Get-Command dotnet -ErrorAction SilentlyContinue)) {
    Write-Error "dotnet SDK is not installed or not in PATH."
    exit 1
}

# Create temporary project folder
$tempDir = Join-Path -Path $PSScriptRoot -ChildPath "temp_csharp"
if (Test-Path $tempDir) { Remove-Item -Recurse -Force $tempDir }
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copy and clean source file
$cleanFile = Join-Path $tempDir "Program.cs"
Get-Content $InputFile | Where-Object { $_ -notmatch '^\s*//|^\s*#' } | Set-Content $cleanFile

# Create minimal .csproj file
$exeName = [IO.Path]::GetFileNameWithoutExtension($OutputExe)
$csprojContent = @"
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net7.0</TargetFramework>
    <RuntimeIdentifier>win-x64</RuntimeIdentifier>
    <SelfContained>true</SelfContained>
    <PublishSingleFile>true</PublishSingleFile>
    <AssemblyName>$exeName</AssemblyName>
    <ApplicationIcon>$IconPath</ApplicationIcon>
  </PropertyGroup>
</Project>
"@

$csprojPath = Join-Path $tempDir "hapksz_temp.csproj"
$csprojContent | Set-Content $csprojPath

# Publish project
dotnet publish $csprojPath -c Release -r win-x64 --self-contained true -o "$tempDir\publish"

# Move exe to output
$publishedExe = Join-Path "$tempDir\publish" "$exeName.exe"
if (Test-Path $publishedExe) {
    Move-Item $publishedExe $OutputExe -Force
    Write-Host "C# executable generated at $OutputExe"
} else {
    Write-Error "Failed to generate C# executable."
    exit 1
}

# Cleanup
Remove-Item -Recurse -Force $tempDir
