"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.installUnTar = installUnTar;
const acquire_1 = require("../fs/acquire");
const vcpkg_1 = require("../vcpkg");
const util_1 = require("./util");
async function installUnTar(session, name, version, targetLocation, install, events, options) {
    const file = await (0, acquire_1.acquireArtifactFile)(session, [...install.location].map(each => session.parseLocation(each)), (0, util_1.artifactFileName)(name, version, install, '.tar'), events, (0, util_1.applyAcquireOptions)(options, install));
    events.unpackArchiveStart?.(file);
    await (0, vcpkg_1.vcpkgExtract)(session, file.fsPath, targetLocation.fsPath, install.strip);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW50YXIuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21pY3Jvc29mdC92Y3BrZy10b29sL21haW4vdmNwa2ctYXJ0aWZhY3RzLyIsInNvdXJjZXMiOlsiaW5zdGFsbGVycy91bnRhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7QUFVbEMsb0NBUUM7QUFoQkQsMkNBQW9EO0FBS3BELG9DQUF3QztBQUN4QyxpQ0FBK0Q7QUFFeEQsS0FBSyxVQUFVLFlBQVksQ0FBQyxPQUFnQixFQUFFLElBQVksRUFBRSxPQUFlLEVBQUUsY0FBbUIsRUFBRSxPQUF1QixFQUFFLE1BQThCLEVBQUUsT0FBZ0M7SUFDaE0sTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFBLDZCQUFtQixFQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFBLHVCQUFnQixFQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFBLDBCQUFtQixFQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ2pOLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLE1BQU0sSUFBQSxvQkFBWSxFQUNoQixPQUFPLEVBQ1AsSUFBSSxDQUFDLE1BQU0sRUFDWCxjQUFjLENBQUMsTUFBTSxFQUN0QixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbEIsQ0FBQyJ9