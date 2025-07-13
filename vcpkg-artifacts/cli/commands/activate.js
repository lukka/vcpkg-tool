"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivateCommand = void 0;
const artifact_1 = require("../../artifacts/artifact");
const constants_1 = require("../../constants");
const i18n_1 = require("../../i18n");
const main_1 = require("../../main");
const artifacts_1 = require("../artifacts");
const command_1 = require("../command");
const format_1 = require("../format");
const project_1 = require("../project");
const styling_1 = require("../styling");
const json_1 = require("../switches/json");
const msbuild_props_1 = require("../switches/msbuild-props");
const project_2 = require("../switches/project");
class ActivateCommand extends command_1.Command {
    command = 'activate';
    project = new project_2.Project(this);
    msbuildProps = new msbuild_props_1.MSBuildProps(this);
    json = new json_1.Json(this);
    async run() {
        const projectManifest = await this.project.manifest;
        if (!projectManifest) {
            (0, styling_1.error)((0, i18n_1.i) `Unable to find project in folder (or parent folders) for ${main_1.session.currentDirectory.fsPath}`);
            return false;
        }
        const options = {
            force: this.commandLine.force,
            allLanguages: this.commandLine.allLanguages,
            language: this.commandLine.language,
            msbuildProps: this.msbuildProps.resolvedValue,
            json: this.json.resolvedValue
        };
        // track what got installed
        const projectResolver = await (0, artifact_1.buildRegistryResolver)(main_1.session, projectManifest.metadata.registries);
        if (!(0, artifact_1.checkDemands)(main_1.session, (await main_1.session.findProjectProfile())?.fsPath ?? constants_1.configurationName, projectManifest.applicableDemands)) {
            return false;
        }
        const resolved = await (0, artifact_1.resolveDependencies)(main_1.session, projectResolver, [projectManifest], 3);
        // print the status of what is going to be activated.
        if (!await (0, artifacts_1.showArtifacts)(resolved, projectResolver, options)) {
            return false;
        }
        return (0, project_1.activate)(main_1.session, false, [(0, format_1.projectFile)(projectManifest.metadata.file.parent)], resolved, projectResolver, options);
    }
}
exports.ActivateCommand = ActivateCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aXZhdGUuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21pY3Jvc29mdC92Y3BrZy10b29sL21haW4vdmNwa2ctYXJ0aWZhY3RzLyIsInNvdXJjZXMiOlsiY2xpL2NvbW1hbmRzL2FjdGl2YXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1Q0FBdUM7QUFDdkMsa0NBQWtDOzs7QUFFbEMsdURBQW9HO0FBQ3BHLCtDQUFvRDtBQUNwRCxxQ0FBK0I7QUFDL0IscUNBQXFDO0FBQ3JDLDRDQUE2QztBQUM3Qyx3Q0FBcUM7QUFDckMsc0NBQXdDO0FBQ3hDLHdDQUFzQztBQUN0Qyx3Q0FBbUM7QUFDbkMsMkNBQXdDO0FBQ3hDLDZEQUF5RDtBQUN6RCxpREFBOEM7QUFFOUMsTUFBYSxlQUFnQixTQUFRLGlCQUFPO0lBQ2pDLE9BQU8sR0FBRyxVQUFVLENBQUM7SUFDOUIsT0FBTyxHQUFZLElBQUksaUJBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQyxZQUFZLEdBQWlCLElBQUksNEJBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwRCxJQUFJLEdBQVUsSUFBSSxXQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFcEIsS0FBSyxDQUFDLEdBQUc7UUFDaEIsTUFBTSxlQUFlLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztRQUVwRCxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDckIsSUFBQSxlQUFLLEVBQUMsSUFBQSxRQUFDLEVBQUEsNERBQTRELGNBQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQ3RHLE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUVELE1BQU0sT0FBTyxHQUFHO1lBQ2QsS0FBSyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSztZQUM3QixZQUFZLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZO1lBQzNDLFFBQVEsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVE7WUFDbkMsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYTtZQUM3QyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhO1NBQzlCLENBQUM7UUFFRiwyQkFBMkI7UUFDM0IsTUFBTSxlQUFlLEdBQUcsTUFBTSxJQUFBLGdDQUFxQixFQUFDLGNBQU8sRUFBRSxlQUFlLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2xHLElBQUksQ0FBQyxJQUFBLHVCQUFZLEVBQUMsY0FBTyxFQUFFLENBQUMsTUFBTSxjQUFPLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxFQUFFLE1BQU0sSUFBSSw2QkFBaUIsRUFBRSxlQUFlLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDO1lBQ2pJLE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUVELE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBQSw4QkFBbUIsRUFBQyxjQUFPLEVBQUUsZUFBZSxFQUFFLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFM0YscURBQXFEO1FBQ3JELElBQUksQ0FBQyxNQUFNLElBQUEseUJBQWEsRUFBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDN0QsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBRUQsT0FBTyxJQUFBLGtCQUFRLEVBQUMsY0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLElBQUEsb0JBQVcsRUFBQyxlQUFlLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxlQUFlLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDM0gsQ0FBQztDQUNGO0FBckNELDBDQXFDQyJ9