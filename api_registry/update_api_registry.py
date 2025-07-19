import os
import re
import sys
import logging
from pathlib import Path
from datetime import datetime
from typing import List, Optional

# Add current directory to path for relative imports
sys.path.insert(0, str(Path(__file__).parent))

try:
    from api_discovery import APIDiscovery, APIEndpoint
except ImportError as e:
    print(f"Error: Cannot import api_discovery module: {e}")
    print("Make sure api_discovery.py is in the same directory as this script.")
    sys.exit(1)

class APIRegistryUpdater:
    """Updates the API registry document with discovered APIs"""
    
    def __init__(self, registry_file: str, discovery_root: str = "."):
        self.registry_file = Path(registry_file).resolve()
        self.discovery_root = Path(discovery_root).resolve()
        self.discovery = APIDiscovery(str(self.discovery_root))
        self.logger = logging.getLogger(__name__)
    
    def update_registry(self) -> bool:
        """Update the API registry document"""
        try:
            self.logger.info(f"Updating API registry: {self.registry_file}")
            
            # Discover APIs
            apis = self.discovery.discover_apis()
            if not apis:
                self.logger.warning("No APIs discovered")
                return False
            
            # Read current registry or create new one
            if self.registry_file.exists():
                try:
                    with open(self.registry_file, 'r', encoding='utf-8') as f:
                        content = f.read()
                    self.logger.info(f"Read existing registry: {len(content)} characters")
                except Exception as e:
                    self.logger.error(f"Error reading registry file: {e}")
                    return False
            else:
                content = self._create_initial_registry()
                self.logger.info("Created initial registry structure")
                
                # Ensure parent directory exists
                self.registry_file.parent.mkdir(parents=True, exist_ok=True)
            
            # Update the inventory table
            updated_content = self._update_inventory_table(content, apis)
            
            # Update timestamp
            updated_content = self._update_timestamp(updated_content)
            
            # Write back to file
            try:
                with open(self.registry_file, 'w', encoding='utf-8') as f:
                    f.write(updated_content)
                
                print(f"✅ Updated {self.registry_file} with {len(apis)} APIs")
                self.logger.info(f"Successfully updated registry with {len(apis)} APIs")
                return True
                
            except Exception as e:
                self.logger.error(f"Error writing registry file: {e}")
                return False
                
        except Exception as e:
            self.logger.error(f"Error during registry update: {e}")
            print(f"❌ Error updating registry: {e}")
            return False
    
    def _create_initial_registry(self) -> str:
        """Create initial registry document structure"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        return f"""# Artifact Virtual - Servers and APIs Inventory

This document provides a living inventory of backend servers, frontend clients, and API endpoints within the Artifact Virtual workspace.

*Last updated: {timestamp}*

---

## How to Discover All APIs and Servers

Artifact Virtual is a rapidly evolving system. To ensure you have the latest API/server inventory:

1. **Automated Discovery**
   ```bash
   # Run the discovery tool
   python core/api_registry/api_discovery.py
   
   # Update this registry document
   python core/api_registry/update_api_registry.py
   ```

2. **Manual Discovery Steps**
   - Search for files named `main.py`, `app.py`, `server.py`, `index.js`, `app.ts`, etc.
   - Check Docker Compose files for service definitions
   - Review PM2/ecosystem configs for Node.js services
   - Scan for open ports in dev/test environments

---

## API/Server Inventory

<!-- API_TABLE_START -->
| Name/Module | File/Entrypoint | Port(s) | Technology | Framework | Status | Purpose/Notes |
|-------------|-----------------|---------|------------|-----------|---------|---------------|
<!-- API_TABLE_END -->

---

## Port Conflict Warning

Multiple services may default to the same port (e.g., 8000, 8080, 3000). Always check and configure ports to avoid conflicts when running multiple servers.

---

## Keeping This Document Up to Date

- **Automate discovery:** Run the API discovery tool regularly
- **Encourage developers** to document new APIs/servers in their module's README
- **Review and update** this inventory before major deployments

---

