"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Git = void 0;
const exec_cmd_1 = require("../util/exec-cmd");
const uri_1 = require("../util/uri");
/** @internal */
class Git {
    #toolPath;
    #targetFolder;
    constructor(toolPath, targetFolder) {
        this.#toolPath = toolPath;
        this.#targetFolder = targetFolder;
    }
    /**
     * Method that clones a git repo into a desired location and with various options.
     * @param repo The Uri of the remote repository that is desired to be cloned.
     * @param events The events that may need to be updated in order to track progress.
     * @param options The options that will modify how the clone will be called.
     * @returns Boolean representing whether the execution was completed without error, this is not necessarily
     *  a guarantee that the clone did what we expected.
     */
    async clone(repo, events, options = {}) {
        const remote = await (0, uri_1.isFilePath)(repo) ? repo.fsPath : repo.toString();
        const result = await (0, exec_cmd_1.execute)(this.#toolPath, [
            'clone',
            remote,
            this.#targetFolder.fsPath,
            options.recursive ? '--recursive' : '',
            options.depth ? `--depth=${options.depth}` : '',
            '--progress'
        ], {
            onStdErrData: chunkToHeartbeat(events),
            onStdOutData: chunkToHeartbeat(events)
        });
        return result.code === 0 ? true : false;
    }
    /**
     * Fetches a 'tag', this could theoretically be a commit, a tag, or a branch.
     * @param remoteName Remote name to fetch from. Typically will be 'origin'.
     * @param events Events that may be called in order to present progress.
     * @param options Options to modify how fetch is called.
     * @returns Boolean representing whether the execution was completed without error, this is not necessarily
     *  a guarantee that the fetch did what we expected.
     */
    async fetch(remoteName, events, options = {}) {
        const result = await (0, exec_cmd_1.execute)(this.#toolPath, [
            '-C',
            this.#targetFolder.fsPath,
            'fetch',
            remoteName,
            options.commit ? options.commit : '',
            options.depth ? `--depth=${options.depth}` : ''
        ], {
            cwd: this.#targetFolder.fsPath
        });
        return result.code === 0 ? true : false;
    }
    /**
     * Checks out a specific commit. If no commit is given, the default behavior of a checkout will be
     * used. (Checking out the current branch)
     * @param events Events to possibly track progress.
     * @param options Passing along a commit or branch to checkout, optionally.
     * @returns Boolean representing whether the execution was completed without error, this is not necessarily
     *  a guarantee that the checkout did what we expected.
     */
    async checkout(events, options = {}) {
        const result = await (0, exec_cmd_1.execute)(this.#toolPath, [
            '-C',
            this.#targetFolder.fsPath,
            'checkout',
            options.commit ? options.commit : ''
        ], {
            cwd: this.#targetFolder.fsPath,
            onStdErrData: chunkToHeartbeat(events),
            onStdOutData: chunkToHeartbeat(events)
        });
        return result.code === 0 ? true : false;
    }
    /**
     * Performs a reset on the git repo.
     * @param events Events to possibly track progress.
     * @param options Options to control how the reset is called.
     * @returns Boolean representing whether the execution was completed without error, this is not necessarily
     *  a guarantee that the reset did what we expected.
     */
    async reset(events, options = {}) {
        const result = await (0, exec_cmd_1.execute)(this.#toolPath, [
            '-C',
            this.#targetFolder.fsPath,
            'reset',
            options.commit ? options.commit : '',
            options.recurse ? '--recurse-submodules' : '',
            options.hard ? '--hard' : ''
        ], {
            cwd: this.#targetFolder.fsPath,
            onStdErrData: chunkToHeartbeat(events),
            onStdOutData: chunkToHeartbeat(events)
        });
        return result.code === 0 ? true : false;
    }
    /**
     * Initializes a folder on disk to be a git repository
     * @returns true if the initialization was successful, false otherwise.
     */
    async init() {
        if (!await this.#targetFolder.exists()) {
            await this.#targetFolder.createDirectory();
        }
        if (!await this.#targetFolder.isDirectory()) {
            throw new Error(`${this.#targetFolder.fsPath} is not a directory.`);
        }
        const result = await (0, exec_cmd_1.execute)(this.#toolPath, ['init'], {
            cwd: this.#targetFolder.fsPath
        });
        return result.code === 0 ? true : false;
    }
    /**
     * Adds a remote location to the git repo.
     * @param name the name of the remote to add.
     * @param location the location of the remote to add.
     * @returns true if the addition was successful, false otherwise.
     */
    async addRemote(name, location) {
        const result = await (0, exec_cmd_1.execute)(this.#toolPath, [
            '-C',
            this.#targetFolder.fsPath,
            'remote',
            'add',
            name,
            location.toString()
        ], {
            cwd: this.#targetFolder.fsPath
        });
        return result.code === 0;
    }
    /**
     * updates submodules in a git repository
     * @param events Events to possibly track progress.
     * @param options Options to control how the submodule update is called.
     * @returns true if the update was successful, false otherwise.
     */
    async updateSubmodules(events, options = {}) {
        const result = await (0, exec_cmd_1.execute)(this.#toolPath, [
            '-C',
            this.#targetFolder.fsPath,
            'submodule',
            'update',
            '--progress',
            options.init ? '--init' : '',
            options.depth ? `--depth=${options.depth}` : '',
            options.recursive ? '--recursive' : '',
        ], {
            cwd: this.#targetFolder.fsPath,
            onStdErrData: chunkToHeartbeat(events),
            onStdOutData: chunkToHeartbeat(events)
        });
        return result.code === 0;
    }
    /**
     * sets a git configuration value in the repo.
     * @param configFile the relative path to the config file inside the repo on disk
     * @param key the key to set in the config file
     * @param value the value to set in the config file
     * @returns true if the config file was updated, false otherwise
     */
    async config(configFile, key, value) {
        const result = await (0, exec_cmd_1.execute)(this.#toolPath, [
            'config',
            '-f',
            this.#targetFolder.join(configFile).fsPath,
            key,
            value
        ], {
            cwd: this.#targetFolder.fsPath
        });
        return result.code === 0;
    }
}
exports.Git = Git;
function chunkToHeartbeat(events) {
    return (chunk) => {
        const regex = /\s([0-9]*?)%/;
        chunk.toString().split(/^/gim).map((x) => x.trim()).filter((each) => each).forEach((line) => {
            const match_array = line.match(regex);
            if (match_array !== null) {
                events.unpackArchiveHeartbeat?.(line.trim());
            }
        });
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0LmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9taWNyb3NvZnQvdmNwa2ctdG9vbC9tYWluL3ZjcGtnLWFydGlmYWN0cy8iLCJzb3VyY2VzIjpbImFyY2hpdmVycy9naXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF1QztBQUN2QyxrQ0FBa0M7OztBQUdsQywrQ0FBMkM7QUFDM0MscUNBQThDO0FBTTlDLGdCQUFnQjtBQUNoQixNQUFhLEdBQUc7SUFDZCxTQUFTLENBQVM7SUFDbEIsYUFBYSxDQUFNO0lBRW5CLFlBQVksUUFBZ0IsRUFBRSxZQUFpQjtRQUM3QyxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLENBQUMsYUFBYSxHQUFHLFlBQVksQ0FBQztJQUNwQyxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBUyxFQUFFLE1BQTZCLEVBQUUsVUFBbUQsRUFBRTtRQUN6RyxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUEsZ0JBQVUsRUFBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRXRFLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBQSxrQkFBTyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDM0MsT0FBTztZQUNQLE1BQU07WUFDTixJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU07WUFDekIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3RDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFdBQVcsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQy9DLFlBQVk7U0FDYixFQUFFO1lBQ0QsWUFBWSxFQUFFLGdCQUFnQixDQUFDLE1B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