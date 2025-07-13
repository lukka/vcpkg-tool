"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipleInstallsMatched = exports.TargetFileCollision = exports.RemoteFileUnavailable = exports.Failed = void 0;
const i18n_1 = require("../i18n");
class Failed extends Error {
    fatal = true;
}
exports.Failed = Failed;
class RemoteFileUnavailable extends Error {
    uri;
    constructor(uri) {
        super();
        this.uri = uri;
    }
}
exports.RemoteFileUnavailable = RemoteFileUnavailable;
class TargetFileCollision extends Error {
    uri;
    constructor(uri, message) {
        super(message);
        this.uri = uri;
    }
}
exports.TargetFileCollision = TargetFileCollision;
class MultipleInstallsMatched extends Error {
    queries;
    constructor(queries) {
        super((0, i18n_1.i) `Matched more than one install block [${queries.join(',')}]`);
        this.queries = queries;
    }
}
exports.MultipleInstallsMatched = MultipleInstallsMatched;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhjZXB0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJ1dGlsL2V4Y2VwdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF1QztBQUN2QyxrQ0FBa0M7OztBQUVsQyxrQ0FBNEI7QUFHNUIsTUFBYSxNQUFPLFNBQVEsS0FBSztJQUMvQixLQUFLLEdBQUcsSUFBSSxDQUFDO0NBQ2Q7QUFGRCx3QkFFQztBQUVELE1BQWEscUJBQXNCLFNBQVEsS0FBSztJQUMzQjtJQUFuQixZQUFtQixHQUFlO1FBQ2hDLEtBQUssRUFBRSxDQUFDO1FBRFMsUUFBRyxHQUFILEdBQUcsQ0FBWTtJQUVsQyxDQUFDO0NBQ0Y7QUFKRCxzREFJQztBQUVELE1BQWEsbUJBQW9CLFNBQVEsS0FBSztJQUN6QjtJQUFuQixZQUFtQixHQUFRLEVBQUUsT0FBZTtRQUMxQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFERSxRQUFHLEdBQUgsR0FBRyxDQUFLO0lBRTNCLENBQUM7Q0FDRjtBQUpELGtEQUlDO0FBRUQsTUFBYSx1QkFBd0IsU0FBUSxLQUFLO0lBQzdCO0lBQW5CLFlBQW1CLE9BQXNCO1FBQ3ZDLEtBQUssQ0FBQyxJQUFBLFFBQUMsRUFBQSx3Q0FBd0MsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFEcEQsWUFBTyxHQUFQLE9BQU8sQ0FBZTtJQUV6QyxDQUFDO0NBQ0Y7QUFKRCwwREFJQyJ9