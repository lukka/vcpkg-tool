"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseCommand = void 0;
const artifact_1 = require("../../artifacts/artifact");
const i18n_1 = require("../../i18n");
const main_1 = require("../../main");
const artifacts_1 = require("../artifacts");
const command_1 = require("../command");
const format_1 = require("../format");
const project_1 = require("../project");
const styling_1 = require("../styling");
const msbuild_props_1 = require("../switches/msbuild-props");
const project_2 = require("../switches/project");
const version_1 = require("../switches/version");
class UseCommand extends command_1.Command {
    command = 'use';
    version = new version_1.Version(this);
    project = new project_2.Project(this);
    msbuildProps = new msbuild_props_1.MSBuildProps(this);
    async run() {
        if (this.inputs.length === 0) {
            (0, styling_1.error)((0, i18n_1.i) `No artifacts specified`);
            return false;
        }
        const resolver = main_1.session.globalRegistryResolver.with(await (0, artifact_1.buildRegistryResolver)(main_1.session, (await this.project.manifest)?.metadata.registries));
        const versions = this.version.values;
        if (versions.length && this.inputs.length !== versions.length) {
            (0, styling_1.error)(`Multiple packages specified, but not an equal number of ${(0, format_1.cmdSwitch)('version')} switches`);
            return false;
        }
        const selections = new Map(this.inputs.map((v, i) => [v, versions[i] || '*']));
        const artifacts = await (0, artifacts_1.selectArtifacts)(main_1.session, selections, resolver, 2);
        if (!artifacts) {
            return false;
        }
        if (!await (0, artifacts_1.showArtifacts)(artifacts, resolver, this.commandLine)) {
            (0, styling_1.warning)((0, i18n_1.i) `No artifacts are being acquired`);
            return false;
        }
        return (0, project_1.activate)(main_1.session, true, this.inputs, artifacts, resolver, { force: this.commandLine.force, language: this.commandLine.language, allLanguages: this.commandLine.allLanguages });
    }
}
exports.UseCommand = UseCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9taWNyb3NvZnQvdmNwa2ctdG9vbC9tYWluL3ZjcGtnLWFydGlmYWN0cy8iLCJzb3VyY2VzIjpbImNsaS9jb21tYW5kcy91c2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF1QztBQUN2QyxrQ0FBa0M7OztBQUVsQyx1REFBaUU7QUFDakUscUNBQStCO0FBQy9CLHFDQUFxQztBQUNyQyw0Q0FBOEQ7QUFDOUQsd0NBQXFDO0FBQ3JDLHNDQUFzQztBQUN0Qyx3Q0FBc0M7QUFDdEMsd0NBQTRDO0FBQzVDLDZEQUF5RDtBQUN6RCxpREFBOEM7QUFDOUMsaURBQThDO0FBRTlDLE1BQWEsVUFBVyxTQUFRLGlCQUFPO0lBQzVCLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDekIsT0FBTyxHQUFHLElBQUksaUJBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QixPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVCLFlBQVksR0FBRyxJQUFJLDRCQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFN0IsS0FBSyxDQUFDLEdBQUc7UUFDaEIsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUM3QixJQUFBLGVBQUssRUFBQyxJQUFBLFFBQUMsRUFBQSx3QkFBd0IsQ0FBQyxDQUFDO1lBQ2pDLE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUVELE1BQU0sUUFBUSxHQUFHLGNBQU8sQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQ2xELE1BQU0sSUFBQSxnQ0FBcUIsRUFBQyxjQUFPLEVBQUUsQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDNUYsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDckMsSUFBSSxRQUFRLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUM5RCxJQUFBLGVBQUssRUFBQywyREFBMkQsSUFBQSxrQkFBUyxFQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNsRyxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7UUFFRCxNQUFNLFVBQVUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0UsTUFBTSxTQUFTLEdBQUcsTUFBTSxJQUFBLDJCQUFlLEVBQUMsY0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDMUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2YsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBRUQsSUFBSSxDQUFDLE1BQU0sSUFBQSx5QkFBYSxFQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7WUFDaEUsSUFBQSxpQkFBTyxFQUFDLElBQUEsUUFBQyxFQUFBLGlDQUFpQyxDQUFDLENBQUM7WUFDNUMsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBRUQsT0FBTyxJQUFBLGtCQUFRLEVBQUMsY0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQzdELEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO0lBQ3pILENBQUM7Q0FDRjtBQWxDRCxnQ0FrQ0MifQ==