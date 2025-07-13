"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.installEspIdf = installEspIdf;
exports.activateEspIdf = activateEspIdf;
const path_1 = require("path");
const i18n_1 = require("../i18n");
const exec_cmd_1 = require("../util/exec-cmd");
const vcpkg_1 = require("../vcpkg");
async function installEspIdf(session, events, targetLocation) {
    // check for some file that espressif installs to see if it's installed.
    if (await targetLocation.exists('.espressif')) {
        return;
    }
    // create the .espressif folder for the espressif installation
    const dotEspidf = await targetLocation.createDirectory('.espressif');
    const pythonPath = await (0, vcpkg_1.vcpkgFetch)(session, 'python3_with_venv');
    if (!pythonPath) {
        throw new Error((0, i18n_1.i) `Could not activate esp-idf: python was not found.`);
    }
    const targetDirectory = targetLocation.fsPath;
    const extendedEnvironment = {
        ...process.env,
        IDF_PATH: targetDirectory,
        IDF_TOOLS_PATH: dotEspidf.fsPath
    };
    const idfTools = targetLocation.join('tools/idf_tools.py').fsPath;
    session.channels.debug(`Running idf installer ${idfTools}`);
    const installResult = await (0, exec_cmd_1.execute)(pythonPath, [
        idfTools,
        'install',
        '--targets=all'
    ], {
        env: extendedEnvironment,
        onStdOutData: (chunk) => {
            session.channels.debug('espidf: ' + chunk);
            const regex = /\s(100)%/;
            chunk.toString().split('\n').forEach((line) => {
                const match_array = line.match(regex);
                if (match_array !== null) {
                    events.unpackArchiveHeartbeat?.('Installing espidf');
                }
            });
        }
    });
    if (installResult.code) {
        return false;
    }
    const installPythonEnv = await (0, exec_cmd_1.execute)(pythonPath, [
        idfTools,
        'install-python-env'
    ], {
        env: extendedEnvironment
    });
    return installPythonEnv.code === 0;
}
async function activateEspIdf(session, activation, targetLocation) {
    const pythonPath = await (0, vcpkg_1.vcpkgFetch)(session, 'python3_with_venv');
    if (!pythonPath) {
        throw new Error((0, i18n_1.i) `Could not activate esp-idf: python was not found.`);
    }
    const targetDirectory = targetLocation.fsPath;
    const dotEspidf = targetLocation.join('.espressif');
    const extendedEnvironment = {
        ...process.env,
        IDF_PATH: targetDirectory,
        IDF_TOOLS_PATH: dotEspidf.fsPath
    };
    const activateIdf = await (0, exec_cmd_1.execute)(pythonPath, [
        `${targetLocation.fsPath}/tools/idf_tools.py`,
        'export',
        '--format',
        'key-value',
        '--prefer-system'
    ], {
        env: extendedEnvironment,
        onStdOutData: (chunk) => {
            chunk.toString().split('\n').forEach((line) => {
                const splitLine = line.split('=');
                if (splitLine[0]) {
                    if (splitLine[0] !== 'PATH') {
                        activation.addEnvironmentVariable(splitLine[0].trim(), [splitLine[1].trim()]);
                    }
                    else {
                        const pathValues = splitLine[1].split(path_1.delimiter);
                        for (const path of pathValues) {
                            if (path.trim() !== '%PATH%' && path.trim() !== '$PATH') {
                                // we actually want to use the artifacts we installed, not the ones that are being bundled.
                                // when espressif supports artifacts properly, we shouldn't need this filter.
                                if (!/\.espressif.tools/ig.exec(path)) {
                                    activation.addPath(splitLine[0].trim(), session.fileSystem.file(path));
                                }
                            }
                        }
                    }
                }
            });
        }
    });
    if (activateIdf.code) {
        throw new Error(`Failed to activate esp-idf - ${activateIdf.stderr}`);
    }
    activation.addEnvironmentVariable('IDF_PATH', targetDirectory);
    activation.addTool('IDF_TOOLS_PATH', dotEspidf.fsPath);
    return true;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXNwaWRmLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9taWNyb3NvZnQvdmNwa2ctdG9vbC9tYWluL3ZjcGtnLWFydGlmYWN0cy8iLCJzb3VyY2VzIjpbImluc3RhbGxlcnMvZXNwaWRmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1Q0FBdUM7QUFDdkMsa0NBQWtDOztBQVdsQyxzQ0FxREM7QUFFRCx3Q0FxREM7QUFySEQsK0JBQWlDO0FBRWpDLGtDQUE0QjtBQUc1QiwrQ0FBMkM7QUFFM0Msb0NBQXNDO0FBRS9CLEtBQUssVUFBVSxhQUFhLENBQUMsT0FBZ0IsRUFBRSxNQUE2QixFQUFFLGNBQW1CO0lBQ3RHLHdFQUF3RTtJQUN4RSxJQUFJLE1BQU0sY0FBYyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDO1FBQUMsT0FBTztJQUFDLENBQUM7SUFFMUQsOERBQThEO0lBQzlELE1BQU0sU0FBUyxHQUFHLE1BQU0sY0FBYyxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUVyRSxNQUFNLFVBQVUsR0FBRyxNQUFNLElBQUEsa0JBQVUsRUFBQyxPQUFPLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUNsRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFBLFFBQUMsRUFBQSxtREFBbUQsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFRCxNQUFNLGVBQWUsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDO0lBRTlDLE1BQU0sbUJBQW1CLEdBQXNCO1FBQzdDLEdBQUksT0FBTyxDQUFDLEdBQUc7UUFDZixRQUFRLEVBQUUsZUFBZTtRQUN6QixjQUFjLEVBQUUsU0FBUyxDQUFDLE1BQU07S0FDakMsQ0FBQztJQUVGLE1BQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDbEUsT0FB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