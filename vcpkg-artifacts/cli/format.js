"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectFile = projectFile;
exports.prettyRegistryName = prettyRegistryName;
exports.artifactIdentity = artifactIdentity;
exports.addVersionToArtifactIdentity = addVersionToArtifactIdentity;
exports.heading = heading;
exports.optional = optional;
exports.cmdSwitch = cmdSwitch;
exports.command = command;
exports.hint = hint;
exports.count = count;
exports.position = position;
const chalk_1 = require("chalk");
function projectFile(uri) {
    return (0, chalk_1.cyan)(uri.fsPath);
}
function prettyRegistryName(registryName) {
    return `${(0, chalk_1.whiteBright)(registryName)}`;
}
function artifactIdentity(registryName, identity, shortName) {
    return `${(0, chalk_1.whiteBright)(registryName)}:${chalk_1.yellow.dim(identity.substr(0, identity.length - shortName.length))}${(0, chalk_1.yellowBright)(shortName)}`;
}
function addVersionToArtifactIdentity(identity, version) {
    return version && version !== '*' ? `${identity}-${(0, chalk_1.gray)(version)}` : identity;
}
function heading(text, level = 1) {
    switch (level) {
        case 1:
            return `${chalk_1.underline.bold(text)}`;
        case 2:
            return `${(0, chalk_1.greenBright)(text)}`;
        case 3:
            return `${(0, chalk_1.green)(text)}`;
    }
    return `${(0, chalk_1.bold)(text)}`;
}
function optional(text) {
    return (0, chalk_1.gray)(text);
}
function cmdSwitch(text) {
    return optional(`--${text}`);
}
function command(text) {
    return chalk_1.whiteBright.bold(text);
}
function hint(text) {
    return chalk_1.green.dim(text);
}
function count(num) {
    return (0, chalk_1.grey)(`${num}`);
}
function position(text) {
    return (0, chalk_1.grey)(`${text}`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0LmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9taWNyb3NvZnQvdmNwa2ctdG9vbC9tYWluL3ZjcGtnLWFydGlmYWN0cy8iLCJzb3VyY2VzIjpbImNsaS9mb3JtYXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF1QztBQUN2QyxrQ0FBa0M7O0FBS2xDLGtDQUVDO0FBRUQsZ0RBRUM7QUFFRCw0Q0FFQztBQUVELG9FQUVDO0FBRUQsMEJBVUM7QUFFRCw0QkFFQztBQUNELDhCQUVDO0FBRUQsMEJBRUM7QUFFRCxvQkFFQztBQUVELHNCQUVDO0FBRUQsNEJBRUM7QUFwREQsaUNBQWlIO0FBR2pILFNBQWdCLFdBQVcsQ0FBQyxHQUFRO0lBQ2xDLE9BQU8sSUFBQSxZQUFJLEVBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzFCLENBQUM7QUFFRCxTQUFnQixrQkFBa0IsQ0FBQyxZQUFvQjtJQUNyRCxPQUFPLEdBQUcsSUFBQSxtQkFBVyxFQUFDLFlBQVksQ0FBQyxFQUFFLENBQUM7QUFDeEMsQ0FBQztBQUVELFNBQWdCLGdCQUFnQixDQUFDLFlBQW9CLEVBQUUsUUFBZ0IsRUFBRSxTQUFpQjtJQUN4RixPQUFPLEdBQUcsSUFBQSxtQkFBVyxFQUFDLFlBQVksQ0FBQyxJQUFJLGNBQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFBLG9CQUFZLEVBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQztBQUN4SSxDQUFDO0FBRUQsU0FBZ0IsNEJBQTRCLENBQUMsUUFBZ0IsRUFBRSxPQUFlO0lBQzVFLE9BQU8sT0FBTyxJQUFJLE9BQU8sS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxJQUFJLElBQUEsWUFBSSxFQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztBQUNoRixDQUFDO0FBRUQsU0FBZ0IsT0FBTyxDQUFDLElBQVksRUFBRSxLQUFLLEdBQUcsQ0FBQztJQUM3QyxRQUFRLEtBQUssRUFBRSxDQUFDO1FBQ2QsS0FBSyxDQUFDO1lBQ0osT0FBTyxHQUFHLGlCQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDbkMsS0FBSyxDQUFDO1lBQ0osT0FBTyxHQUFHLElBQUEsbUJBQVcsRUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ2hDLEtBQUssQ0FBQztZQUNKLE9BQU8sR0FBRyxJQUFBLGFBQUssRUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFDRCxPQUFPLEdBQUcsSUFBQSxZQUFJLEVBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUN6QixDQUFDO0FBRUQsU0FBZ0IsUUFBUSxDQUFDLElBQVk7SUFDbkMsT0FBTyxJQUFBLFlBQUksRUFBQyxJQUFJLENBQUMsQ0FBQztBQUNwQixDQUFDO0FBQ0QsU0FBZ0IsU0FBUyxDQUFDLElBQVk7SUFDcEMsT0FBTyxRQUFRLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQy9CLENBQUM7QUFFRCxTQUFnQixPQUFPLENBQUMsSUFBWTtJQUNsQyxPQUFPLG1CQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hDLENBQUM7QUFFRCxTQUFnQixJQUFJLENBQUMsSUFBWTtJQUMvQixPQUFPLGFBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekIsQ0FBQztBQUVELFNBQWdCLEtBQUssQ0FBQyxHQUFXO0lBQy9CLE9BQU8sSUFBQSxZQUFJLEVBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFFRCxTQUFnQixRQUFRLENBQUMsSUFBWTtJQUNuQyxPQUFPLElBQUEsWUFBSSxFQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUN6QixDQUFDIn0=