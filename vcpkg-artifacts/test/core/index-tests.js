"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
const indexer_1 = require("../../registries/indexer");
const assert_1 = require("assert");
const mocha_1 = require("mocha");
const semver_1 = require("semver");
/** An Index implementation for TestData */
class MyIndex extends indexer_1.IndexSchema {
    id = new indexer_1.StringKey(this, (i) => i.id, 'StringKey/info.id');
    version = new indexer_1.SemverKey(this, (i) => new semver_1.SemVer(i.version), 'SemverKey/info.version');
    description = new indexer_1.StringKey(this, (i) => i.description, 'StringKey/info.description');
}
// sample test using decorators.
(0, mocha_1.describe)('Index Tests', () => {
    (0, mocha_1.it)('Create index from some data', () => {
        const index = new indexer_1.Index(MyIndex);
        index.insert({
            id: 'bob',
            version: new semver_1.SemVer('1.2.3')
        }, 'foo/bob');
        index.insert({
            id: 'wham/blam/sam',
            version: new semver_1.SemVer('0.0.4'),
            description: 'this is a test'
        }, 'other/sam');
        index.insert({
            id: 'tom',
            version: new semver_1.SemVer('2.3.4'),
            contacts: {
                'bob Smith': {
                    email: 'garrett@contoso.org'
                },
                'rob Smith': {
                    email: 'tarrett@contoso.org'
                },
            }
        }, 'foo/tom');
        index.insert({
            id: 'sam/blam/bam',
            version: new semver_1.SemVer('0.3.1'),
            description: 'this is a test'
        }, 'sam/blam/bam');
        const data = index.serialize();
        const index2 = new indexer_1.Index(MyIndex);
        index2.deserialize(data);
        const results2 = index.where.
            version.greaterThan(new semver_1.SemVer('0.3.0')).
            items;
        assert_1.strict.sequenceEqual(results2, ['sam/blam/bam', 'foo/bob', 'foo/tom']);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtdGVzdHMuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21pY3Jvc29mdC92Y3BrZy10b29sL21haW4vdmNwa2ctYXJ0aWZhY3RzLyIsInNvdXJjZXMiOlsidGVzdC9jb3JlL2luZGV4LXRlc3RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1Q0FBdUM7QUFDdkMsa0NBQWtDOztBQUdsQyxzREFBb0Y7QUFDcEYsbUNBQWdDO0FBQ2hDLGlDQUFxQztBQUNyQyxtQ0FBZ0M7QUFjaEMsMkNBQTJDO0FBQzNDLE1BQU0sT0FBUSxTQUFRLHFCQUE4QjtJQUNsRCxFQUFFLEdBQUcsSUFBSSxtQkFBUyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0lBQzNELE9BQU8sR0FBRyxJQUFJLG1CQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLGVBQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztJQUN0RixXQUFXLEdBQUcsSUFBSSxtQkFBUyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO0NBQ3ZGO0FBRUQsZ0NBQWdDO0FBQ2hDLElBQUEsZ0JBQVEsRUFBQyxhQUFhLEVBQUUsR0FBRyxFQUFFO0lBQzNCLElBQUEsVUFBRSxFQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBRTtRQUNyQyxNQUFNLEtBQUssR0FBRyxJQUFJLGVBQUssQ0FBb0IsT0FBTyxDQUFDLENBQUM7UUFFcEQsS0FBSyxDQUFDLE1BQU0sQ0FBQztZQUNYLEVBQUUsRUFBRSxLQUFLO1lBQ1QsT0FBTyxFQUFFLElBQUksZUFBTSxDQUFDLE9BQU8sQ0FBQztTQUM3QixFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRWQsS0FBSyxDQUFDLE1BQU0sQ0FBQztZQUNYLEVBQUUsRUFBRSxlQUFlO1lBQ25CLE9BQU8sRUFBRSxJQUFJLGVBQU0sQ0FBQyxPQUFPLENBQUM7WUFDNUIsV0FBVyxFQUFFLGdCQUFnQjtTQUM5QixFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRWhCLEtBQUssQ0FBQyxNQUFNLENBQUM7WUFDWCxFQUFFLEVBQUUsS0FBSztZQUNULE9BQU8sRUFBRSxJQUFJLGVBQU0sQ0FBQyxPQUFPLENBQUM7WUFDNUIsUUFBUSxFQUFFO2dCQUNSLFdBQVcsRUFBRTtvQkFDWCxLQUFLLEVBQUUscUJBQXFCO2lCQUM3QjtnQkFDRCxXQUFXLEVBQUU7b0JBQ1gsS0FBSyxFQUFFLHFCQUFxQjtpQkFDN0I7YUFDRjtTQUNGLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFZCxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQ1gsRUFBRSxFQUFFLGNBQWM7WUFDbEIsT0FBTyxFQUFFLElBQUksZUFBTSxDQUFDLE9BQU8sQ0FBQztZQUM1QixXQUFXLEVBQUUsZ0JBQWdCO1NBQzlCLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFFbkIsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQy9CLE1BQU0sTUFBTSxHQUFHLElBQUksZUFBSyxDQUFvQixPQUFPLENBQUMsQ0FBQztRQUNyRCxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pCLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxLQUFLO1lBQzFCLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxlQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDeEMsS0FBSyxDQUFDO1FBQ1IsZUFBTSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBRSxDQUFDLENBQUM7SUFDM0UsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9