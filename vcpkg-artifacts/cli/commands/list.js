"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCommand = void 0;
const main_1 = require("../../main");
const command_1 = require("../command");
const console_table_1 = require("../console-table");
const format_1 = require("../format");
const styling_1 = require("../styling");
const installed_1 = require("../switches/installed");
class ListCommand extends command_1.Command {
    command = 'list';
    installed = new installed_1.Installed(this);
    async run() {
        if (this.installed.active) {
            const artifacts = await main_1.session.getInstalledArtifacts();
            const table = new console_table_1.Table('Artifact', 'Version', 'Summary');
            for (const { artifact, id, folder } of artifacts) {
                const name = (0, format_1.artifactIdentity)('<registry-name-goes-here>', id, artifact.shortName); //todo: fixme
                table.push(name, artifact.version, artifact.metadata.summary || '');
            }
            (0, styling_1.log)(table.toString());
            (0, styling_1.log)();
        }
        else {
            (0, styling_1.log)('use --installed for now');
        }
        return true;
    }
}
exports.ListCommand = ListCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJjbGkvY29tbWFuZHMvbGlzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBR2xDLHFDQUFxQztBQUNyQyx3Q0FBcUM7QUFDckMsb0RBQXlDO0FBQ3pDLHNDQUE2QztBQUM3Qyx3Q0FBaUM7QUFDakMscURBQWtEO0FBRWxELE1BQWEsV0FBWSxTQUFRLGlCQUFPO0lBQzdCLE9BQU8sR0FBRyxNQUFNLENBQUM7SUFDMUIsU0FBUyxHQUFHLElBQUkscUJBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUV2QixLQUFLLENBQUMsR0FBRztRQUNoQixJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDMUIsTUFBTSxTQUFTLEdBQUcsTUFBTSxjQUFPLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUN4RCxNQUFNLEtBQUssR0FBRyxJQUFJLHFCQUFLLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUUxRCxLQUFLLE1BQU0sRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLFNBQVMsRUFBRSxDQUFDO2dCQUNqRCxNQUFNLElBQUksR0FBRyxJQUFBLHlCQUFnQixFQUFDLDJCQUEyQixFQUFFLEVBQUUsRUFBRSxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxhQUFhO2dCQUNqRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ3RFLENBQUM7WUFDRCxJQUFBLGFBQUcsRUFBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUN0QixJQUFBLGFBQUcsR0FBRSxDQUFDO1FBQ1IsQ0FBQzthQUNJLENBQUM7WUFDSixJQUFBLGFBQUcsRUFBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBQ2pDLENBQUM7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7Q0FDRjtBQXRCRCxrQ0FzQkMifQ==