"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleanCommand = exports.Artifacts = exports.Downloads = exports.All = void 0;
const activation_1 = require("../../artifacts/activation");
const i18n_1 = require("../../i18n");
const main_1 = require("../../main");
const command_1 = require("../command");
const styling_1 = require("../styling");
const switch_1 = require("../switch");
class All extends switch_1.Switch {
    switch = 'all';
}
exports.All = All;
class Downloads extends switch_1.Switch {
    switch = 'downloads';
}
exports.Downloads = Downloads;
class Artifacts extends switch_1.Switch {
    switch = 'artifacts';
}
exports.Artifacts = Artifacts;
class CleanCommand extends command_1.Command {
    command = 'clean';
    all = new All(this);
    artifacts = new Artifacts(this);
    downloads = new Downloads(this);
    async run() {
        if (this.all.active || this.artifacts.active) {
            await (0, activation_1.deactivate)(main_1.session, false);
            await main_1.session.installFolder.delete({ recursive: true });
            await main_1.session.installFolder.createDirectory();
            (0, styling_1.log)((0, i18n_1.i) `Installed Artifact folder cleared (${main_1.session.installFolder.fsPath}) `);
        }
        if (this.all.active || this.downloads.active) {
            await main_1.session.downloads.delete({ recursive: true });
            await main_1.session.downloads.createDirectory();
            (0, styling_1.log)((0, i18n_1.i) `Cache folder cleared (${main_1.session.downloads.fsPath}) `);
        }
        return true;
    }
}
exports.CleanCommand = CleanCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xlYW4uanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21pY3Jvc29mdC92Y3BrZy10b29sL21haW4vdmNwa2ctYXJ0aWZhY3RzLyIsInNvdXJjZXMiOlsiY2xpL2NvbW1hbmRzL2NsZWFuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1Q0FBdUM7QUFDdkMsa0NBQWtDOzs7QUFFbEMsMkRBQXdEO0FBQ3hELHFDQUErQjtBQUMvQixxQ0FBcUM7QUFDckMsd0NBQXFDO0FBQ3JDLHdDQUFpQztBQUNqQyxzQ0FBbUM7QUFFbkMsTUFBYSxHQUFJLFNBQVEsZUFBTTtJQUM3QixNQUFNLEdBQUcsS0FBSyxDQUFDO0NBQ2hCO0FBRkQsa0JBRUM7QUFFRCxNQUFhLFNBQVUsU0FBUSxlQUFNO0lBQ25DLE1BQU0sR0FBRyxXQUFXLENBQUM7Q0FDdEI7QUFGRCw4QkFFQztBQUVELE1BQWEsU0FBVSxTQUFRLGVBQU07SUFDbkMsTUFBTSxHQUFHLFdBQVcsQ0FBQztDQUN0QjtBQUZELDhCQUVDO0FBRUQsTUFBYSxZQUFhLFNBQVEsaUJBQU87SUFDOUIsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUMzQixHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEIsU0FBUyxHQUFHLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2hDLFNBQVMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUV2QixLQUFLLENBQUMsR0FBRztRQUVoQixJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDN0MsTUFBTSxJQUFBLHVCQUFVLEVBQUMsY0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sY0FBTyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUN4RCxNQUFNLGNBQU8sQ0FBQyxhQUFhLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDOUMsSUFBQSxhQUFHLEVBQUMsSUFBQSxRQUFDLEVBQUEsc0NBQXNDLGNBQU8sQ0FBQyxhQUFhLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQztRQUMvRSxDQUFDO1FBRUQsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQzdDLE1BQU0sY0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUNwRCxNQUFNLGNBQU8sQ0FBQyxTQUFTLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDMUMsSUFBQSxhQUFHLEVBQUMsSUFBQSxRQUFDLEVBQUEseUJBQXlCLGNBQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQztRQUM5RCxDQUFDO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0NBQ0Y7QUF2QkQsb0NBdUJDIn0=