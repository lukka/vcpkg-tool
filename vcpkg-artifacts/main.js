#!/usr/bin/env node
"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.session = void 0;
const child_process_1 = require("child_process");
const process_1 = require("process");
const command_line_1 = require("./cli/command-line");
const acquire_1 = require("./cli/commands/acquire");
const acquire_project_1 = require("./cli/commands/acquire-project");
const activate_1 = require("./cli/commands/activate");
const add_1 = require("./cli/commands/add");
const cache_1 = require("./cli/commands/cache");
const clean_1 = require("./cli/commands/clean");
const deactivate_1 = require("./cli/commands/deactivate");
const delete_1 = require("./cli/commands/delete");
const find_1 = require("./cli/commands/find");
const generate_msbuild_props_1 = require("./cli/commands/generate-msbuild-props");
const list_1 = require("./cli/commands/list");
const regenerate_index_1 = require("./cli/commands/regenerate-index");
const remove_1 = require("./cli/commands/remove");
const update_1 = require("./cli/commands/update");
const use_1 = require("./cli/commands/use");
const styling_1 = require("./cli/styling");
const i18n_1 = require("./i18n");
const session_1 = require("./session");
// parse the command line
const commandline = new command_line_1.CommandLine(process_1.argv.slice(2));
(0, i18n_1.setLocale)(commandline.language);
require('./exports');
async function main() {
    // ensure we can execute commands from this process.
    // this works around an odd bug in the way that node handles
    // executing child processes where the target is a windows store symlink
    (0, child_process_1.spawn)(process.argv0, ['--version']);
    // create our session for this process.
    exports.session = new session_1.Session(process.cwd(), commandline.context, commandline);
    (0, styling_1.initStyling)(commandline, exports.session);
    // start up the session and init the channel listeners.
    await exports.session.init();
    const find = new find_1.FindCommand(commandline);
    const list = new list_1.ListCommand(commandline);
    const add = new add_1.AddCommand(commandline);
    const acquire_project = new acquire_project_1.AcquireProjectCommand(commandline);
    const acquire = new acquire_1.AcquireCommand(commandline);
    const use = new use_1.UseCommand(commandline);
    const remove = new remove_1.RemoveCommand(commandline);
    const del = new delete_1.DeleteCommand(commandline);
    const activate = new activate_1.ActivateCommand(commandline);
    const activate_msbuildprops = new generate_msbuild_props_1.GenerateMSBuildPropsCommand(commandline);
    const deactivate = new deactivate_1.DeactivateCommand(commandline);
    const regenerate = new regenerate_index_1.RegenerateCommand(commandline);
    const update = new update_1.UpdateCommand(commandline);
    const cache = new cache_1.CacheCommand(commandline);
    const clean = new clean_1.CleanCommand(commandline);
    const command = commandline.command;
    if (!command) {
        // no command recognized.
        // did they specify inputs?
        if (commandline.inputs.length > 0) {
            // unrecognized command
            (0, styling_1.error)(`Unrecognized command '${commandline.inputs[0]}'`);
            return process.exitCode = 1;
        }
        return process.exitCode = 0;
    }
    let result = true;
    try {
        result = await command.run();
    }
    catch (e) {
        // in --debug mode we want to see the stack trace(s).
        if (commandline.debug && e instanceof Error) {
            (0, styling_1.log)(e.stack);
            if (e instanceof AggregateError) {
                e.errors.forEach(each => (0, styling_1.log)(each.stack));
            }
        }
        (0, styling_1.error)(e);
        await exports.session.writeTelemetry();
        return process.exit(1);
    }
    finally {
        await exports.session.writeTelemetry();
    }
    return process.exit(result ? 0 : 1);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJtYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBRWxDLGlEQUFzQztBQUN0QyxxQ0FBK0I7QUFDL0IscURBQWlEO0FBQ2pELG9EQUF3RDtBQUN4RCxvRUFBdUU7QUFDdkUsc0RBQTBEO0FBQzFELDRDQUFnRDtBQUNoRCxnREFBb0Q7QUFDcEQsZ0RBQW9EO0FBQ3BELDBEQUE4RDtBQUM5RCxrREFBc0Q7QUFDdEQsOENBQWtEO0FBQ2xELGtGQUFvRjtBQUNwRiw4Q0FBa0Q7QUFDbEQsc0VBQW9FO0FBQ3BFLGtEQUFzRDtBQUN0RCxrREFBc0Q7QUFDdEQsNENBQWdEO0FBQ2hELDJDQUF3RDtBQUN4RCxpQ0FBbUM7QUFDbkMsdUNBQW9DO0FBRXBDLHlCQUF5QjtBQUN6QixNQUFNLFdBQVcsR0FBRyxJQUFJLDBCQUFXLENBQUMsY0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBR25ELElBQUEsZ0JBQVMsRUFBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7QUFHaEMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBRXJCLEtBQUssVUFBVSxJQUFJO0lBRWpCLG9EQUFvRDtJQUNwRCw0REFBNEQ7SUFDNUQsd0VBQXdFO0lBQ3hFLElBQUEscUJBQUssRUFBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUVwQyx1Q0FBdUM7SUFDdkMsZUFBTyxHQUFHLElBQUksaUJBQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsV0FBVyxDQUFDLE9BQU8sRUFBTyxXQUFXLENBQUMsQ0FBQztJQUU1RSxJQUFBLHFCQUFXLEVBQUMsV0FBVyxFQUFF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