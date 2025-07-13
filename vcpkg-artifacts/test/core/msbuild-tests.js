"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
const activation_1 = require("../../artifacts/activation");
const assert_1 = require("assert");
const os_1 = require("os");
const SuiteLocal_1 = require("./SuiteLocal");
describe('MSBuild Generator', () => {
    const local = new SuiteLocal_1.SuiteLocal();
    after(local.after.bind(local));
    it('Generates roots without a trailing slash', async () => {
        const activation = await activation_1.Activation.start(local.session, false);
        const expectedPosix = 'c:/tmp';
        const expected = ((0, os_1.platform)() === 'win32') ? expectedPosix.replaceAll('/', '\\') : expectedPosix;
        assert_1.strict.equal(activation.msBuildProcessPropertyValue('{root}', local.fs.file('c:/tmp')), expected);
        assert_1.strict.equal(activation.msBuildProcessPropertyValue('{root}', local.fs.file('c:/tmp/')), expected);
    });
    it('Generates locations in order', async () => {
        const activation = await activation_1.Activation.start(local.session, false);
        // Note that only "addMSBuildProperty" has an effect on the output for now but that we'll probably
        // need to respond to the others in the future.
        [
            ['z', 'zse&tting'],
            ['a', 'ase<tting'],
            ['c', 'csetting'],
            ['b', 'bsetting'],
            ['prop', ['first', 'seco>nd', 'third']]
        ].forEach(([key, value]) => activation.addProperty(key, typeof value === 'string' ? [value] : value));
        activation.addLocation('somepath', local.fs.file('c:/tmp'));
        activation.addPath('include', [local.fs.file('c:/tmp'), local.fs.file('c:/tmp2')]);
        activation.addDefine('VERY_POSIX', '1');
        const fileWithNoSlash = local.fs.file('c:/tmp');
        const fileWithSlash = local.fs.file('c:/tmp/');
        activation.addMSBuildProperty('a', '$(a);fir{root}st', fileWithNoSlash);
        activation.addMSBuildProperty('a', '$(a);second', fileWithNoSlash);
        activation.addMSBuildProperty('a', '$(a);{root}hello', fileWithNoSlash);
        activation.addMSBuildProperty('b', '$(x);first', fileWithSlash);
        activation.addMSBuildProperty('b', '$(b);se{root}cond', fileWithSlash);
        activation.addMSBuildProperty('a', '$(a);third', fileWithNoSlash);
        activation.addMSBuildProperty('b', 'third', fileWithSlash);
        activation.addMSBuildProperty('b', '$(b);{root}world', fileWithSlash);
        activation.addMSBuildProperty('xml chars', '\'"<>& and $ look funny when escaped', fileWithSlash);
        const expectedPosix = `<?xml version="1.0" encoding="utf-8"?>
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
  <PropertyGroup>
    <a>$(a);firc:/tmpst</a>
    <a>$(a);second</a>
    <a>$(a);c:/tmphello</a>
    <b>$(x);first</b>
    <b>$(b);sec:/tmpcond</b>
    <a>$(a);third</a>
    <b>third</b>
    <b>$(b);c:/tmpworld</b>
    <xml chars>'"&lt;&gt;&amp; and $ look funny when escaped</xml chars>
  </PropertyGroup>
</Project>`;
        const expected = ((0, os_1.platform)() === 'win32')
            ? expectedPosix.replaceAll('c:/tmp', 'c:\\tmp').replaceAll('c:/', 'c:\\')
            : expectedPosix;
        assert_1.strict.equal(activation.generateMSBuild(), expected);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXNidWlsZC10ZXN0cy5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJ0ZXN0L2NvcmUvbXNidWlsZC10ZXN0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7QUFFbEMsMkRBQXdEO0FBQ3hELG1DQUFnQztBQUNoQywyQkFBOEI7QUFDOUIsNkNBQTBDO0FBRTFDLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7SUFDakMsTUFBTSxLQUFLLEdBQUcsSUFBSSx1QkFBVSxFQUFFLENBQUM7SUFFL0IsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFFL0IsRUFBRSxDQUFDLDBDQUEwQyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3hELE1BQU0sVUFBVSxHQUFHLE1BQU0sdUJBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNoRSxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUM7UUFDL0IsTUFBTSxRQUFRLEdBQUcsQ0FBQyxJQUFBLGFBQVEsR0FBRSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDO1FBQ2hHLGVBQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLDJCQUEyQixDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2xHLGVBQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLDJCQUEyQixDQUFDLFFBQVEsRUFBRSxLQUFLLENB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