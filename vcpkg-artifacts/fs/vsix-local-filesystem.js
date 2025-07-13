"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.VsixLocalFilesystem = void 0;
const uri_1 = require("../util/uri");
const local_filesystem_1 = require("./local-filesystem");
class VsixLocalFilesystem extends local_filesystem_1.LocalFileSystem {
    vsixBaseUri;
    constructor(session) {
        super(session);
        const programData = process.env['ProgramData'];
        if (programData) {
            this.vsixBaseUri = this.file(programData).join('Microsoft/VisualStudio/Packages');
        }
    }
    /**
     * Creates a new URI from a string, e.g. `https://www.msft.com/some/path`,
     * `file:///usr/home`, or `scheme:with/path`.
     *
     * @param value A string which represents an URI (see `URI#toString`).
     */
    parseUri(value, _strict) {
        return uri_1.Uri.parseFilterVsix(this, value, _strict, this.vsixBaseUri);
    }
}
exports.VsixLocalFilesystem = VsixLocalFilesystem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnNpeC1sb2NhbC1maWxlc3lzdGVtLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9taWNyb3NvZnQvdmNwa2ctdG9vbC9tYWluL3ZjcGtnLWFydGlmYWN0cy8iLCJzb3VyY2VzIjpbImZzL3ZzaXgtbG9jYWwtZmlsZXN5c3RlbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBR2xDLHFDQUFrQztBQUNsQyx5REFBcUQ7QUFFckQsTUFBYSxtQkFBb0IsU0FBUSxrQ0FBZTtJQUNyQyxXQUFXLENBQWtCO0lBRTlDLFlBQVksT0FBZ0I7UUFDMUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2YsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMvQyxJQUFJLFdBQVcsRUFBRSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsaUNBQWlDLENBQUMsQ0FBQztRQUNwRixDQUFDO0lBQ0gsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ00sUUFBUSxDQUFDLEtBQWEsRUFBRSxPQUFpQjtRQUNoRCxPQUFPLFNBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7Q0FDRjtBQXBCRCxrREFvQkMifQ==