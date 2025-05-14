# build_cpp.ps1
param (
    [string]$InputFile,
    [string]$OutputExe = "output.exe",
    [string]$IconPath = ".\assets\hapksz_icon.ico"
)

# Check for g++ or cl.exe
$gpp = Get-Command g++ -ErrorAction SilentlyContinue
$cl = Get-Command cl -ErrorAction SilentlyContinue

if ($gpp) {
    Write-Host "Using g++ compiler."
    $compileArgs = @('-static', '-O2', '-Wall', $InputFile, '-o', $OutputExe)
    & g++ @compileArgs
    if ($LASTEXITCODE -ne 0) {
        Write-Error "g++ compilation failed."
        exit 1
    }
} elseif ($cl) {
    Write-Host "Using MSVC cl compiler."
    # Adjust paths and flags as needed for cl.exe
    & cl $InputFile /Fe:$OutputExe /MT /O2
    if ($LASTEXITCODE -ne 0) {
        Write-Error "cl.exe compilation failed."
        exit 1
    }
} else {
    Write-Error "No suitable C++ compiler found (g++ or cl.exe)."
    exit 1
}

# Apply icon using rcedit if available
$rcedit = Get-Command rcedit.exe -ErrorAction SilentlyContinue
if ($rcedit) {
    & rcedit.exe $OutputExe --set-icon $IconPath
    Write-Host "Icon applied to executable."
} else {
    Write-Warning "rcedit.exe not found. Icon not applied."
}

Write-Host "C++ executable generated at $OutputExe"
