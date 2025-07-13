"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnifiedFileSystem = void 0;
exports.schemeOf = schemeOf;
const assert_1 = require("assert");
const i18n_1 = require("../i18n");
const filesystem_1 = require("./filesystem");
/**
 * gets the scheme off the front of an uri.
 * @param uri the uri to get the scheme for.
 * @returns the scheme, undefined if the uri has no scheme (colon)
 */
function schemeOf(uri) {
    assert_1.strict.ok(uri, (0, i18n_1.i) `Uri may not be empty`);
    return /^(\w*):/.exec(uri)?.[1];
}
class UnifiedFileSystem extends filesystem_1.FileSystem {
    filesystems = {};
    /** registers a scheme to a given filesystem
     *
     * @param scheme the Uri scheme to reserve
     * @param fileSystem the filesystem to associate with the scheme
     */
    register(scheme, fileSystem) {
        assert_1.strict.ok(!this.filesystems[scheme], (0, i18n_1.i) `scheme '${scheme}' already registered`);
        this.filesystems[scheme] = fileSystem;
        return this;
    }
    /**
     * gets the filesystem for the given uri.
     *
     * @param uri the uri to check the filesystem for
     *
     * @returns the filesystem. Will throw if no filesystem is valid.
     */
    filesystem(uri) {
        const scheme = schemeOf(uri.toString());
        assert_1.strict.ok(scheme, (0, i18n_1.i) `uri ${uri.toString()} has no scheme`);
        const filesystem = this.filesystems[scheme];
        assert_1.strict.ok(filesystem, (0, i18n_1.i) `scheme ${scheme} has no filesystem associated with it`);
        return filesystem;
    }
    /**
    * Creates a new URI from a string, e.g. `https://www.msft.com/some/path`,
    * `file:///usr/home`, or `scheme:with/path`.
    *
    * @param uri A string which represents an URI (see `URI#toString`).
    */
    parseUri(uri, _strict) {
        return this.filesystem(uri).parseUri(uri);
    }
    stat(uri) {
        return this.filesystem(uri).stat(uri);
    }
    async readDirectory(uri, options) {
        return this.filesystem(uri).readDirectory(uri, options);
    }
    createDirectory(uri) {
        return this.filesystem(uri).createDirectory(uri);
    }
    readFile(uri) {
        return this.filesystem(uri).readFile(uri);
    }
    openFile(uri) {
        return this.filesystem(uri).openFile(uri);
    }
    writeFile(uri, content) {
        return this.filesystem(uri).writeFile(uri, content);
    }
    readStream(uri, options) {
        return this.filesystem(uri).readStream(uri, options);
    }
    writeStream(uri, options) {
        return this.filesystem(uri).writeStream(uri, options);
    }
    delete(uri, options) {
        return this.filesystem(uri).delete(uri, options);
    }
    rename(source, target, options) {
        assert_1.strict.ok(source.fileSystem === target.fileSystem, (0, i18n_1.i) `may not rename across filesystems`);
        return source.fileSystem.rename(source, target, options);
    }
    copy(source, target, options) {
        return target.fileSystem.copy(source, target);
    }
    createSymlink(original, symlink) {
        return symlink.fileSystem.createSymlink(original, symlink);
    }
}
exports.UnifiedFileSystem = UnifiedFileSystem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pZmllZC1maWxlc3lzdGVtLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9taWNyb3NvZnQvdmNwa2ctdG9vbC9tYWluL3ZjcGtnLWFydGlmYWN0cy8iLCJzb3VyY2VzIjpbImZzL3VuaWZpZWQtZmlsZXN5c3RlbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBYWxDLDRCQUdDO0FBZEQsbUNBQWdDO0FBRWhDLGtDQUE0QjtBQUU1Qiw2Q0FBOEY7QUFFOUY7Ozs7R0FJRztBQUNILFNBQWdCLFFBQVEsQ0FBQyxHQUFXO0lBQ2xDLGVBQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLElBQUEsUUFBQyxFQUFBLHNCQUFzQixDQUFDLENBQUM7SUFDeEMsT0FBTyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEMsQ0FBQztBQUVELE1BQWEsaUJBQWtCLFNBQVEsdUJBQVU7SUFFdkMsV0FBVyxHQUFnQyxFQUFFLENBQUM7SUFFdEQ7Ozs7T0FJRztJQUNILFFBQVEsQ0FBQyxNQUFjLEVBQUUsVUFBc0I7UUFDN0MsZUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBQSxRQUFDLEVBQUEsV0FBVyxNQUFNLHNCQUFzQixDQUFDLENBQUM7UUFDL0UsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxVQUFVLENBQUM7UUFDdEMsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksVUFBVSxDQUFDLEdBQWlCO1FBQ2pDLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUV4QyxlQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxJQUFBLFFBQUMsRUFBQSxP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