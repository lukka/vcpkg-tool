"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Uri = void 0;
exports.isFilePath = isFilePath;
const assert_1 = require("assert");
const path_1 = require("path");
const url_1 = require("url");
const vscode_uri_1 = require("vscode-uri");
const hash_1 = require("./hash");
const text_1 = require("./text");
/**
 * This class is intended to be a drop-in replacement for the vscode uri
 * class, but has a filesystem associated with it.
 *
 * By associating the filesystem with the URI, we can allow for file URIs
 * to be scoped to a given filesystem (ie, a zip could be a filesystem )
 *
 * Uniform Resource Identifier (URI) https://tools.ietf.org/html/rfc3986.
 * This class is a simple parser which creates the basic component parts
 * (https://tools.ietf.org/html/rfc3986#section-3) with minimal validation
 * and encoding.
 *
 *
 * ```txt
 *       foo://example.com:8042/over/there?name=ferret#nose
 *       \_/   \______________/\_________/ \_________/ \__/
 *        |           |            |            |        |
 *     scheme     authority       path        query   fragment
 *        |   _____________________|__
 *       / \ /                        \
 *       urn:example:animal:ferret:nose
 * ```
 *
 */
class Uri {
    fileSystem;
    uri;
    constructor(fileSystem, uri) {
        this.fileSystem = fileSystem;
        this.uri = uri;
    }
    static invalid = new Uri(undefined, vscode_uri_1.URI.parse('invalid:'));
    static isInvalid(uri) {
        return uri === undefined || Uri.invalid === uri;
    }
    /**
    * scheme is the 'https' part of 'https://www.msft.com/some/path?query#fragment'.
    * The part before the first colon.
    */
    get scheme() { return this.uri.scheme; }
    /**
    * authority is the 'www.msft.com' part of 'https://www.msft.com/some/path?query#fragment'.
    * The part between the first double slashes and the next slash.
    */
    get authority() { return this.uri.authority; }
    /**
     * path is the '/some/path' part of 'https://www.msft.com/some/path?query#fragment'.
     */
    get path() { return this.uri.path; }
    /**
     * query is the 'query' part of 'https://www.msft.com/some/path?query#fragment'.
     */
    get query() { return this.uri.query; }
    /**
     * fragment is the 'fragment' part of 'https://www.msft.com/some/path?query#fragment'.
     */
    get fragment() { return this.uri.fragment; }
    /**
    * Creates a new Uri from a string, e.g. `https://www.msft.com/some/path`,
    * `file:///usr/home`, or `scheme:with/path`.
    *
    * @param value A string which represents an URI (see `URI#toString`).
    */
    static parse(fileSystem, value, _strict) {
        return new Uri(fileSystem, vscode_uri_1.URI.parse(value, _strict));
    }
    /**
     * Creates a new Uri from a string, and replaces 'vsix' schemes with file:// instead.
     *
     * @param value A string which represents a URI which may be a VSIX uri.
     */
    static parseFilterVsix(fileSystem, value, _strict, vsixBaseUri) {
        const parsed = vscode_uri_1.URI.parse(value, _strict);
        if (vsixBaseUri && parsed.scheme === 'vsix') {
            return vsixBaseUri.join(parsed.path);
        }
        return new Uri(fileSystem, parsed);
    }
    /**
   * Creates a new URI from a file system path, e.g. `c:\my\files`,
   * `/usr/home`, or `\\server\share\some\path`.
   *
   * The *difference* between `URI#parse` and `URI#file` is that the latter treats the argument
   * as path, not as stringified-uri. E.g. `URI.file(path)` is **not the same as**
   * `URI.parse('file://' + path)` because the path might contain characters that are
   * interpreted (# and ?). See the following sample:
   * ```ts
  const good = URI.file('/coding/c#/project1');
  good.scheme === 'file';
  good.path === '/coding/c#/project1';
  good.fragment === '';
  const bad = URI.parse('file://' + '/coding/c#/project1');
  bad.scheme === 'file';
  bad.path === '/coding/c'; // path is now broken
  bad.fragment === '/project1';
  ```
   *
   * @param path A file system path (see `URI#fsPath`)
   */
    static file(fileSystem, path) {
        return new Uri(fileSystem, vscode_uri_1.URI.file(path));
    }
    /** construct an Uri from the various parts */
    static from(fileSystem, components) {
        return new Uri(fileSystem, vscode_uri_1.URI.from(components));
    }
    /**
     * Join all arguments together and normalize the resulting Uri.
     *
     * Also ensures that slashes are all forward.
     * */
    join(...paths) {
        return new Uri(this.fileSystem, this.with({ path: (0, path_1.join)(this.path, ...paths).replace(/\\/g, '/') }));
    }
    relative(target) {
        assert_1.strict.ok(target.authority === this.authority, `Uris '${target.toString()}' and '${this.toString()}' are not of the same base`);
        return (0, path_1.relative)(this.path, target.path).replace(/\\/g, '/');
    }
    /** returns true if the uri represents a file:// resource. */
    get isLocal() {
        return this.scheme === 'file' || this.scheme === 'vsix';
    }
    get isHttps() {
        return this.scheme === 'https';
    }
    /**
     * Returns a string representing the corresponding file system path of this URI.
     * Will handle UNC paths, normalizes windows drive letters to lower-case, and uses the
     * platform specific path separator.
     *
     * * Will *not* validate the path for invalid characters and semantics.
     * * Will *not* look at the scheme of this URI.
     * * The result shall *not* be used for display purposes but for accessing a file on disk.
     *
     *
     * The *difference* to `URI#path` is the use of the platform specific separator and the handling
     * of UNC paths. See the below sample of a file-uri with an authority (UNC path).
     *
     * ```ts
        const u = URI.parse('file://server/c$/folder/file.txt')
        u.authority === 'server'
        u.path === '/shares/c$/file.txt'
        u.fsPath === '\\server\c$\folder\file.txt'
    ```
     *
     * Using `URI#path` to read a file (using fs-apis) would not be enough because parts of the path,
     * namely the server name, would be missing. Therefore `URI#fsPath` exists - it's sugar to ease working
     * with URIs that represent files on disk (`file` scheme).
     */
    get fsPath() {
        return this.uri.fsPath;
    }
    /** Duplicates the current Uri, changing out any parts */
    with(change) {
        return new Uri(this.fileSystem, this.uri.with(change));
    }
    /**
    * Creates a string representation for this URI. It's guaranteed that calling
    * `URI.parse` with the result of this function creates an URI which is equal
    * to this URI.
    *
    * * The result shall *not* be used for display purposes but for externalization or transport.
    * * The result will be encoded using the percentage encoding and encoding happens mostly
    * ignore the scheme-specific encoding rules.
    *
    * @param skipEncoding Do not encode the result, default is `false`
    */
    toString(skipEncoding) {
        return this.uri.toString(skipEncoding);
    }
    get formatted() {
        return this.scheme === 'file' ? this.uri.fsPath : this.uri.toString();
    }
    /** returns a JSON object with the components of the Uri */
    toJSON() {
        return this.uri.toJSON();
    }
    toUrl() {
        return new url_1.URL(this.uri.toString());
    }
    /* Act on this uri */
    resolve(uriOrRelativePath) {
        return typeof uriOrRelativePath === 'string' ? this.join(uriOrRelativePath) : uriOrRelativePath ?? this;
    }
    stat(uri) {
        uri = this.resolve(uri);
        return uri.fileSystem.stat(uri);
    }
    readDirectory(uri, options) {
        uri = this.resolve(uri);
        return uri.fileSystem.readDirectory(uri, options);
    }
    async createDirectory(uri) {
        uri = this.resolve(uri);
        await uri.fileSystem.createDirectory(uri);
        return uri;
    }
    readFile(uri) {
        uri = this.resolve(uri);
        return uri.fileSystem.readFile(uri);
    }
    async readUTF8(uri) {
        return (0, text_1.decode)(await this.readFile(uri));
    }
    async tryReadUTF8(uri) {
        try {
            return await this.readUTF8(uri);
            // eslint-disable-next-line no-empty
        }
        catch { }
        return undefined;
    }
    openFile(uri) {
        uri = this.resolve(uri);
        return uri.fileSystem.openFile(uri);
    }
    readStream(start = 0, end = Infinity) {
        return this.fileSystem.readStream(this, { start, end });
    }
    async readBlock(start = 0, end = Infinity) {
        const stream = await this.fileSystem.readStream(this, { start, end });
        let block = Buffer.alloc(0);
        for await (const chunk of stream) {
            block = Buffer.concat([block, chunk]);
        }
        return block;
    }
    async writeFile(content) {
        await this.fileSystem.writeFile(this, content);
        return this;
    }
    writeUTF8(content) {
        return this.writeFile((0, text_1.encode)(content));
    }
    writeStream(options) {
        return this.fileSystem.writeStream(this, options);
    }
    delete(options) {
        return this.fileSystem.delete(this, options);
    }
    exists(uri) {
        uri = this.resolve(uri);
        return uri.fileSystem.exists(uri);
    }
    isFile(uri) {
        uri = this.resolve(uri);
        return uri.fileSystem.isFile(uri);
    }
    isSymlink(uri) {
        uri = this.resolve(uri);
        return uri.fileSystem.isSymlink(uri);
    }
    isDirectory(uri) {
        uri = this.resolve(uri);
        return uri.fileSystem.isDirectory(uri);
    }
    async size(uri) {
        return (await this.stat(uri)).size;
    }
    async hash(algorithm) {
        if (algorithm) {
            return await (0, hash_1.hash)(await this.fileSystem.readStream(this), this, await this.size(), algorithm, {});
        }
        return undefined;
    }
    async hashValid(events, matchOptions) {
        if (matchOptions?.algorithm && await this.exists()) {
            events.hashVerifyStart?.(this.fsPath);
            const result = matchOptions.value?.toLowerCase() === await (0, hash_1.hash)(await this.readStream(), this, await this.size(), matchOptions.algorithm, events);
            events.hashVerifyComplete?.(this.fsPath);
            return result;
        }
        return false;
    }
    get parent() {
        return new Uri(this.fileSystem, this.with({
            path: (0, path_1.dirname)(this.path)
        }));
    }
}
exports.Uri = Uri;
function isFilePath(uriOrPath) {
    if (uriOrPath) {
        if (uriOrPath instanceof Uri) {
            return uriOrPath.scheme === 'file';
        }
        if (uriOrPath.startsWith('file:')) {
            return true;
        }
        return !!(/^[/\\.]|^[a-zA-Z]:/g.exec((uriOrPath || '').toString()));
    }
    return false;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJpLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9taWNyb3NvZnQvdmNwa2ctdG9vbC9tYWluL3ZjcGtnLWFydGlmYWN0cy8iLCJzb3VyY2VzIjpbInV0aWwvdXJpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1Q0FBdUM7QUFDdkMsa0NBQWtDOzs7QUFxVmxDLGdDQVdDO0FBOVZELG1DQUFnQztBQUNoQywrQkFBK0M7QUFFL0MsNkJBQTBCO0FBQzFCLDJDQUFpQztBQUlqQyxpQ0FBK0M7QUFDL0MsaUNBQXdDO0FBRXhDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVCRztBQUNILE1BQWEsR0FBRztJQUN3QjtJQUEyQztJQUFqRixZQUFzQyxVQUFzQixFQUFxQixHQUFRO1FBQW5ELGVBQVUsR0FBVixVQUFVLENBQVk7UUFBcUIsUUFBRyxHQUFILEdBQUcsQ0FBSztJQUV6RixDQUFDO0lBRUQsTUFBTSxDQUFVLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBTSxTQUFTLEVBQUUsZ0JBQUcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUV6RSxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQVM7UUFDeEIsT0FBTyxHQUFHLEtBQUssU0FBUyxJQUFJLEdBQUcsQ0FBQyxPQUFPLEtBQUssR0FBRyxDQUFDO0lBQ2xELENBQUM7SUFDRDs7O01BR0U7SUFDRixJQUFJLE1BQU0sS0FBSyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUV4Qzs7O01BR0U7SUFDRixJQUFJLFNBQVMsS0FBSyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUU5Qzs7T0FFRztJQUNILElBQUksSUFBSSxLQUFLLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRXBDOztPQUVHO0lBQ0gsSUFBSSxLQUFLLEtBQUss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