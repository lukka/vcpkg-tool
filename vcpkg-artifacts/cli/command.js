"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const debug_1 = require("./switches/debug");
const force_1 = require("./switches/force");
/** @internal */
class Command {
    commandLine;
    switches = new Array();
    arguments = new Array();
    force = new force_1.Force(this);
    debug = new debug_1.Debug(this);
    constructor(commandLine) {
        this.commandLine = commandLine;
        commandLine.addCommand(this);
    }
    get inputs() {
        return this.commandLine.inputs.slice(1);
    }
    async run() {
        // do something
        return true;
    }
}
exports.Command = Command;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJjbGkvY29tbWFuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBS2xDLDRDQUF5QztBQUN6Qyw0Q0FBeUM7QUFFekMsZ0JBQWdCO0FBRWhCLE1BQXNCLE9BQU87SUFTUjtJQU5WLFFBQVEsR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFDO0lBQy9CLFNBQVMsR0FBRyxJQUFJLEtBQUssRUFBWSxDQUFDO0lBRWxDLEtBQUssR0FBRyxJQUFJLGFBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QixLQUFLLEdBQUcsSUFBSSxhQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFakMsWUFBbUIsV0FBd0I7UUFBeEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDekMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQsSUFBSSxNQUFNO1FBQ1IsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELEtBQUssQ0FBQyxHQUFHO1FBQ1AsZUFBZTtRQUNmLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztDQUNGO0FBckJELDBCQXFCQyJ9