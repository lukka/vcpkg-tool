"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.vcpkgFetch = vcpkgFetch;
exports.vcpkgExtract = vcpkgExtract;
exports.vcpkgDownload = vcpkgDownload;
const child_process_1 = require("child_process");
const i18n_1 = require("./i18n");
function streamVcpkg(vcpkgCommand, args, listener) {
    return new Promise((accept, reject) => {
        if (!vcpkgCommand) {
            reject((0, i18n_1.i) `VCPKG_COMMAND was not set`);
            return;
        }
        const subproc = (0, child_process_1.spawn)(vcpkgCommand, args, { stdio: ['ignore', 'pipe', 'pipe'] });
        subproc.stdout.on('data', listener);
        subproc.stderr.pipe(process.stdout);
        subproc.on('error', (err) => { reject(err); });
        subproc.on('close', (code, signal) => {
            if (code === 0) {
                accept();
                return;
            }
            reject((0, i18n_1.i) `Running vcpkg internally returned a nonzero exit code: ${code}`);
        });
    });
}
async function runVcpkg(vcpkgCommand, args) {
    let result = '';
    await streamVcpkg(vcpkgCommand, args, (chunk) => { result += chunk; });
    return result.trimEnd();
}
function vcpkgFetch(session, fetchKey) {
    return runVcpkg(session.vcpkgCommand, ['fetch', fetchKey, '--x-stderr-status']).then((output) => {
        return output;
    }, (error) => {
        if (fetchKey === 'git') {
            session.channels.warning('failed to fetch git, falling back to attempting to use git from the PATH');
            return Promise.resolve('git');
        }
        return Promise.reject(error);
    });
}
async function vcpkgExtract(session, archive, target, strip) {
    const args = ['z-extract', archive, target];
    if (strip) {
        args.push(`--strip=${strip}`);
    }
    return runVcpkg(session.vcpkgCommand, args);
}
async function vcpkgDownload(session, destination, sha512, uris, events) {
    const args = ['x-download', destination, '--z-machine-readable-progress'];
    if (sha512) {
        args.push(`--sha512=${sha512}`);
    }
    else {
        args.push('--skip-sha512');
    }
    for (const uri of uris) {
        events.downloadProgress?.(uri, destination, 0);
        const uriArgs = [...args, `--url=${uri.toString()}`];
        try {
            await streamVcpkg(session.vcpkgCommand, uriArgs, (chunk) => {
                const match = /(\d+)(\.\d+)?%\s*$/.exec(chunk);
                if (!match) {
                    return;
                }
                const number = parseFloat(match[1]);
                // throwing out 100s avoids displaying temporarily full progress bars resulting from redirects getting resolved
                if (number && number < 100) {
                    events.downloadProgress?.(uri, destination, number);
                }
            });
            return;
        }
        catch {
            session.channels.warning((0, i18n_1.i) `failed to download from ${uri.toString()}`);
        }
    }
    throw new Error((0, i18n_1.i) `failed to download ${destination} from any source`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmNwa2cuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21pY3Jvc29mdC92Y3BrZy10b29sL21haW4vdmNwa2ctYXJ0aWZhY3RzLyIsInNvdXJjZXMiOlsidmNwa2cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF1QztBQUN2QyxrQ0FBa0M7O0FBbUNsQyxnQ0FXQztBQUVELG9DQU0rQztBQUUvQyxzQ0E2QkM7QUFuRkQsaURBQXNDO0FBQ3RDLGlDQUEyQjtBQUszQixTQUFTLFdBQVcsQ0FBQyxZQUFnQyxFQUFFLElBQW1CLEVBQUUsUUFBOEI7SUFDeEcsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUNwQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDbEIsTUFBTSxDQUFDLElBQUEsUUFBQyxFQUFBLDJCQUEyQixDQUFDLENBQUM7WUFDckMsT0FBTztRQUNULENBQUM7UUFFRCxNQUFNLE9BQU8sR0FBRyxJQUFBLHFCQUFLLEVBQUMsWUFBWSxFQUFFLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2pGLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNwQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDcEMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9DLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBWSxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQzNDLElBQUksSUFBSSxLQUFL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