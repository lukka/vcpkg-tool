"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.acquireArtifactFile = acquireArtifactFile;
exports.resolveNugetUrl = resolveNugetUrl;
exports.acquireNugetFile = acquireNugetFile;
const assert_1 = require("assert");
const i18n_1 = require("../i18n");
const exceptions_1 = require("../util/exceptions");
const vcpkg_1 = require("../vcpkg");
async function acquireArtifactFile(session, uris, outputFilename, events, options) {
    await session.downloads.createDirectory();
    session.channels.debug(`Acquire file '${outputFilename}' from [${uris.map(each => each.toString()).join(',')}]`);
    // is the file present on a local filesystem?
    for (const uri of uris) {
        if (uri.isLocal) {
            // we have a local file
            if (options?.algorithm && options?.value) {
                // we have a hash.
                // is it valid?
                if (await uri.hashValid(events, options)) {
                    session.channels.debug(`Local file matched hash: ${uri.fsPath}`);
                    return uri;
                }
            }
            else if (await uri.exists()) {
                // we don't have a hash, but the file is local, and it exists.
                // we have to return it
                session.channels.debug(`Using local file (no hash, unable to verify): ${uri.fsPath}`);
                return uri;
            }
            // do we have a filename
        }
    }
    // we don't have a local file
    // https is all that we know at the moment.
    const webUris = uris.where(each => each.isHttps);
    if (webUris.length === 0) {
        // wait, no web uris?
        throw new exceptions_1.RemoteFileUnavailable(uris);
    }
    return https(session, webUris, outputFilename, events, options);
}
/** */
async function https(session, uris, outputFilename, events, options) {
    session.channels.debug(`Attempting to download file '${outputFilename}' from [${uris.map(each => each.toString()).join(',')}]`);
    const hashAlgorithm = options?.algorithm;
    const outputFile = session.downloads.join(outputFilename);
    if (options?.force) {
        session.channels.debug(`Acquire '${outputFilename}': force specified, forcing download`);
        // is force specified; delete the current file
        await outputFile.delete();
    }
    else if (hashAlgorithm) {
        // does it match a hash that we have?
        if (await outputFile.hashValid(events, options)) {
            session.channels.debug(`Acquire '${outputFilename}': local file hash matches metdata`);
            // yes it does. let's just return done.
            return outputFile;
        }
        // invalid hash, deleting file
        session.channels.debug(`Acquire '${outputFilename}': local file hash mismatch, redownloading`);
        await outputFile.delete();
    }
    else if (await outputFile.exists()) {
        session.channels.debug(`Acquire '${outputFilename}': skipped due to existing file, no hash known`);
        session.channels.warning((0, i18n_1.i) `Assuming '${outputFilename}' is correct; supply a hash in the artifact metadata to suppress this message.`);
        return outputFile;
    }
    session.channels.debug(`Acquire '${outputFilename}': checking remote connections`);
    events.downloadStart?.(uris, outputFile.fsPath);
    let sha512 = undefined;
    if (hashAlgorithm == 'sha512') {
        sha512 = options?.value;
    }
    await (0, vcpkg_1.vcpkgDownload)(session, outputFile.fsPath, sha512, uris, events);
    events.downloadComplete?.();
    // we've downloaded the file, let's see if it matches the hash we have.
    if (hashAlgorithm == 'sha512') {
        // vcpkg took care of it already
        session.channels.debug(`Acquire '${outputFilename}': vcpkg checked SHA512`);
    }
    else if (hashAlgorithm) {
        session.channels.debug(`Acquire '${outputFilename}': checking downloaded file hash`);
        // does it match the hash that we have?
        if (!await outputFile.hashValid(events, options)) {
            await outputFile.delete();
            throw new Error((0, i18n_1.i) `Downloaded file '${outputFile.fsPath}' did not have the correct hash (${options.algorithm}: ${options.value}) `);
        }
        session.channels.debug(`Acquire '${outputFilename}': downloaded file hash matches specified hash`);
    }
    session.channels.debug(`Acquire '${outputFilename}': downloading file successful`);
    return outputFile;
}
async function resolveNugetUrl(session, pkg) {
    const [, name, version] = pkg.match(/^(.*)\/(.*)$/) ?? [];
    assert_1.strict.ok(version, (0, i18n_1.i) `package reference '${pkg}' is not a valid nuget package reference ({name}/{version})`);
    // let's resolve the redirect first, since nuget servers don't like us getting HEAD data on the targets via a redirect.
    // even if this wasn't the case, this is lower cost now rather than later.
    return session.fileSystem.parseUri(`https://www.nuget.org/api/v2/package/${name}/${version}`);
}
async function acquireNugetFile(session, pkg, outputFilename, events, options) {
    return https(session, [await resolveNugetUrl(session, pkg)], outputFilename, events, options);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNxdWlyZS5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJmcy9hY3F1aXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1Q0FBdUM7QUFDdkMsa0NBQWtDOztBQWdCbEMsa0RBbUNDO0FBeURELDBDQU9DO0FBRUQsNENBRUM7QUFySEQsbUNBQWdDO0FBQ2hDLGtDQUE0QjtBQUc1QixtREFBMkQ7QUFHM0Qsb0NBQXlDO0FBT2xDLEtBQUssVUFBVSxtQkFBbUIsQ0FBQyxPQUFnQixFQUFFLElBQWdCLEVBQUUsY0FBc0IsRUFBRSxNQUErQixFQUFFLE9BQXdCO0lBQzdKLE1BQU0sT0FBTyxDQUFDLFNBQVMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUMxQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsY0FBYyxXQUFXLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRWpILDZDQUE2QztJQUM3QyxLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ3ZCLElBQUksR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2hCLHVCQUF1QjtZQUV2QixJQUFJLE9BQU8sRUFBRSxTQUFTLElBQUksT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDO2dCQUN6QyxrQkFBa0I7Z0JBQ2xCLGVBQWU7Z0JBQ2YsSUFBSSxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUM7b0JBQ3pDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLDRCQUE0QixHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztv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