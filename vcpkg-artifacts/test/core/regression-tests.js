"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
const SuiteLocal_1 = require("./SuiteLocal");
describe('Regressions', () => {
    const local = new SuiteLocal_1.SuiteLocal();
    after(local.after.bind(local));
    // These 2 registry loads ensure that we can process both the 'old' and 'new' index.yaml files
    // regression discovered in https://github.com/microsoft/vcpkg-ce-catalog/pull/33
    it('Loads 2ffbc04d6856a1d03c5de0ab94404f90636f7855 registry', async () => {
        await local.session.registryDatabase.loadRegistry(local.session, local.resourcesFolderUri.join('vcpkg-ce-catalog-2ffbc04d6856a1d03c5de0ab94404f90636f7855'));
    });
    it('Loads d471612be63b2fb506ab5f47122da460f5aa4d30 registry', async () => {
        await local.session.registryDatabase.loadRegistry(local.session, local.resourcesFolderUri.join('vcpkg-ce-catalog-d471612be63b2fb506ab5f47122da460f5aa4d30'));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVncmVzc2lvbi10ZXN0cy5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJ0ZXN0L2NvcmUvcmVncmVzc2lvbi10ZXN0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7QUFFbEMsNkNBQTBDO0FBRTFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFO0lBQzNCLE1BQU0sS0FBSyxHQUFHLElBQUksdUJBQVUsRUFBRSxDQUFDO0lBRS9CLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBRS9CLDhGQUE4RjtJQUM5RixpRkFBaUY7SUFFakYsRUFBRSxDQUFDLHlEQUF5RCxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3ZFLE1BQU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFDN0QsS0FBSyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQywyREFBMkQsQ0FBQyxDQUFDLENBQUM7SUFDaEcsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMseURBQXlELEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDdkUsTUFBTSxLQUFLLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUM3RCxLQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLDJEQUEyRCxDQUFDLENBQUMsQ0FBQztJQUNoRyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=