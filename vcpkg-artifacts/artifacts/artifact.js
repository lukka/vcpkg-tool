"use strict";
/* eslint-disable prefer-const */
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstalledArtifact = exports.ProjectManifest = exports.Artifact = exports.InstallStatus = exports.ArtifactBase = void 0;
exports.parseArtifactDependency = parseArtifactDependency;
exports.buildRegistryResolver = buildRegistryResolver;
exports.checkDemands = checkDemands;
exports.sanitizePath = sanitizePath;
exports.sanitizeUri = sanitizeUri;
exports.resolveDependencies = resolveDependencies;
const assert_1 = require("assert");
const path_1 = require("path");
const format_1 = require("../cli/format");
const i18n_1 = require("../i18n");
const espidf_1 = require("../installers/espidf");
const registries_1 = require("../registries/registries");
const linq_1 = require("../util/linq");
const uri_1 = require("../util/uri");
const SetOfDemands_1 = require("./SetOfDemands");
function parseArtifactDependency(id) {
    const parts = id.split(':');
    if (parts.length === 2) {
        return [parts[0], parts[1]];
    }
    if (parts.length === 1) {
        return [undefined, parts[0]];
    }
    throw new Error((0, i18n_1.i) `Invalid artifact id '${id}'`);
}
function loadRegistry(session, decl) {
    const loc = decl.location.get(0);
    if (loc) {
        const locUri = session.parseLocation(loc);
        session.channels.debug(`Loading registry ${loc} (interpreted as ${locUri.toString()})`);
        return session.registryDatabase.loadRegistry(session, locUri);
    }
    return Promise.resolve(undefined);
}
async function buildRegistryResolver(session, registries) {
    // load the registries from the project file
    const result = new registries_1.RegistryResolver(session.registryDatabase);
    if (registries) {
        for (const [name, registry] of registries) {
            const loaded = await loadRegistry(session, registry);
            if (loaded) {
                result.add(loaded.location, name);
            }
        }
    }
    return result;
}
function addDisplayPrefix(prefix, targets) {
    const result = new Array();
    for (const element of targets) {
        result.push((0, i18n_1.i) `${prefix} - ${element}`);
    }
    return result;
}
class ArtifactBase {
    session;
    metadata;
    applicableDemands;
    constructor(session, metadata) {
        this.session = session;
        this.metadata = metadata;
        this.applicableDemands = new SetOfDemands_1.SetOfDemands(this.metadata, this.session);
    }
    buildRegistryByName(name) {
        const decl = this.metadata.registries.get(name);
        if (decl) {
            return loadRegistry(this.session, decl);
        }
        return Promise.resolve(undefined);
    }
}
exports.ArtifactBase = ArtifactBase;
function checkDemands(session, thisDisplayName, applicableDemands) {
    const errors = addDisplayPrefix(thisDisplayName, applicableDemands.errors);
    session.channels.error(errors);
    if (errors.length) {
        return false;
    }
    session.channels.warning(addDisplayPrefix(thisDisplayName, applicableDemands.warnings));
    session.channels.message(addDisplayPrefix(thisDisplayName, applicableDemands.messages));
    return true;
}
var InstallStatus;
(function (InstallStatus) {
    InstallStatus[InstallStatus["Installed"] = 0] = "Installed";
    InstallStatus[InstallStatus["AlreadyInstalled"] = 1] = "AlreadyInstalled";
    InstallStatus[InstallStatus["Failed"] = 2] = "Failed";
})(InstallStatus || (exports.InstallStatus = InstallStatus = {}));
class Artifact extends ArtifactBase {
    shortName;
    targetLocation;
    constructor(session, metadata, shortName, targetLocation) {
        super(session, metadata);
        this.shortName = shortName;
        this.targetLocation = targetLocation;
    }
    get id() {
        return this.metadata.id;
    }
    get version() {
        return this.metadata.version;
    }
    get registryUri() {
        return this.metadata.registryUri;
    }
    get isInstalled() {
        return this.targetLocation.exists('artifact.json');
    }
    get uniqueId() {
        return `${this.registryUri.toString()}::${this.id}::${this.version}`;
    }
    async install(thisDisplayName, events, options) {
        const applicableDemands = this.applicableDemands;
        if (!checkDemands(this.session, thisDisplayName, applicableDemands)) {
            return InstallStatus.Failed;
        }
        if (await this.isInstalled && !options.force) {
            events.alreadyInstalledArtifact?.(thisDisplayName);
            return InstallStatus.AlreadyInstalled;
        }
        try {
            if (options.force) {
                try {
                    await this.uninstall();
                }
                catch {
                    // if a file is locked, it may not get removed. We'll deal with this later.
                }
            }
            // ok, let's install this.
            events.startInstallArtifact?.(thisDisplayName);
            for (const installInfo of applicableDemands.installer) {
                if (installInfo.lang && !options.allLanguages && options.language && options.language.toLowerCase() !== installInfo.lang.toLowerCase()) {
                    continue;
                }
                const installer = this.session.artifactInstaller(installInfo);
                if (!installer) {
                    (0, assert_1.fail)((0, i18n_1.i) `Unknown installer type ${installInfo.installerKind}`);
                }
                await installer(this.session, this.id, this.version, this.targetLocation, installInfo, events, options);
            }
            if (this.metadata.espidf) {
                await (0, espidf_1.installEspIdf)(this.session, events, this.targetLocation);
            }
            // after we unpack it, write out the installed manifest
            await this.writeManifest();
            return InstallStatus.Installed;
        }
        catch (err) {
            try {
                await this.uninstall();
            }
            catch {
                // if a file is locked, it may not get removed. We'll deal with this later.
            }
            throw err;
        }
    }
    async writeManifest() {
        await this.targetLocation.createDirectory();
        await this.metadata.save(this.targetLocation.join('artifact.json'));
    }
    async uninstall() {
        await this.targetLocation.delete({ recursive: true, useTrash: false });
    }
    async loadActivationSettings(activation) {
        // construct paths (bin, lib, include, etc.)
        // construct tools
        // compose variables
        // defines
        for (const exportsBlock of this.applicableDemands.exports) {
            activation.addExports(exportsBlock, this.targetLocation);
        }
        // if espressif install
        if (this.metadata.espidf) {
            // activate
            if (!await (0, espidf_1.activateEspIdf)(this.session, activation, this.targetLocation)) {
                return false;
            }
        }
        return true;
    }
    async sanitizeAndValidatePath(path) {
        try {
            const loc = this.session.fileSystem.file((0, path_1.resolve)(this.targetLocation.fsPath, path));
            if (await loc.exists()) {
                return loc;
            }
        }
        catch {
            // no worries, treat it like a relative path.
        }
        const loc = this.targetLocation.join(sanitizePath(path));
        if (await loc.exists()) {
            return loc;
        }
        return undefined;
    }
}
exports.Artifact = Artifact;
function sanitizePath(path) {
    return path.
        replace(/[\\/]+/g, '/'). // forward slashes please
        replace(/[?<>:|"]/g, ''). // remove illegal characters.
        // eslint-disable-next-line no-control-regex
        replace(/[\x00-\x1f\x80-\x9f]/g, ''). // remove unicode control codes
        replace(/^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i, ''). // no reserved names
        replace(/^[/.]*\//, ''). // dots and slashes off the front.
        replace(/[/.]+$/, ''). // dots and slashes off the back.
        replace(/\/\.+\//g, '/'). // no parts made just of dots.
        replace(/\/+/g, '/'); // duplicate slashes.
}
function sanitizeUri(u) {
    return u.
        replace(/[\\/]+/g, '/'). // forward slashes please
        replace(/[?<>|"]/g, ''). // remove illegal characters.
        // eslint-disable-next-line no-control-regex
        replace(/[\x00-\x1f\x80-\x9f]/g, ''). // remove unicode control codes
        replace(/^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i, ''). // no reserved names
        replace(/^[/.]*\//, ''). // dots and slashes off the front.
        replace(/[/.]+$/, ''). // dots and slashes off the back.
        replace(/\/\.+\//g, '/'). // no parts made just of dots.
        replace(/\/+/g, '/'); // duplicate slashes.
}
class ProjectManifest extends ArtifactBase {
    loadActivationSettings(activation) {
        return Promise.resolve(true);
    }
}
exports.ProjectManifest = ProjectManifest;
class InstalledArtifact extends Artifact {
    constructor(session, metadata) {
        super(session, metadata, '', uri_1.Uri.invalid);
    }
}
exports.InstalledArtifact = InstalledArtifact;
async function resolveDependencies(session, registryResolver, initialParents, dependencyDepth) {
    let depth = 0;
    let nextDepthRegistries = initialParents.map((parent) => parent.metadata.registryUri ? registryResolver.getRegistryByUri(parent.metadata.registryUri) : undefined);
    let currentRegistries = [];
    let nextDepth = initialParents;
    let initialSelections = new Set();
    let current = [];
    let resultSet = new Map(); // uniqueId, artifact
    let orderer = new Map(); // uniqueId, [depth, priority]
    while (nextDepth.length !== 0) {
        ++depth;
        currentRegistries = nextDepthRegistries;
        nextDepthRegistries = [];
        current = nextDepth;
        nextDepth = [];
        if (depth == dependencyDepth) {
            initialSelections = new Set(resultSet.keys());
        }
        for (let idx = 0; idx < current.length; ++idx) {
            const subjectParentRegistry = currentRegistries[idx];
            const subject = current[idx];
            let subjectId;
            let subjectUniqueId;
            if (subject instanceof Artifact) {
                subjectId = subject.id;
                subjectUniqueId = subject.uniqueId;
            }
            else {
                subjectId = subject.metadata.file.toString();
                subjectUniqueId = subjectId;
            }
            session.channels.debug(`Resolving ${subjectUniqueId}'s dependencies...`);
            // Note that we must update depth even if visiting the same artifact again
            orderer.set(subjectUniqueId, [depth, subject.metadata.priority]);
            if (resultSet.has(subjectUniqueId)) {
                session.channels.debug(`${subjectUniqueId} is a terminal dependency with a depth of ${depth}.`);
                // already visited
                continue;
            }
            resultSet.set(subjectUniqueId, subject);
            for (const [idOrShortName, version] of linq_1.linq.entries(subject.applicableDemands.requires)) {
                const [dependencyRegistryDeclaredName, dependencyId] = parseArtifactDependency(idOrShortName);
                let dependencyRegistry;
                if (dependencyRegistryDeclaredName) {
                    const maybeRegistry = await subject.buildRegistryByName(dependencyRegistryDeclaredName);
                    if (!maybeRegistry) {
                        throw new Error((0, i18n_1.i) `While resolving dependencies of ${subjectId}, ${dependencyRegistryDeclaredName} in ${idOrShortName} could not be resolved to a registry.`);
                    }
                    dependencyRegistry = maybeRegistry;
                }
                else {
                    if (!subjectParentRegistry) {
                        throw new Error((0, i18n_1.i) `While resolving dependencies of the project file ${subjectId}, ${idOrShortName} did not specify a registry.`);
                    }
                    dependencyRegistry = subjectParentRegistry;
                }
                const dependencyRegistryDisplayName = registryResolver.getRegistryDisplayName(dependencyRegistry.location);
                session.channels.debug(`Interpreting '${idOrShortName}' as ${dependencyRegistry.location.toString()}:${dependencyId}`);
                const dependency = await (0, registries_1.getArtifact)(dependencyRegistry, dependencyId, version.raw);
                if (!dependency) {
                    throw new Error((0, i18n_1.i) `Unable to resolve dependency ${dependencyId} in ${(0, format_1.prettyRegistryName)(dependencyRegistryDisplayName)}.`);
                }
                session.channels.debug(`Resolved dependency ${(0, format_1.artifactIdentity)(dependencyRegistryDisplayName, dependency[0], dependency[1].shortName)}`);
                nextDepthRegistries.push(dependencyRegistry);
                nextDepth.push(dependency[1]);
            }
        }
    }
    if (initialSelections.size === 0) {
        initialSelections = new Set(resultSet.keys());
    }
    session.channels.debug(`The following are initial selections: ${Array.from(initialSelections).join(', ')}`);
    const results = new Array();
    for (const [uniqueId, artifact] of resultSet) {
        const order = orderer.get(uniqueId);
        if (order) {
            results.push({
                'artifact': artifact,
                'uniqueId': uniqueId,
                'initialSelection': initialSelections.has(uniqueId),
                'depth': order[0],
                'priority': artifact.metadata.priority
            });
        }
        else {
            throw new Error('Result artifact with no order (bug in resolveDependencies)');
        }
    }
    results.sort((a, b) => {
        if (a.depth != b.depth) {
            return b.depth - a.depth;
        }
        return a.priority - b.priority;
    });
    return results;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJ0aWZhY3QuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21pY3Jvc29mdC92Y3BrZy10b29sL21haW4vdmNwa2ctYXJ0aWZhY3RzLyIsInNvdXJjZXMiOlsiYXJ0aWZhY3RzL2FydGlmYWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxpQ0FBaUM7QUFDakMsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBbUJsQywwREFXQztBQWFELHNEQWFDO0FBOEJELG9DQVVDO0FBcUlELG9DQVdDO0FBRUQsa0NBV0M7QUFzQkQsa0RBNEdDO0FBN1hELG1DQUE4QjtBQUM5QiwrQkFBK0I7QUFHL0IsMENBQXFFO0FBQ3JFLGtDQUE0QjtBQUM1QixpREFBcUU7QUFFckUseURBQW1GO0FBRW5GLHVDQUFvQztBQUNwQyxxQ0FBa0M7QUFFbEMsaURBQThDO0FBSTlDLFNBQWdCLHVCQUF1QixDQUFDLEVBQVU7SUFDaEQsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM1QixJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDdkIsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQ3ZCLE9BQU8sQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVELE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBQSxRQUFDLEVBQUEsd0JBQXdCLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDbEQsQ0FBQztBQUVELFNBQVMsWUFBWSxDQUFDLE9BQWdCLEVBQUUsSUFBeUI7SUFDL0QsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakMsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNSLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDMUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsb0JBQW9CLEdBQUcsb0JBQW9CLE1BQU0sQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDeEYsT0FBTyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRUQsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3BDLENBQUM7QUFFTSxLQUFLLFVBQVUscUJBQXFCLENBQUMsT0FBZ0IsRUFBRSxVQUE2QztJQUN6Ryw0Q0FBNEM7SUFDNUMsTUFBTSxNQUFNLEdBQUcsSUFBSSw2QkFBZ0IsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUM5RCxJQUFJLFVBQVUsRUFBRSxDQUFDO1FBQ2YsS0FBSyxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLFVBQVUsRUFBRSxDQUFDO1lBQzFDLE1BQU0sTUFBTSxHQUFHLE1BQU0sWUFBWSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNyRCxJQUFJLE1BQU0sRUFBRSxDQUFDO2dCQUNYLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNwQyxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFFRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBRUQsU0FBUyxnQkFBZ0IsQ0FBQyxNQUFjLEVBQUUsT0FBc0I7SUFDOUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxLQUFLLEVBQVUsQ0FBQztJQUNuQyxLQUFLLE1BQU0sT0FBTyxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBQSxRQUFDLEVBQUEsR0FBRyxNQUFNLE1BQU0sT0FBTyxFQUFFLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUVELE1BQXNCLFlBQVk7SUFHVjtJQUFrQztJQUYvQyxpQkFBaUIsQ0FBZTtJQUV6QyxZQUFzQixPQUFnQixFQUFrQixRQUFzQjtRQUF4RCxZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQWtCLGFBQVEsR0FBUixRQUFRLENBQWM7UUFDNUUsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksMkJBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRUQsbUJBQW1CLENBQUMsSUFBWTtRQUM5QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEQsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUNULE9BQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDMUMsQ0FBQztRQUVELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNwQyxDQUFDO0NBR0Y7QUFqQkQsb0NBaUJDO0FBRUQsU0FBZ0IsWUFBWSxDQUFDLE9BQWdCLEVBQUUsZUFBdUIsRUFBRSxpQkFBK0I7SUFDckcsTUFBTSxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsZUFBZSxFQUFFLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzNFLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9CLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2xCLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLGVBQWUsRUFBRSxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ3hGLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLGVBQWUsRUFBRSxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ3hGLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVELElBQVksYUFJWDtBQUpELFdBQVksYUFBYTtJQUN2QiwyREFBUyxDQUFBO0lBQ1QseUVBQWdCLENBQUE7SUFDaEIscURBQU0sQ0FBQTtBQUNSLENBQUMsRUFKVyxhQUFhLDZCQUFiLGFBQWEsUUFJeEI7QUFFRCxNQUFhLFFBQVMsU0FBUSxZQUFZO0lBQ3FCO0lBQTBCO0lBQXZGLFlBQVksT0FBZ0IsRUFBRSxRQUFzQixFQUFTLFNBQWlCLEVBQVMsY0FBbUI7UUFDeEcsS0FBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztRQURrQyxjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQVMsbUJBQWMsR0FBZCxjQUFjLENBQUs7SUFFMUcsQ0FBQztJQUVELElBQUksRUFBRTtRQUNKLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVELElBQUksT0FBTztRQUNULE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7SUFDL0IsQ0FBQztJQUVELElBQUksV0FBVztRQUNiLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFZLENBQUM7SUFDcEMsQ0FBQztJQUVELElBQUksV0FBVztRQUNiLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELElBQUksUUFBUTtRQUNWLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3ZFLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTyxDQUFDLGVBQXVCLEVBQUUsTUFBOEIsRUFBRSxPQUF1RTtRQUM1SSxNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztRQUNqRCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsZUFBZSxFQUFFLGlCQUFpQixDQUFDLEVBQUUsQ0FBQztZQUNwRSxPQUFPLGFBQWEsQ0FBQyxNQUFNLENBQUM7UUFDOUIsQ0FBQztRQUVELElBQUksTUFBTSxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzdDLE1BQU0sQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ25ELE9BQU8sYUFBYSxDQUFDLGdCQUFnQixDQUFDO1FBQ3hDLENBQUM7UUFFRCxJQUFJLENBQUM7WUFDSCxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDbEIsSUFBSSxDQUFDO29CQUNILE1BQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUN6QixDQUFDO2dCQUFDLE1BQU0sQ0FBQztvQkFDUCwyRUFBMkU7Z0JBQzdFLENBQUM7WUFDSCxDQUFDO1lBRUQsMEJBQTBCO1lBQzFCLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQy9DLEtBQUssTUFBTSxXQUFXLElBQUksaUJBQWlCLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ3RELElBQUksV0FBVyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLElBQUksT0FBTyxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxLQUFLLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQztvQkFDdkksU0FBUztnQkFDWCxDQUFDO2dCQUVELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQzlELElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztvQkFDZixJQUFBLGFBQUksRUFBQyxJQUFBLFFBQUMsRUFBQSwwQkFBMEIsV0FBWSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7Z0JBQ2hFLENBQUM7Z0JBQ0QsTUFBTSxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzFHLENBQUM7WUFFRCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ3pCLE1BQU0sSUFBQSxzQkFBYSxFQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUNqRSxDQUFDO1lBRUQsdURBQXVEO1lBQ3ZELE1BQU0sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQzNCLE9BQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQztRQUNqQyxDQUFDO1FBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNiLElBQUksQ0FBQztnQkFDSCxNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUN6QixDQUFDO1lBQUMsTUFBTSxDQUFDO2dCQUNQLDJFQUEyRTtZQUM3RSxDQUFDO1lBRUQsTUFBTSxHQUFHLENBQUM7UUFDWixDQUFDO0lBQ0gsQ0FBQztJQUVELEtBQUssQ0FBQyxhQUFhO1FBQ2pCLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUM1QyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUVELEtBQUssQ0FBQyxTQUFTO1FBQ2IsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUdELEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxVQUFzQjtRQUNqRCw0Q0FBNEM7UUFDNUMsa0JBQWtCO1FBQ2xCLG9CQUFvQjtRQUNwQixVQUFVO1FBRVYsS0FBSyxNQUFNLFlBQVksSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDMUQsVUFBVSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzNELENBQUM7UUFFRCx1QkFBdUI7UUFDdkIsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3pCLFdBQVc7WUFDWCxJQUFJLENBQUMsTUFBTSxJQUFBLHVCQUFjLEVBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUM7Z0JBQ3pFLE9BQU8sS0FBSyxDQUFDO1lBQ2YsQ0FBQztRQUNILENBQUM7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxLQUFLLENBQUMsdUJBQXVCLENBQUMsSUFBWTtRQUN4QyxJQUFJLENBQUM7WUFDSCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBQSxjQUFPLEVBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNwRixJQUFJLE1BQU0sR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUM7Z0JBQ3ZCLE9BQU8sR0FBRyxDQUFDO1lBQ2IsQ0FBQztRQUNILENBQUM7UUFBQyxNQUFNLENBQUM7WUFDUCw2Q0FBNkM7UUFDL0MsQ0FBQztRQUNELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3pELElBQUksTUFBTSxHQUFHLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQztZQUN2QixPQUFPLEdBQUcsQ0FBQztRQUNiLENBQUM7UUFDRCxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0NBQ0Y7QUEzSEQsNEJBMkhDO0FBRUQsU0FBZ0IsWUFBWSxDQUFDLElBQVk7SUFDdkMsT0FBTyxJQUFJO1FBQ1QsT0FBTyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsRUFBTSx5QkFBeUI7UUFDdEQsT0FBTyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsRUFBRSw2QkFBNkI7UUFDdkQsNENBQTRDO1FBQzVDLE9BQU8sQ0FBQyx1QkFBdUIsRUFBRSxFQUFFLENBQUMsRUFBRSwrQkFBK0I7UUFDckUsT0FBTyxDQUFDLHdDQUF3QyxFQUFFLEVBQUUsQ0FBQyxFQUFFLG9CQUFvQjtRQUMzRSxPQUFPLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFLGtDQUFrQztRQUMzRCxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUFFLGlDQUFpQztRQUN4RCxPQUFPLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxFQUFFLDhCQUE4QjtRQUN4RCxPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMscUJBQXFCO0FBQy9DLENBQUM7QUFFRCxTQUFnQixXQUFXLENBQUMsQ0FBUztJQUNuQyxPQUFPLENBQUM7UUFDTixPQUFPLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxFQUFNLHlCQUF5QjtRQUN0RCxPQUFPLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFLDZCQUE2QjtRQUN0RCw0Q0FBNEM7UUFDNUMsT0FBTyxDQUFDLHVCQUF1QixFQUFFLEVBQUUsQ0FBQyxFQUFFLCtCQUErQjtRQUNyRSxPQUFPLENBQUMsd0NBQXdDLEVBQUUsRUFBRSxDQUFDLEVBQUUsb0JBQW9CO1FBQzNFLE9BQU8sQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQUUsa0NBQWtDO1FBQzNELE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsaUNBQWlDO1FBQ3hELE9BQU8sQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLEVBQUUsOEJBQThCO1FBQ3hELE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxxQkFBcUI7QUFDL0MsQ0FBQztBQUVELE1BQWEsZUFBZ0IsU0FBUSxZQUFZO0lBQy9DLHNCQUFzQixDQUFDLFVBQXNCO1FBQzNDLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMvQixDQUFDO0NBQ0Y7QUFKRCwwQ0FJQztBQUVELE1BQWEsaUJBQWtCLFNBQVEsUUFBUTtJQUM3QyxZQUFZLE9BQWdCLEVBQUUsUUFBc0I7UUFDbEQsS0FBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLFNBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM1QyxDQUFDO0NBQ0Y7QUFKRCw4Q0FJQztBQVVNLEtBQUssVUFBVSxtQkFBbUIsQ0FBQyxPQUFnQixFQUFFLGdCQUFrQyxFQUFFLGNBQW1DLEVBQUUsZUFBdUI7SUFDMUosSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQ2QsSUFBSSxtQkFBbUIsR0FBZ0MsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQ25GLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM1RyxJQUFJLGlCQUFpQixHQUFnQyxFQUFFLENBQUM7SUFDeEQsSUFBSSxTQUFTLEdBQXdCLGNBQWMsQ0FBQztJQUNwRCxJQUFJLGlCQUFpQixHQUFHLElBQUksR0FBRyxFQUFVLENBQUM7SUFDMUMsSUFBSSxPQUFPLEdBQXdCLEVBQUUsQ0FBQztJQUN0QyxJQUFJLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBd0IsQ0FBQyxDQUFDLHFCQUFxQjtJQUN0RSxJQUFJLE9BQU8sR0FBRyxJQUFJLEdBQUcsRUFBNEIsQ0FBQyxDQUFDLDhCQUE4QjtJQUVqRixPQUFPLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDOUIsRUFBRSxLQUFLLENBQUM7UUFDUixpQkFBaUIsR0FBRyxtQkFBbUIsQ0FBQztRQUN4QyxtQkFBbUIsR0FBRyxFQUFFLENBQUM7UUFDekIsT0FBTyxHQUFHLFNBQVMsQ0FBQztRQUNwQixTQUFTLEdBQUcsRUFBRSxDQUFDO1FBRWYsSUFBSSxLQUFLLElBQUksZUFBZSxFQUFFLENBQUM7WUFDN0IsaUJBQWlCLEdBQUcsSUFBSSxHQUFHLENBQVMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUVELEtBQUssSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUM7WUFDOUMsTUFBTSxxQkFBcUIsR0FBRyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNyRCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDN0IsSUFBSSxTQUFpQixDQUFDO1lBQ3RCLElBQUksZUFBdUIsQ0FBQztZQUM1QixJQUFJLE9BQU8sWUFBWSxRQUFRLEVBQUUsQ0FBQztnQkFDaEMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUM7Z0JBQ3ZCLGVBQWUsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO1lBQ3JDLENBQUM7aUJBQU0sQ0FBQztnQkFDTixTQUFTLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQzdDLGVBQWUsR0FBRyxTQUFTLENBQUM7WUFDOUIsQ0FBQztZQUVELE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLGFBQWEsZUFBZSxvQkFBb0IsQ0FBQyxDQUFDO1lBQ3pFLDBFQUEwRTtZQUMxRSxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDakUsSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUM7Z0JBQ25DLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsZUFBZSw2Q0FBNkMsS0FBSyxHQUFHLENBQUMsQ0FBQztnQkFDaEcsa0JBQWtCO2dCQUNsQixTQUFTO1lBQ1gsQ0FBQztZQUVELFNBQVMsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3hDLEtBQUssTUFBTSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsSUFBSSxXQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO2dCQUN4RixNQUFNLENBQUMsOEJBQThCLEVBQUUsWUFBWSxDQUFDLEdBQUcsdUJBQXVCLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQzlGLElBQUksa0JBQTRCLENBQUM7Z0JBQ2pDLElBQUksOEJBQThCLEVBQUUsQ0FBQztvQkFDbkMsTUFBTSxhQUFhLEdBQUcsTUFBTSxPQUFPLENBQUMsbUJBQW1CLENBQUMsOEJBQThCLENBQUMsQ0FBQztvQkFDeEYsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO3dCQUNuQixNQUFNLElBQUksS0FBSyxDQUFDLElBQUEsUUFBQyxFQUFBLG1DQUFtQyxTQUFTLEtBQUssOEJBQThCLE9BQU8sYUFBYSx1Q0FBdUMsQ0FBQyxDQUFDO29CQUMvSixDQUFDO29CQUVELGtCQUFrQixHQUFHLGFBQWEsQ0FBQztnQkFDckMsQ0FBQztxQkFBTSxDQUFDO29CQUNOLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO3dCQUMzQixNQUFNLElBQUksS0FBSyxDQUFDLElBQUEsUUFBQyxFQUFBLG9EQUFvRCxTQUFTLEtBQUssYUFBYSw4QkFBOEIsQ0FBQyxDQUFDO29CQUNsSSxDQUFDO29CQUVELGtCQUFrQixHQUFHLHFCQUFxQixDQUFDO2dCQUM3QyxDQUFDO2dCQUVELE1BQU0sNkJBQTZCLEdBQUcsZ0JBQWdCLENBQUMsc0JBQXNCLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzNHLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLGlCQUFpQixhQUFhLFFBQVEsa0JBQWtCLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxJQUFJLFlBQVksRUFBRSxDQUFDLENBQUM7Z0JBQ3ZILE1BQU0sVUFBVSxHQUFHLE1BQU0sSUFBQSx3QkFBVyxFQUFDLGtCQUFrQixFQUFFLFlBQVksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3BGLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztvQkFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFBLFFBQUMsRUFBQSxnQ0FBZ0MsWUFBWSxPQUFPLElBQUEsMkJBQWtCLEVBQUMsNkJBQTZCLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzVILENBQUM7Z0JBRUQsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsdUJBQXVCLElBQUEseUJBQWdCLEVBQUMsNkJBQTZCLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3pJLG1CQUFtQixDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUM3QyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUVELElBQUksaUJBQWlCLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQ2pDLGlCQUFpQixHQUFHLElBQUksR0FBRyxDQUFTLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRCxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyx5Q0FBeUMsS0FBSyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFNUcsTUFBTSxPQUFPLEdBQUcsSUFBSSxLQUFLLEVBQW9CLENBQUM7SUFDOUMsS0FBSyxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxJQUFJLFNBQVMsRUFBRSxDQUFDO1FBQzdDLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDcEMsSUFBSSxLQUFLLEVBQUUsQ0FBQztZQUNWLE9BQU8sQ0FBQyxJQUFJLENBQUM7Z0JBQ1gsVUFBVSxFQUFFLFFBQVE7Z0JBQ3BCLFVBQVUsRUFBRSxRQUFRO2dCQUNwQixrQkFBa0IsRUFBRSxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO2dCQUNuRCxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDakIsVUFBVSxFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUTthQUN2QyxDQUFDLENBQUM7UUFDTCxDQUFDO2FBQU0sQ0FBQztZQUNOLE1BQU0sSUFBSSxLQUFLLENBQUMsNERBQTRELENBQUMsQ0FBQztRQUNoRixDQUFDO0lBQ0gsQ0FBQztJQUVELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDcEIsSUFBSSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUN2QixPQUFPLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUMzQixDQUFDO1FBRUQsT0FBTyxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUM7SUFDakMsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDIn0=