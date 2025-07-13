"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveCommand = void 0;
const i18n_1 = require("../../i18n");
const main_1 = require("../../main");
const command_1 = require("../command");
const styling_1 = require("../styling");
const project_1 = require("../switches/project");
class RemoveCommand extends command_1.Command {
    command = 'remove';
    project = new project_1.Project(this);
    async run() {
        const projectManifest = await this.project.manifest;
        if (!projectManifest) {
            (0, styling_1.error)((0, i18n_1.i) `Unable to find project in folder (or parent folders) for ${main_1.session.currentDirectory.fsPath}`);
            return false;
        }
        if (this.inputs.length === 0) {
            (0, styling_1.error)((0, i18n_1.i) `No artifacts specified`);
            return false;
        }
        const req = projectManifest.metadata.requires.keys;
        for (const input of this.inputs) {
            if (req.indexOf(input) !== -1) {
                projectManifest.metadata.requires.delete(input);
                (0, styling_1.log)((0, i18n_1.i) `Removing ${input} from project manifest`);
            }
            else {
                (0, styling_1.error)((0, i18n_1.i) `unable to find artifact ${input} in the project manifest`);
                return false;
            }
        }
        // write the file out.
        await projectManifest.metadata.save();
        return true;
    }
}
exports.RemoveCommand = RemoveCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVtb3ZlLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9taWNyb3NvZnQvdmNwa2ctdG9vbC9tYWluL3ZjcGtnLWFydGlmYWN0cy8iLCJzb3VyY2VzIjpbImNsaS9jb21tYW5kcy9yZW1vdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF1QztBQUN2QyxrQ0FBa0M7OztBQUVsQyxxQ0FBK0I7QUFDL0IscUNBQXFDO0FBQ3JDLHdDQUFxQztBQUNyQyx3Q0FBd0M7QUFDeEMsaURBQThDO0FBRTlDLE1BQWEsYUFBYyxTQUFRLGlCQUFPO0lBQy9CLE9BQU8sR0FBRyxRQUFRLENBQUM7SUFDNUIsT0FBTyxHQUFZLElBQUksaUJBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUU1QixLQUFLLENBQUMsR0FBRztRQUNoQixNQUFNLGVBQWUsR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO1FBRXBELElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUNyQixJQUFBLGVBQUssRUFBQyxJQUFBLFFBQUMsRUFBQSw0REFBNEQsY0FBTyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDdEcsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO1FBRUQsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUM3QixJQUFBLGVBQUssRUFBQyxJQUFBLFFBQUMsRUFBQSx3QkFBd0IsQ0FBQyxDQUFDO1lBQ2pDLE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUdELE1BQU0sR0FBRyxHQUFHLGVBQWUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztRQUNuRCxLQUFLLE1BQU0sS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNoQyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQztnQkFDOUIsZUFBZSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNoRCxJQUFBLGFBQUcsRUFBQyxJQUFBLFFBQUMsRUFBQSxZQUFZLEtBQUssd0JBQXdCLENBQUMsQ0FBQztZQUNsRCxDQUFDO2lCQUFNLENBQUM7Z0JBQ04sSUFBQSxlQUFLLEVBQUMsSUFBQSxRQUFDLEVBQUEsMkJBQTJCLEtBQUssMEJBQTBCLENBQUMsQ0FBQztnQkFDbkUsT0FBTyxLQUFLLENBQUM7WUFDZixDQUFDO1FBQ0gsQ0FBQztRQUVELHNCQUFzQjtRQUN0QixNQUFNLGVBQWUsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdEMsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0NBQ0Y7QUFqQ0Qsc0NBaUNDIn0=