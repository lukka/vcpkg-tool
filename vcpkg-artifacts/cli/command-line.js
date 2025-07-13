"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandLine = void 0;
const os_1 = require("os");
const path_1 = require("path");
const intersect_1 = require("../util/intersect");
class Ctx {
    constructor(cmdline) {
        this.os =
            cmdline.isSet('windows') ? 'win32' :
                cmdline.isSet('osx') ? 'darwin' :
                    cmdline.isSet('linux') ? 'linux' :
                        cmdline.isSet('freebsd') ? 'freebsd' :
                            process.platform;
        this.arch = cmdline.isSet('x64') ? 'x64' :
            cmdline.isSet('x86') ? 'x32' :
                cmdline.isSet('arm') ? 'arm' :
                    cmdline.isSet('arm64') ? 'arm64' :
                        process.arch;
    }
    os;
    arch;
    get windows() {
        return this.os === 'win32';
    }
    get linux() {
        return this.os === 'linux';
    }
    get freebsd() {
        return this.os === 'freebsd';
    }
    get osx() {
        return this.os === 'darwin';
    }
    get x64() {
        return this.arch === 'x64';
    }
    get x86() {
        return this.arch === 'x32';
    }
    get arm() {
        return this.arch === 'arm';
    }
    get arm64() {
        return this.arch === 'arm64';
    }
}
class CommandLine {
    commands = new Array();
    inputs = new Array();
    switches = {};
    context;
    #home;
    get homeFolder() {
        // home folder is determined by
        // command line ( --vcpkg-root )
        // environment (VCPKG_ROOT)
        // default 1 $HOME/.vcpkg
        // default 2 <tmpdir>/.vcpkg
        // note, this does not create the folder, that would happen when the session is initialized.
        return this.#home || (this.#home = (0, path_1.resolve)(this.switches['vcpkg-root']?.[0] ||
            process.env['VCPKG_ROOT'] ||
            (0, path_1.join)(process.env['HOME'] || process.env['USERPROFILE'] || (0, os_1.tmpdir)(), '.vcpkg')));
    }
    get vcpkgCommand() {
        return this.switches['z-vcpkg-command']?.[0];
    }
    get force() {
        return !!this.switches['force'];
    }
    get debug() {
        return !!this.switches['debug'];
    }
    get vcpkgArtifactsRoot() {
        return this.switches['z-vcpkg-artifacts-root']?.[0];
    }
    get vcpkgDownloads() {
        return this.switches['z-vcpkg-downloads']?.[0];
    }
    get vcpkgRegistriesCache() {
        return this.switches['z-vcpkg-registries-cache']?.[0];
    }
    get telemetryFile() {
        return this.switches['z-telemetry-file']?.[0];
    }
    get nextPreviousEnvironment() {
        return this.switches['z-next-previous-environment']?.[0];
    }
    get globalConfig() {
        return this.switches['z-global-config']?.[0];
    }
    get language() {
        const l = this.switches['language'] || [];
        return l[0];
    }
    get allLanguages() {
        const l = this.switches['all-languages'] || [];
        return !!l[0];
    }
    isSet(sw) {
        const s = this.switches[sw];
        if (s && s.last !== 'false') {
            return true;
        }
        return false;
    }
    claim(sw) {
        const v = this.switches[sw];
        delete this.switches[sw];
        return v;
    }
    addCommand(command) {
        this.commands.push(command);
    }
    /** parses the command line and returns the command that has been requested */
    get command() {
        return this.commands.find(cmd => cmd.command === this.inputs[0]);
    }
    constructor(args) {
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            // eslint-disable-next-line prefer-const
            let [, name, sep, value] = /^--([^=:]+)([=:])?(.+)?$/g.exec(arg) || [];
            if (name) {
                if (!value) {
                    if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
                        // if you say --foo bar then bar is the value
                        value = args[++i];
                    }
                }
                this.switches[name] = this.switches[name] === undefined ? [] : this.switches[name];
                this.switches[name].push(value);
                continue;
            }
            this.inputs.push(arg);
        }
        this.context = (0, intersect_1.intersect)(new Ctx(this), this.switches);
    }
}
exports.CommandLine = CommandLine;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZC1saW5lLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9taWNyb3NvZnQvdmNwa2ctdG9vbC9tYWluL3ZjcGtnLWFydGlmYWN0cy8iLCJzb3VyY2VzIjpbImNsaS9jb21tYW5kLWxpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF1QztBQUN2QyxrQ0FBa0M7OztBQUVsQywyQkFBNEI7QUFDNUIsK0JBQXFDO0FBQ3JDLGlEQUE4QztBQU85QyxNQUFNLEdBQUc7SUFDUCxZQUFZLE9BQW9CO1FBQzlCLElBQUksQ0FBQyxFQUFFO1lBQ0wsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ2xDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUMvQixPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQzt3QkFDaEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7NEJBQ3BDLE9BQU8sQ0FBQyxRQUFRLENBQUM7UUFDM0IsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4QyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDNUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzVCLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO3dCQUNoQyxPQUFPLENB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