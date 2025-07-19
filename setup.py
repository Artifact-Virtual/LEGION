#!/usr/bin/env python3
"""
Setup script for Artifact XAI: Legion Enterprise System
"""

from setuptools import setup, find_packages
from pathlib import Path

# Read the README file
this_directory = Path(__file__).parent
long_description = (this_directory / "README.md").read_text(encoding='utf-8')

# Read requirements
requirements = []
with open('requirements.txt', 'r') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#'):
            requirements.append(line)

setup(
    name="artifact-xai-legion-enterprise",
    version="1.0.0",
    description="AI-powered enterprise management platform with multi-agent orchestration",
    long_description=long_description,
    long_description_content_type="text/markdown",
    author="Artifact Virtual",
    author_email="contact@artifact-virtual.com",
    url="https://github.com/artifact-virtual/legion-enterprise",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Intended Audience :: Developers",
        "Intended Audience :: End Users/Desktop",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Topic :: Office/Business",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
        "Topic :: Software Development :: Libraries :: Python Modules",
    ],
    python_requires=">=3.8",
    install_requires=requirements,
    extras_require={
        "dev": [
            "pytest>=8.2.2",
            "autopep8>=2.0.0",
            "black>=23.0.0",
            "flake8>=6.0.0",
        ],
        "web": [
            "fastapi>=0.110.0",
            "uvicorn>=0.29.0",
        ],
        "analysis": [
            "pandas>=2.2.0",
            "numpy>=1.26.0",
            "matplotlib>=3.7.0",
        ],
    },
    entry_points={
        "console_scripts": [
            "legion-enterprise=active_system_manager:main",
            "legion-api=frontend_integration_api:main",
            "legion-demo=integration_demo:main",
            "legion-test=test_integrations:main",
        ],
    },
    include_package_data=True,
    package_data={
        "": ["*.md", "*.txt", "*.json", "*.yaml", "*.yml"],
        "config": ["*.json"],
        "data": ["*.db"],
        "templates": ["*.html", "*.css", "*.js"],
    },
    data_files=[
        ("", ["README.md", "ARCHITECTURE.md", "LICENSE"]),
        ("config", ["config/integrations.json"]),
    ],
    project_urls={
        "Bug Reports": "https://github.com/artifact-virtual/legion-enterprise/issues",
        "Source": "https://github.com/artifact-virtual/legion-enterprise",
        "Documentation": "https://github.com/artifact-virtual/legion-enterprise/blob/main/README.md",
    },
    keywords=[
        "ai", "enterprise", "automation", "multi-agent", "business-intelligence",
        "crm", "integration", "xai", "explainable-ai", "workflow", "orchestration"
    ],
)
