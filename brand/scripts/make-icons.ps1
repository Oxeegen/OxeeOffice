$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

# Generates the OxeeOffice icon set into brand/assets/build/ from the master
# brand/assets/icon.png (upstream's glyph, white on the Oxeegen purple
# gradient). Windows-only (GDI+); outputs are committed, so this only needs
# re-running when the master or the file-type style changes:
#
#   powershell -File brand\scripts\make-icons.ps1
#
# The file-type tile drawing is carried over VERBATIM from the pre-fork
# pipeline (OxeeOffice-build/src/make-fileicons.ps1), so the five approved
# icons regenerate identically; .html was added for the HTML app (0.9.431).

$Root   = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$Master = Join-Path $Root 'brand\assets\icon.png'
$Out    = Join-Path $Root 'brand\assets\build'
New-Item -ItemType Directory -Force -Path (Join-Path $Out 'icons') | Out-Null

$cLight = [System.Drawing.ColorTranslator]::FromHtml("#7060F7")
$cMid   = [System.Drawing.ColorTranslator]::FromHtml("#5E4AF5")
$cDark  = [System.Drawing.ColorTranslator]::FromHtml("#4E3BD8")

$types = @(
    @{ name="docx"; letter="W";   accent="#4A9EFF" },
    @{ name="xlsx"; letter="X";   accent="#3ECF8E" },
    @{ name="pptx"; letter="P";   accent="#FF8A4A" },
    @{ name="md";   letter="M";   accent="#B8B8C4" },
    @{ name="pdf";  letter="PDF"; accent="#FF5A5A" },
    @{ name="html"; letter="</>"; accent="#F5C542" }
)

function New-RoundedPath([float]$x,[float]$y,[float]$w,[float]$h,[float]$r) {
    $p = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $r*2
    $p.AddArc($x,$y,$d,$d,180,90); $p.AddArc($x+$w-$d,$y,$d,$d,270,90)
    $p.AddArc($x+$w-$d,$y+$h-$d,$d,$d,0,90); $p.AddArc($x,$y+$h-$d,$d,$d,90,90)
    $p.CloseFigure(); return $p
}

function New-TypeTile([int]$size,[string]$letter,[string]$accentHex) {
    $bmp = New-Object System.Drawing.Bitmap $size,$size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode='AntiAlias'; $g.TextRenderingHint='AntiAliasGridFit'
    $g.InterpolationMode='HighQualityBicubic'; $g.PixelOffsetMode='HighQuality'
    $g.Clear([System.Drawing.Color]::Transparent)

    $rect = New-Object System.Drawing.RectangleF 0,0,$size,$size
    $br = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect,$cLight,$cDark,45.0)
    $blend = New-Object System.Drawing.Drawing2D.ColorBlend 3
    $blend.Colors=@($cLight,$cMid,$cDark); $blend.Positions=@(0.0,0.5,1.0)
    $br.InterpolationColors=$blend
    $path = New-RoundedPath 0 0 $size $size ([float]($size*0.18))
    $g.FillPath($br,$path); $br.Dispose(); $path.Dispose()

    $accent = [System.Drawing.ColorTranslator]::FromHtml($accentHex)
    $barH = [Math]::Max(2,[int]($size*0.13))
    $bp = New-RoundedPath ([float]($size*0.16)) ([float]($size-$barH-$size*0.13)) ([float]($size*0.68)) ([float]$barH) ([float]($barH/2))
    $ab = New-Object System.Drawing.SolidBrush $accent
    $g.FillPath($ab,$bp); $ab.Dispose(); $bp.Dispose()

    if ($size -ge 24) {
        $fs = if ($letter.Length -gt 1) { $size*0.30 } else { $size*0.46 }
        $f = New-Object System.Drawing.Font("Segoe UI",$fs,[System.Drawing.FontStyle]::Bold,[System.Drawing.GraphicsUnit]::Pixel)
        $sf = New-Object System.Drawing.StringFormat
        $sf.Alignment='Center'; $sf.LineAlignment='Center'
        $box = New-Object System.Drawing.RectangleF 0,([float](-$size*0.06)),$size,$size
        $g.DrawString($letter,$f,[System.Drawing.Brushes]::White,$box,$sf)
        $f.Dispose(); $sf.Dispose()
    }
    $g.Dispose(); return $bmp
}

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

# --- file-type icons -------------------------------------------------------
$sizes = @(16,24,32,48,64,128,256)
foreach ($t in $types) {
    $frames = @()
    foreach ($s in $sizes) {
        $b = New-TypeTile $s $t.letter $t.accent
        $m = New-Object System.IO.MemoryStream
        $b.Save($m,[System.Drawing.Imaging.ImageFormat]::Png)
        $frames += ,@($s,$m.ToArray()); $m.Dispose(); $b.Dispose()
    }
    $p = Join-Path $Out ($t.name + ".ico")
    Save-Ico $frames $p
    "{0,-6} {1,-4} {2,-9} {3,7:N0} bytes" -f $t.name,$t.letter,$t.accent,(Get-Item $p).Length
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

# --- contact sheet (not shipped; for eyeballing) ---------------------------
$sheet = New-Object System.Drawing.Bitmap 830,160
$g = [System.Drawing.Graphics]::FromImage($sheet)
$g.Clear([System.Drawing.ColorTranslator]::FromHtml("#1E1E22"))
$x = 20
foreach ($t in $types) {
    $b = New-TypeTile 96 $t.letter $t.accent
    $g.DrawImage($b,$x,20,96,96); $b.Dispose()
    $f = New-Object System.Drawing.Font("Segoe UI",12)
    $g.DrawString("."+$t.name,$f,[System.Drawing.Brushes]::White,$x+22,124); $f.Dispose()
    $x += 132
}
$g.Dispose()
$sheetPath = Join-Path $Root 'brand\assets\filetypes-contact-sheet.png'
$sheet.Save($sheetPath,[System.Drawing.Imaging.ImageFormat]::Png); $sheet.Dispose()
"contact sheet: $sheetPath"
