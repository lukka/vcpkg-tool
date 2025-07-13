"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcquireProjectCommand = void 0;
const artifact_1 = require("../../artifacts/artifact");
const i18n_1 = require("../../i18n");
const main_1 = require("../../main");
const artifacts_1 = require("../artifacts");
const command_1 = require("../command");
const styling_1 = require("../styling");
const project_1 = require("../switches/project");
class AcquireProjectCommand extends command_1.Command {
    command = 'acquire-project';
    project = new project_1.Project(this);
    async run() {
        const projectManifest = await this.project.manifest;
        if (!projectManifest) {
            (0, styling_1.error)((0, i18n_1.i) `Unable to find project in folder (or parent folders) for ${main_1.session.currentDirectory.fsPath}`);
            return false;
        }
        const projectResolver = await (0, artifact_1.buildRegistryResolver)(main_1.session, projectManifest.metadata.registries);
        const resolved = await (0, artifact_1.resolveDependencies)(main_1.session, projectResolver, [projectManifest], 3);
        // print the status of what is going to be acquired
        if (!await (0, artifacts_1.showArtifacts)(resolved, projectResolver, { force: this.commandLine.force })) {
            main_1.session.channels.error((0, i18n_1.i) `Unable to acquire project`);
            return false;
        }
        return await (0, artifacts_1.acquireArtifacts)(main_1.session, resolved, projectResolver, {
            force: this.commandLine.force,
            allLanguages: this.commandLine.allLanguages,
            language: this.commandLine.language
        });
    }
}
exports.AcquireProjectCommand = AcquireProjectCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNxdWlyZS1wcm9qZWN0LmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9taWNyb3NvZnQvdmNwa2ctdG9vbC9tYWluL3ZjcGtnLWFydGlmYWN0cy8iLCJzb3VyY2VzIjpbImNsaS9jb21tYW5kcy9hY3F1aXJlLXByb2plY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF1QztBQUN2QyxrQ0FBa0M7OztBQUVsQyx1REFBc0Y7QUFDdEYscUNBQStCO0FBQy9CLHFDQUFxQztBQUNyQyw0Q0FBK0Q7QUFDL0Qsd0NBQXFDO0FBQ3JDLHdDQUFtQztBQUNuQyxpREFBOEM7QUFFOUMsTUFBYSxxQkFBc0IsU0FBUSxpQkFBTztJQUN2QyxPQUFPLEdBQUcsaUJBQWlCLENBQUM7SUFDckMsT0FBTyxHQUFZLElBQUksaUJBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUU1QixLQUFLLENBQUMsR0FBRztRQUNoQixNQUFNLGVBQWUsR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO1FBQ3BELElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUNyQixJQUFBLGVBQUssRUFBQyxJQUFBLFFBQUMsRUFBQSw0REFBNEQsY0FBTyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDdEcsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBRUQsTUFBTSxlQUFlLEdBQUcsTUFBTSxJQUFBLGdDQUFxQixFQUFDLGNBQU8sRUFBRSxlQUFlLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2xHLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBQSw4QkFBbUIsRUFBQyxjQUFPLEVBQUUsZUFBZSxFQUFFLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFM0YsbURBQW1EO1FBQ25ELElBQUksQ0FBQyxNQUFNLElBQUEseUJBQWEsRUFBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFDLENBQUMsRUFBRSxDQUFDO1lBQ3JGLGNBQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUEsUUFBQyxFQUFBLDJCQUEyQixDQUFDLENBQUM7WUFDckQsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBRUQsT0FBTyxNQUFNLElBQUEsNEJBQWdCLEVBQUMsY0FBTyxFQUFFLFFBQVEsRUFBRSxlQUFlLEVBQUU7WUFDaEUsS0FBSyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSztZQUM3QixZQUFZLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZO1lBQzNDLFFBQVEsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVE7U0FDcEMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBMUJELHNEQTBCQyJ9