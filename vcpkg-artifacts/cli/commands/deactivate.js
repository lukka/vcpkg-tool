"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeactivateCommand = void 0;
const activation_1 = require("../../artifacts/activation");
const main_1 = require("../../main");
const command_1 = require("../command");
class DeactivateCommand extends command_1.Command {
    command = 'deactivate';
    run() {
        return (0, activation_1.deactivate)(main_1.session, true);
    }
}
exports.DeactivateCommand = DeactivateCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVhY3RpdmF0ZS5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJjbGkvY29tbWFuZHMvZGVhY3RpdmF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBRWxDLDJEQUF3RDtBQUV4RCxxQ0FBcUM7QUFDckMsd0NBQXFDO0FBRXJDLE1BQWEsaUJBQWtCLFNBQVEsaUJBQU87SUFDbkMsT0FBTyxHQUFHLFlBQVksQ0FBQztJQUV2QixHQUFHO1FBQ1YsT0FBTyxJQUFBLHVCQUFVLEVBQUMsY0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ25DLENBQUM7Q0FDRjtBQU5ELDhDQU1DIn0=