*This document is automatically maintained by the API Discovery Tool.*
"""
    
    def _update_inventory_table(self, content: str, apis: List[APIEndpoint]) -> str:
        """Update the inventory table in the content"""
        try:
            # Generate new table content
            table_rows = []
            for api in sorted(apis, key=lambda x: (x.technology, x.name)):
                status = "🟢 Running" if api.is_running else "🔴 Stopped"
                purpose = self._clean_description(api.description) or f"{api.framework} API server"
                
                # Clean file path for display
                file_path = api.file_path.replace('\\', '/')
                if len(file_path) > 50:
                    file_path = "..." + file_path[-47:]
                
                row = f"| {api.name} | `{file_path}` | {api.port or 'N/A'} | {api.technology} | {api.framework} | {status} | {purpose} |"
                table_rows.append(row)
            
            new_table_content = "\n".join(table_rows)
            
            # Look for table markers first (more reliable)
            table_start_marker = "<!-- API_TABLE_START -->"
            table_end_marker = "<!-- API_TABLE_END -->"
            
            if table_start_marker in content and table_end_marker in content:
                # Replace content between markers
                pattern = f"{re.escape(table_start_marker)}.*?{re.escape(table_end_marker)}"
                replacement = f"{table_start_marker}\n| Name/Module | File/Entrypoint | Port(s) | Technology | Framework | Status | Purpose/Notes |\n|-------------|-----------------|---------|------------|-----------|---------|---------------|\n{new_table_content}\n{table_end_marker}"
                content = re.sub(pattern, replacement, content, flags=re.DOTALL)
            else:
                # Fallback to regex pattern matching
                table_header = "| Name/Module | File/Entrypoint | Port(s) | Technology | Framework | Status | Purpose/Notes |"
                separator = "|-------------|-----------------|---------|------------|-----------|---------|---------------|"
                
                # Find existing table pattern
                table_pattern = re.escape(table_header) + r'\s*\n' + re.escape(separator) + r'\s*\n(?:\|.*?\|\s*\n)*'
                
                new_table = f"{table_header}\n{separator}\n{new_table_content}\n"
                
                if re.search(table_pattern, content):
                    content = re.sub(table_pattern, new_table, content)
                else:
                    # Insert table after inventory heading
                    insert_pattern = r'(## .*?[Ii]nventory.*?\n)'
                    replacement = f'\\1\n{new_table}\n'
                    content = re.sub(insert_pattern, replacement, content)
            
            return content
            
        except Exception as e:
            self.logger.error(f"Error updating inventory table: {e}")
            return content
    
    def _clean_description(self, description: str) -> str:
        """Clean and truncate description for table display"""
        if not description:
            return ""
        
        # Remove newlines and extra whitespace
        cleaned = re.sub(r'\s+', ' ', description.strip())
        
        # Truncate if too long
        if len(cleaned) > 60:
            cleaned = cleaned[:57] + "..."
        
        return cleaned
    
    def _update_timestamp(self, content: str) -> str:
        """Update the last updated timestamp"""
        try:
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            
            # Update existing timestamp
            timestamp_pattern = r'\*Last updated:.*?\*'
            replacement = f'*Last updated: {timestamp}*'
            
            if re.search(timestamp_pattern, content):
                content = re.sub(timestamp_pattern, replacement, content)
            else:
                # Add timestamp after title
                title_pattern = r'(# .*?\n)'
                replacement_with_timestamp = f'\\1\n*Last updated: {timestamp}*\n'
                content = re.sub(title_pattern, replacement_with_timestamp, content)
            
            return content
            
        except Exception as e:
            self.logger.error(f"Error updating timestamp: {e}")
            return content
    
    def validate_registry_path(self) -> bool:
        """Validate that the registry path is accessible"""
        try:
            # Check if parent directory exists or can be created
            if not self.registry_file.parent.exists():
                self.registry_file.parent.mkdir(parents=True, exist_ok=True)
            
            # Test write access
            if self.registry_file.exists():
                return os.access(self.registry_file, os.W_OK)
            else:
                return os.access(self.registry_file.parent, os.W_OK)
                
        except Exception as e:
            self.logger.error(f"Error validating registry path: {e}")
            return False

def setup_logging(verbose: bool = False):
    """Setup logging configuration"""
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(
        level=level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

def main():
    """Update the API registry"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Update API registry document')
    parser.add_argument('--registry', '-r', 
                       default='docs/technical/api_registry.md',
                       help='Path to API registry document')
    parser.add_argument('--root', default='.', 
                       help='Root directory to scan')
    parser.add_argument('--verbose', '-v', action='store_true',
                       help='Enable verbose logging')
    
    args = parser.parse_args()
    
    # Setup logging
    setup_logging(args.verbose)
    logger = logging.getLogger(__name__)
    
    try:
        # Resolve paths relative to script location if they're relative
        if not Path(args.registry).is_absolute():
            script_dir = Path(__file__).parent
            registry_path = script_dir.parent.parent / args.registry
        else:
            registry_path = args.registry
        
        if not Path(args.root).is_absolute():
            root_path = Path.cwd() if args.root == '.' else Path(args.root)
        else:
            root_path = args.root
        
        logger.info(f"Registry file: {registry_path}")
        logger.info(f"Discovery root: {root_path}")
        
        # Create updater and run
        updater = APIRegistryUpdater(str(registry_path), str(root_path))
        
        # Validate paths
        if not updater.validate_registry_path():
            print(f"❌ Cannot write to registry file: {registry_path}")
            return 1
        
        # Update registry
        success = updater.update_registry()
        return 0 if success else 1
        
    except KeyboardInterrupt:
        print("\n⚠️  Operation cancelled by user")
        return 1
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        print(f"❌ Unexpected error: {e}")
        return 1

if __name__ == "__main__":
    exit(main())