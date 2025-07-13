"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuiteLocal = void 0;
const assert_1 = require("assert");
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const local_filesystem_1 = require("../../fs/local-filesystem");
const session_1 = require("../../session");
const uniqueTempFolder_1 = require("./uniqueTempFolder");
require('../../exports');
function resourcesFolder(from = __dirname) {
    for (;;) {
        try {
            const resources = (0, path_1.join)(from, 'test-resources');
            const s = (0, fs_1.statSync)(resources);
            s.isDirectory();
            return resources;
        }
        catch {
            // shh!
        }
        const up = (0, path_1.resolve)(from, '..');
        assert_1.strict.notEqual(up, from, 'O_o unable to find root folder');
        from = up;
    }
}
class SuiteLocal {
    tempFolder = (0, uniqueTempFolder_1.uniqueTempFolder)();
    session;
    fs;
    resourcesFolder = resourcesFolder();
    tempFolderUri;
    resourcesFolderUri;
    constructor() {
        this.tempFolder = (0, uniqueTempFolder_1.uniqueTempFolder)();
        this.session = new session_1.Session(this.tempFolder, {}, {
            vcpkgCommand: undefined,
            homeFolder: (0, path_1.join)(this.tempFolder, 'vcpkg_root'),
            vcpkgArtifactsRoot: (0, path_1.join)(this.tempFolder, 'artifacts'),
            vcpkgDownloads: (0, path_1.join)(this.tempFolder, 'downloads'),
            vcpkgRegistriesCache: (0, path_1.join)(this.tempFolder, 'registries'),
        });
        this.fs = new local_filesystem_1.LocalFileSystem(this.session);
        this.tempFolderUri = this.fs.file(this.tempFolder);
        this.resourcesFolderUri = this.fs.file(this.resourcesFolder);
        // set the debug=1 in the environment to have the debug messages dumped during testing
        if (process.env['DEBUG'] || process.env['debug']) {
            this.session.channels.on('debug', (text, msec) => {
                SuiteLocal.log(`[${msec}msec] ${text}`);
            });
        }
    }
    async after() {
        await (0, promises_1.rm)(this.tempFolder, { recursive: true });
    }
    static log(args) {
        console['log'](args);
    }
}
exports.SuiteLocal = SuiteLocal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3VpdGVMb2NhbC5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJ0ZXN0L2NvcmUvU3VpdGVMb2NhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBRWxDLG1DQUFnQztBQUNoQywyQkFBOEI7QUFDOUIsMENBQWlDO0FBQ2pDLCtCQUFxQztBQUNyQyxnRUFBNEQ7QUFDNUQsMkNBQXdDO0FBRXhDLHlEQUFzRDtBQUd0RCxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFFekIsU0FBUyxlQUFlLENBQUMsSUFBSSxHQUFHLFNBQVM7SUFDdkMsU0FBUyxDQUFDO1FBQ1IsSUFBSSxDQUFDO1lBQ0gsTUFBTSxTQUFTLEdBQUcsSUFBQSxXQUFJLEVBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFDL0MsTUFBTSxDQUFDLEdBQUcsSUFBQSxhQUFRLEVBQUMsU0FBUyxDQUFDLENBQUM7WUFDOUIsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ2hCLE9BQU8sU0FBUyxDQUFDO1FBQ25CLENBQUM7UUFDRCxNQUFNLENBQUM7WUFDTCxPQUFPO1FBQ1QsQ0FBQztRQUVELE1BQU0sRUFBRSxHQUFHLElBQUEsY0FBTyxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMvQixlQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsZ0NBQWdDLENBQUMsQ0FBQztRQUM1RCxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ1osQ0FBQztBQUNILENBQUM7QUFFRCxNQUFhLFVBQVU7SUFDWixVQUFVLEdBQUcsSUFBQSxtQ0FBZ0IsR0FBRSxDQUFDO0lBQ2hDLE9BQU8sQ0FBVTtJQUNqQixFQUFFLENBQWtCO0lBQ3BCLGVBQWUsR0FBRyxlQUFlLEVBQUUsQ0FBQztJQUNwQyxhQUFhLENBQU07SUFDbkIsa0JBQWtCLENBQU07SUFFakM7UUFDRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUEsbUNBQWdCLEdBQUUsQ0FBQztRQUNyQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksaUJBQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFPLEVBQUUsRUFBRTtZQUNuRCxZQUFZLEVBQUUsU0FBUztZQUN2QixVQUFVLEVBQUUsSUFBQSxXQUFJLEVBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUM7WUFDL0Msa0JBQWtCLEVBQUUsSUFBQSxXQUFJLEVBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUM7WUFDdEQsY0FBYyxFQUFFLElBQUEsV0FBSSxFQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDO1lBQ2xELG9CQUFvQixFQUFFLElBQUEsV0FBSSxFQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDO1NBQzFELENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxrQ0FBZSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzdELHNGQUFzRjtRQUN0RixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQ2pELElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUU7Z0JBQy9DLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLFNBQVMsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUMxQyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7SUFDSCxDQUFDO0lBRUQsS0FBSyxDQUFDLEtBQUs7UUFDVCxNQUFNLElBQUEsYUFBRSxFQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFTO1FBQ2xCLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2QixDQUFDO0NBQ0Y7QUFuQ0QsZ0NBbUNDIn0=