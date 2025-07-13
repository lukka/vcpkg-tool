"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateMSBuildPropsCommand = void 0;
const activation_1 = require("../../artifacts/activation");
const artifact_1 = require("../../artifacts/artifact");
const i18n_1 = require("../../i18n");
const main_1 = require("../../main");
const artifacts_1 = require("../artifacts");
const command_1 = require("../command");
const styling_1 = require("../styling");
const msbuild_props_1 = require("../switches/msbuild-props");
const project_1 = require("../switches/project");
class GenerateMSBuildPropsCommand extends command_1.Command {
    command = 'generate-msbuild-props';
    project = new project_1.Project(this);
    msbuildProps = new msbuild_props_1.MSBuildProps(this, 'out');
    async run() {
        if (!this.msbuildProps.active) {
            (0, styling_1.error)('generate-msbuild-props requires --msbuild-props');
            return false;
        }
        const projectManifest = await this.project.manifest;
        if (!projectManifest) {
            (0, styling_1.error)((0, i18n_1.i) `Unable to find project in folder (or parent folders) for ${main_1.session.currentDirectory.fsPath}`);
            return false;
        }
        const projectResolver = await (0, artifact_1.buildRegistryResolver)(main_1.session, projectManifest.metadata.registries);
        const resolved = await (0, artifact_1.resolveDependencies)(main_1.session, projectResolver, [projectManifest], 3);
        // print the status of what is going to be activated.
        if (!await (0, artifacts_1.showArtifacts)(resolved, projectResolver, {})) {
            (0, styling_1.error)((0, i18n_1.i) `Unable to activate project`);
            return false;
        }
        const activation = await activation_1.Activation.start(main_1.session, false);
        for (const artifact of resolved) {
            if (!await artifact.artifact.loadActivationSettings(activation)) {
                main_1.session.channels.error((0, i18n_1.i) `Unable to activate project`);
                return false;
            }
        }
        const content = activation.generateMSBuild();
        await this.msbuildProps.resolvedValue?.writeUTF8(content);
        return true;
    }
}
exports.GenerateMSBuildPropsCommand = GenerateMSBuildPropsCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUtbXNidWlsZC1wcm9wcy5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJjbGkvY29tbWFuZHMvZ2VuZXJhdGUtbXNidWlsZC1wcm9wcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBRWxDLDJEQUF3RDtBQUN4RCx1REFBc0Y7QUFDdEYscUNBQStCO0FBQy9CLHFDQUFxQztBQUNyQyw0Q0FBNkM7QUFDN0Msd0NBQXFDO0FBQ3JDLHdDQUFtQztBQUNuQyw2REFBeUQ7QUFDekQsaURBQThDO0FBRTlDLE1BQWEsMkJBQTRCLFNBQVEsaUJBQU87SUFDN0MsT0FBTyxHQUFHLHdCQUF3QixDQUFDO0lBRTVDLE9BQU8sR0FBWSxJQUFJLGlCQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckMsWUFBWSxHQUFpQixJQUFJLDRCQUFZLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRWxELEtBQUssQ0FBQyxHQUFHO1FBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQzlCLElBQUEsZUFBSyxFQUFDLGlEQUFpRCxDQUFDLENBQUM7WUFDekQsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBRUQsTUFBTSxlQUFlLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztRQUVwRCxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDckIsSUFBQSxlQUFLLEVBQUMsSUFBQSxRQUFDLEVBQUEsNERBQTRELGNBQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQ3RHLE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUVELE1BQU0sZUFBZSxHQUFHLE1BQU0sSUFBQSxnQ0FBcUIsRUFBQyxjQUFPLEVBQUUsZUFBZSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNsRyxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUEsOEJBQW1CLEVBQUMsY0FBTyxFQUFFLGVBQWUsRUFBRSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRTNGLHFEQUFxRDtRQUNyRCxJQUFJLENBQUMsTUFBTSxJQUFBLHlCQUFhLEVBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ3hELElBQUEsZUFBSyxFQUFDLElBQUEsUUFBQyxFQUFBLDRCQUE0QixDQUFDLENBQUM7WUFDckMsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBRUQsTUFBTSxVQUFVLEdBQUcsTUFBTSx1QkFBVSxDQUFDLEtBQUssQ0FBQyxjQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDMUQsS0FBSyxNQUFNLFFBQVEsSUFBSSxRQUFRLEVBQUUsQ0FBQztZQUNoQyxJQUFJLENBQUMsTUFBTSxRQUFRLENBQUMsUUFBUSxDQUFDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7Z0JBQ2hFLGNBQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUEsUUFBQyxFQUFBLDRCQUE0QixDQUFDLENBQUM7Z0JBQ3RELE9BQU8sS0FBSyxDQUFDO1lBQ2YsQ0FBQztRQUNILENBQUM7UUFFRCxNQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDN0MsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDMUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0NBQ0Y7QUF4Q0Qsa0VBd0NDIn0=