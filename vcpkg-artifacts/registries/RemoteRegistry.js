"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteRegistry = void 0;
const assert_1 = require("assert");
const crypto_1 = require("crypto");
const yaml_1 = require("yaml");
const constants_1 = require("../constants");
const acquire_1 = require("../fs/acquire");
const i18n_1 = require("../i18n");
const checks_1 = require("../util/checks");
const vcpkg_1 = require("../vcpkg");
const ArtifactRegistry_1 = require("./ArtifactRegistry");
const artifact_index_1 = require("./artifact-index");
const indexer_1 = require("./indexer");
class RemoteRegistry extends ArtifactRegistry_1.ArtifactRegistry {
    indexYaml;
    installationFolder;
    cacheFolder;
    #localName;
    constructor(session, location) {
        assert_1.strict.ok(location.scheme === 'https', `remote registry location must be an HTTPS uri (${location})`);
        super(session, location);
        this.cacheFolder = session.registryFolder.join(this.localName);
        this.indexYaml = this.cacheFolder.join(constants_1.registryIndexFile);
        this.installationFolder = session.installFolder.join(this.localName);
    }
    /*
    notes:
      // does this look like a github repo (in which case assume '${url}/archive/refs/heads/main.zip') as the packed repo.
      // does this point to a .zip file ?
      // https://github.com/microsoft/vcpkg-ce-catalog/archive/refs/heads/main.zip
   */
    get localName() {
        if (!this.#localName) {
            switch (this.location.authority.toLowerCase()) {
                case 'aka.ms':
                    return this.#localName = this.location.path.replace(/\//g, '');
                case 'github.com':
                    if ((0, checks_1.isGithubRepo)(this.location)) {
                        // it's a reference to a github repo, the assumption that the zip archive is what we're getting
                        return this.#localName = this.location.path;
                    }
                    break;
            }
            // if we didn't get a match, use the url to generate a local filesystem name
            this.#localName = (0, crypto_1.createHash)('sha256').update(this.location.toString(), 'utf8').digest('hex').substring(0, 8);
        }
        return this.#localName;
    }
    get safeName() {
        return this.localName.replace(/[^a-zA-Z0-9]/g, '.');
    }
    async load(force) {
        if (force || !this.loaded) {
            if (!await this.indexYaml.exists()) {
                await this.update();
            }
            assert_1.strict.ok(await this.indexYaml.exists(), `Index file is missing '${this.indexYaml.fsPath}'`);
            // load it fresh.
            this.index = new indexer_1.Index(artifact_index_1.ArtifactIndex);
            this.session.channels.debug(`Loading registry from '${this.indexYaml.fsPath}'`);
            this.index.deserialize((0, yaml_1.parse)(await this.indexYaml.readUTF8()));
            this.loaded = true;
        }
    }
    async update(displayName) {
        const displayNameStr = displayName ?? this.location.toString();
        this.session.channels.message((0, i18n_1.i) `Updating registry data from ${displayNameStr}`);
        let locations = [this.location];
        if ((0, checks_1.isGithubRepo)(this.location)) {
            // it's just a github uri, let's use the main/m*ster branch as the zip file location.
            locations = [this.location.join('archive/refs/heads/main.zip'), this.location.join('archive/refs/heads/master.zip')];
        }
        const file = await (0, acquire_1.acquireArtifactFile)(this.session, locations, `${this.safeName}-registry.zip`, {}, { force: true });
        if (await file.exists()) {
            const targetLocation = this.cacheFolder.fsPath;
            await (0, vcpkg_1.vcpkgExtract)(this.session, file.fsPath, targetLocation, 'AUTO');
            await file.delete();
        }
    }
}
exports.RemoteRegistry = RemoteRegistry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVtb3RlUmVnaXN0cnkuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21pY3Jvc29mdC92Y3BrZy10b29sL21haW4vdmNwa2ctYXJ0aWZhY3RzLyIsInNvdXJjZXMiOlsicmVnaXN0cmllcy9SZW1vdGVSZWdpc3RyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBRWxDLG1DQUFnQztBQUNoQyxtQ0FBb0M7QUFDcEMsK0JBQTZCO0FBQzdCLDRDQUFpRDtBQUNqRCwyQ0FBb0Q7QUFDcEQsa0NBQTRCO0FBRTVCLDJDQUE4QztBQUU5QyxvQ0FBd0M7QUFDeEMseURBQXNEO0FBQ3RELHFEQUFpRDtBQUNqRCx1Q0FBa0M7QUFFbEMsTUFBYSxjQUFlLFNBQVEsbUNBQWdCO0lBQ3hDLFNBQVMsQ0FBTTtJQUNoQixrQkFBa0IsQ0FBQztJQUNuQixXQUFXLENBQU07SUFDMUIsVUFBVSxDQUFxQjtJQUUvQixZQUFZLE9BQWdCLEVBQUUsUUFBYTtRQUN6QyxlQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEtBQUssT0FBTyxFQUFFLGtEQUFrRCxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ3RHLEtBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFekIsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyw2QkFBaUIsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVEOzs7OztLQUtDO0lBQ0QsSUFBWSxTQUFTO1FBQ25CLElB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