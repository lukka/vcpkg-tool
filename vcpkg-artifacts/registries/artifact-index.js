"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtifactIndex = void 0;
const semver_1 = require("semver");
const indexer_1 = require("./indexer");
class ArtifactIndex extends indexer_1.IndexSchema {
    id = new indexer_1.IdentityKey(this, (i) => i.id, ['IdentityKey/id', 'IdentityKey/info.id']);
    version = new indexer_1.SemverKey(this, (i) => new semver_1.SemVer(i.version), ['SemverKey/version', 'SemverKey/info.version']);
    summary = new indexer_1.StringKey(this, (i) => i.summary, ['StringKey/summary', 'StringKey/info.summary']);
}
exports.ArtifactIndex = ArtifactIndex;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJ0aWZhY3QtaW5kZXguanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21pY3Jvc29mdC92Y3BrZy10b29sL21haW4vdmNwa2ctYXJ0aWZhY3RzLyIsInNvdXJjZXMiOlsicmVnaXN0cmllcy9hcnRpZmFjdC1pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBRWxDLG1DQUFnQztBQUVoQyx1Q0FBMkU7QUFHM0UsTUFBYSxhQUFjLFNBQVEscUJBQXdDO0lBQ3pFLEVBQUUsR0FBRyxJQUFJLHFCQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsZ0JBQWdCLEVBQUUscUJBQXFCLENBQUMsQ0FBQyxDQUFDO0lBQ25GLE9BQU8sR0FBRyxJQUFJLG1CQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLGVBQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDLENBQUM7SUFDN0csT0FBTyxHQUFHLElBQUksbUJBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDLENBQUM7Q0FDbEc7QUFKRCxzQ0FJQyJ9