"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCommand = void 0;
const artifact_1 = require("../../artifacts/artifact");
const unified_filesystem_1 = require("../../fs/unified-filesystem");
const i18n_1 = require("../../i18n");
const main_1 = require("../../main");
const RemoteRegistry_1 = require("../../registries/RemoteRegistry");
const exceptions_1 = require("../../util/exceptions");
const command_1 = require("../command");
const format_1 = require("../format");
const styling_1 = require("../styling");
const all_1 = require("../switches/all");
const project_1 = require("../switches/project");
async function updateRegistry(registry, displayName) {
    try {
        await registry.update(displayName);
        await registry.load();
        (0, styling_1.log)((0, i18n_1.i) `Updated ${displayName}. It contains ${(0, format_1.count)(registry.count)} metadata files.`);
    }
    catch (e) {
        if (e instanceof exceptions_1.RemoteFileUnavailable) {
            (0, styling_1.log)((0, i18n_1.i) `Unable to download ${displayName}.`);
        }
        else {
            (0, styling_1.log)((0, i18n_1.i) `${displayName} could not be updated; it could be malformed.`);
            (0, styling_1.writeException)(e);
        }
        return false;
    }
    return true;
}
class UpdateCommand extends command_1.Command {
    command = 'update';
    project = new project_1.Project(this);
    all = new all_1.All(this);
    async run() {
        const resolver = main_1.session.globalRegistryResolver.with(await (0, artifact_1.buildRegistryResolver)(main_1.session, (await this.project.manifest)?.metadata.registries));
        if (this.all.active) {
            for (const registryUri of main_1.session.registryDatabase.getAllUris()) {
                if ((0, unified_filesystem_1.schemeOf)(registryUri) != 'https') {
                    continue;
                }
                const parsed = main_1.session.fileSystem.parseUri(registryUri);
                const displayName = resolver.getRegistryDisplayName(parsed);
                const loaded = resolver.getRegistryByUri(parsed);
                if (loaded) {
                    if (!await updateRegistry(loaded, displayName)) {
                        return false;
                    }
                }
            }
        }
        for (const registryInput of this.inputs) {
            const registryByName = resolver.getRegistryByName(registryInput);
            if (registryByName) {
                // if it matched a name, it's a name
                if (!await updateRegistry(registryByName, registryInput)) {
                    return false;
                }
                continue;
            }
            const scheme = (0, unified_filesystem_1.schemeOf)(registryInput);
            switch (scheme) {
                case 'https':
                    const registryInputAsUri = main_1.session.fileSystem.parseUri(registryInput);
                    const registryByUri = resolver.getRegistryByUri(registryInputAsUri)
                        ?? new RemoteRegistry_1.RemoteRegistry(main_1.session, registryInputAsUri);
                    if (!await updateRegistry(registryByUri, resolver.getRegistryDisplayName(registryInputAsUri))) {
                        return false;
                    }
                    continue;
                case 'file':
                    (0, styling_1.error)((0, i18n_1.i) `The x-update-registry command downloads new registry information and thus cannot be used with local registries. Did you mean x-regenerate ${registryInput}?`);
                    return false;
            }
            (0, styling_1.error)((0, i18n_1.i) `Unable to find registry ${registryInput}.`);
            return false;
        }
        return true;
    }
}
exports.UpdateCommand = UpdateCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9taWNyb3NvZnQvdmNwa2ctdG9vbC9tYWluL3ZjcGtnLWFydGlmYWN0cy8iLCJzb3VyY2VzIjpbImNsaS9jb21tYW5kcy91cGRhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF1QztBQUN2QyxrQ0FBa0M7OztBQUVsQyx1REFBaUU7QUFDakUsb0VBQXVEO0FBQ3ZELHFDQUErQjtBQUMvQixxQ0FBcUM7QUFDckMsb0VBQWlFO0FBRWpFLHNEQUE4RDtBQUM5RCx3Q0FBcUM7QUFDckMsc0NBQWtDO0FBQ2xDLHdDQUF3RDtBQUN4RCx5Q0FBc0M7QUFDdEMsaURBQThDO0FBRTlDLEtBQUssVUFBVSxjQUFjLENBQUMsUUFBa0IsRUFBRSxXQUFtQjtJQUNuRSxJQUFJLENBQUM7UUFDSCxNQUFNLFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDbkMsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdEIsSUFBQSxhQUFHLEVBQUMsSUFBQSxRQUFDLEVBQUEsV0FBVyxXQUFXLGlCQUFpQixJQUFBLGNBQUssRUFBQyxRQUFRLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDdkYsQ0FBQztJQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFDWCxJQUFJLENBQUMsWUFBWSxrQ0FBcUIsRUFBRSxDQUFDO1lBQ3ZDLElBQUEsYUFBRyxFQUFDLElBQUEsUUFBQyxFQUFBLHNCQUFzQixXQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQzdDLENBQUM7YUFBTSxDQUFDO1lBQ04sSUFBQSxhQUFHLEVBQUMsSUFBQSxRQUFDLEVBQUEsR0FBRyxXQUFXLCtDQUErQyxDQUFDLENBQUM7WUFDcEUsSUFBQSx3QkFBYyxFQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLENBQUM7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFF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