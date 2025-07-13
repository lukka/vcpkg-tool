"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.MSBuildProps = void 0;
const path_1 = require("path");
const main_1 = require("../../main");
const switch_1 = require("../switch");
class MSBuildProps extends switch_1.Switch {
    switch;
    constructor(command, swName = 'msbuild-props') {
        super(command);
        this.switch = swName;
    }
    get resolvedValue() {
        const v = this.value;
        if (v) {
            return main_1.session.fileSystem.file((0, path_1.resolve)(v));
        }
        return undefined;
    }
}
exports.MSBuildProps = MSBuildProps;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXNidWlsZC1wcm9wcy5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJjbGkvc3dpdGNoZXMvbXNidWlsZC1wcm9wcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBRWxDLCtCQUErQjtBQUMvQixxQ0FBcUM7QUFHckMsc0NBQW1DO0FBRW5DLE1BQWEsWUFBYSxTQUFRLGVBQU07SUFDdEIsTUFBTSxDQUFTO0lBQy9CLFlBQVksT0FBZ0IsRUFBRSxNQUFNLEdBQUcsZUFBZTtRQUNwRCxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQsSUFBSSxhQUFhO1FBQ2YsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNyQixJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ04sT0FBTyxjQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFBLGNBQU8sRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFFRCxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0NBQ0Y7QUFmRCxvQ0FlQyJ9