# API Registry System

This directory contains tools for automatically discovering and documenting APIs in the Legion Enterprise system.

## Files

- **`api_discovery.py`** - Core API discovery engine that scans for APIs across multiple technologies
- **`update_api_registry.py`** - Updates the API registry markdown document with discovered APIs
- **`discover_apis.ps1`** - PowerShell wrapper script for easy Windows automation
- **`README.md`** - This documentation file

## Quick Start

### Basic API Discovery
```bash
# Discover APIs and print to console
python api_discovery.py

# Generate JSON report
python api_discovery.py --format json --output api_report.json

# Generate HTML report
python api_discovery.py --format html --output api_report.html
```

### Update Registry Document
```bash
# Update the main API registry document
python update_api_registry.py

# Update with custom paths
python update_api_registry.py --registry "path/to/registry.md" --root "/scan/path"
```

### PowerShell (Windows)
```powershell
# Basic discovery with registry update
.\discover_apis.ps1 -UpdateRegistry -Verbose

# Generate HTML report
.\discover_apis.ps1 -Format html -Output "report.html"
```

## Supported Technologies

- **Python**: FastAPI, Flask, aiohttp
- **Node.js**: Express, custom servers
- **Go**: Standard library HTTP servers
- **Docker**: Compose services, Dockerfiles
- **Package Managers**: NPM scripts

## Features

- Multi-technology API detection
- Running service discovery
- Port conflict detection
- Endpoint extraction
- Docker configuration parsing
- Automatic documentation updates
- Multiple output formats (Markdown, JSON, HTML)

## Configuration

The discovery tool automatically detects APIs by:

1. **File Pattern Scanning**: Looks for common API entry points (`main.py`, `app.js`, etc.)
2. **Technology Detection**: Uses regex patterns to identify frameworks
3. **Port Extraction**: Finds port configurations in code
4. **Docker Analysis**: Parses Docker Compose and Dockerfile configurations
5. **Process Scanning**: Detects currently running services

## Output Formats

### Markdown
Human-readable report with tables and summaries

### JSON
Machine-readable format for integration with other tools

### HTML
Web-viewable report with styling

## Integration

This tool is designed to integrate with:
- CI/CD pipelines for automatic documentation updates
- Development workflows for API inventory maintenance
- System monitoring for service discovery

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure both `api_discovery.py` and `update_api_registry.py` are in the same directory
2. **Permission Errors**: Check write permissions for output files
3. **Missing Dependencies**: Install required Python packages (`pyyaml` for Docker Compose parsing)

### Dependencies
```bash
pip install pyyaml  # For Docker Compose support
```

## Contributing

When adding support for new technologies:

1. Add detection patterns to `tech_patterns` in `APIDiscovery`
2. Add endpoint extraction patterns for the framework
3. Update the technology category mapping
4. Test with sample projects

---

*Part of the Artifact Virtual DevOps toolkit*