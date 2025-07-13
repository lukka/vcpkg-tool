"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const registries_1 = require("../../registries/registries");
const SuiteLocal_1 = require("./SuiteLocal");
class FakeRegistry {
    location;
    constructor(location) {
        this.location = location;
    }
    get count() { return 1; }
    async search(criteria) {
        throw new Error('not implemented');
    }
    load(force) { return Promise.resolve(); }
    save() { return Promise.resolve(); }
    update(displayName) { return Promise.resolve(); }
    regenerate(normalize) { return Promise.resolve(); }
}
describe('Registry resolver', () => {
    const local = new SuiteLocal_1.SuiteLocal();
    after(local.after.bind(local));
    const appleUri = local.fs.parseUri('https://example.com/apple.zip');
    const appleRegistry = new FakeRegistry(appleUri);
    const bananaUri = local.fs.parseUri('https://example.com/banana.zip');
    const bananaRegistry = new FakeRegistry(appleUri);
    const cherryUri = local.fs.parseUri('https://example.com/cherry.zip');
    const cherryRegistry = new FakeRegistry(appleUri);
    const alphaUri = local.fs.parseUri('https://example.com/alpha.zip');
    const alphaRegistry = new FakeRegistry(alphaUri);
    const andromedaUri = local.fs.parseUri('https://example.com/andromeda.zip');
    const andromedaRegistry = new FakeRegistry(alphaUri);
    const db = new registries_1.RegistryDatabase();
    db.add(appleUri, appleRegistry);
    db.add(bananaUri, bananaRegistry);
    db.add(cherryUri, cherryRegistry);
    db.add(alphaUri, alphaRegistry);
    db.add(andromedaUri, andromedaRegistry);
    const globalContext = new registries_1.RegistryResolver(db);
    globalContext.add(appleUri, 'a');
    globalContext.add(bananaUri, 'b');
    globalContext.add(alphaUri, 'apple');
    const projectContext = new registries_1.RegistryResolver(db);
    projectContext.add(appleUri, 'apple');
    projectContext.add(cherryUri, 'cherry');
    const combined = globalContext.with(projectContext);
    it('Knows names in the project', () => {
        assert_1.strict.equal(combined.getRegistryByName('apple'), appleRegistry);
        assert_1.strict.equal(combined.getRegistryByName('cherry'), cherryRegistry);
    });
    it('Projects do not know different names from the same URI from the global context', () => {
        assert_1.strict.equal(projectContext.getRegistryByName('a'), undefined);
        assert_1.strict.equal(projectContext.getRegistryByName('b'), undefined);
    });
    it('Knows only URIs from either context', () => {
        assert_1.strict.equal(combined.getRegistryByUri(appleUri), appleRegistry);
        assert_1.strict.equal(combined.getRegistryByUri(bananaUri), bananaRegistry);
        assert_1.strict.equal(combined.getRegistryByUri(cherryUri), cherryRegistry);
        assert_1.strict.equal(combined.getRegistryByUri(alphaUri), alphaRegistry);
        assert_1.strict.equal(combined.getRegistryByUri(andromedaUri), undefined); // database knows but context doesn't
    });
    it('Chooses names of identical URIs from the project', () => {
        assert_1.strict.equal(combined.getRegistryName(appleUri), 'apple');
        assert_1.strict.equal(combined.getRegistryDisplayName(appleUri), 'apple');
        assert_1.strict.equal(combined.getRegistryName(cherryUri), 'cherry');
        assert_1.strict.equal(combined.getRegistryDisplayName(cherryUri), 'cherry');
    });
    it('Chooses names not in the project from the global configuration', () => {
        assert_1.strict.equal(combined.getRegistryName(bananaUri), 'b'); // not in project, so global name is used
        assert_1.strict.equal(combined.getRegistryDisplayName(bananaUri), 'b');
    });
    it('Does not know names with different meaning in the project', () => {
        // Global called this 'apple', but project called 'apple' appleUri, so it can only be displayed as
        // the full URI (in []s)
        assert_1.strict.equal(combined.getRegistryName(alphaUri), undefined); // not in project, so global name is used
        assert_1.strict.equal(combined.getRegistryDisplayName(alphaUri), '[https://example.com/alpha.zip]');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0cnktcmVzb2x2ZXItdGVzdHMuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21pY3Jvc29mdC92Y3BrZy10b29sL21haW4vdmNwa2ctYXJ0aWZhY3RzLyIsInNvdXJjZXMiOlsidGVzdC9jb3JlL3JlZ2lzdHJ5LXJlc29sdmVyLXRlc3RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1Q0FBdUM7QUFDdkMsa0NBQWtDOztBQUVsQyxtQ0FBZ0M7QUFFaEMsNERBQTJHO0FBRTNHLDZDQUEwQztBQUUxQyxNQUFNLFlBQVk7SUFDWTtJQUE1QixZQUE0QixRQUFhO1FBQWIsYUFBUSxHQUFSLFFBQVEsQ0FBSztJQUN6QyxDQUFDO0lBRUQsSUFBSSxLQUFLLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXpCLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBeUI7UUFDcEMsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxJQUFJLENBQUMsS0FBZSxJQUFtQixPQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDbEUsSUFBSSxLQUFvQixPQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDbkQsTUFBTSxDQUFDLFdBQW9CLElBQW1CLE9BQU8sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN6RSxVQUFVLENBQUMsU0FBbUIsSUFBbUIsT0FBTyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO0NBQzdFO0FBRUQsUUFBUSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtJQUNqQyxNQUFNLEtBQUssR0FBRyxJQUFJLHVCQUFVLEVBQUUsQ0FBQztJQUUvQixLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUUv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