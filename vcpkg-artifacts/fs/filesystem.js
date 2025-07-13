"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystem = exports.ReadHandle = exports.FileType = void 0;
/* eslint-disable @typescript-eslint/ban-types */
const node_events_1 = require("node:events");
const stream_1 = require("stream");
const uri_1 = require("../util/uri");
const size64K = 1 << 16;
const size32K = 1 << 15;
/**
* Enumeration of file types. The types `File` and `Directory` can also be
* a symbolic links, in that case use `FileType.File | FileType.SymbolicLink` and
* `FileType.Directory | FileType.SymbolicLink`.
*/
var FileType;
(function (FileType) {
    /**
     * The file type is unknown.
     */
    FileType[FileType["Unknown"] = 0] = "Unknown";
    /**
     * A regular file.
     */
    FileType[FileType["File"] = 1] = "File";
    /**
     * A directory.
     */
    FileType[FileType["Directory"] = 2] = "Directory";
    /**
     * A symbolic link to a file.
     */
    FileType[FileType["SymbolicLink"] = 64] = "SymbolicLink";
})(FileType || (exports.FileType = FileType = {}));
/**
 * A random-access reading interface to access a file in a FileSystem.
 *
 * Ideally, we keep reads in a file to a forward order, so that this can be implemented on filesystems
 * that do not support random access (ie, please do your best to order reads so that they go forward only as much as possible)
 *
 * Underneath on FSes that do not support random access, this would likely require multiple 'open' operation for the same
 * target file.
 */
class ReadHandle {
    async readComplete(buffr, offset = 0, length = buffr.byteLength, position = null, totalRead = 0) {
        const { bytesRead, buffer } = await this.read(buffr, offset, length, position);
        if (length) {
            if (bytesRead && bytesRead < length) {
                return await this.readComplete(buffr, offset + bytesRead, length - bytesRead, position ? position + bytesRead : null, bytesRead + totalRead);
            }
        }
        return { bytesRead: bytesRead + totalRead, buffer };
    }
    /**
     * Returns a Readable for consuming an opened ReadHandle
     * @param start the first byte to read of the target
     * @param end the last byte to read of the target (inclusive!)
     */
    readStream(start = 0, end = Infinity) {
        return stream_1.Readable.from(asyncIterableOverHandle(start, end, this), {});
    }
    range(start, length) {
        return new RangeReadHandle(this, start, length);
    }
}
exports.ReadHandle = ReadHandle;
class RangeReadHandle extends ReadHandle {
    start;
    length;
    pos = 0;
    readHandle;
    constructor(readHandle, start, length) {
        super();
        this.start = start;
        this.length = length;
        this.readHandle = readHandle;
    }
    async read(buffer, offset, length, position) {
        if (this.readHandle) {
            position = position !== undefined && position !== null ? (position + this.start) : (this.pos + this.start);
            length = length === null ? this.length : length;
            const result = await this.readHandle.read(buffer, offset, length, position);
            this.pos += result.bytesRead;
            return result;
        }
        return {
            bytesRead: 0, buffer
        };
    }
    async size() {
        return this.length;
    }
    async close() {
        this.readHandle = undefined;
    }
}
/**
 * Picks a reasonable buffer size. Not more than 64k
 *
 * @param length
 */
function reasonableBuffer(length) {
    return Buffer.alloc(length > size64K ? size32K : length);
}
/**
 * Creates an AsyncIterable<Buffer> over a ReadHandle
 * @param start the first byte in the target read from
 * @param end the last byte in the target to read from
 * @param handle the ReadHandle
 */
