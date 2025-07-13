"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Json = void 0;
const path_1 = require("path");
const main_1 = require("../../main");
const switch_1 = require("../switch");
class Json extends switch_1.Switch {
    switch = 'json';
    get resolvedValue() {
        const v = this.value;
        if (v) {
            return main_1.session.fileSystem.file((0, path_1.resolve)(v));
        }
        return undefined;
    }
}
exports.Json = Json;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJjbGkvc3dpdGNoZXMvanNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBRWxDLCtCQUErQjtBQUMvQixxQ0FBcUM7QUFFckMsc0NBQW1DO0FBRW5DLE1BQWEsSUFBSyxTQUFRLGVBQU07SUFDOUIsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUVoQixJQUFJLGFBQWE7UUFDZixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDTixPQUFPLGNBQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUEsY0FBTyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0MsQ0FBQztRQUVELE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7Q0FFRjtBQVpELG9CQVlDIn0=