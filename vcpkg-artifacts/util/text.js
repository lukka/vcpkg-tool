"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = decode;
exports.encode = encode;
exports.equalsIgnoreCase = equalsIgnoreCase;
const util_1 = require("util");
const decoder = new util_1.TextDecoder('utf-8');
function decode(input) {
    return decoder.decode(input);
}
function encode(content) {
    return Buffer.from(content, 'utf-8');
}
function equalsIgnoreCase(s1, s2) {
    return s1 === s2 || !!s1 && !!s2 && s1.localeCompare(s2, undefined, { sensitivity: 'base' }) === 0;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJ1dGlsL3RleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF1QztBQUN2QyxrQ0FBa0M7O0FBTWxDLHdCQUVDO0FBQ0Qsd0JBRUM7QUFFRCw0Q0FFQztBQWJELCtCQUFtQztBQUVuQyxNQUFNLE9BQU8sR0FBRyxJQUFJLGtCQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7QUFFekMsU0FBZ0IsTUFBTSxDQUFDLEtBQStEO0lBQ3BGLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMvQixDQUFDO0FBQ0QsU0FBZ0IsTUFBTSxDQUFDLE9BQWU7SUFDcEMsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN2QyxDQUFDO0FBRUQsU0FBZ0IsZ0JBQWdCLENBQUMsRUFBc0IsRUFBRSxFQUFzQjtJQUM3RSxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxhQUFhLENBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNyRyxDQUFDIn0=