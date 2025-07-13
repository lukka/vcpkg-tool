"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.artifactFileName = artifactFileName;
exports.applyAcquireOptions = applyAcquireOptions;
function artifactFileName(name, version, install, extension) {
    let result = name;
    if (install.nametag) {
        result += '-';
        result += install.nametag;
    }
    if (install.lang) {
        result += '-';
        result += install.lang;
    }
    // add the version number into the filename too.
    result += '-' + version;
    // if there is a sha256 or sha512 hash in the install, add it to the filename
    const hash = (install.sha256 || install.sha512 || '');
    if (hash) {
        result += `-(${hash})`;
    }
    result += extension;
    return result.replace(/[^\w()-]+/g, '.');
}
function applyAcquireOptions(options, install) {
    const sha256 = install.sha256;
    if (sha256 !== null && sha256 !== undefined) {
        return { ...options, algorithm: 'sha256', value: sha256.toString() };
    }
    const sha512 = install.sha512;
    if (sha512 !== null && sha512 !== undefined) {
        return { ...options, algorithm: 'sha512', value: sha512.toString() };
    }
    return options;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJpbnN0YWxsZXJzL3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF1QztBQUN2QyxrQ0FBa0M7O0FBTWxDLDRDQXNCQztBQUVELGtEQVlDO0FBcENELFNBQWdCLGdCQUFnQixDQUFDLElBQVksRUFBRSxPQUFlLEVBQUUsT0FBK0IsRUFBRSxTQUFpQjtJQUNoSCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFDbEIsSUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDcEIsTUFBTSxJQUFJLEdBQUcsQ0FBQztRQUNkLE1BQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDO0lBQzVCLENBQUM7SUFFRCxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNqQixNQUFNLElBQUksR0FBRyxDQUFDO1FBQ2QsTUFBTSxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDekIsQ0FBQztJQUNELGdEQUFnRDtJQUNoRCxNQUFNLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQztJQUV4Qiw2RUFBNkU7SUFDN0UsTUFBTSxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLENBQUM7SUFDdEQsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNULE1BQU0sSUFBSSxLQUFLLElBQUksR0FBRyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxNQUFNLElBQUksU0FBUyxDQUFDO0lBQ3BCLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDM0MsQ0FBQztBQUVELFNBQWdCLG1CQUFtQixDQUFDLE9BQXVCLEVBQUUsT0FBbUI7SUFDOUUsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUM5QixJQUFJLE1BQU0sS0FBSyxJQUFJLElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRSxDQUFDO1FBQzVDLE9BQU8sRUFBRSxHQUFHLE9BQU8sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQztJQUN2RSxDQUFDO0lBRUQsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUM5QixJQUFJLE1BQU0sS0FBSyxJQUFJLElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRSxDQUFDO1FBQzVDLE9BQU8sRUFBRSxHQUFHLE9BQU8sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQztJQUN2RSxDQUFDO0lBRUQsT0FBTyxPQUFPLENBQUM7QUFDakIsQ0FBQyJ9