async function* asyncIterableOverHandle(start, end, handle) {
    while (start < end) {
        // buffer alloc must be inside the loop; zlib will hold the buffers until it can deal with a whole stream.
        const buffer = reasonableBuffer(1 + end - start);
        const count = Math.min(1 + end - start, buffer.byteLength);
        const b = await handle.read(buffer, 0, count, start);
        if (b.bytesRead === 0) {
            return;
        }
        start += b.bytesRead;
        // return only what was actually read. (just a view)
        if (b.bytesRead === buffer.byteLength) {
            yield buffer;
        }
        else {
            yield buffer.slice(0, b.bytesRead);
        }
    }
}
class FileSystem extends node_events_1.EventEmitter {
    session;
    baseUri;
    /**
   * Creates a new URI from a file system path, e.g. `c:\my\files`,
   * `/usr/home`, or `\\server\share\some\path`.
   *
   * associates this FileSystem with the Uri
   *
   * @param path A file system path (see `URI#fsPath`)
   */
    file(path) {
        return uri_1.Uri.file(this, path);
    }
    /** construct an Uri from the various parts */
    from(components) {
        return uri_1.Uri.from(this, components);
    }
    /**
   * Creates a new URI from a string, e.g. `https://www.msft.com/some/path`,
   * `file:///usr/home`, or `scheme:with/path`.
   *
   * @param value A string which represents an URI (see `URI#toString`).
   */
    parseUri(value, _strict) {
        return uri_1.Uri.parse(this, value, _strict);
    }
    /** checks to see if the target exists */
    async exists(uri) {
        try {
            return !!(await this.stat(uri));
        }
        catch (e) {
            // if this fails, we're assuming false
        }
        return false;
    }
    /** checks to see if the target is a directory/folder */
    async isDirectory(uri) {
        try {
            return !!((await this.stat(uri)).type & FileType.Directory);
        }
        catch {
            // if this fails, we're assuming false
        }
        return false;
    }
    /** checks to see if the target is a file */
    async isFile(uri) {
        try {
            const s = await this.stat(uri);
            return !!(s.type & FileType.File);
        }
        catch {
            // if this fails, we're assuming false
        }
        return false;
    }
    /** checks to see if the target is a symbolic link */
    async isSymlink(uri) {
        try {
            return !!((await this.stat(uri)) && FileType.SymbolicLink);
        }
        catch {
            // if this fails, we're assuming false
        }
        return false;
    }
    constructor(session) {
        super();
        this.session = session;
    }
    /** EventEmitter for when files are read */
    read(path, context) {
        this.emit('read', path, context, this.session.stopwatch.total);
    }
    /** EventEmitter for when files are written */
    write(path, context) {
        this.emit('write', path, context, this.session.stopwatch.total);
    }
    /** EventEmitter for when files are deleted */
    deleted(path, context) {
        this.emit('deleted', path, context, this.session.stopwatch.total);
    }
    /** EventEmitter for when files are renamed */
    renamed(path, context) {
        this.emit('renamed', path, context, this.session.stopwatch.total);
    }
    /** EventEmitter for when directories are read */
    directoryRead(path, contents) {
        this.emit('directoryRead', path, contents, this.session.stopwatch.total);
    }
    /** EventEmitter for when direcotries are created */
    directoryCreated(path, context) {
        this.emit('directoryCreated', path, context, this.session.stopwatch.total);
    }
}
exports.FileSystem = FileSystem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXN5c3RlbS5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJmcy9maWxlc3lzdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1Q0FBdUM7QUFDdkMsa0NBQWtDOzs7QUFFbEMsaURBQWlEO0FBRWpELDZDQUEyQztBQUMzQyxtQ0FBNEM7QUFFNUMscUNBQWtDO0FBRWxDLE1BQU0sT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDeEIsTUFBTSxPQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQXVDeEI7Ozs7RUFJRTtBQUNGLElBQVksUUFpQlg7QUFqQkQsV0FBWSxRQUFRO0lBQ2xCOztPQUVHO0lBQ0gsNkNBQVcsQ0FBQTtJQUNYOztPQUVHO0lBQ0gsdUNBQVEsQ0FBQTtJQUNSOztPQUVHO0lBQ0gsaURBQWEsQ0FBQTtJQUNiOztPQUVHO0lBQ0gsd0RBQWlCLENBQUE7QUFDbkIsQ0FBQyxFQWpCVyxRQUFRLHdCQUFSLFFBQVEsUUFpQm5CO0FBUUQ7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFzQixVQUFVO0lBVzlCLEtBQUssQ0FBQyxZQUFZLENBQTZCLEtBQWMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxLQUFLLENBQUMsVUFBVSxFQUFFLFdBQTBCLElBQUksRUFBRSxTQUFTLEdBQUcsQ0FBQztRQUNqSixNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMvRSxJQUFJLE1BQU0sRUFBRSxDQUFDO1lBQ1gsSUFBSSxTQUFTLElBQUksU0FBUyxHQUFHLE1BQU0sRUFBRSxDQUFDO2dCQUNwQyxPQUFPLE1BQU0sSUFBSSxDQUFD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