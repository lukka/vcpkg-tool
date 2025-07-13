"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubCacheHandler = void 0;
/**
 * GitHub Actions Cache CLI Tool
 *
 * This module provides a command-line interface for interacting with GitHub Actions cache
 * using the @actions/cache library. It abstracts the cache operations for vcpkg-tool.
 */
const cache = require("@actions/cache");
const fs = require("fs");
// GitHub Actions cache key prefix for vcpkg binary packages
const VCPKG_CACHE_PREFIX = 'vcpkg-binary-';
class GitHubCacheHandler {
    /**
     * Check if GitHub Actions environment variables are available
     */
    static isGitHubActions() {
        return !!(process.env.GITHUB_ACTIONS &&
            process.env.GITHUB_TOKEN &&
            process.env.ACTIONS_CACHE_URL &&
            process.env.ACTIONS_RUNTIME_TOKEN);
    }
    /**
     * Restore a cache entry
     */
    async restore(options) {
        try {
            if (!GitHubCacheHandler.isGitHubActions()) {
                return {
                    success: false,
                    error: 'GitHub Actions environment not detected. Missing required environment variables.'
                };
            }
            const cacheKey = await cache.restoreCache(options.paths, options.key, options.restoreKeys);
            if (cacheKey) {
                return {
                    success: true,
                    cacheHit: true,
                    message: `Cache restored with key: ${cacheKey}`
                };
            }
            else {
                return {
                    success: true,
                    cacheHit: false,
                    message: 'No cache entry found'
                };
            }
        }
        catch (error) {
            return {
                success: false,
                error: `Cache restore failed: ${error instanceof Error ? error.message : String(error)}`
            };
        }
    }
    /**
     * Save a cache entry
     */
    async save(options) {
        try {
            if (!GitHubCacheHandler.isGitHubActions()) {
                return {
                    success: false,
                    error: 'GitHub Actions environment not detected. Missing required environment variables.'
                };
            }
            // Check if all paths exist
            for (const cachePath of options.paths) {
                if (!fs.existsSync(cachePath)) {
                    return {
                        success: false,
                        error: `Path does not exist: ${cachePath}`
                    };
                }
            }
            const cacheId = await cache.saveCache(options.paths, options.key);
            return {
                success: true,
                message: `Cache saved with ID: ${cacheId}`
            };
        }
        catch (error) {
            return {
                success: false,
                error: `Cache save failed: ${error instanceof Error ? error.message : String(error)}`
            };
        }
    }
    /**
     * Generate a vcpkg cache key from package ABI
     */
    static generateCacheKey(packageAbi) {
        return `${VCPKG_CACHE_PREFIX}${packageAbi}`;
    }
}
exports.GitHubCacheHandler = GitHubCacheHandler;
/**
 * CLI interface for the GitHub cache tool
 */
async function main() {
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.error('Usage: node github-cache-cli.js <command> [options]');
        console.error('Commands:');
        console.error('  restore <key> <path> [restore-keys...]  - Restore cache entry');
        console.error('  save <key> <path>                       - Save cache entry');
        console.error('  check                                   - Check GitHub Actions environment');
        process.exit(1);
    }
    const command = args[0];
    const handler = new GitHubCacheHandler();
    try {
        switch (command) {
            case 'check': {
                const isGA = GitHubCacheHandler.isGitHubActions();
                console.log(JSON.stringify({
                    success: true,
                    githubActions: isGA,
                    message: isGA ? 'GitHub Actions environment detected' : 'Not running in GitHub Actions'
                }));
                break;
            }
            case 'restore': {
                if (args.length < 3) {
                    console.error('restore requires <key> <path> [restore-keys...]');
                    process.exit(1);
                }
                const key = args[1];
                const cachePath = args[2];
                const restoreKeys = args.slice(3);
                const result = await handler.restore({
                    key,
                    paths: [cachePath],
                    restoreKeys: restoreKeys.length > 0 ? restoreKeys : undefined
                });
                console.log(JSON.stringify(result));
                process.exit(result.success ? 0 : 1);
                break;
            }
            case 'save': {
                if (args.length < 3) {
                    console.error('save requires <key> <path>');
                    process.exit(1);
                }
                const key = args[1];
                const cachePath = args[2];
                const result = await handler.save({
                    key,
                    paths: [cachePath]
                });
                console.log(JSON.stringify(result));
                process.exit(result.success ? 0 : 1);
                break;
            }
            default:
                console.error(`Unknown command: ${command}`);
                process.exit(1);
        }
    }
    catch (error) {
        console.error(JSON.stringify({
            success: false,
            error: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`
        }));
        process.exit(1);
    }
}
// Run CLI if this file is executed directly
if (require.main === module) {
    main().catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0aHViLWNhY2hlLWNsaS5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJnaXRodWItY2FjaGUtY2xpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1Q0FBdUM7QUFDdkMsa0NBQWtDOzs7QUFFbEM7Ozs7O0dBS0c7QUFFSCx3Q0FBd0M7QUFDeEMseUJBQXlCO0FBR3pCLDREQUE0RDtBQUM1RCxNQUFNLGtCQUFrQixHQUFHLGVBQWUsQ0FBQztBQWUzQyxNQUFNLGtCQUFrQjtJQUN0Qjs7T0FFRztJQUNLLE1BQU0sQ0FBQyxlQUFlO1FBQzVCLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjO1lBQzFCLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWTtZQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQjtZQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVEOztPQUVHO0lBQ0gsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFxQjtRQUNqQyxJQUFJLENBQUM7WUFDSCxJQUFJLENBQUMsa0JBQWtCLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQztnQkFDMUMsT0FBTztvQkFDTCxPQUFPLEVBQUUsS0FBSztvQkFDZCxLQUFLLEVBQUUsa0ZBQWtGO2lCQUMxRixDQUFDO1lBQ0osQ0FBQztZQUVELE1BQU0sUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUFDLFlBQVksQ0FDdkMsT0FBTyxDQUFDLEtBQUssRUFDYixPQUFPLENBQUMsR0FBRyxFQUNYLE9BQU8sQ0FBQyxXQUFXLENBQ3BCLENBQUM7WUFFRixJQUFJLFFBQVEsRUFBRSxDQUFDO2dCQUNiLE9BQU87b0JBQ0wsT0FBTyxFQUFFLElBQUk7b0JBQ2IsUUFBUSxFQUFFLElBQUk7b0JB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