"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
const activation_1 = require("../artifacts/activation");
const artifact_1 = require("../artifacts/artifact");
const artifacts_1 = require("./artifacts");
function trackActivationPlan(session, resolved) {
    for (const resolvedEntry of resolved) {
        const artifact = resolvedEntry.artifact;
        if (artifact instanceof artifact_1.Artifact) {
            session.trackActivate(artifact.registryUri.toString(), artifact.id, artifact.version);
        }
    }
}
async function activate(session, allowStacking, stackEntries, artifacts, registries, options) {
    trackActivationPlan(session, artifacts);
    // install the items in the project
    if (!await (0, artifacts_1.acquireArtifacts)(session, artifacts, registries, options)) {
        return false;
    }
    const activation = await activation_1.Activation.start(session, allowStacking);
    for (const artifact of artifacts) {
        if (!await artifact.artifact.loadActivationSettings(activation)) {
            return false;
        }
    }
    return await activation.activate(stackEntries, options?.msbuildProps, options?.json);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJjbGkvcHJvamVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7QUEwQmxDLDRCQWVDO0FBdkNELHdEQUFxRDtBQUNyRCxvREFBbUU7QUFJbkUsMkNBQStDO0FBVS9DLFNBQVMsbUJBQW1CLENBQUMsT0FBZ0IsRUFBRSxRQUFpQztJQUM5RSxLQUFLLE1BQU0sYUFBYSxJQUFJLFFBQVEsRUFBRSxDQUFDO1FBQ3JDLE1BQU0sUUFBUSxHQUFHLGFBQWEsQ0FBQyxRQUFRLENBQUM7UUFDeEMsSUFBSSxRQUFRLFlBQVksbUJBQVEsRUFBRSxDQUFDO1lBQ2pDLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxRQUFRLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN4RixDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUM7QUFFTSxLQUFLLFVBQVUsUUFBUSxDQUFDLE9BQWdCLEVBQUUsYUFBc0IsRUFBRSxZQUEyQixFQUFFLFNBQWtDLEVBQUUsVUFBa0MsRUFBRSxPQUEyQjtJQUN2TSxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDeEMsbUNBQW1DO0lBQ25DLElBQUksQ0FBQyxNQUFNLElBQUEsNEJBQWdCLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQztRQUNyRSxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRCxNQUFNLFVBQVUsR0FBRyxNQUFNLHVCQUFVLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNsRSxLQUFLLE1BQU0sUUFBUSxJQUFJLFNBQVMsRUFBRSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxNQUFNLFFBQVEsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztZQUNoRSxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7SUFDSCxDQUFDO0lBRUQsT0FBTyxNQUFNLFVBQVUsQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3ZGLENBQUMifQ==