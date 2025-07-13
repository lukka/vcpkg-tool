"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindCommand = void 0;
const chalk_1 = require("chalk");
const artifact_1 = require("../../artifacts/artifact");
const i18n_1 = require("../../i18n");
const main_1 = require("../../main");
const command_1 = require("../command");
const console_table_1 = require("../console-table");
const styling_1 = require("../styling");
const project_1 = require("../switches/project");
const version_1 = require("../switches/version");
class FindCommand extends command_1.Command {
    command = 'find';
    version = new version_1.Version(this);
    project = new project_1.Project(this);
    async run() {
        // load registries (from the current project too if available)
        const resolver = main_1.session.globalRegistryResolver.with(await (0, artifact_1.buildRegistryResolver)(main_1.session, (await this.project.manifest)?.metadata.registries));
        const table = new console_table_1.Table((0, i18n_1.i) `Artifact`, (0, i18n_1.i) `Version`, (0, i18n_1.i) `Summary`);
        let anyEntries = false;
        for (const each of this.inputs) {
            const hasColon = each.indexOf(':') > -1;
            // eslint-disable-next-line prefer-const
            for (let [display, artifactVersions] of await resolver.search({
                // use keyword search if no registry is specified
                keyword: hasColon ? undefined : each,
                // otherwise use the criteria as an id
                idOrShortName: hasColon ? each : undefined,
                version: this.version.value
            })) {
                if (!this.version.isRangeOfVersions) {
                    // if the user didn't specify a range, just show the latest version that was returned
                    artifactVersions.splice(1);
                }
                for (const result of artifactVersions) {
                    if (!result.metadata.dependencyOnly) {
                        anyEntries = true;
                        table.push(display, result.metadata.version, result.metadata.summary || '');
                    }
                }
            }
        }
        if (!anyEntries) {
            (0, styling_1.error)((0, i18n_1.i) `No artifacts found matching criteria: ${chalk_1.cyan.bold(this.inputs.join(', '))}`);
            return false;
        }
        (0, styling_1.log)(table.toString());
        (0, styling_1.log)();
        return true;
    }
}
exports.FindCommand = FindCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZC5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJjbGkvY29tbWFuZHMvZmluZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBR2xDLGlDQUE2QjtBQUM3Qix1REFBaUU7QUFDakUscUNBQStCO0FBQy9CLHFDQUFxQztBQUNyQyx3Q0FBcUM7QUFDckMsb0RBQXlDO0FBQ3pDLHdDQUF3QztBQUN4QyxpREFBOEM7QUFDOUMsaURBQThDO0FBRTlDLE1BQWEsV0FBWSxTQUFRLGlCQUFPO0lBQzdCLE9BQU8sR0FBRyxNQUFNLENBQUM7SUFFMUIsT0FBTyxHQUFHLElBQUksaUJBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QixPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRW5CLEtBQUssQ0FBQyxHQUFHO1FBQ2hCLDhEQUE4RDtRQUM5RCxNQUFNLFFBQVEsR0FBRyxjQUFPLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUNsRCxNQUFNLElBQUEsZ0NBQXFCLEVBQUMsY0FBTyxFQUFFLENBQUMsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQzVGLE1BQU0sS0FBSyxHQUFHLElBQUkscUJBQUssQ0FBQyxJQUFBLFFBQUMsRUFBQSxVQUFVLEVBQUUsSUFBQSxRQUFDLEVBQUEsU0FBUyxFQUFFLElBQUEsUUFBQyxFQUFBLFNBQVMsQ0FBQyxDQUFDO1FBRTdELElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN2QixLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUMvQixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLHdDQUF3QztZQUN4QyxLQUFLLElBQUksQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLENBQUMsSUFBSSxNQUFNLFFBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBQzVELGlEQUFpRDtnQkFDakQsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJO2dCQUNwQyxzQ0FBc0M7Z0JBQ3RDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUztnQkFDMUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSzthQUM1QixDQUFDLEVBQUUsQ0FBQztnQkFDSCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO29CQUNwQyxxRkFBcUY7b0JBQ3JGLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0IsQ0FBQztnQkFDRCxLQUFLLE1BQU0sTUFBTSxJQUFJLGdCQUFnQixFQUFFLENBQUM7b0JBQ3RDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO3dCQUNwQyxVQUFVLEdBQUcsSUFBSSxDQUFDO3dCQUNsQixLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQztvQkFDOUUsQ0FBQztnQkFDSCxDQUFDO1lBQ0gsQ0FBQztRQUNILENBQUM7UUFFRCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDaEIsSUFBQSxlQUFLLEVBQUMsSUFBQSxRQUFDLEVBQUEseUNBQXlDLFlBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDckYsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBRUQsSUFBQSxhQUFHLEVBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDdEIsSUFBQSxhQUFHLEdBQUUsQ0FBQztRQUNOLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztDQUNGO0FBN0NELGtDQTZDQyJ9