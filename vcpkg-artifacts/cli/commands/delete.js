"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCommand = void 0;
const i18n_1 = require("../../i18n");
const main_1 = require("../../main");
const command_1 = require("../command");
const version_1 = require("../switches/version");
class DeleteCommand extends command_1.Command {
    command = 'delete';
    version = new version_1.Version(this);
    async run() {
        const artifacts = await main_1.session.getInstalledArtifacts();
        for (const input of this.inputs) {
            for (const { artifact, id, folder } of artifacts) {
                if (input === id) {
                    if (await folder.exists()) {
                        main_1.session.channels.message((0, i18n_1.i) `Deleting artifact ${id} from ${folder.fsPath}`);
                        await artifact.uninstall();
                    }
                }
            }
        }
        return true;
    }
}
exports.DeleteCommand = DeleteCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsZXRlLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9taWNyb3NvZnQvdmNwa2ctdG9vbC9tYWluL3ZjcGtnLWFydGlmYWN0cy8iLCJzb3VyY2VzIjpbImNsaS9jb21tYW5kcy9kZWxldGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF1QztBQUN2QyxrQ0FBa0M7OztBQUVsQyxxQ0FBK0I7QUFDL0IscUNBQXFDO0FBQ3JDLHdDQUFxQztBQUNyQyxpREFBOEM7QUFFOUMsTUFBYSxhQUFjLFNBQVEsaUJBQU87SUFDL0IsT0FBTyxHQUFHLFFBQVEsQ0FBQztJQUM1QixPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25CLEtBQUssQ0FBQyxHQUFHO1FBQ2hCLE1BQU0sU0FBUyxHQUFHLE1BQU0sY0FBTyxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDeEQsS0FBSyxNQUFNLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDaEMsS0FBSyxNQUFNLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxTQUFTLEVBQUUsQ0FBQztnQkFDakQsSUFBSSxLQUFLLEtBQUssRUFBRSxFQUFFLENBQUM7b0JBQ2pCLElBQUksTUFBTSxNQUFNLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQzt3QkFDMUIsY0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBQSxRQUFDLEVBQUEscUJBQXFCLEVBQUUsU0FBUyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQzt3QkFDM0UsTUFBTSxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBQzdCLENBQUM7Z0JBQ0gsQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0NBQ0Y7QUFqQkQsc0NBaUJDIn0=