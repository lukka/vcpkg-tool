"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataFile = void 0;
const path_1 = require("path");
const yaml_1 = require("yaml");
const i18n_1 = require("../i18n");
const error_kind_1 = require("../interfaces/error-kind");
const BaseMap_1 = require("../yaml/BaseMap");
const Options_1 = require("../yaml/Options");
const contact_1 = require("./contact");
const demands_1 = require("./demands");
const info_1 = require("./info");
const registries_1 = require("./registries");
class MetadataFile extends BaseMap_1.BaseMap {
    document;
    filename;
    file;
    lineCounter;
    registryUri;
    constructor(document, filename, file, lineCounter, registryUri) {
        super(document.contents);
        this.document = document;
        this.filename = filename;
        this.file = file;
        this.lineCounter = lineCounter;
        this.registryUri = registryUri;
    }
    static async parseMetadata(filename, uri, session, registryUri) {
        return MetadataFile.parseConfiguration(filename, await uri.readUTF8(), session, registryUri);
    }
    static async parseConfiguration(filename, content, session, registryUri) {
        const lc = new yaml_1.LineCounter();
        if (!content || content === 'null') {
            content = '{\n}';
        }
        const doc = (0, yaml_1.parseDocument)(content, { prettyErrors: false, lineCounter: lc, strict: true });
        return new MetadataFile(doc, filename, session.fileSystem.file((0, path_1.resolve)(filename)), lc, registryUri);
    }
    #info = new info_1.Info(undefined, this, 'info');
    contacts = new contact_1.Contacts(undefined, this, 'contacts');
    registries = new registries_1.RegistriesDeclaration(undefined, this, 'registries');
    // rather than re-implement it, use encapsulation with a demand block
    demandBlock = new demands_1.DemandBlock(this.node, undefined);
    /** Artifact identity
   *
   * this should be the 'path' to the artifact (following the guidelines)
   *
   * ie, 'compilers/microsoft/msvc'
   *
   * artifacts install to artifacts-root/<source>/<id>/<VER>
   */
    get id() { return this.asString(this.getMember('id')) || this.#info.id || ''; }
    set id(value) { this.normalize(); this.setMember('id', value); }
    /** the version of this artifact */
    get version() { return this.asString(this.getMember('version')) || this.#info.version || ''; }
    set version(value) { this.normalize(); this.setMember('version', value); }
    /** a short 1 line descriptive text */
    get summary() { return this.asString(this.getMember('summary')) || this.#info.summary; }
    set summary(value) { this.normalize(); this.setMember('summary', value); }
    /** if a longer description is required, the value should go here */
    get description() { return this.asString(this.getMember('description')) || this.#info.description; }
    set description(value) { this.normalize(); this.setMember('description', value); }
    #options = new Options_1.Options(undefined, this, 'options');
    /** if true, intended to be used only as a dependency; for example, do not show in search results or lists */
    get dependencyOnly() { return this.#options.has('dependencyOnly') || this.#info.options.has('dependencyOnly'); }
    get espidf() { return this.#options.has('espidf') || this.#info.options.has('espidf'); }
    /** higher priority artifacts should install earlier; the default is zero */
    get priority() { return this.asNumber(this.getMember('priority')) || this.#info.priority || 0; }
    set priority(value) { this.normalize(); this.setMember('priority', value); }
    get error() { return this.demandBlock.error; }
    set error(value) { this.demandBlock.error = value; }
    get warning() { return this.demandBlock.warning; }
    set warning(value) { this.demandBlock.warning = value; }
    get message() { return this.demandBlock.message; }
    set message(value) { this.demandBlock.message = value; }
    get requires() { return this.demandBlock.requires; }
    get exports() { return this.demandBlock.exports; }
    get install() { return this.demandBlock.install; }
    conditionalDemands = new demands_1.Demands(undefined, this, 'demands');
    get isFormatValid() {
        return this.document.errors.length === 0;
    }
    toJsonString() {
        let content = JSON.stringify(this.document.toJSON(), null, 2);
        if (!content || content === 'null') {
            content = '{}\n';
        }
        return content;
    }
    async save(uri = this.file) {
        await uri.writeUTF8(this.toJsonString());
    }
    #errors;
    get formatErrors() {
        const t = this;
        return this.#errors || (this.#errors = this.document.errors.map(each => {
            const message = each.message;
            const line = each.linePos?.[0].line || 1;
            const column = each.linePos?.[0].col || 1;
            return t.formatMessage(each.name, message, line, column);
        }));
    }
    /** @internal */ formatMessage(category, message, line, column) {
        if (line !== undefined && column !== undefined) {
            return `${this.filename}:${line}:${column} ${category}, ${message}`;
        }
        else {
            return `${this.filename}: ${category}, ${message}`;
        }
    }
    formatVMessage(vMessage) {
        const message = vMessage.message;
        const range = vMessage.range;
        const rangeOffset = vMessage.rangeOffset;
        const category = vMessage.category;
        const r = Array.isArray(range) ? range : range?.sourcePosition();
        const { line, column } = this.positionAt(r, rangeOffset);
        return this.formatMessage(category, message, line, column);
    }
    *deprecationWarnings() {
        const node = this.node;
        if (node) {
            const info = node.get('info');
            if (info) {
                const infoNode = info;
                yield {
                    message: (0, i18n_1.i) `The info block is deprecated for consistency with vcpkg.json; move info members to the outside.`,
                    range: infoNode.range || undefined,
                    category: error_kind_1.ErrorKind.InfoBlockPresent
                };
            }
        }
    }
    positionAt(range, offset) {
        const { line, col } = this.lineCounter.linePos(range?.[0] || 0);
        return offset ? {
            // adds the offset values (which can come from the mediaquery parser) to the line & column. If MQ doesn't have a position, it's zero.
            line: line + (offset.line - 1),
            column: col + (offset.column - 1),
        } :
            {
                line, column: col
            };
    }
    /** @internal */
    *validate() {
        yield* super.validate();
        const hasInfo = this.document.has('info');
        const allowedChildren = ['contacts', 'registries', 'demands', 'exports', 'requires', 'install'];
        if (hasInfo) {
            // 2022-06-17 and earlier used a separate 'info' block for these fields
            allowedChildren.push('info');
        }
        else {
            allowedChildren.push('version', 'id', 'summary', 'priority', 'description', 'options');
        }
        yield* this.validateChildKeys(allowedChildren);
        if (hasInfo) {
            yield* this.#info.validate();
        }
        else {
            if (!this.has('id')) {
                yield { message: (0, i18n_1.i) `Missing identity '${'id'}'`, range: this, category: error_kind_1.ErrorKind.FieldMissing };
            }
            else if (!this.childIs('id', 'string')) {
                yield { message: (0, i18n_1.i) `id should be of type 'string', found '${this.kind('id')}'`, range: this.sourcePosition('id'), category: error_kind_1.ErrorKind.IncorrectType };
            }
            if (!this.has('version')) {
                yield { message: (0, i18n_1.i) `Missing version '${'version'}'`, range: this, category: error_kind_1.ErrorKind.FieldMissing };
            }
            else if (!this.childIs('version', 'string')) {
                yield { message: (0, i18n_1.i) `version should be of type 'string', found '${this.kind('version')}'`, range: this.sourcePosition('version'), category: error_kind_1.ErrorKind.IncorrectType };
            }
            if (this.childIs('summary', 'string') === false) {
                yield { message: (0, i18n_1.i) `summary should be of type 'string', found '${this.kind('summary')}'`, range: this.sourcePosition('summary'), category: error_kind_1.ErrorKind.IncorrectType };
            }
            if (this.childIs('description', 'string') === false) {
                yield { message: (0, i18n_1.i) `description should be of type 'string', found '${this.kind('description')}'`, range: this.sourcePosition('description'), category: error_kind_1.ErrorKind.IncorrectType };
            }
            if (this.childIs('options', 'sequence') === false) {
                yield { message: (0, i18n_1.i) `options should be a sequence, found '${this.kind('options')}'`, range: this.sourcePosition('options'), category: error_kind_1.ErrorKind.IncorrectType };
            }
        }
        if (this.document.has('contacts')) {
            for (const each of this.contacts.values) {
                yield* each.validate();
            }
        }
        const set = new Set();
        for (const [mediaQuery, demandBlock] of this.conditionalDemands) {
            if (set.has(mediaQuery)) {
                yield { message: (0, i18n_1.i) `Duplicate keys detected in manifest: '${mediaQuery}'`, range: demandBlock, category: error_kind_1.ErrorKind.DuplicateKey };
            }
            set.add(mediaQuery);
            yield* demandBlock.validate();
        }
        yield* this.conditionalDemands.validate();
        yield* this.install.validate();
        yield* this.registries.validate();
        yield* this.contacts.validate();
        yield* this.exports.validate();
        yield* this.requires.validate();
    }
    normalize() {
        if (!this.node) {
            return;
        }
        if (this.document.has('info')) {
            this.setMember('id', this.#info.id);
            this.setMember('version', this.#info.version);
            this.setMember('summary', this.#info.summary);
            this.setMember('description', this.#info.description);
            const maybeOptions = this.#info.options.node?.items;
            if (maybeOptions) {
                for (const option of maybeOptions) {
                    this.#options.set(option.value, true);
                }
            }
            this.setMember('priority', this.#info.priority);
            this.node.delete('info');
        }
    }
    /** @internal */ assert(recreateIfDisposed = false, node = this.node) {
        if (!(0, yaml_1.isMap)(this.node)) {
            this.document = (0, yaml_1.parseDocument)('{}\n', { prettyErrors: false, lineCounter: this.lineCounter, strict: true });
            this.node = this.document.contents;
        }
    }
}
exports.MetadataFile = MetadataFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YWRhdGEtZmlsZS5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJhbWYvbWV0YWRhdGEtZmlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBRWxDLCtCQUErQjtBQUMvQiwrQkFBNEU7QUFDNUUsa0NBQTRCO0FBQzVCLHlEQUFxRDtBQUlyRCw2Q0FBMEM7QUFDMUMsNkNBQTBDO0FBRzFDLHVDQUFxQztBQUNyQyx1Q0FBaUQ7QUFDakQsaUNBQThCO0FBQzlCLDZDQUFxRDtBQUVyRCxNQUFhLFlBQWEsU0FBUSxpQkFBTztJQUNUO0lBQTJDO0lBQWtDO0lBQWtCO0lBQTBDO0lBQXZLLFlBQThCLFFBQXlCLEVBQWtCLFFBQWdCLEVBQWtCLElBQVMsRUFBUyxXQUF3QixFQUFrQixXQUE0QjtRQUNqTSxLQUFLLENBQTRCLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUR4QixhQUFRLEdBQVIsUUFBUSxDQUFpQjtRQUFrQixhQUFRLEdBQVIsUUFBUSxDQUFRO1FBQWtCLFNBQUksR0FBSixJQUFJLENBQUs7UUFBUyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUFrQixnQkFBVyxHQUFYLFdBQVcsQ0FBaUI7SUFHbk0sQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFFBQWdCLEVBQUUsR0FBUSxFQUFFLE9BQWdCLEVBQUUsV0FBaUI7UUFDeEYsT0FBTyxZQUFZLENBQUMsa0JBQWtCLENBQUMsUUFBUSxFQUFFLE1BQU0sR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztJQUMvRixDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxRQUFnQixFQUFFLE9BQWUsRUFBRSxPQUFnQixF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