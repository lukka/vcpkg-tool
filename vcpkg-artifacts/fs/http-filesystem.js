"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpsFileSystem = void 0;
const filesystem_1 = require("./filesystem");
/**
 * HTTPS Filesystem
 *
 */
class HttpsFileSystem extends filesystem_1.FileSystem {
    async stat(uri) {
        throw new Error('Method not implemented');
    }
    readDirectory(uri) {
        throw new Error('Method not implemented');
    }
    createDirectory(uri) {
        throw new Error('Method not implemented');
    }
    async readFile(uri) {
        throw new Error('Method not implemented');
    }
    writeFile(uri, content) {
        throw new Error('Method not implemented');
    }
    delete(uri, options) {
        throw new Error('Method not implemented');
    }
    rename(source, target, options) {
        throw new Error('Method not implemented');
    }
    copy(source, target, options) {
        throw new Error('Method not implemented');
    }
    async createSymlink(original, symlink) {
        throw new Error('Method not implemented');
    }
    async readStream(uri, options) {
        throw new Error('Method not implemented');
    }
    writeStream(uri) {
        throw new Error('Method not implemented');
    }
    async openFile(uri) {
        throw new Error('Method not implemented');
    }
}
exports.HttpsFileSystem = HttpsFileSystem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC1maWxlc3lzdGVtLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9taWNyb3NvZnQvdmNwa2ctdG9vbC9tYWluL3ZjcGtnLWFydGlmYWN0cy8iLCJzb3VyY2VzIjpbImZzL2h0dHAtZmlsZXN5c3RlbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBSWxDLDZDQUEwRTtBQUUxRTs7O0dBR0c7QUFDSCxNQUFhLGVBQWdCLFNBQVEsdUJBQVU7SUFFN0MsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFRO1FBQ2pCLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBQ0QsYUFBYSxDQUFDLEdBQVE7UUFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFDRCxlQUFlLENBQUMsR0FBUTtRQUN0QixNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUNELEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBUTtRQUNyQixNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUNELFNBQVMsQ0FBQyxHQUFRLEVBQUUsT0FBbUI7UUFDckMsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFDRCxNQUFNLENBQUMsR0FBUSxFQUFFLE9BQThFO1FBQzdGLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBQ0QsTUFBTSxDQUFDLE1BQVcsRUFBRSxNQUFXLEVBQUUsT0FBOEM7UUFDN0UsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFDRCxJQUFJLENBQUMsTUFBVyxFQUFFLE1BQVcsRUFBRSxPQUE4QztRQUMzRSxNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUNELEtBQUssQ0FBQyxhQUFhLENBQUMsUUFBYSxFQUFFLE9BQVk7UUFDN0MsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFDRCxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQVEsRUFBRSxPQUEwQztRQUNuRSxNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUNELFdBQVcsQ0FBQyxHQUFRO1FBQ2xCLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFRO1FBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztJQUM1QyxDQUFDO0NBQ0Y7QUF2Q0QsMENBdUNDIn0=