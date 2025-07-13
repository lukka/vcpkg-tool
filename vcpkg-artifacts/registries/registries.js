"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistryResolver = exports.RegistryDatabase = void 0;
exports.getArtifact = getArtifact;
const assert_1 = require("assert");
const artifact_1 = require("../artifacts/artifact");
const format_1 = require("../cli/format");
const i18n_1 = require("../i18n");
const LocalRegistry_1 = require("./LocalRegistry");
const RemoteRegistry_1 = require("./RemoteRegistry");
/**
  * returns an artifact for the strongly-named artifact id/version.
  */
async function getArtifact(registry, idOrShortName, version) {
    const artifactRecords = await registry.search({ idOrShortName, version });
    if (artifactRecords.length === 0) {
        return undefined; // nothing matched.
    }
    if (artifactRecords.length === 1) {
        // found 1 matching artifact identity
        const artifactRecord = artifactRecords[0];
        const artifactDisplay = artifactRecord[0];
        const artifactVersions = artifactRecord[1];
        if (artifactVersions.length === 0) {
            throw new Error('Internal search error: id matched but no versions present');
        }
        return [artifactDisplay, artifactVersions[0]];
    }
    // multiple matches.
    // we can't return a single artifact, we're going to have to throw.
    (0, assert_1.fail)((0, i18n_1.i) `'${idOrShortName}' matched more than one result (${[...artifactRecords.map(each => each[0])].join(',')}).`);
}
class RegistryDatabase {
    #uriToRegistry = new Map();
    getRegistryByUri(registryUri) {
        return this.#uriToRegistry.get(registryUri);
    }
    has(registryUri) { return this.#uriToRegistry.has(registryUri); }
    // Exposed for testing
    add(uri, registry) {
        const stringized = uri.toString();
        if (this.#uriToRegistry.has(stringized)) {
            throw new Error(`Duplicate registry add ${stringized}`);
        }
        this.#uriToRegistry.set(stringized, registry);
    }
    async loadRegistry(session, locationUri) {
        const locationUriStr = locationUri.toString();
        const existingRegistry = this.#uriToRegistry.get(locationUriStr);
        if (existingRegistry) {
            return existingRegistry;
        }
        // not already loaded
        let loaded;
        switch (locationUri.scheme) {
            case 'https':
                loaded = new RemoteRegistry_1.RemoteRegistry(session, locationUri);
                break;
            case 'file':
                loaded = new LocalRegistry_1.LocalRegistry(session, locationUri);
                break;
            default:
                throw new Error((0, i18n_1.i) `Unsupported registry scheme '${locationUri.scheme}'`);
        }
        this.#uriToRegistry.set(locationUriStr, loaded);
        await loaded.load();
        return loaded;
    }
    getAllUris() {
        return Array.from(this.#uriToRegistry.keys());
    }
}
exports.RegistryDatabase = RegistryDatabase;
class RegistryResolver {
    #database;
    #knownUris;
    #uriToName;
    #nameToUri;
    addMapping(name, uri) {
        this.#uriToName.set(uri, name);
        this.#nameToUri.set(name, uri);
    }
    constructor(parent) {
        if (parent instanceof RegistryResolver) {
            this.#database = parent.#database;
            this.#knownUris = new Set(parent.#knownUris);
            this.#uriToName = new Map(parent.#uriToName);
            this.#nameToUri = new Map(parent.#nameToUri);
        }
        else {
            this.#database = parent;
            this.#knownUris = new Set();
            this.#uriToName = new Map();
            this.#nameToUri = new Map();
        }
    }
    getRegistryName(registry) {
        const stringized = registry.toString();
        return this.#uriToName.get(stringized);
    }
    getRegistryDisplayName(registry) {
        const stringized = registry.toString();
        const prettyName = this.#uriToName.get(stringized);
        if (prettyName) {
            return prettyName;
        }
        return `[${stringized}]`;
    }
    getRegistryByUri(registryUri) {
        const stringized = registryUri.toString();
        if (this.#knownUris.has(stringized)) {
            return this.#database.getRegistryByUri(stringized);
        }
        return undefined;
    }
    getRegistryByName(name) {
        const asUri = this.#nameToUri.get(name);
        if (asUri) {
            return this.#database.getRegistryByUri(asUri);
        }
        return undefined;
    }
    // Adds `registry` to this context with name `name`. If `name` is already set to a different URI, throws.
    add(registryUri, name) {
        const stringized = registryUri.toString();
        if (!this.#database.has(stringized)) {
            throw new Error('Attempted to add unloaded registry to a RegistryContext');
        }
        const oldLocation = this.#nameToUri.get(name);
        if (oldLocation && oldLocation !== stringized) {
            throw new Error((0, i18n_1.i) `Tried to add ${stringized} as ${name}, but ${name} is already ${oldLocation}.`);
        }
        this.#knownUris.add(stringized);
        this.addMapping(name, stringized);
    }
    async search(criteria) {
        const idOrShortName = criteria?.idOrShortName || '';
        const [source, name] = (0, artifact_1.parseArtifactDependency)(idOrShortName);
        if (source === undefined) {
            // search them all
            const results = [];
            for (const location of this.#knownUris) {
                const registry = this.#database.getRegistryByUri(location);
                if (registry === undefined) {
                    throw new Error('RegistryContext tried to search an unloaded registry.');
                }
                const displayName = this.getRegistryDisplayName(registry.location);
                for (const [artifactId, artifacts] of await registry.search(criteria)) {
                    results.push([(0, format_1.artifactIdentity)(displayName, artifactId, artifacts[0].shortName), artifacts]);
                }
            }
            return results;
        }
        else {
            const registry = this.getRegistryByName(source);
            if (registry) {
                return (await registry.search({ ...criteria, idOrShortName: name }))
                    .map((artifactRecord) => [(0, format_1.artifactIdentity)(source, artifactRecord[0], artifactRecord[1][0].shortName), artifactRecord[1]]);
            }
            throw new Error((0, i18n_1.i) `Unknown registry ${source} (in ${idOrShortName}). The following are known: ${Array.from(this.#nameToUri.keys()).join(', ')}`);
        }
    }
    // Combines resolvers together. Any registries that match exactly will take their names from `otherResolver`. Any
    // registries whose names match but which resolve to different URIs will have the name from `otherResolver`, and the
    // other registry will become known but nameless.
    with(otherResolver) {
        if (this.#database !== otherResolver.#database) {
            throw new Error('Tried to combine registry resolvers with different databases.');
        }
        const result = new RegistryResolver(otherResolver);
        for (const uri of this.#knownUris) {
            result.#knownUris.add(uri);
        }
        for (const [name, location] of this.#nameToUri) {
            if (!result.#nameToUri.has(name) && !result.#uriToName.has(location)) {
                result.addMapping(name, location);
            }
        }
        return result;
    }
}
exports.RegistryResolver = RegistryResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0cmllcy5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJyZWdpc3RyaWVzL3JlZ2lzdHJpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF1QztBQUN2QyxrQ0FBa0M7OztBQW9DbEMsa0NBcUJDO0FBdkRELG1DQUE4QjtBQUM5QixvREFBMEU7QUFDMUUsMENBQWlEO0FBQ2pELGtDQUE0QjtBQUc1QixtREFBZ0Q7QUFDaEQscURBQWtEO0FBd0JsRDs7SUFFSTtBQUNHLEtBQUssVUFBVSxXQUFXLENBQUMsUUFBNEIsRUFBRSxhQUFxQixFQUFFLE9BQTJCO0lBQ2hILE1BQU0sZUFBZSxHQUFHLE1BQU0sUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQzFFLElBQUksZUFBZSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUNqQyxPQUFPLFNBQVMsQ0FBQyxDQUFDLG1CQUFtQjtJQUN2QyxDQUFDO0lBRUQsSUFBSSxlQUFlLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQ2pDLHFDQUFxQztRQUNyQyxNQUFNLGNBQWMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUMsTUFBTSxlQUFlLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFDLE1BQU0sZ0JBQWdCLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLElBQUksZ0JBQWdCLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ2xDLE1BQU0sSUFBSSxLQUFLLENBQUMsMkRBQTJELENBQUMsQ0FBQztRQUMvRSxDQUFDO1FBRUQsT0FBTyxDQUFDLGVBQWUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxD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