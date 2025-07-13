"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueTempFolder = uniqueTempFolder;
const fs_1 = require("fs");
const os_1 = require("os");
const path_1 = require("path");
function uniqueTempFolder() {
    return (0, fs_1.mkdtempSync)((0, path_1.join)((0, os_1.tmpdir)(), '/ce-temp!'));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pcXVlVGVtcEZvbGRlci5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJ0ZXN0L2NvcmUvdW5pcXVlVGVtcEZvbGRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7QUFNbEMsNENBRUM7QUFORCwyQkFBaUM7QUFDakMsMkJBQTRCO0FBQzVCLCtCQUE0QjtBQUU1QixTQUFnQixnQkFBZ0I7SUFDOUIsT0FBTyxJQUFBLGdCQUFXLEVBQUMsSUFBQSxXQUFJLEVBQUMsSUFBQSxXQUFNLEdBQUUsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO0FBQ2xELENBQUMifQ==