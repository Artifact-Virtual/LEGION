<#
.SYNOPSIS
    Discover and report APIs in the Artifact Virtual system

.DESCRIPTION
    This script runs the API discovery tool and generates reports in various formats.
    It can also update the API registry document automatically.

.PARAMETER Root
    Root directory to scan for APIs (default: current directory)

.PARAMETER Format
    Output format: markdown, json, or html (default: markdown)

.PARAMETER Output
    Output file path (if not specified, prints to console)

.PARAMETER UpdateRegistry
    Update the API registry document

.PARAMETER Verbose
    Enable verbose output

.EXAMPLE
    .\discover_apis.ps1
    
.EXAMPLE
    .\discover_apis.ps1 -Format json -Output "api_report.json"
    
.EXAMPLE
    .\discover_apis.ps1 -UpdateRegistry -Verbose
#>

param(
    [string]$Root = ".",
    [ValidateSet("markdown", "json", "html")]
    [string]$Format = "markdown",
    [string]$Output,
    [switch]$UpdateRegistry,
    [switch]$Verbose
)

# Get script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Check if Python is available
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Error "Python is not installed or not in PATH"
    exit 1
}

# Check if api_discovery.py exists
$DiscoveryScript = Join-Path $ScriptDir "api_discovery.py"
if (-not (Test-Path $DiscoveryScript)) {
    Write-Error "API discovery script not found: $DiscoveryScript"
    exit 1
}

Write-Host "🔍 Starting API Discovery..." -ForegroundColor Green

try {
    if ($UpdateRegistry) {
        $UpdateArgs = @("--root", $Root, "--update-registry")
        if ($Verbose) { $UpdateArgs += "--verbose" }
        Write-Host "📝 Updating API registry..." -ForegroundColor Yellow
        & python $DiscoveryScript @UpdateArgs
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ API registry updated successfully!" -ForegroundColor Green
        } else {
            Write-Error "Failed to update API registry"
        }
    }
    
    # Run discovery
    $DiscoveryArgs = @("--root", $Root, "--format", $Format)
    if ($Output) { $DiscoveryArgs += @("--output", $Output) }
    if ($Verbose) { $DiscoveryArgs += "--verbose" }
    Write-Host "🚀 Running API discovery..." -ForegroundColor Yellow
    & python $DiscoveryScript @DiscoveryArgs
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ API discovery completed successfully!" -ForegroundColor Green
        if ($Output) {
            Write-Host "📄 Report saved to: $Output" -ForegroundColor Cyan
            if ($Format -eq "html" -and (Test-Path $Output)) {
                $OpenReport = Read-Host "Open HTML report in browser? (y/N)"
                if ($OpenReport -match "^[Yy]") {
                    Start-Process $Output
                }
            }
        }
    } else {
        Write-Error "API discovery failed"
        exit 1
    }
    
} catch {
    Write-Error "Error during API discovery: $_"
    exit 1
}

Write-Host "🎉 All done!" -ForegroundColor Green