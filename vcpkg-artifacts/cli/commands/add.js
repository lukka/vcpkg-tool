"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCommand = void 0;
const artifact_1 = require("../../artifacts/artifact");
const i18n_1 = require("../../i18n");
const main_1 = require("../../main");
const artifacts_1 = require("../artifacts");
const command_1 = require("../command");
const format_1 = require("../format");
const styling_1 = require("../styling");
const project_1 = require("../switches/project");
const version_1 = require("../switches/version");
class AddCommand extends command_1.Command {
    command = 'add';
    version = new version_1.Version(this);
    project = new project_1.Project(this);
    async run() {
        const projectManifest = await this.project.manifest;
        if (!projectManifest) {
            (0, styling_1.error)((0, i18n_1.i) `Unable to find project in folder (or parent folders) for ${main_1.session.currentDirectory.fsPath}`);
            return false;
        }
        if (this.inputs.length === 0) {
            (0, styling_1.error)((0, i18n_1.i) `No artifacts specified`);
            return false;
        }
        const versions = this.version.values;
        if (versions.length && this.inputs.length !== versions.length) {
            (0, styling_1.error)((0, i18n_1.i) `Multiple artifacts specified, but not an equal number of ${(0, format_1.cmdSwitch)('version')} switches`);
            return false;
        }
        const selections = new Map(this.inputs.map((v, i) => [v, versions[i] || '*']));
        const projectResolver = await (0, artifact_1.buildRegistryResolver)(main_1.session, projectManifest.metadata.registries);
        const combinedResolver = main_1.session.globalRegistryResolver.with(projectResolver);
        const selectedArtifacts = await (0, artifacts_1.selectArtifacts)(main_1.session, selections, combinedResolver, 2);
        if (!selectedArtifacts) {
            return false;
        }
        await (0, artifacts_1.showArtifacts)(selectedArtifacts, combinedResolver);
        for (const resolution of selectedArtifacts) {
            // map the registry of the found artifact to the registries already in the project file
            const artifact = resolution.artifact;
            if (resolution.initialSelection && artifact instanceof artifact_1.Artifact) {
                const registryUri = artifact.metadata.registryUri;
                let registryName = projectResolver.getRegistryName(registryUri);
                if (!registryName) {
                    // the registry isn't known yet to the project, try to declare it
                    registryName = main_1.session.globalRegistryResolver.getRegistryName(registryUri);
                    if (!registryName) {
                        throw new Error((0, i18n_1.i) `Tried to add an artifact [${registryUri.toString()}]:${artifact.id} but could not determine the registry to use.`);
                    }
                    const conflictingRegistry = projectResolver.getRegistryByName(registryName);
                    if (conflictingRegistry) {
                        throw new Error((0, i18n_1.i) `Tried to add registry ${registryName} as ${registryUri.toString()}, but it was already ${conflictingRegistry.location.toString()}. Please add ${registryUri.toString()} to this project manually and reattempt.`);
                    }
                    projectManifest.metadata.registries.add(registryName, artifact.registryUri, 'artifact');
                    projectResolver.add(registryUri, registryName);
                }
                // add the artifact to the project
                const fulfilled = artifact.version.toString();
                const requested = resolution.requestedVersion;
                const v = requested !== fulfilled ? `${requested} ${fulfilled}` : fulfilled;
                projectManifest.metadata.requires.set(`${registryName}:${artifact.id}`, v);
            }
        }
        // write the file out.
        await projectManifest.metadata.save();
        main_1.session.channels.message((0, i18n_1.i) `Run \`vcpkg-shell activate\` to apply to the current terminal`);
        return true;
    }
}
exports.AddCommand = AddCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9taWNyb3NvZnQvdmNwa2ctdG9vbC9tYWluL3ZjcGtnLWFydGlmYWN0cy8iLCJzb3VyY2VzIjpbImNsaS9jb21tYW5kcy9hZGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF1QztBQUN2QyxrQ0FBa0M7OztBQUVsQyx1REFBMkU7QUFDM0UscUNBQStCO0FBQy9CLHFDQUFxQztBQUNyQyw0Q0FBOEQ7QUFDOUQsd0NBQXFDO0FBQ3JDLHNDQUFzQztBQUN0Qyx3Q0FBbUM7QUFDbkMsaURBQThDO0FBQzlDLGlEQUE4QztBQUU5QyxNQUFhLFVBQVcsU0FBUSxpQkFBTztJQUM1QixPQUFPLEdBQUcsS0FBSyxDQUFDO0lBRXpCLE9BQU8sR0FBRyxJQUFJLGlCQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUIsT0FBTyxHQUFZLElBQUksaUJBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUU1QixLQUFLLENBQUMsR0FBRztRQUNoQixNQUFNLGVBQWUsR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO1FBRXBELElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUNyQixJQUFBLGVBQUssRUFBQyxJQUFBLFFBQUMsRUFBQSw0REFBNEQsY0FBTyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDdEcsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBRUQsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUM3QixJQUFBLGVBQUssRUFBQyxJQUFBLFFBQUMsRUFBQSx3QkFBd0IsQ0FBQyxDQUFDO1lBQ2pDLE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUVELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQ3JDLElBQUksUUFBUSxD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