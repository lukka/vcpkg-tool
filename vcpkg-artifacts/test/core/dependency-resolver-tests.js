"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
const artifacts_1 = require("../../cli/artifacts");
const registries_1 = require("../../registries/registries");
const assert_1 = require("assert");
const SuiteLocal_1 = require("./SuiteLocal");
describe('Dependency resolver', () => {
    const local = new SuiteLocal_1.SuiteLocal();
    after(local.after.bind(local));
    it('Topologically sorts', async () => {
        const db = new registries_1.RegistryDatabase();
        const localRegistryUri = local.resourcesFolderUri.join('topo-sort-registry');
        const localRegistryStr = localRegistryUri.toString();
        await db.loadRegistry(local.session, localRegistryUri);
        const registryContext = new registries_1.RegistryResolver(db);
        registryContext.add(localRegistryUri, 'topo');
        const resolved = await (0, artifacts_1.selectArtifacts)(local.session, new Map([['alpha', '*'], ['foxtrot', '1.0.0'], ['delta', '1.0']]), registryContext, 2);
        assert_1.strict.ok(resolved);
        // beta and echo being transposed would also be a correct order.
        // alpha and foxtrot being transposed would also be a correct order.
        assert_1.strict.deepStrictEqual(resolved.map(a => [a.uniqueId, a.initialSelection, a.depth, a.requestedVersion]), [
            [localRegistryStr + '::delta::1.0.0', true, 4, '1.0'],
            [localRegistryStr + '::charlie::1.0.0', false, 3, undefined],
            [localRegistryStr + '::bravo::1.0.0', false, 2, undefined],
            [localRegistryStr + '::echo::1.0.0', false, 2, undefined],
            [localRegistryStr + '::alpha::1.0.0', true, 1, '*'],
            [localRegistryStr + '::foxtrot::1.0.0', true, 1, '1.0.0']
        ]);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwZW5kZW5jeS1yZXNvbHZlci10ZXN0cy5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJ0ZXN0L2NvcmUvZGVwZW5kZW5jeS1yZXNvbHZlci10ZXN0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7QUFFbEMsbURBQXNEO0FBQ3RELDREQUFpRjtBQUNqRixtQ0FBZ0M7QUFDaEMsNkNBQTBDO0FBRTFDLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7SUFDbkMsTUFBTSxLQUFLLEdBQUcsSUFBSSx1QkFBVSxFQUFFLENBQUM7SUFFL0IsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFFL0IsRUFBRSxDQUFDLHFCQUFxQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ25DLE1BQU0sRUFBRSxHQUFHLElBQUksNkJBQWdCLEVBQUUsQ0FBQztRQUNsQyxNQUFNLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUM3RSxNQUFNLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3JELE1BQU0sRUFBRSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDdkQsTUFBTSxlQUFlLEdBQUcsSUFBSSw2QkFBZ0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNqRCxlQUFlLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRTlDLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBQSwyQkFBZSxFQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxHQUFHLENBQWlCLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM3SixlQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BCLGdFQUFnRTtRQUNoRSxvRUFBb0U7UUFDcEUsZUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUU7WUFDdkcsQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQztZQUNyRCxDQUFDLGdCQUFnQixHQUFHLGtCQUFrQixFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsU0FBUyxDQUFDO1lBQzVELENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUM7WUFDMUQsQ0FBQyxnQkFBZ0IsR0FBRyxlQUFlLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUM7WUFDekQsQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQztZQUNuRCxDQUFDLGdCQUFnQixHQUFHLGtCQUFrQixFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDO1NBQzFELENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==