"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const path_1 = require("path");
const artifact_1 = require("../../artifacts/artifact");
const constants_1 = require("../../constants");
const filesystem_1 = require("../../fs/filesystem");
const i18n_1 = require("../../i18n");
const main_1 = require("../../main");
const format_1 = require("../format");
const styling_1 = require("../styling");
const switch_1 = require("../switch");
class Project extends switch_1.Switch {
    switch = 'project';
    async resolveProjectUri() {
        const v = this.value;
        if (v) {
            const uri = main_1.session.fileSystem.file((0, path_1.resolve)(v));
            const stat = await uri.stat();
            if (stat.type & filesystem_1.FileType.File) {
                return { 'filename': v, uri: uri };
            }
            if (stat.type & filesystem_1.FileType.Directory) {
                const project = uri.join(constants_1.configurationName);
                if (await project.exists()) {
                    return { 'filename': project.fsPath, uri: project };
                }
            }
            (0, styling_1.error)((0, i18n_1.i) `Unable to find project environment ${(0, format_1.projectFile)(uri)}`);
            return undefined;
        }
        const sessionProject = await main_1.session.findProjectProfile();
        if (sessionProject) {
            return { 'filename': sessionProject.fsPath, 'uri': sessionProject };
        }
        return undefined;
    }
    get resolvedValue() {
        return this.resolveProjectUri().then(v => v?.uri);
    }
    get manifest() {
        return this.resolveProjectUri().then(async (resolved) => {
            if (!resolved) {
                (0, styling_1.debug)('No project manifest');
                return undefined;
            }
            (0, styling_1.debug)(`Loading project manifest ${resolved.filename} `);
            return await new artifact_1.ProjectManifest(main_1.session, await main_1.session.openManifest(resolved.filename, resolved.uri));
        });
    }
}
exports.Project = Project;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJjbGkvc3dpdGNoZXMvcHJvamVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBRWxDLCtCQUErQjtBQUMvQix1REFBMkQ7QUFDM0QsK0NBQW9EO0FBQ3BELG9EQUErQztBQUMvQyxxQ0FBK0I7QUFDL0IscUNBQXFDO0FBRXJDLHNDQUF3QztBQUN4Qyx3Q0FBMEM7QUFDMUMsc0NBQW1DO0FBT25DLE1BQWEsT0FBUSxTQUFRLGVBQU07SUFDakMsTUFBTSxHQUFHLFNBQVMsQ0FBQztJQUVuQixLQUFLLENBQUMsaUJBQWlCO1FBQ3JCLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDckIsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUNOLE1BQU0sR0FBRyxHQUFHLGNBQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUEsY0FBTyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEQsTUFBTSxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFOUIsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLHFCQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQzlCLE9BQU8sRUFBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUMsQ0FBQztZQUNuQyxDQUFDO1lBQ0QsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLHFCQUFRLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ25DLE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsNkJBQWlCLENBQUMsQ0FBQztnQkFDNUMsSUFBSSxNQUFNLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDO29CQUMzQixPQUFPLEVBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBQyxDQUFDO2dCQUNwRCxDQUFDO1lBQ0gsQ0FBQztZQUVELElBQUEsZUFBSyxFQUFDLElBQUEsUUFBQyxFQUFBLHNDQUFzQyxJQUFBLG9CQUFXLEVBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2pFLE9BQU8sU0FBUyxDQUFDO1FBQ25CLENBQUM7UUFFRCxNQUFNLGNBQWMsR0FBRyxNQUFNLGNBQU8sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzFELElBQUksY0FBYyxFQUFFLENBQUM7WUFDbkIsT0FBTyxFQUFDLFVBQVUsRUFBRSxjQUFjLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUMsQ0FBQztRQUNwRSxDQUFDO1FBRUQsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUVELElBQUksYUFBYTtRQUNmLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRCxJQUFJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUU7WUFDdEQsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUNkLElBQUEsZUFBSyxFQUFDLHFCQUFxQixDQUFDLENBQUM7Z0JBQzdCLE9BQU8sU0FBUyxDQUFDO1lBQ25CLENBQUM7WUFFRCxJQUFBLGVBQUssRUFBQyw0QkFBNEIsUUFBUSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7WUFDeEQsT0FBTyxNQUFNLElBQUksMEJBQWUsQ0FBQyxjQUFPLEVBQUUsTUFBTSxjQUFPLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekcsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUE5Q0QsMEJBOENDIn0=