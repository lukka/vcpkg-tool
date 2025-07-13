"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
const media_query_1 = require("../../mediaquery/media-query");
const assert_1 = require("assert");
const s = require("../sequence-equal");
// forces the global function for sequence equal to be added to strict before this exectues:
s;
describe('MediaQuery', () => {
    it('windows', async () => {
        const queryList = (0, media_query_1.parseQuery)('windows');
        assert_1.strict.equal(queryList.length, 1, 'should be just one query');
        assert_1.strict.equal(queryList.queries[0].expressions.length, 1, 'should be just one expression');
        assert_1.strict.equal(queryList.queries[0].expressions[0].feature, 'windows');
    });
    it('windows and arm', async () => {
        const queryList = (0, media_query_1.parseQuery)('windows and arm');
        assert_1.strict.equal(queryList.length, 1, 'should be just one query');
        assert_1.strict.equal(queryList.queries[0].expressions.length, 2, 'should be two expressions');
        assert_1.strict.sequenceEqual(queryList.queries[0].expressions.map(each => each.feature), ['windows', 'arm']);
    });
    it('target:x64', async () => {
        const queryList = (0, media_query_1.parseQuery)('target:x64');
        assert_1.strict.equal(queryList.length, 1, 'should be just one query');
        assert_1.strict.equal(queryList.queries[0].expressions.length, 1, 'should be one expression');
        assert_1.strict.equal(queryList.queries[0].expressions[0].feature, 'target', `feature should say target (got ${queryList.queries[0].expressions[0].feature})`);
        assert_1.strict.equal(queryList.queries[0].expressions[0].constant, 'x64', 'constant should say x64');
    });
    it('just test the parser for good queries', async () => {
        (0, media_query_1.parseQuery)('foo and bar');
        (0, media_query_1.parseQuery)('foo and (bar)');
        (0, media_query_1.parseQuery)('foo and (bar:100)');
        (0, media_query_1.parseQuery)('foo and (bar:"hello")');
        (0, media_query_1.parseQuery)('foo and (bar:"hello") and buzz');
        (0, media_query_1.parseQuery)('not foo and not bar');
    });
    it('test for known bad query strings', async () => {
        assert_1.strict.equal((0, media_query_1.parseQuery)('!').error?.message, 'Expected expression, found "!"');
        assert_1.strict.equal((0, media_query_1.parseQuery)('foo and !').error?.message, 'Expected expression, found "!"');
        assert_1.strict.equal((0, media_query_1.parseQuery)('foo or (bar:100)').error?.message, 'Expected comma, found "or"');
        assert_1.strict.equal((0, media_query_1.parseQuery)('not not bar').error?.message, 'Expression specified NOT twice');
        assert_1.strict.equal((0, media_query_1.parseQuery)('"hello" and bar').error?.message, 'Expected expression, found "\\"hello\\""');
        assert_1.strict.equal((0, media_query_1.parseQuery)('foo and (bar: : 200 )').error?.message, 'Expected one of {Number, Boolean, Identifier, String}, found token ":"');
        assert_1.strict.equal((0, media_query_1.parseQuery)('"').error?.message, 'Unexpected end of file while searching for \'"\'');
        assert_1.strict.equal((0, media_query_1.parseQuery)('foo:0x01fz').error?.message, 'Expected comma, found "z"');
        assert_1.strict.equal((0, media_query_1.parseQuery)('foo:?100').error?.message, 'Expected one of {Number, Boolean, Identifier, String}, found token "?"');
    });
    it('positive matches', async () => {
        assert_1.strict.ok((0, media_query_1.parseQuery)('foo').match({ foo: true }), 'foo was present, it should match!');
        assert_1.strict.ok((0, media_query_1.parseQuery)('foo').match({ foo: null }), 'foo was present, it should match!');
        assert_1.strict.ok((0, media_query_1.parseQuery)('foo:false').match({}), 'foo was not present, it should match!');
        assert_1.strict.ok((0, media_query_1.parseQuery)('foo:true').match({ foo: true }), 'foo was true, it should  match!');
        assert_1.strict.ok((0, media_query_1.parseQuery)('foo:true').match({ foo: null }), 'foo was true, it should  match!');
        assert_1.strict.ok((0, media_query_1.parseQuery)('foo and windows').match({ foo: true, windows: true, books: true }), 'foo,windows was present, it should match!');
        assert_1.strict.ok((0, media_query_1.parseQuery)('windows and x64 and target:amd64, osx').match({ windows: true, x64: true, target: 'amd64' }), 'should match');
        assert_1.strict.ok((0, media_query_1.parseQuery)('windows and (x64) and (target:amd64), osx').match({ windows: true, x64: true, target: 'amd64' }), 'should match');
        assert_1.strict.ok((0, media_query_1.parseQuery)('windows and x64 and target:amd64, osx').match({ osx: true }), 'should match');
        assert_1.strict.ok((0, media_query_1.parseQuery)('not windows').match({ windows: false, linux: true }), 'it should match!');
    });
    it('negative matches', async () => {
        assert_1.strict.ok(!(0, media_query_1.parseQuery)('not foo').match({ foo: true }), 'foo was present, it should not match!');
        assert_1.strict.ok(!(0, media_query_1.parseQuery)('not foo').match({ foo: null }), 'foo was present, it should not match!');
        assert_1.strict.ok(!(0, media_query_1.parseQuery)('foo').match({ foo: false }), 'foo was false, it should not match!');
        assert_1.strict.ok(!(0, media_query_1.parseQuery)('not foo:true').match({ foo: true }), 'foo was true, it should not match!');
        assert_1.strict.ok(!(0, media_query_1.parseQuery)('not foo:true').match({ foo: null }), 'foo was true, it should not match!');
        assert_1.strict.ok(!(0, media_query_1.parseQuery)('foo').match({}), 'foo was not present, it should not match!');
        assert_1.strict.ok(!(0, media_query_1.parseQuery)('not foo:false').match({}), 'foo was not present, it should match false!');
        assert_1.strict.ok(!(0, media_query_1.parseQuery)('bar and windows').match({ foo: true, windows: true, books: true }), 'bar was not , it should not match!');
        assert_1.strict.ok(!(0, media_query_1.parseQuery)('windows and x64 and target:amd64, osx').match({ linux: true }), 'should not match');
        assert_1.strict.ok(!(0, media_query_1.parseQuery)('not windows and not linux').match({ windows: false, linux: true }), 'it should not match!');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkaWEtcXVlcnktdGVzdHMuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21pY3Jvc29mdC92Y3BrZy10b29sL21haW4vdmNwa2ctYXJ0aWZhY3RzLyIsInNvdXJjZXMiOlsidGVzdC9jb3JlL21lZGlhLXF1ZXJ5LXRlc3RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1Q0FBdUM7QUFDdkMsa0NBQWtDOztBQUVsQyw4REFBMEQ7QUFDMUQsbUNBQWdDO0FBQ2hDLHVDQUF1QztBQUV2Qyw0RkFBNEY7QUFDNUYsQ0FBQyxDQUFDO0FBRUYsUUFBUSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUU7SUFDMUIsRUFBRSxDQUFDLFNBQVMsRUFBRSxLQUFLLElBQUksRUFBRTtRQUN2QixNQUFNLFNBQVMsR0FBRyxJQUFBLHdCQUFVLEVBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEMsZUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO1FBQzlELGVBQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSwrQkFBK0IsQ0FBQyxDQUFDO1FBQzFGLGVBQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3ZFLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGlCQUFpQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQy9CLE1BQU0sU0FBUyxHQUFHLElBQUEsd0JBQVUsRUFBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ2hELGVBQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsMEJBQTBCLENB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