"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalFileSystem = void 0;
const assert_1 = require("assert");
const constants_1 = require("constants");
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const i18n_1 = require("../i18n");
const exceptions_1 = require("../util/exceptions");
const promise_1 = require("../util/promise");
const filesystem_1 = require("./filesystem");
function getFileType(stats) {
    return filesystem_1.FileType.Unknown |
        (stats.isDirectory() ? filesystem_1.FileType.Directory : 0) |
        (stats.isFile() ? filesystem_1.FileType.File : 0) |
        (stats.isSymbolicLink() ? filesystem_1.FileType.SymbolicLink : 0);
}
class LocalFileStats {
    stats;
    constructor(stats) {
        this.stats = stats;
        assert_1.strict.ok(stats, (0, i18n_1.i) `stats may not be undefined`);
    }
    get type() {
        return getFileType(this.stats);
    }
    get ctime() {
        return this.stats.ctimeMs;
    }
    get mtime() {
        return this.stats.mtimeMs;
    }
    get size() {
        return this.stats.size;
    }
    get mode() {
        return this.stats.mode;
    }
}
/**
 * Implementation of the Local File System
 *
 * This is used to handle the access to the local disks.
 */
class LocalFileSystem extends filesystem_1.FileSystem {
    async stat(uri) {
        const path = uri.fsPath;
        const s = await (0, promises_1.stat)(path);
        return new LocalFileStats(s);
    }
    async readDirectory(uri, options) {
        let retval;
        try {
            const folder = uri.fsPath;
            const retval = new Array();
            // use forEachAsync instead so we can throttle this appropriately.
            await (await (0, promises_1.readdir)(folder)).forEachAsync(async (each) => {
                const path = uri.fileSystem.file((0, path_1.join)(folder, each));
                const type = getFileType(await (0, promises_1.stat)(uri.join(each).fsPath));
                retval.push([path, type]);
                if (options?.recursive && type === filesystem_1.FileType.Directory) {
                    retval.push(...await this.readDirectory(path, options));
                }
            }).done;
            return retval;
        }
        finally {
            // log that.
            this.directoryRead(uri, retval);
        }
    }
    async createDirectory(uri) {
        await (0, promises_1.mkdir)(uri.fsPath, { recursive: true });
        this.directoryCreated(uri);
    }
    createSymlink(original, slink) {
        return (0, promises_1.symlink)(original.fsPath, slink.fsPath, 'file');
    }
    async readFile(uri) {
        let contents;
        try {
            contents = (0, promises_1.readFile)(uri.fsPath);
            return await contents;
        }
        finally {
            this.read(uri, contents);
        }
    }
    async writeFile(uri, content) {
        try {
            await uri.parent.createDirectory();
            return (0, promises_1.writeFile)(uri.fsPath, content);
        }
        finally {
            this.write(uri, content);
        }
    }
    async delete(uri, options) {
        try {
            options = options || { recursive: false };
            await (0, promises_1.rm)(uri.fsPath, { recursive: options.recursive, force: true, maxRetries: 3, retryDelay: 20 });
            // todo: Hack -- on windows, when something is used and then deleted, the delete might not actually finish
            // before the Promise is resolved. Adding a delay fixes this (but probably is an underlying node bug)
            await new Promise(res => setTimeout(res, 50));
            return;
        }
        finally {
            this.deleted(uri);
        }
    }
    rename(source, target, options) {
        try {
            assert_1.strict.equal(source.fileSystem, target.fileSystem, (0, i18n_1.i) `Cannot rename files across filesystems`);
            return (0, promises_1.rename)(source.fsPath, target.fsPath);
        }
        finally {
            this.renamed(source, { target, options });
        }
    }
    async copy(source, target, options) {
        const { type } = await source.stat();
        const opts = (options || {});
        const overwrite = opts.overwrite ? 0 : constants_1.COPYFILE_EXCL;
        if (type & filesystem_1.FileType.File) {
            // make sure the target folder is there
            await target.parent.createDirectory();
            await (0, promises_1.copyFile)(source.fsPath, target.fsPath, overwrite);
            return 1;
        }
        assert_1.strict.ok(type & filesystem_1.FileType.Directory, 'Unknown file type should never happen during copy');
        let targetIsFile = false;
        try {
            targetIsFile = !!((await target.stat()).type & filesystem_1.FileType.File);
        }
        catch {
            // not a file
        }
        // if it's a folder, then the target has to be a folder, or not exist
        if (targetIsFile) {
            throw new exceptions_1.TargetFileCollision(target, (0, i18n_1.i) `Copy failed: source (${source.fsPath}) is a folder, target (${target.fsPath}) is a file`);
        }
        // make sure the target folder exists
        await target.createDirectory();
        // only the initial call gets to wait for everybody to finish.
        let queue;
        // track the count, starting at the base folder.
        if (opts.queue === undefined) {
            queue = opts.queue = new promise_1.Queue();
        }
        // loop thru the contents of this folder
        for (const [sourceUri, fileType] of await source.readDirectory()) {
            const targetUri = target.join((0, path_1.basename)(sourceUri.path));
            if (fileType & filesystem_1.FileType.Directory) {
                await this.copy(sourceUri, targetUri, opts);
                continue;
            }
            // queue up the copy file
            void opts.queue.enqueue(() => (0, promises_1.copyFile)(sourceUri.fsPath, targetUri.fsPath, overwrite));
        }
        return queue ? queue.done : -1 /* innerloop */;
    }
    async readStream(uri, options) {
        this.read(uri);
        return (0, fs_1.createReadStream)(uri.fsPath, options);
    }
    async writeStream(uri, options) {
        this.write(uri);
        const flags = options?.append ? 'a' : 'w';
        const createWriteOptions = { flags, mode: options?.mode, autoClose: true, emitClose: true };
        if (options?.mtime) {
            const mtime = options.mtime;
            // inject futimes call as part of close
            createWriteOptions.fs = {
                open: fs_1.open,
                write: fs_1.write,
                writev: fs_1.writev,
                close: (fd, callback) => {
                    (0, fs_1.futimes)(fd, new Date(), mtime, (futimesErr) => {
                        (0, fs_1.close)(fd, (closeErr) => {
                            callback(futimesErr || closeErr);
                        });
                    });
                }
            };
        }
        return (0, fs_1.createWriteStream)(uri.fsPath, createWriteOptions);
    }
    async openFile(uri) {
        return new LocalReadHandle(await (0, promises_1.open)(uri.fsPath, 'r'));
    }
}
exports.LocalFileSystem = LocalFileSystem;
class LocalReadHandle extends filesystem_1.ReadHandle {
    handle;
    constructor(handle) {
        super();
        this.handle = handle;
    }
    read(buffer, offset = 0, length = buffer.byteLength, position = null) {
        return this.handle.read(buffer, offset, length, position);
    }
    async size() {
        const stat = await this.handle.stat();
        return stat.size;
    }
    async close() {
        return this.handle.close();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWwtZmlsZXN5c3RlbS5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJmcy9sb2NhbC1maWxlc3lzdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1Q0FBdUM7QUFDdkMsa0NBQWtDOzs7QUFFbEMsbUNBQWdDO0FBQ2hDLHlDQUEwQztBQUMxQywyQkFBdUo7QUFDdkosMENBQXlIO0FBQ3pILCtCQUFzQztBQUV0QyxrQ0FBNEI7QUFDNUIsbURBQXlEO0FBQ3pELDZDQUF3QztBQUV4Qyw2Q0FBOEY7QUFFOUYsU0FBUyxXQUFXLENBQUMsS0FBWTtJQUMvQixPQUFPLHFCQUFRLENBQUMsT0FBTztRQUNyQixDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMscUJBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMscUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQyxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUMscUJBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pELENBQUM7QUFFRCxNQUFNLGNBQWM7SUFDRTtJQUFwQixZQUFvQixLQUFZO1FBQVosVUFBSyxHQUFMLEtBQUssQ0FBTztRQUM5QixlQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxJQUFBLFFBQUMsRUFBQSw0QkFBNEIsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFDRCxJQUFJLElBQUk7UUFDTixPQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUNELElBQUksS0FBSztRQUNQ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