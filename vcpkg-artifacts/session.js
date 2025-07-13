"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const assert_1 = require("assert");
const crypto_1 = require("crypto");
const metadata_file_1 = require("./amf/metadata-file");
const artifact_1 = require("./artifacts/artifact");
const constants_1 = require("./constants");
const http_filesystem_1 = require("./fs/http-filesystem");
const local_filesystem_1 = require("./fs/local-filesystem");
const unified_filesystem_1 = require("./fs/unified-filesystem");
const vsix_local_filesystem_1 = require("./fs/vsix-local-filesystem");
const i18n_1 = require("./i18n");
const git_1 = require("./installers/git");
const nuget_1 = require("./installers/nuget");
const untar_1 = require("./installers/untar");
const unzip_1 = require("./installers/unzip");
const registries_1 = require("./registries/registries");
const channels_1 = require("./util/channels");
function hexsha(content) {
    return (0, crypto_1.createHash)('sha256').update(content, 'ascii').digest('hex');
}
function formatArtifactEntry(entry) {
    // we hash all the things to remove PII
    return `${hexsha(entry.registryUri)}:${hexsha(entry.id)}:${hexsha(entry.version)}`;
}
/**
 * The Session class is used to hold a reference to the
 * message channels,
 * the filesystems,
 * and any other 'global' data that should be kept.
 *
 */
