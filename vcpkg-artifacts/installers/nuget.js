"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.installNuGet = installNuGet;
const acquire_1 = require("../fs/acquire");
const vcpkg_1 = require("../vcpkg");
const util_1 = require("./util");
async function installNuGet(session, name, version, targetLocation, install, events, options) {
    const file = await (0, acquire_1.acquireNugetFile)(session, install.location, `${name}.zip`, events, (0, util_1.applyAcquireOptions)(options, install));
    events.unpackArchiveStart?.(file);
    await (0, vcpkg_1.vcpkgExtract)(session, file.fsPath, targetLocation.fsPath, install.strip);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVnZXQuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21pY3Jvc29mdC92Y3BrZy10b29sL21haW4vdmNwa2ctYXJ0aWZhY3RzLyIsInNvdXJjZXMiOlsiaW5zdGFsbGVycy9udWdldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7QUFTbEMsb0NBUUM7QUFmRCwyQ0FBaUQ7QUFLakQsb0NBQXdDO0FBQ3hDLGlDQUE2QztBQUN0QyxLQUFLLFVBQVUsWUFBWSxDQUFDLE9BQWdCLEVBQUUsSUFBWSxFQUFFLE9BQWUsRUFBRSxjQUFtQixFQUFFLE9BQXVCLEVBQUUsTUFBOEIsRUFBRSxPQUFnQztJQUNoTSxNQUFNLElBQUksR0FBRyxNQUFNLElBQUEsMEJBQWdCLEVBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBQSwwQkFBbUIsRUFBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUM3SCxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQyxNQUFNLElBQUEsb0JBQVksRUFDaEIsT0FBTyxFQUNQLElBQUksQ0FBQyxNQUFNLEVBQ1gsY0FBYyxDQUFDLE1BQU0sRUFDckIsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25CLENBQUMifQ==