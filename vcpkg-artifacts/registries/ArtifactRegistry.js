"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtifactRegistry = void 0;
const semver_1 = require("semver");
const metadata_file_1 = require("../amf/metadata-file");
const artifact_1 = require("../artifacts/artifact");
const filesystem_1 = require("../fs/filesystem");
const promise_1 = require("../util/promise");
const yaml_1 = require("../yaml/yaml");
const artifact_index_1 = require("./artifact-index");
const indexer_1 = require("./indexer");
class ArtifactRegistry {
    session;
    location;
    constructor(session, location) {
        this.session = session;
        this.location = location;
    }
    index = new indexer_1.Index(artifact_index_1.ArtifactIndex);
    get count() {
        return this.index.indexOfTargets.length;
    }
    #loaded = false;
    get loaded() {
        return this.#loaded;
    }
    set loaded(loaded) {
        this.#loaded = loaded;
    }
    async regenerate(normalize) {
        // reset the index to blank.
        this.index = new indexer_1.Index(artifact_index_1.ArtifactIndex);
        const repo = this;
        const q = new promise_1.Queue();
        const session = this.session;
        async function processFile(uri) {
            const content = await uri.readUTF8();
            try {
                const amf = await metadata_file_1.MetadataFile.parseConfiguration(uri.fsPath, content, session);
                if (!amf.isFormatValid) {
                    for (const err of amf.formatErrors) {
                        repo.session.channels.warning(`Parse errors in metadata file ${err}}`);
                    }
                    throw new Error('invalid format');
                }
                let anyErrors = false;
                for (const err of amf.validate()) {
                    repo.session.channels.warning(amf.formatVMessage(err));
                    anyErrors = true;
                }
                if (anyErrors) {
                    throw new Error('invalid manifest');
                }
                let fileUpdated = false;
                for (const warning of amf.deprecationWarnings()) {
                    if (normalize) {
                        amf.normalize();
                        fileUpdated = true;
                    }
                    else {
                        repo.session.channels.warning(amf.formatVMessage(warning));
                    }
                }
                repo.session.channels.debug(`Inserting ${uri.formatted} into index.`);
                repo.index.insert(amf, repo.cacheFolder.relative(uri));
                if (fileUpdated) {
                    await amf.save(uri);
                }
            }
            catch (e) {
                repo.session.channels.debug(e.toString());
                repo.session.channels.warning(`skipping invalid metadata file ${uri.fsPath}`);
            }
        }
        async function process(folder) {
            for (const [entry, type] of await folder.readDirectory()) {
                if (type & filesystem_1.FileType.Directory) {
                    await process(entry);
                    continue;
                }
                if (type & filesystem_1.FileType.File && entry.path.endsWith('.json')) {
                    void q.enqueue(() => processFile(entry));
                }
            }
        }
        // process the files in the local folder
        await process(this.cacheFolder);
        await q.done;
        // we're done inserting values
        this.index.doneInsertion();
        this.loaded = true;
    }
    async search(criteria) {
        await this.load();
        const query = this.index.where;
        if (criteria?.idOrShortName) {
            query.id.nameOrShortNameIs(criteria.idOrShortName);
        }
        if (criteria?.keyword) {
            query.id.contains(criteria.keyword);
        }
        const version = criteria?.version;
        if (version && version !== '*') {
            query.version.rangeMatch(version);
        }
        return [...(await this.openArtifacts(query.items)).entries()];
    }
    async openArtifact(manifestPath) {
        const metadataPath = this.cacheFolder.join(manifestPath);
        const metadata = await metadata_file_1.MetadataFile.parseMetadata(metadataPath.fsPath, metadataPath, this.session, this.location);
        const id = metadata.id;
        return new artifact_1.Artifact(this.session, metadata, this.index.indexSchema.id.getShortNameOf(id) || id, this.installationFolder.join(id.replace(/[^\w]+/g, '.'), metadata.version));
    }
    async openArtifacts(manifestPaths) {
        let metadataFiles = new Array();
        // load them up async, but throttled via a queue
        await manifestPaths.forEachAsync(async (manifest) => metadataFiles.push(await this.openArtifact(manifest))).done;
        // sort the contents by version before grouping. (descending version)
        metadataFiles = metadataFiles.sort((a, b) => (0, semver_1.compare)(b.metadata.version, a.metadata.version));
        // return a map.
        return metadataFiles.groupByMap(m => m.metadata.id, artifact => artifact);
    }
    async save() {
        await this.indexYaml.writeFile(Buffer.from((0, yaml_1.serialize)(this.index.serialize())));
    }
}
exports.ArtifactRegistry = ArtifactRegistry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXJ0aWZhY3RSZWdpc3RyeS5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJyZWdpc3RyaWVzL0FydGlmYWN0UmVnaXN0cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF1QztBQUN2QyxrQ0FBa0M7OztBQUVsQyxtQ0FBaUM7QUFDakMsd0RBQW9EO0FBQ3BELG9EQUFpRDtBQUNqRCxpREFBNEM7QUFFNUMsNkNBQXdDO0FBRXhDLHVDQUF5QztBQUN6QyxxREFBaUQ7QUFDakQsdUNBQWtDO0FBR2xDLE1BQXNCLGdCQUFnQjtJQUNkO0lBQTJCO0lBQWpELFlBQXNCLE9BQWdCLEVBQVcsUUFBYTtRQUF4QyxZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQVcsYUFBUSxHQUFSLFFBQVEsQ0FBSztJQUM5RCxDQUFDO0lBTVMsS0FBSyxHQUFHLElBQUksZUFBSyxDQUFDLDhCQUFhLENBQUMsQ0FBQztJQUczQyxJQUFJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQztJQUMxQyxDQUFDO0lBRUQsT0FBTyxHQUFHLEtBQUssQ0FBQztJQUVoQixJQUFJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDdEIsQ0FBQztJQUVELElBQWMsTUFBTSxDQUFDLE1BQWU7UUFDbEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7SUFDeEIsQ0FBQztJQUlELEtBQUssQ0FBQyxVQUFVLENBQUMsU0FBbUI7UUFDbEMsNEJBQTRCO1FBQzVCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxlQUFLLENBQUMsOEJBQWEsQ0FBQyxDQUFDO1FBRXRDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQztRQUNsQixNQUFNLENBQUMsR0FBRyxJQUFJLGVBQUssRUFBRSxD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