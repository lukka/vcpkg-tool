# GitHub Actions Cache Support for vcpkg-tool

This implementation restores GitHub Actions cache functionality to vcpkg-tool by delegating cache operations to a Node.js application that uses the `@actions/cache` library.

## Architecture

1. **Node.js CLI Tool** (`scripts/github-cache-cli.js`): Provides a command-line interface that abstracts @actions/cache operations
2. **C++ Integration** (`src/vcpkg/binarycaching.cpp`): Integrates the CLI tool with vcpkg's existing binary cache infrastructure
3. **Configuration Support**: Restored x-gha provider parsing in binary cache configuration

## Usage

To enable GitHub Actions cache in vcpkg, use the `x-gha` binary source configuration:

```bash
# Basic usage
vcpkg install <package> --binarysource=x-gha

# With read/write modes
vcpkg install <package> --binarysource=x-gha,readwrite
vcpkg install <package> --binarysource=x-gha,read
vcpkg install <package> --binarysource=x-gha,write
```

## Requirements

1. Must be running in GitHub Actions environment with the following environment variables:
   - `GITHUB_ACTIONS=true`
   - `GITHUB_TOKEN` (provided by GitHub Actions)
   - `ACTIONS_CACHE_URL` (provided by GitHub Actions)
   - `ACTIONS_RUNTIME_TOKEN` (provided by GitHub Actions)

2. Node.js runtime available on the system

## Implementation Details

### Cache Key Format
- Format: `vcpkg-binary-{package_abi}.zip`
- Example: `vcpkg-binary-abc123def456.zip`

### Error Handling
- Gracefully handles non-GitHub Actions environments
- Provides JSON-structured error responses
- Falls back to other cache providers if GitHub Actions cache is unavailable

### Testing
- Comprehensive test coverage for configuration parsing
- Mock implementation for non-GitHub Actions environments
- Integration with existing vcpkg binary cache test infrastructure

## Node.js CLI Tool Commands

```bash
# Check GitHub Actions environment
node scripts/github-cache-cli.js check

# Restore cache entry
node scripts/github-cache-cli.js restore <key> <path> [restore-keys...]

# Save cache entry  
node scripts/github-cache-cli.js save <key> <path>
```

## Future Enhancements

To complete the implementation with the actual @actions/cache library:

1. Install the dependency in vcpkg-artifacts:
   ```bash
   cd vcpkg-artifacts
   npm install @actions/cache@^3.2.4
   ```

2. Replace the mock implementation in `github-cache-cli.js` with:
   ```javascript
   const cache = require('@actions/cache');
   
   // Replace mock restore with:
   const cacheKey = await cache.restoreCache(options.paths, options.key, options.restoreKeys);
   
   // Replace mock save with:
   const cacheId = await cache.saveCache(options.paths, options.key);
   ```

This provides a clean separation between vcpkg-tool's C++ codebase and the Node.js ecosystem while leveraging the official GitHub Actions cache library.