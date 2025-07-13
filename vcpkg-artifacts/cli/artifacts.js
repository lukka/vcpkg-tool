"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.showArtifacts = showArtifacts;
exports.selectArtifacts = selectArtifacts;
exports.acquireArtifacts = acquireArtifacts;
const cli_progress_1 = require("cli-progress");
const artifact_1 = require("../artifacts/artifact");
const i18n_1 = require("../i18n");
const registries_1 = require("../registries/registries");
const console_table_1 = require("./console-table");
const format_1 = require("./format");
const styling_1 = require("./styling");
async function showArtifacts(artifacts, registries, options) {
    let failing = false;
    const table = new console_table_1.Table((0, i18n_1.i) `Artifact`, (0, i18n_1.i) `Version`, (0, i18n_1.i) `Status`, (0, i18n_1.i) `Dependency`, (0, i18n_1.i) `Summary`);
    for (const resolved of artifacts) {
        const artifact = resolved.artifact;
        if (artifact instanceof artifact_1.Artifact) {
            const name = (0, format_1.artifactIdentity)(registries.getRegistryDisplayName(artifact.registryUri), artifact.id, artifact.shortName);
            for (const err of artifact.metadata.validate()) {
                failing = true;
                (0, styling_1.error)(artifact.metadata.formatVMessage(err));
            }
            table.push(name, artifact.version, options?.force || await artifact.isInstalled ? 'installed' : 'will install', resolved.initialSelection ? ' ' : '*', artifact.metadata.summary || '');
        }
    }
    (0, styling_1.log)(table.toString());
    (0, styling_1.log)();
    return !failing;
}
async function selectArtifacts(session, selections, registries, dependencyDepth) {
    const userSelectedArtifacts = new Map();
    const userSelectedVersions = new Map();
    for (const [idOrShortName, version] of selections) {
        const [, artifact] = await (0, registries_1.getArtifact)(registries, idOrShortName, version) || [];
        if (!artifact) {
            (0, styling_1.error)(`Unable to resolve artifact: ${(0, format_1.addVersionToArtifactIdentity)(idOrShortName, version)}`);
            const results = await registries.search({ keyword: idOrShortName, version: version });
            if (results.length) {
                (0, styling_1.log)('Possible matches:');
                for (const [artifactDisplay, artifactVersions] of results) {
                    for (const artifactVersion of artifactVersions) {
                        (0, styling_1.log)(`  ${(0, format_1.addVersionToArtifactIdentity)(artifactDisplay, artifactVersion.version)}`);
                    }
                }
            }
            return false;
        }
        userSelectedArtifacts.set(artifact.uniqueId, artifact);
        userSelectedVersions.set(artifact.uniqueId, version);
    }
    const allResolved = await (0, artifact_1.resolveDependencies)(session, registries, Array.from(userSelectedArtifacts.values()), dependencyDepth);
    const results = new Array();
    for (const resolved of allResolved) {
        results.push({ ...resolved, 'requestedVersion': userSelectedVersions.get(resolved.uniqueId) });
    }
    return results;
}
var TaggedProgressKind;
(function (TaggedProgressKind) {
    TaggedProgressKind[TaggedProgressKind["Unset"] = 0] = "Unset";
    TaggedProgressKind[TaggedProgressKind["Verifying"] = 1] = "Verifying";
    TaggedProgressKind[TaggedProgressKind["Downloading"] = 2] = "Downloading";
    TaggedProgressKind[TaggedProgressKind["GenericProgress"] = 3] = "GenericProgress";
    TaggedProgressKind[TaggedProgressKind["Heartbeat"] = 4] = "Heartbeat";
})(TaggedProgressKind || (TaggedProgressKind = {}));
class TaggedProgressBar {
    multiBar;
    bar;
    kind = TaggedProgressKind.Unset;
    lastCurrentValue = 0;
    constructor(multiBar) {
        this.multiBar = multiBar;
    }
    checkChangeKind(currentValue, kind) {
        this.lastCurrentValue = currentValue;
        if (this.kind !== kind) {
            if (this.bar) {
                this.multiBar.remove(this.bar);
                this.bar = undefined;
            }
            this.kind = kind;
        }
    }
    startOrUpdate(kind, total, currentValue, suffix) {
        this.checkChangeKind(currentValue, kind);
        const payload = { suffix: suffix };
        if (this.bar) {
            this.bar.update(currentValue, payload);
        }
        else {
            this.kind = kind;
            this.bar = this.multiBar.create(total, currentValue, payload, { format: '{bar} {percentage}% {suffix}' });
        }
    }
    heartbeat(suffix) {
        this.checkChangeKind(0, TaggedProgressKind.Heartbeat);
        const payload = { suffix: suffix };
        if (this.bar) {
            this.bar.update(0, payload);
        }
        else {
            const progressUnknown = (0, i18n_1.i) `(progress unknown)`;
            const totalSpaces = 41 - progressUnknown.length;
            const prefixSpaces = Math.floor(totalSpaces / 2);
            const suffixSpaces = totalSpaces - prefixSpaces;
            const prettyProgressUnknown = Array(prefixSpaces).join(' ') + progressUnknown + Array(suffixSpaces).join(' ');
            this.bar = this.multiBar.create(0, 0, payload, { format: '*' + prettyProgressUnknown + '* {suffix}' });
        }
    }
}
class TtyProgressRenderer {
    #bar = new cli_progress_1.MultiBar({
        clearOnComplete: true,
        hideCursor: true,
        barCompleteChar: '*',
        barIncompleteChar: ' ',
        etaBuffer: 40
    });
    #overallProgress;
    #individualProgress;
    constructor(totalArtifactCount) {
        this.#overallProgress = this.#bar.create(totalArtifactCount, 0, { name: '' }, { format: `{bar} [{value}/${totalArtifactCount - 1}] {name}`, emptyOnZero: true });
        this.#individualProgress = new TaggedProgressBar(this.#bar);
    }
    setArtifactIndex(index, displayName) {
        this.#overallProgress.update(index, { name: displayName });
    }
    hashVerifyProgress(file, percent) {
        this.#individualProgress.startOrUpdate(TaggedProgressKind.Verifying, 100, percent, (0, i18n_1.i) `verifying` + ' ' + file);
    }
    downloadProgress(uri, destination, percent) {
        this.#individualProgress.startOrUpdate(TaggedProgressKind.Downloading, 100, percent, (0, i18n_1.i) `downloading ${uri.toString()} -> ${destination}`);
    }
    unpackArchiveStart(archiveUri) {
        this.#individualProgress.heartbeat((0, i18n_1.i) `unpacking ${archiveUri.fsPath}`);
    }
    unpackArchiveHeartbeat(text) {
        this.#individualProgress.heartbeat(text);
    }
    stop() {
        this.#bar.stop();
    }
}
const downloadUpdateRateMs = 10 * 1000;
class NoTtyProgressRenderer {
    channels;
    totalArtifactCount;
    #currentIndex = 0;
    #downloadPrecent = 0;
    #downloadTimeoutId;
    constructor(channels, totalArtifactCount) {
        this.channels = channels;
        this.totalArtifactCount = totalArtifactCount;
    }
    setArtifactIndex(index) {
        this.#currentIndex = index;
    }
    startInstallArtifact(displayName) {
        this.channels.message(`[${this.#currentIndex + 1}/${this.totalArtifactCount - 1}] ` + (0, i18n_1.i) `Installing ${displayName}...`);
    }
    alreadyInstalledArtifact(displayName) {
        this.channels.message(`[${this.#currentIndex + 1}/${this.totalArtifactCount - 1}] ` + (0, i18n_1.i) `${displayName} already installed.`);
    }
    downloadStart(uris, destination) {
        let displayUri;
        if (uris.length === 1) {
            displayUri = uris[0].toString();
        }
        else {
            displayUri = JSON.stringify(uris.map(uri => uri.toString()));
        }
        this.channels.message((0, i18n_1.i) `Downloading ${displayUri}...`);
        this.#downloadTimeoutId = setTimeout(this.downloadProgressDisplay.bind(this), downloadUpdateRateMs);
    }
    downloadProgress(uri, destination, percent) {
        this.#downloadPrecent = percent;
    }
    downloadProgressDisplay() {
        this.channels.message(`${this.#downloadPrecent}%`);
        this.#downloadTimeoutId = setTimeout(this.downloadProgressDisplay.bind(this), downloadUpdateRateMs);
    }
    downloadComplete() {
        if (this.#downloadTimeoutId) {
            clearTimeout(this.#downloadTimeoutId);
        }
    }
    stop() {
        if (this.#downloadTimeoutId) {
            clearTimeout(this.#downloadTimeoutId);
        }
    }
    unpackArchiveStart(archiveUri) {
        this.channels.message((0, i18n_1.i) `Unpacking ${archiveUri.fsPath}...`);
    }
}
async function acquireArtifacts(session, resolved, registries, options) {
    // resolve the full set of artifacts to install.
    const isTty = process.stdout.isTTY === true;
    const progressRenderer = isTty ? new TtyProgressRenderer(resolved.length) : new NoTtyProgressRenderer(session.channels, resolved.length);
    for (let idx = 0; idx < resolved.length; ++idx) {
        const artifact = resolved[idx].artifact;
        if (artifact instanceof artifact_1.Artifact) {
            const id = artifact.id;
            const registryName = registries.getRegistryDisplayName(artifact.registryUri);
            const artifactDisplayName = (0, format_1.artifactIdentity)(registryName, id, artifact.shortName);
            progressRenderer.setArtifactIndex?.(idx, artifactDisplayName);
            try {
                const installStatus = await artifact.install(artifactDisplayName, progressRenderer, options || {});
                switch (installStatus) {
                    case artifact_1.InstallStatus.Installed:
                        session.trackAcquire(artifact.registryUri.toString(), id, artifact.version);
                        break;
                    case artifact_1.InstallStatus.AlreadyInstalled:
                        break;
                    case artifact_1.InstallStatus.Failed:
                        progressRenderer.stop?.();
                        return false;
                }
            }
            catch (e) {
                progressRenderer.stop?.();
                (0, styling_1.debug)(e);
                (0, styling_1.debug)(e.stack);
                (0, styling_1.error)((0, i18n_1.i) `Error installing ${artifactDisplayName} - ${e}`);
                return false;
            }
        }
    }
    progressRenderer.stop?.();
    return true;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJ0aWZhY3RzLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9taWNyb3NvZnQvdmNwa2ctdG9vbC9tYWluL3ZjcGtnLWFydGlmYWN0cy8iLCJzb3VyY2VzIjpbImNsaS9hcnRpZmFjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF1QztBQUN2QyxrQ0FBa0M7O0FBY2xDLHNDQWtCQztBQU1ELDBDQWlDQztBQWdLRCw0Q0FtQ0M7QUF4UUQsK0NBQW1EO0FBQ25ELG9EQUFpSTtBQUNqSSxrQ0FBNEI7QUFFNUIseURBQWlHO0FBSWpHLG1EQUF3QztBQUN4QyxxQ0FBMEU7QUFDMUUsdUNBQThDO0FBRXZDLEtBQUssVUFBVSxhQUFhLENBQUMsU0FBcUMsRUFBRSxVQUFrQyxFQUFFLE9BQTZCO0lBQzFJLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQztJQUNwQixNQUFNLEtBQUssR0FBRyxJQUFJLHFCQUFLLENBQUMsSUFBQSxRQUFDLEVBQUEsVUFBVSxFQUFFLElBQUEsUUFBQyxFQUFBLFNBQVMsRUFBRSxJQUFBLFFBQUMsRUFBQSxRQUFRLEVBQUUsSUFBQSxRQUFDLEVBQUEsWUFBWSxFQUFFLElBQUEsUUFBQyxFQUFBLFNBQVMsQ0FBQyxDQUFDO0lBQ3ZGLEtBQUssTUFBTSxRQUFRLElBQUksU0FBUyxFQUFFLENBQUM7UUFDakMsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUNuQyxJQUFJLFFBQVEsWUFBWSxtQkFBUSxFQUFFLENBQUM7WUFDakMsTUFBTSxJQUFJLEdBQUcsSUFBQSx5QkFBZ0IsRUFBQyxVQUFVLENBQUMsc0JBQXNCLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3hILEtBQUssTUFBTSxHQUFHLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsRUFBRSxD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