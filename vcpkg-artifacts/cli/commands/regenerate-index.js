"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegenerateCommand = void 0;
const path_1 = require("path");
const i18n_1 = require("../../i18n");
const main_1 = require("../../main");
const LocalRegistry_1 = require("../../registries/LocalRegistry");
const command_1 = require("../command");
const styling_1 = require("../styling");
const normalize_1 = require("../switches/normalize");
class RegenerateCommand extends command_1.Command {
    command = 'regenerate';
    normalize = new normalize_1.Normalize(this);
    async run() {
        for (const input of this.inputs) {
            const inputUri = main_1.session.fileSystem.file((0, path_1.resolve)(input));
            const localReg = new LocalRegistry_1.LocalRegistry(main_1.session, inputUri);
            try {
                await localReg.load();
                (0, styling_1.log)((0, i18n_1.i) `Regenerating index for ${input}`);
                await localReg.regenerate(this.normalize.active);
                const count = localReg.count;
                if (count) {
                    await localReg.save();
                    (0, styling_1.log)((0, i18n_1.i) `Regeneration complete. Index contains ${count} metadata files`);
                }
                else {
                    // looks like  the registry contained no items
                    (0, styling_1.error)((0, i18n_1.i) `Registry: '${input}' contains no artifacts.`);
                }
            }
            catch (e) {
                let message = 'unknown';
                if (e instanceof Error) {
                    message = e.message;
                }
                (0, styling_1.log)((0, i18n_1.i) `error ${input}: ` + message);
                return false;
            }
        }
        return true;
    }
}
exports.RegenerateCommand = RegenerateCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnZW5lcmF0ZS1pbmRleC5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJjbGkvY29tbWFuZHMvcmVnZW5lcmF0ZS1pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBRWxDLCtCQUErQjtBQUUvQixxQ0FBK0I7QUFDL0IscUNBQXFDO0FBQ3JDLGtFQUErRDtBQUMvRCx3Q0FBcUM7QUFFckMsd0NBQXdDO0FBQ3hDLHFEQUFrRDtBQUVsRCxNQUFhLGlCQUFrQixTQUFRLGlCQUFPO0lBQ25DLE9BQU8sR0FBRyxZQUFZLENBQUM7SUFDdkIsU0FBUyxHQUFHLElBQUkscUJBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVoQyxLQUFLLENBQUMsR0FBRztRQUNoQixLQUFLLE1BQU0sS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNoQyxNQUFNLFFBQVEsR0FBRyxjQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFBLGNBQU8sRUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3pELE1BQU0sUUFBUSxHQUFHLElBQUksNkJBQWEsQ0FBQyxjQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDdEQsSUFBSSxDQUFDO2dCQUNILE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUN0QixJQUFBLGFBQUcsRUFBQyxJQUFBLFFBQUMsRUFBQSwwQkFBMEIsS0FBSyxFQUFFLENBQUMsQ0FBQztnQkFDeEMsTUFBTSxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ2pELE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7Z0JBQzdCLElBQUksS0FBSyxFQUFFLENBQUM7b0JBQ1YsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ3RCLElBQUEsYUFBRyxFQUFDLElBQUEsUUFBQyxFQUFBLHlDQUF5QyxLQUFLLGlCQUFpQixDQUFDLENBQUM7Z0JBQ3hFLENBQUM7cUJBQU0sQ0FBQztvQkFDTiw4Q0FBOEM7b0JBQzlDLElBQUEsZUFBSyxFQUFDLElBQUEsUUFBQyxFQUFBLGNBQWMsS0FBSywwQkFBMEIsQ0FBQyxDQUFDO2dCQUN4RCxDQUFDO1lBQ0gsQ0FBQztZQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7Z0JBQ1gsSUFBSSxPQUFPLEdBQUcsU0FBUyxDQUFDO2dCQUN4QixJQUFJLENBQUMsWUFBWSxLQUFLLEVBQUUsQ0FBQztvQkFDdkIsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3RCLENBQUM7Z0JBRUQsSUFBQSxhQUFHLEVBQUMsSUFBQSxRQUFDLEVBQUEsU0FBUyxLQUFLLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQztnQkFDbkMsT0FBTyxLQUFLLENBQUM7WUFDZixDQUFDO1FBQ0gsQ0FBQztRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztDQUNGO0FBakNELDhDQWlDQyJ9