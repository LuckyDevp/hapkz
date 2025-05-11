[Setup]
AppName=hapksz
AppVersion=1.0
DefaultDirName={pf}\hapksz
DefaultGroupName=hapksz
OutputBaseFilename=hapksz_installer
Compression=lzma
SolidCompression=yes

[Files]
Source: "..\bin\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs

[Icons]
Name: "{group}\hapksz"; Filename: "{app}\hapksz.js"

[Run]
Filename: "powershell.exe"; Parameters: "-NoProfile -ExecutionPolicy Bypass -File ""{app}\add_path.ps1"""; Flags: runhidden
