// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * GitHub Actions Cache CLI Tool
 * 
 * This module provides a command-line interface for interacting with GitHub Actions cache
 * using the @actions/cache library. It abstracts the cache operations for vcpkg-tool.
 */

import * as cache from '@actions/cache';
import * as fs from 'fs';
import * as path from 'path';

// GitHub Actions cache key prefix for vcpkg binary packages
const VCPKG_CACHE_PREFIX = 'vcpkg-binary-';

interface CacheOptions {
  key: string;
  paths: string[];
  restoreKeys?: string[];
}

interface CacheResult {
  success: boolean;
  cacheHit?: boolean;
  cacheKey?: string | null;
  cacheId?: number;
  message?: string;
  error?: string;
}

class GitHubCacheHandler {
  /**
   * Check if GitHub Actions environment variables are available
   */
  static isGitHubActions(): boolean {
    return !!(process.env.GITHUB_ACTIONS && 
              process.env.GITHUB_TOKEN && 
              process.env.ACTIONS_CACHE_URL &&
              process.env.ACTIONS_RUNTIME_TOKEN);
  }

  /**
   * Restore a cache entry
   */
  async restore(options: CacheOptions): Promise<CacheResult> {
    try {
      if (!GitHubCacheHandler.isGitHubActions()) {
        return {
          success: false,
          error: 'GitHub Actions environment not detected. Missing required environment variables.'
        };
      }

      const cacheKey = await cache.restoreCache(
        options.paths,
        options.key,
        options.restoreKeys
      );

      return {
        success: true,
        cacheHit: !!cacheKey,
        cacheKey: cacheKey || null,
        message: cacheKey ? `Cache restored from key: ${cacheKey}` : 'No cache entry found'
      };
    } catch (error) {
      return {
        success: false,
        error: `Cache restore failed: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Save a cache entry
   */
  async save(options: CacheOptions): Promise<CacheResult> {
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
        cacheId: cacheId,
        message: `Cache saved with ID: ${cacheId}`
      };
    } catch (error) {
      return {
        success: false,
        error: `Cache save failed: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Generate a vcpkg cache key from package ABI
   */
  static generateCacheKey(packageAbi: string): string {
    return `${VCPKG_CACHE_PREFIX}${packageAbi}`;
  }
}

/**
 * CLI interface for the GitHub cache tool
 */
async function main(): Promise<void> {
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
  } catch (error) {
    console.error(JSON.stringify({
      success: false,
      error: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`
    }));
    process.exit(1);
  }
}

// Export for testing purposes
export { GitHubCacheHandler, CacheOptions, CacheResult };

// Run CLI if this file is executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}