"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.installGit = installGit;
const git_1 = require("../archivers/git");
const i18n_1 = require("../i18n");
const vcpkg_1 = require("../vcpkg");
async function installGit(session, name, version, targetLocation, install, events, options) {
    const gitPath = await (0, vcpkg_1.vcpkgFetch)(session, 'git');
    if (!gitPath) {
        throw new Error((0, i18n_1.i) `Git is not installed`);
    }
    const repo = session.parseLocation(install.location);
    const targetDirectory = targetLocation.join(options.subdirectory ?? '');
    const gitTool = new git_1.Git(gitPath, targetDirectory);
    events.unpackArchiveStart?.(repo);
    // changing the clone process to do an init/add remote/fetch/checkout because
    // it's far faster to clone a specific commit and this allows us to support
    // recursive shallow submodules as well.
    if (!await gitTool.init()) {
        events.unpackArchiveHeartbeat?.((0, i18n_1.i) `Initializing repository folder`);
        throw new Error((0, i18n_1.i) `Failed to initialize git repository folder (${targetDirectory.fsPath})`);
    }
    if (!await gitTool.addRemote('origin', repo)) {
        events.unpackArchiveHeartbeat?.((0, i18n_1.i) `Adding remote ${repo.toString()} to git repository folder`);
        throw new Error((0, i18n_1.i) `Failed to set git origin (${repo.toString()}) in folder (${targetDirectory.fsPath})`);
    }
    if (!await gitTool.fetch('origin', events, { commit: install.commit, depth: install.full ? undefined : 1 })) {
        events.unpackArchiveHeartbeat?.((0, i18n_1.i) `Fetching remote ${repo.toString()} for git repository folder`);
        throw new Error((0, i18n_1.i) `Unable to fetch git data for (${repo.toString()}) in folder (${targetDirectory.fsPath})`);
    }
    if (!await gitTool.checkout(events, { commit: 'FETCH_HEAD' })) {
        events.unpackArchiveHeartbeat?.((0, i18n_1.i) `Checking out commit ${install.commit} for ${repo.toString()} to git repository folder`);
        throw new Error((0, i18n_1.i) `Unable to checkout data for (${repo.toString()}) in folder (${targetDirectory.fsPath})`);
    }
    if (install.recurse) {
        events.unpackArchiveHeartbeat?.((0, i18n_1.i) `Updating submodules for repository ${repo.toString()} in the git repository folder`);
        if (!await gitTool.config('.gitmodules', 'submodule.*.shallow', 'true')) {
            throw new Error((0, i18n_1.i) `Unable to set submodule shallow data for (${repo.toString()}) in folder (${targetDirectory.fsPath})`);
        }
        if (!await gitTool.updateSubmodules(events, { init: true, recursive: true, depth: install.full ? undefined : 1 })) {
            throw new Error((0, i18n_1.i) `Unable update submodules for (${repo.toString()}) in folder (${targetDirectory.fsPath})`);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0LmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9taWNyb3NvZnQvdmNwa2ctdG9vbC9tYWluL3ZjcGtnLWFydGlmYWN0cy8iLCJzb3VyY2VzIjpbImluc3RhbGxlcnMvZ2l0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1Q0FBdUM7QUFDdkMsa0NBQWtDOztBQVVsQyxnQ0ErQ0M7QUF2REQsMENBQXFEO0FBQ3JELGtDQUE0QjtBQUs1QixvQ0FBc0M7QUFFL0IsS0FBSyxVQUFVLFVBQVUsQ0FBQyxPQUFnQixFQUFFLElBQVksRUFBRSxPQUFlLEVBQUUsY0FBbUIsRUFBRSxPQUFxQixFQUFFLE1BQThCLEVBQUUsT0FBK0Q7SUFDM04sTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFBLGtCQUFVLEVBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRWpELElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNiLE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBQSxRQUFDLEVBQUEsc0JBQXNCLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDckQsTUFBTSxlQUFlLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBRXhFLE1BQU0sT0FBTyxHQUFHLElBQUksU0FBRyxDQUFDLE9BQU8sRUFBRSxlQUFlLENBQUMsQ0FBQztJQUNsRCxNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVsQyw2RUFBNkU7SUFDN0UsMkVBQTJFO0lBQzNFLHdDQUF3QztJQUV4QyxJQUFJLENBQUUsTUFBTSxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQztRQUMzQixNQUFNLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxJQUFBLFFBQUMs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