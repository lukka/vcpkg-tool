"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = exports.registryIndexFile = exports.configurationName = exports.manifestName = exports.vcpkgDownloadVariable = exports.latestVersion = exports.postscriptVariable = exports.undoVariableName = void 0;
exports.undoVariableName = 'Z_VCPKG_UNDO';
exports.postscriptVariable = 'Z_VCPKG_POSTSCRIPT';
exports.latestVersion = '*';
exports.vcpkgDownloadVariable = 'VCPKG_DOWNLOADS';
exports.manifestName = 'vcpkg.json';
exports.configurationName = 'vcpkg-configuration.json';
exports.registryIndexFile = 'index.yaml';
exports.defaultConfig = `{
  "registries": [
    {
      "kind": "artifact",
      "name": "microsoft",
      "location": "https://github.com/microsoft/vcpkg-ce-catalog/archive/refs/heads/main.zip"
    },
    {
      "kind": "artifact",
      "name": "arm",
      "location": "https://artifacts.tools.arm.com/vcpkg-registry"
    }
  ]
}
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9taWNyb3NvZnQvdmNwa2ctdG9vbC9tYWluL3ZjcGtnLWFydGlmYWN0cy8iLCJzb3VyY2VzIjpbImNvbnN0YW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBRXJCLFFBQUEsZ0JBQWdCLEdBQUcsY0FBYyxDQUFDO0FBQ2xDLFFBQUEsa0JBQWtCLEdBQUcsb0JBQW9CLENBQUM7QUFDMUMsUUFBQSxhQUFhLEdBQUcsR0FBRyxDQUFDO0FBQ3BCLFFBQUEscUJBQXFCLEdBQUcsaUJBQWlCLENBQUM7QUFDMUMsUUFBQSxZQUFZLEdBQUcsWUFBWSxDQUFDO0FBQzVCLFFBQUEsaUJBQWlCLEdBQUcsMEJBQTBCLENBQUM7QUFDL0MsUUFBQSxpQkFBaUIsR0FBRyxZQUFZLENBQUM7QUFFakMsUUFBQSxhQUFhLEdBQ3hCOzs7Ozs7Ozs7Ozs7OztDQWNELENBQUMifQ==