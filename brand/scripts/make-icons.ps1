$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

# Generates the OxeeOffice app icon set into brand/assets/build/ from the master
# brand/assets/icon.png (upstream's glyph, white on the Oxeegen purple
# gradient). Windows-only (GDI+); outputs are committed, so this only needs
# re-running when the master changes:
#
#   powershell -File brand\scripts\make-icons.ps1
#
# File-type icons (.docx, .xlsx, .pptx, .pdf, .md, .html) are upstream's and are
# not replaced: the purple tiles used up to 0.10.488 all looked alike and were
# unreadable at 16 px (Oxeegen's call, 2026-09-16).

$Root   = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$Master = Join-Path $Root 'brand\assets\icon.png'
$Out    = Join-Path $Root 'brand\assets\build'
New-Item -ItemType Directory -Force -Path (Join-Path $Out 'icons') | Out-Null

function Save-Ico($frames,$path) {
    $ms = New-Object System.IO.MemoryStream
    $bw = New-Object System.IO.BinaryWriter($ms)
    $bw.Write([UInt16]0); $bw.Write([UInt16]1); $bw.Write([UInt16]$frames.Count)
    $off = 6 + (16*$frames.Count)
    foreach ($f in $frames) {
        $dim = if ($f[0] -ge 256) { 0 } else { $f[0] }
        $bw.Write([Byte]$dim); $bw.Write([Byte]$dim); $bw.Write([Byte]0); $bw.Write([Byte]0)
        $bw.Write([UInt16]1); $bw.Write([UInt16]32)
        $bw.Write([UInt32]$f[1].Length); $bw.Write([UInt32]$off); $off += $f[1].Length
    }
    foreach ($f in $frames) { $bw.Write($f[1]) }
    $bw.Flush(); [System.IO.File]::WriteAllBytes($path,$ms.ToArray()); $bw.Dispose(); $ms.Dispose()
}

function Resize-Png([System.Drawing.Image]$src,[int]$size) {
    $bmp = New-Object System.Drawing.Bitmap $size,$size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode='HighQualityBicubic'; $g.SmoothingMode='AntiAlias'; $g.PixelOffsetMode='HighQuality'
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($src,0,0,$size,$size); $g.Dispose()
    $m = New-Object System.IO.MemoryStream
    $bmp.Save($m,[System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose()
    $bytes = $m.ToArray(); $m.Dispose(); return ,$bytes
}

# --- app icon: png set (Linux hicolor) + ico (Windows) ---------------------
# NB: PowerShell variable names are case-insensitive -- an image held in
# `$master` would silently overwrite the `$Master` path. Hence `$masterImg`.
$masterImg = [System.Drawing.Image]::FromFile($Master)
try {
    if ($masterImg.Width -ne 1024 -or $masterImg.Height -ne 1024) { throw "master must be 1024x1024: $Master" }
    Copy-Item $Master (Join-Path $Out 'icon.png') -Force
    foreach ($s in @(16,32,48,64,128,256,512,1024)) {
        [System.IO.File]::WriteAllBytes((Join-Path $Out "icons\${s}x${s}.png"), (Resize-Png $masterImg $s))
    }
    $frames = @()
    foreach ($s in @(16,24,32,48,64,128,256)) { $frames += ,@($s,(Resize-Png $masterImg $s)) }
    Save-Ico $frames (Join-Path $Out 'icon.ico')
    "icon.ico + icons/ (8 sizes) from $Master"
} finally { $masterImg.Dispose() }
