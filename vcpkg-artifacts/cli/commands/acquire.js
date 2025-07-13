"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcquireCommand = void 0;
const artifact_1 = require("../../artifacts/artifact");
const i18n_1 = require("../../i18n");
const main_1 = require("../../main");
const linq_1 = require("../../util/linq");
const artifacts_1 = require("../artifacts");
const command_1 = require("../command");
const format_1 = require("../format");
const styling_1 = require("../styling");
const project_1 = require("../switches/project");
const version_1 = require("../switches/version");
class AcquireCommand extends command_1.Command {
    command = 'acquire';
    version = new version_1.Version(this);
    project = new project_1.Project(this);
    async run() {
        if (this.inputs.length === 0) {
            (0, styling_1.error)((0, i18n_1.i) `No artifacts specified`);
            return false;
        }
        const versions = this.version.values;
        if (versions.length && this.inputs.length !== versions.length) {
            (0, styling_1.error)(`Multiple packages specified, but not an equal number of ${(0, format_1.cmdSwitch)('version')} switches`);
            return false;
        }
        const resolver = main_1.session.globalRegistryResolver.with(await (0, artifact_1.buildRegistryResolver)(main_1.session, (await this.project.manifest)?.metadata.registries));
        const resolved = await (0, artifacts_1.selectArtifacts)(main_1.session, new Map(this.inputs.map((v, i) => [v, versions[i] || '*'])), resolver, 2);
        if (!resolved) {
            (0, styling_1.debug)('No artifacts selected - stopping');
            return false;
        }
        if (!await (0, artifacts_1.showArtifacts)(resolved, resolver, this.commandLine)) {
            (0, styling_1.warning)((0, i18n_1.i) `No artifacts are acquired`);
            return false;
        }
        const numberOfArtifacts = await (0, linq_1.countWhere)(resolved, async (resolution) => {
            const artifact = resolution.artifact;
            return !(!this.commandLine.force && artifact instanceof artifact_1.Artifact && await artifact.isInstalled);
        });
        if (!numberOfArtifacts) {
            (0, styling_1.log)((0, i18n_1.i) `All artifacts are already installed`);
            return true;
        }
        (0, styling_1.debug)(`Installing ${numberOfArtifacts} artifacts`);
        const success = await (0, artifacts_1.acquireArtifacts)(main_1.session, resolved, resolver, { force: this.commandLine.force, language: this.commandLine.language, allLanguages: this.commandLine.allLanguages });
        if (success) {
            (0, styling_1.log)((0, i18n_1.i) `${numberOfArtifacts} artifacts installed successfully`);
        }
        else {
            (0, styling_1.log)((0, i18n_1.i) `Installation failed -- stopping`);
        }
        return success;
    }
}
exports.AcquireCommand = AcquireCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNxdWlyZS5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJjbGkvY29tbWFuZHMvYWNxdWlyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBRWxDLHVEQUEyRTtBQUMzRSxxQ0FBK0I7QUFDL0IscUNBQXFDO0FBQ3JDLDBDQUE2QztBQUM3Qyw0Q0FBZ0Y7QUFDaEYsd0NBQXFDO0FBQ3JDLHNDQUFzQztBQUN0Qyx3Q0FBd0Q7QUFDeEQsaURBQThDO0FBQzlDLGlEQUE4QztBQUU5QyxNQUFhLGNBQWUsU0FBUSxpQkFBTztJQUNoQyxPQUFPLEdBQUcsU0FBUyxDQUFDO0lBQzdCLE9BQU8sR0FBWSxJQUFJLGlCQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckMsT0FBTyxHQUFZLElBQUksaUJBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUU1QixLQUFLLENBQUMsR0FBRztRQUNoQixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQzdCLElBQUEsZUFBSyxFQUFDLElBQUEsUUFBQyxFQUFBLHdCQUF3QixDQUFDLENBQUM7WUFDakMsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBRUQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDckMsSUFBSSxRQUFRLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUM5RCxJQUFBLGVBQUssRUFBQywyREFBMkQsSUFBQSxrQkFBUyxFQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNsRyxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7UUFFRCxNQUFNLFFBQVEsR0FBRyxjQUFPLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUNsRCxNQUFNLElBQUEsZ0NBQXFCLEVBQUMsY0FBTyxFQUFFLENBQUMsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQzVGLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBQSwyQkFBZSxFQUFDLGNBQU8sRUFBRSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzFILElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNkLElBQUEsZUFBSyxFQUFDLGtDQUFrQyxDQUFDLENBQUM7WUFDMUMsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBRUQsSUFBSSxDQUFDLE1BQU0sSUFBQSx5QkFBYSxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7WUFDL0QsSUFBQSxpQkFBTyxFQUFDLElBQUEsUUFBQyxFQUFBLDJCQUEyQixDQUFDLENBQUM7WUFDdEMsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBRUQsTUFBTSxpQkFBaUIsR0FBRyxNQUFNLElBQUEsaUJBQVUsRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxFQUFFO1lBQ3hFLE1BQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUM7WUFDckMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssSUFBSSxRQUFRLFlBQVksbUJBQVEsSUFBSSxNQUFNLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNsRyxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1lBQ3ZCLElBQUEsYUFBRyxFQUFDLElBQUEsUUFBQyxFQUFBLHFDQUFxQyxDQUFDLENBQUM7WUFDNUMsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBRUQsSUFBQSxlQUFLLEVBQUMsY0FBYyxpQkFBaUIsWUFBWSxDQUFDLENBQUM7UUFDbkQsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFBLDRCQUFnQixFQUFDLGNBQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO1FBQ3pMLElBQUksT0FBTyxFQUFFLENBQUM7WUFDWixJQUFBLGFBQUcsRUFBQyxJQUFBLFFBQUMsRUFBQSxHQUFHLGlCQUFpQixtQ0FBbUMsQ0FBQyxDQUFDO1FBQ2hFLENBQUM7YUFBTSxDQUFDO1lBQ04sSUFBQSxhQUFHLEVBQUMsSUFBQSxRQUFDLEVBQUEsaUNBQWlDLENBQUMsQ0FBQztRQUMxQyxDQUFDO1FBRUQsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztDQUNGO0FBbERELHdDQWtEQyJ9