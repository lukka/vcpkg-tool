"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_file_1 = require("../../amf/metadata-file");
const assert_1 = require("assert");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const s = require("../sequence-equal");
const SuiteLocal_1 = require("./SuiteLocal");
// forces the global function for sequence equal to be added to strict before this exectues:
s;
// sample test using decorators.
describe('Amf', () => {
    const local = new SuiteLocal_1.SuiteLocal();
    after(local.after.bind(local));
    it('readProfile', async () => {
        const content = await (await (0, promises_1.readFile)((0, path_1.join)(local.resourcesFolder, 'sample1.json'))).toString('utf-8');
        const doc = await metadata_file_1.MetadataFile.parseConfiguration('./sample1.json', content, local.session);
        assert_1.strict.ok(doc.isFormatValid);
        assert_1.strict.sequenceEqual(doc.validate(), []);
        assert_1.strict.equal(doc.id, 'sample1', 'name incorrect');
        assert_1.strict.equal(doc.version, '1.2.3', 'version incorrect');
    });
    it('reads file with nupkg', async () => {
        const content = await (await (0, promises_1.readFile)((0, path_1.join)(local.resourcesFolder, 'repo', 'sdks', 'microsoft', 'windows.json'))).toString('utf-8');
        const doc = await metadata_file_1.MetadataFile.parseConfiguration('./windows.json', content, local.session);
        assert_1.strict.ok(doc.isFormatValid);
        assert_1.strict.sequenceEqual(doc.validate(), []);
    });
    it('load/persist an artifact', async () => {
        const content = await (await (0, promises_1.readFile)((0, path_1.join)(local.resourcesFolder, 'example-artifact.json'))).toString('utf-8');
        const doc = await metadata_file_1.MetadataFile.parseConfiguration('./example-artifact.json', content, local.session);
        assert_1.strict.ok(doc.isFormatValid);
        assert_1.strict.sequenceEqual(doc.validate(), []);
    });
    it('profile checks', async () => {
        const content = await (await (0, promises_1.readFile)((0, path_1.join)(local.resourcesFolder, 'sample1.json'))).toString('utf-8');
        const doc = await metadata_file_1.MetadataFile.parseConfiguration('./sample1.json', content, local.session);
        assert_1.strict.ok(doc.isFormatValid, 'Ensure that it is valid json');
        assert_1.strict.sequenceEqual(doc.validate(), []);
        assert_1.strict.sequenceEqual(doc.contacts.get('Bob Smith').roles, ['fallguy', 'otherguy'], 'Should return the two roles');
        doc.contacts.get('Bob Smith').roles.delete('fallguy');
        assert_1.strict.sequenceEqual(doc.contacts.get('Bob Smith').roles, ['otherguy'], 'Should return the remaining role');
        doc.contacts.get('Bob Smith').roles.add('the dude');
        doc.contacts.get('Bob Smith').roles.add('the dude'); // shouldn't add this one
        assert_1.strict.sequenceEqual(doc.contacts.get('Bob Smith').roles, ['otherguy', 'the dude'], 'Should return only two roles');
        const k = doc.contacts.add('James Brown');
        k.email = 'jim@contoso.net';
        assert_1.strict.equal(doc.contacts.keys.length, 3, 'Should have 3 contacts');
        doc.contacts.delete('James Brown');
        assert_1.strict.equal(doc.contacts.keys.length, 2, 'Should have 2 contacts');
        doc.contacts.delete('James Brown'); // this is ok.
        // version can be coerced to be a string (via tostring)
        assert_1.strict.equal(doc.requires.get('foo/bar/bin')?.raw == '~2.0.0', true, 'Version must match');
        // can we get the normalized range?
        assert_1.strict.equal(doc.requires.get('foo/bar/bin').range.range, '>=2.0.0 <2.1.0-0', 'The canonical ranges should match');
        // no resolved version means undefined.
        assert_1.strict.equal(doc.requires.get('foo/bar/bin').resolved, undefined, 'Version must match');
        // the setter is actually smart enough, but typescript does not allow heterogeneous accessors (yet! https://github.com/microsoft/TypeScript/issues/2521)
        doc.requires.set('just/a/version', '1.2.3');
        assert_1.strict.equal(doc.requires.get('just/a/version').raw, '1.2.3', 'Should be a static version range');
        // set it with a struct
        doc.requires.set('range/with/resolved', { range: '1.*', resolved: '1.0.0' });
        assert_1.strict.equal(doc.requires.get('range/with/resolved').raw, '1.* 1.0.0');
        assert_1.strict.equal(doc.exports.tools.get('CC'), 'foo/bar/cl.exe', 'should have a value');
        assert_1.strict.equal(doc.exports.tools.get('CXX'), 'bin/baz/cl.exe', 'should have a value');
        assert_1.strict.equal(doc.exports.tools.get('Whatever'), 'some/tool/path/foo', 'should have a value');
        doc.exports.tools.delete('CXX');
        assert_1.strict.equal(doc.exports.tools.keys.length, 2, 'should only have two tools now');
        assert_1.strict.sequenceEqual(doc.exports.environment.get('test'), ['abc'], 'variables should be an array');
        assert_1.strict.sequenceEqual(doc.exports.environment.get('cxxflags'), ['foo=bar', 'bar=baz'], 'variables should be an array');
        doc.exports.environment.add('test').add('another value');
        assert_1.strict.sequenceEqual(doc.exports.environment.get('test'), ['abc', 'another value'], 'variables should be an array of two items now');
        doc.exports.paths.add('bin').add('hello/there');
        assert_1.strict.deepEqual(doc.exports.paths.get('bin')?.length, 3, 'there should be three paths in bin now');
        assert_1.strict.sequenceEqual(doc.conditionalDemands.keys, ['windows and arm'], 'should have one conditional demand');
    });
    it('read invalid json file', async () => {
        const content = await (await (0, promises_1.readFile)((0, path_1.join)(local.resourcesFolder, 'errors.json'))).toString('utf-8');
        const doc = await metadata_file_1.MetadataFile.parseConfiguration('./errors.json', content, local.session);
        assert_1.strict.equal(doc.isFormatValid, false, 'this document should have errors');
        assert_1.strict.equal(doc.formatErrors.length, 2, 'This document should have two error');
        assert_1.strict.equal(doc.id, 'bob', 'name incorrect');
        assert_1.strict.equal(doc.version, '1.0.2', 'version incorrect');
    });
    it('read empty json file', async () => {
        const content = await (await (0, promises_1.readFile)((0, path_1.join)(local.resourcesFolder, 'empty.json'))).toString('utf-8');
        const doc = await metadata_file_1.MetadataFile.parseConfiguration('./empty.json', content, local.session);
        assert_1.strict.ok(doc.isFormatValid);
        const validationErrors = Array.from(doc.validate(), (error) => doc.formatVMessage(error));
        assert_1.strict.sequenceEqual(validationErrors, [
            './empty.json:1:1 FieldMissing, Missing identity \'id\'',
            './empty.json:1:1 FieldMissing, Missing version \'version\''
        ]);
        const [firstError] = doc.validate();
        assert_1.strict.equal(doc.formatVMessage(firstError), './empty.json:1:1 FieldMissing, Missing identity \'id\'', 'Should have an error about id');
    });
    it('validation errors', async () => {
        const content = await (await (0, promises_1.readFile)((0, path_1.join)(local.resourcesFolder, 'validation-errors.json'))).toString('utf-8');
        const doc = await metadata_file_1.MetadataFile.parseConfiguration('./validation-errors.json', content, local.session);
        assert_1.strict.ok(doc.isFormatValid);
        const validationErrors = Array.from(doc.validate(), (error) => doc.formatVMessage(error));
        assert_1.strict.sequenceEqual(validationErrors, [
            './validation-errors.json:5:15 InvalidChild, Unexpected \'goober )\' found in $',
            './validation-errors.json:8:13 InvalidChild, Unexpected \'goober\' found in $',
            './validation-errors.json:11:13 InvalidChild, Unexpected \'floopy\' found in $',
            './validation-errors.json:12:29 InvalidChild, Unexpected \'windows and target:x64\' found in $',
            './validation-errors.json:3:16 InvalidChild, Unexpected \'nothing\' found in $.info',
            './validation-errors.json:2:11 FieldMissing, Missing identity \'info.id\'',
            './validation-errors.json:2:11 FieldMissing, Missing version \'info.version\''
        ]);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1mLXRlc3RzLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9taWNyb3NvZnQvdmNwa2ctdG9vbC9tYWluL3ZjcGtnLWFydGlmYWN0cy8iLCJzb3VyY2VzIjpbInRlc3QvY29yZS9hbWYtdGVzdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF1QztBQUN2QyxrQ0FBa0M7O0FBRWxDLDJEQUF1RDtBQUN2RCxtQ0FBZ0M7QUFDaEMsMENBQXVDO0FBQ3ZDLCtCQUE0QjtBQUM1Qix1Q0FBdUM7QUFDdkMsNkNBQTBDO0FBRTFDLDRGQUE0RjtBQUM1RixDQUFDLENBQUM7QUFFRixnQ0FBZ0M7QUFDaEMsUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUU7SUFDbkIsTUFBTSxLQUFLLEdBQUcsSUFBSSx1QkFBVSxFQUFFLENBQUM7SUFFL0IsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFFL0IsRUFBRSxDQUFDLGFBQWEsRUFBRSxLQUFLLElBQUksRUFBRTtRQUMzQixNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxJQUFBLG1CQUFRLEVBQUMsSUFBQSxXQUFJLEVBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RHLE1BQU0sR0FBRyxHQUFHLE1BQU0sNEJBQVksQ0FBQyxrQkFBa0IsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTVGLGVBQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzdCLGVBQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRXpDLGVBQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxD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