class Session {
    context;
    settings;
    /** @internal */
    stopwatch = new channels_1.Stopwatch();
    fileSystem;
    channels;
    homeFolder;
    nextPreviousEnvironment;
    installFolder;
    registryFolder;
    telemetryFile;
    get vcpkgCommand() { return this.settings.vcpkgCommand; }
    globalConfig;
    downloads;
    currentDirectory;
    configuration;
    /** register installer functions here */
    installers = new Map([
        ['nuget', nuget_1.installNuGet],
        ['unzip', unzip_1.installUnZip],
        ['untar', untar_1.installUnTar],
        ['git', git_1.installGit]
    ]);
    registryDatabase = new registries_1.RegistryDatabase();
    globalRegistryResolver = new registries_1.RegistryResolver(this.registryDatabase);
    processVcpkgArg(argSetting, defaultName) {
        return argSetting ? this.fileSystem.file(argSetting) : this.homeFolder.join(defaultName);
    }
    constructor(currentDirectory, context, settings) {
        this.context = context;
        this.settings = settings;
        this.fileSystem = new unified_filesystem_1.UnifiedFileSystem(this).
            register('file', new local_filesystem_1.LocalFileSystem(this)).
            register('vsix', new vsix_local_filesystem_1.VsixLocalFilesystem(this)).
            register('https', new http_filesystem_1.HttpsFileSystem(this));
        this.channels = new channels_1.Channels(this);
        if (settings.telemetryFile) {
            this.telemetryFile = this.fileSystem.file(settings.telemetryFile);
        }
        this.homeFolder = this.fileSystem.file(settings.homeFolder);
        this.downloads = this.processVcpkgArg(settings.vcpkgDownloads, 'downloads');
        this.globalConfig = this.processVcpkgArg(settings.globalConfig, constants_1.configurationName);
        this.registryFolder = this.processVcpkgArg(settings.vcpkgRegistriesCache, 'registries').join('artifact');
        this.installFolder = this.processVcpkgArg(settings.vcpkgArtifactsRoot, 'artifacts');
        this.nextPreviousEnvironment = this.processVcpkgArg(settings.nextPreviousEnvironment, `previous-environment-${Date.now().toFixed()}.json`);
        this.currentDirectory = this.fileSystem.file(currentDirectory);
    }
    parseLocation(location) {
        // Drive letter, absolute Unix path, or drive-relative windows path, treat as a file
        if (/^[A-Za-z]:/.exec(location) || location.startsWith('/') || location.startsWith('\\')) {
            return this.fileSystem.file(location);
        }
        // Otherwise, it's a URI
        return this.fileSystem.parseUri(location);
    }
    async saveConfig() {
        await this.configuration?.save(this.globalConfig);
    }
    async init() {
        // load global configuration
        if (!await this.fileSystem.isDirectory(this.homeFolder)) {
            // let's create the folder
            try {
                await this.fileSystem.createDirectory(this.homeFolder);
            }
            catch (error) {
                // if this throws, let it
                this.channels.debug(error?.message);
            }
            // check if it got made, because at an absolute minimum, we need a folder, so failing this is catastrophic.
            assert_1.strict.ok(await this.fileSystem.isDirectory(this.homeFolder), (0, i18n_1.i) `Fatal: The root folder '${this.homeFolder.fsPath}' cannot be created`);
        }
        if (!await this.fileSystem.isFile(this.globalConfig)) {
            try {
                await this.globalConfig.writeUTF8(constants_1.defaultConfig);
            }
            catch {
                // if this throws, let it
            }
            // check if it got made, because at an absolute minimum, we need the config file, so failing this is catastrophic.
            assert_1.strict.ok(await this.fileSystem.isFile(this.globalConfig), (0, i18n_1.i) `Fatal: The global configuration file '${this.globalConfig.fsPath}' cannot be created`);
        }
        // got past the checks, let's load the configuration.
        this.configuration = await metadata_file_1.MetadataFile.parseMetadata(this.globalConfig.fsPath, this.globalConfig, this);
        this.channels.debug(`Loaded global configuration file '${this.globalConfig.fsPath}'`);
        // load the registries
        for (const [name, regDef] of this.configuration.registries) {
            const loc = regDef.location.get(0);
            if (loc) {
                const uri = this.parseLocation(loc);
                const reg = await this.registryDatabase.loadRegistry(this, uri);
                this.globalRegistryResolver.add(uri, name);
                if (reg) {
                    this.channels.debug(`Loaded global manifest ${name} => ${uri.formatted}`);
                }
            }
        }
        return this;
    }
    async findProjectProfile(startLocation = this.currentDirectory) {
        let location = startLocation;
        const path = location.join(constants_1.configurationName);
        if (await this.fileSystem.isFile(path)) {
            return path;
        }
        location = location.join('..');
        return (location.toString() === startLocation.toString()) ? undefined : this.findProjectProfile(location);
    }
    async getInstalledArtifacts() {
        const result = new Array();
        if (!await this.installFolder.exists()) {
            return result;
        }
        for (const [folder, stat] of await this.installFolder.readDirectory(undefined, { recursive: true })) {
            try {
                const artifactJsonPath = folder.join('artifact.json');
                const metadata = await metadata_file_1.MetadataFile.parseMetadata(artifactJsonPath.fsPath, artifactJsonPath, this);
                result.push({
                    folder,
                    id: metadata.id,
                    artifact: await new artifact_1.InstalledArtifact(this, metadata)
                });
            }
            catch {
                // not a valid install.
            }
        }
        return result;
    }
    /** returns an installer function (or undefined) for a given installerkind */
    artifactInstaller(installInfo) {
        return this.installers.get(installInfo.installerKind);
    }
    async openManifest(filename, uri) {
        return await metadata_file_1.MetadataFile.parseConfiguration(filename, await uri.readUTF8(), this);
    }
    #acquiredArtifacts = [];
    #activatedArtifacts = [];
    trackAcquire(registryUri, id, version) {
        this.#acquiredArtifacts.push({ registryUri: registryUri, id: id, version: version });
    }
    trackActivate(registryUri, id, version) {
        this.#activatedArtifacts.push({ registryUri: registryUri, id: id, version: version });
    }
    writeTelemetry() {
        const acquiredArtifacts = this.#acquiredArtifacts.map(formatArtifactEntry).join(',');
        const activatedArtifacts = this.#activatedArtifacts.map(formatArtifactEntry).join(',');
        const telemetryFile = this.telemetryFile;
        if (telemetryFile) {
            return telemetryFile.writeUTF8(JSON.stringify({
                'acquired-artifacts': acquiredArtifacts,
                'activated-artifacts': activatedArtifacts
            }));
        }
        return Promise.resolve(undefined);
    }
}
exports.Session = Session;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vzc2lvbi5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJzZXNzaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1Q0FBdUM7QUFDdkMsa0NBQWtDOzs7QUFFbEMsbUNBQWdDO0FBQ2hDLG1DQUFvQztBQUNwQyx1REFBbUQ7QUFDbkQsbURBQW1FO0FBQ25FLDJDQUErRDtBQUUvRCwwREFBdUQ7QUFDdkQsNERBQXdEO0FBQ3hELGdFQUE0RDtBQUM1RCxzRUFBaUU7QUFDakUsaUNBQTJCO0FBQzNCLDBDQUE4QztBQUM5Qyw4Q0FBa0Q7QUFDbEQsOENBQWtEO0FBQ2xELDhDQUFrRDtBQUdsRCx3REFBNkU7QUFDN0UsOENBQXNEO0FBNkN0RCxTQUFTLE1BQU0sQ0FBQyxPQUFlO0lBQzdCLE9BQU8sSUFBQSxtQkFBVSxFQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3JFLENBQUM7QUFFRCxTQUFTLG1CQUFtQixDQUFDLEtBQW9CO0lBQy9DLHVDQUF1QztJQUN2QyxPQUFPLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztBQUNyRixDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsTUFBYSxPQUFPO0lBZ0NvQztJQUFrQztJQS9CeEYsZ0JBQWdCO0lBQ1AsU0FBUyxHQUFHLElBQUksb0JBQVMsRUFBRSxDQUFDO0lBQzVCLFVBQVUsQ0FBYTtJQUN2QixRQUFRLENBQVc7SUFDbkIsVUFBVSxDQUFNO0lBQ2hCLHVCQUF1QixDQUFNO0lBQzdCLGFBQWEsQ0FB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