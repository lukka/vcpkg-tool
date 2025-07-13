interface CacheOptions {
    key: string;
    paths: string[];
    restoreKeys?: string[];
}
interface CacheResult {
    success: boolean;
    cacheHit?: boolean;
    message?: string;
    error?: string;
}
declare class GitHubCacheHandler {
    /**
     * Check if GitHub Actions environment variables are available
     */
    private static isGitHubActions;
    /**
     * Restore a cache entry
     */
    restore(options: CacheOptions): Promise<CacheResult>;
    /**
     * Save a cache entry
     */
    save(options: CacheOptions): Promise<CacheResult>;
    /**
     * Generate a vcpkg cache key from package ABI
     */
    static generateCacheKey(packageAbi: string): string;
}
export { GitHubCacheHandler, CacheOptions, CacheResult };
//# sourceMappingURL=github-cache-cli.d.ts.map