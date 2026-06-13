# Minimal static file server for local preview (no dependencies)
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 8377
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Serving $root at http://localhost:$port/"

$mime = @{
  '.html' = 'text/html; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.js'   = 'application/javascript; charset=utf-8'
  '.svg'  = 'image/svg+xml'
  '.png'  = 'image/png'
  '.jpg'  = 'image/jpeg'
  '.ico'  = 'image/x-icon'
  '.json' = 'application/json'
  '.md'   = 'text/plain; charset=utf-8'
  '.txt'  = 'text/plain; charset=utf-8'
  '.xml'  = 'application/xml; charset=utf-8'
}

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()

    # POST /save?name=frame_0001.jpg — used only by render-frames.html (local frame export)
    if ($ctx.Request.HttpMethod -eq 'POST' -and $ctx.Request.Url.AbsolutePath -eq '/save') {
      $name = $ctx.Request.QueryString['name']
      $dirq = $ctx.Request.QueryString['dir']
      $okFrame = ($name -match '^frame_\d{4}\.jpg$' -and $dirq -match '^[a-z0-9-]{1,40}$')
      $okOg    = ($name -match '^og-image\.png$' -and $dirq -eq 'assets')
      if ($okFrame -or $okOg) {
        if ($okOg) { $outDir = Join-Path $root 'assets' }
        else { $outDir = Join-Path $root "assets\cinematic\$dirq" }
        if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Force $outDir | Out-Null }
        $ms = New-Object System.IO.MemoryStream
        $ctx.Request.InputStream.CopyTo($ms)
        [IO.File]::WriteAllBytes((Join-Path $outDir $name), $ms.ToArray())
        $ctx.Response.StatusCode = 200
      } else {
        $ctx.Response.StatusCode = 400
      }
      $ctx.Response.Close()
      continue
    }

    $path = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart('/')
    if ([string]::IsNullOrWhiteSpace($path)) { $path = 'index.html' }
    $file = Join-Path $root $path
    $fullRoot = (Resolve-Path $root).Path
    if ((Test-Path $file -PathType Leaf) -and ((Resolve-Path $file).Path.StartsWith($fullRoot))) {
      $bytes = [IO.File]::ReadAllBytes($file)
      $ext = [IO.Path]::GetExtension($file).ToLower()
      $type = $mime[$ext]
      if (-not $type) { $type = 'application/octet-stream' }
      $ctx.Response.ContentType = $type
      $ctx.Response.ContentLength64 = $bytes.Length
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $ctx.Response.StatusCode = 404
    }
    $ctx.Response.Close()
  } catch {
    # keep serving on per-request errors
  }
}
