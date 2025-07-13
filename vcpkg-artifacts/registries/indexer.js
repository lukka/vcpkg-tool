"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexSchema = exports.SemverKey = exports.IdentityKey = exports.StringKey = exports.Index = void 0;
const semver_1 = require("semver");
const sorted_btree_1 = require("sorted-btree");
const i18n_1 = require("../i18n");
const checks_1 = require("../util/checks");
const linq_1 = require("../util/linq");
/**
 * An Index is the means to search a registry
 *
 * @param TGraph The type of object to create an index for
 * @param TIndexSchema the custom index schema (layout).
 */
class Index {
    indexConstructor;
    /** @internal */
    indexSchema;
    /** @internal */
    indexOfTargets = new Array();
    /**
     * Creates an index for fast searching.
     *
     * @param indexConstructor the class for the custom index.
     */
    constructor(indexConstructor) {
        this.indexConstructor = indexConstructor;
        this.indexSchema = new indexConstructor(this);
    }
    reset() {
        this.indexSchema = new this.indexConstructor(this);
    }
    /**
     * Serializes the index to a javascript object graph that can be persisted.
     */
    serialize() {
        return {
            items: this.indexOfTargets,
            indexes: this.indexSchema.serialize()
        };
    }
    /**
     * Deserializes an object graph to the expected indexes.
     *
     * @param content the object graph to deserialize.
     */
    deserialize(content) {
        this.indexOfTargets = content.items;
        this.indexSchema.deserialize(content.indexes);
    }
    /**
     * Returns a clone of the index that can be searched, which narrows the list of
     */
    get where() {
        // clone the index so that the consumer can filter on it.
        const index = new Index(this.indexConstructor);
        index.indexOfTargets = this.indexOfTargets;
        for (const [key, impl] of this.indexSchema.mapOfKeyObjects.entries()) {
            index.indexSchema.mapOfKeyObjects.get(key).cloneKey(impl);
        }
        return index.indexSchema;
    }
    /** inserts an object into the index */
    insert(content, target) {
        const n = this.indexOfTargets.push(target) - 1;
        const start = process.uptime() * 1000;
        for (const indexKey of this.indexSchema.mapOfKeyObjects.values()) {
            indexKey.insert(content, n);
        }
    }
    doneInsertion() {
        for (const indexKey of this.indexSchema.mapOfKeyObjects.values()) {
            indexKey.doneInsertion();
        }
    }
}
exports.Index = Index;
/**
 * A Key is a means to creating a searchable, sortable index
 */
class Key {
    accessor;
    nestedKeys = new Array();
    values = new sorted_btree_1.default(undefined, this.compare);
    words = new sorted_btree_1.default();
    indexSchema;
    identity;
    alternativeIdentities;
    /** persists the key to an object graph */
    serialize() {
        const result = {
            keys: {},
            words: {},
        };
        for (const each of this.values.entries()) {
            result.keys[each[0]] = [...each[1]];
        }
        for (const each of this.words.entries()) {
            result.words[each[0]] = [...each[1]];
        }
        return result;
    }
    /** deserializes an object graph back into this key */
    deserialize(content) {
        for (const [key, ids] of (0, linq_1.entries)(content.keys)) {
            this.values.set(this.coerce(key), new Set(ids));
        }
        for (const [key, ids] of (0, linq_1.entries)(content.words)) {
            this.words.set(key, new Set(ids));
        }
    }
    /** @internal */
    cloneKey(from) {
        this.values = from.values.greedyClone();
        this.words = from.words.greedyClone();
    }
    /** adds key value to this Key */
    addKey(each, n) {
        let set = this.values.get(each);
        if (!set) {
            set = new Set();
            this.values.set(each, set);
        }
        set.add(n);
    }
    /** adds a 'word' value to this key  */
    addWord(each, n) {
        const words = each.toString().split(/(\W+)/g);
        for (let word = 0; word < words.length; word += 2) {
            for (let i = word; i < words.length; i += 2) {
                const s = words.slice(word, i + 1).join('');
                if (s && s.indexOf(' ') === -1) {
                    let set = this.words.get(s);
                    if (!set) {
                        set = new Set();
                        this.words.set(s, set);
                    }
                    set.add(n);
                }
            }
        }
    }
    /** processes an object to generate key/word values for it. */
    insert(graph, n) {
        let value = this.accessor(graph);
        if (value) {
            value = (Array.isArray(value) ? value
                : typeof value === 'string' ? [value]
                    : (0, checks_1.isIterable)(value) ? [...value] : [value]);
            this.insertKey(graph, n, value);
        }
    }
    /** insert the key/word values and process any children */
    insertKey(graph, n, value) {
        if ((0, checks_1.isIterable)(value)) {
            for (const each of value) {
                this.addKey(each, n);
                this.addWord(each, n);
                if (this.nestedKeys) {
                    for (const child of this.nestedKeys) {
                        const v = child.accessor(graph, each.toString());
                        if (v) {
                            child.insertKey(graph, n, v);
                        }
                    }
                }
            }
        }
        else {
            this.addKey(value, n);
            this.addWord(value, n);
        }
    }
    /** construct a Key */
    constructor(indexSchema, accessor, protoIdentity) {
        this.accessor = accessor;
        this.indexSchema = indexSchema;
        if (typeof protoIdentity === 'string') {
            this.identity = protoIdentity;
            this.alternativeIdentities = [protoIdentity];
        }
        else {
            this.identity = protoIdentity[0];
            this.alternativeIdentities = protoIdentity;
        }
        this.indexSchema.mapOfKeyObjects.set(this.identity, this);
    }
    /** word search */
    contains(value) {
        if (value !== undefined && value !== '') {
            const matches = this.words.get(value.toString());
            this.indexSchema.filter(matches || []);
        }
        return this.indexSchema;
    }
    /** exact match search */
    equals(value) {
        if (value !== undefined && value !== '') {
            const matches = this.values.get(this.coerce(value));
            this.indexSchema.filter(matches || []);
        }
        return this.indexSchema;
    }
    /** metadata value is greater than search */
    greaterThan(value) {
        const max = this.values.maxKey();
        const set = new Set();
        if (max && value !== undefined && value !== '') {
            this.values.forRange(this.coerce(value), max, true, (k, v) => {
                for (const n of v) {
                    set.add(n);
                }
            });
        }
        this.indexSchema.filter(set.values());
        return this.indexSchema;
    }
    /** metadata value is less than search */
    lessThan(value) {
        const min = this.values.minKey();
        const set = new Set();
        if (min && value !== undefined && value !== '') {
            value = this.coerce(value);
            this.values.forRange(min, this.coerce(value), false, (k, v) => {
                for (const n of v) {
                    set.add(n);
                }
            });
        }
        this.indexSchema.filter(set.values());
        return this.indexSchema;
    }
    /** regex search -- WARNING: slower */
    match(regex) {
        // This could be faster if we stored a reverse lookup
        // array that had the id for each key, but .. I don't
        // think the perf will suffer much doing it this way.
        const set = new Set();
        for (const node of this.values.entries()) {
            for (const id of node[1]) {
                if (!this.indexSchema.selectedElements || this.indexSchema.selectedElements.has(id)) {
                    // it's currently in the keep list.
                    if (regex.match(node.toString())) {
                        set.add(id);
                    }
                }
            }
        }
        this.indexSchema.filter(set.values());
        return this.indexSchema;
    }
    /** substring match -- slower */
    startsWith(value) {
        // ok, I'm being lazy here. I can add a check to see if we're past
        // the point where this could be a match, but I don't know if I'll
        // even need this enough to keep it.
        const set = new Set();
        for (const node of this.values.entries()) {
            for (const id of node[1]) {
                if (!this.indexSchema.selectedElements || this.indexSchema.selectedElements.has(id)) {
                    // it's currently in the keep list.
                    if (node[0].toString().startsWith(value.toString())) {
                        set.add(id);
                    }
                }
            }
        }
        this.indexSchema.filter(set.values());
        return this.indexSchema;
    }
    /** substring match -- slower */
    endsWith(value) {
        // Same thing here, but I'd have to do a reversal of all the strings.
        const set = new Set();
        for (const node of this.values.entries()) {
            for (const id of node[1]) {
                if (!this.indexSchema.selectedElements || this.indexSchema.selectedElements.has(id)) {
                    // it's currently in the keep list.
                    if (node[0].toString().endsWith(value.toString())) {
                        set.add(id);
                    }
                }
            }
        }
        this.indexSchema.filter(set.values());
        return this.indexSchema;
    }
    doneInsertion() {
        // nothing normally
    }
}
/** An  key for string values. */
class StringKey extends Key {
    compare(a, b) {
        if (a && b) {
            return a.localeCompare(b);
        }
        if (a) {
            return 1;
        }
        if (b) {
            return -1;
        }
        return 0;
    }
    /** impl: transform value into comparable key */
    coerce(value) {
        return value;
    }
}
exports.StringKey = StringKey;
function shortName(value, n) {
    const v = value.split('/');
    let p = v.length - n;
    if (p < 0) {
        p = 0;
    }
    return v.slice(p).join('/');
}
class IdentityKey extends StringKey {
    identities = new sorted_btree_1.default(undefined, this.compare);
    idShortName = new Map();
    doneInsertion() {
        // go thru each of the values, find short name for each.
        const ids = new linq_1.ManyMap();
        for (const idAndIndexNumber of this.values.entries()) {
            ids.push(shortName(idAndIndexNumber[0], 1), idAndIndexNumber);
        }
        let n = 1;
        while (ids.size > 0) {
            n++;
            for (const [snKey, artifacts] of [...ids.entries()]) {
                // remove it from the list.
                ids.delete(snKey);
                if (artifacts.length === 1) {
                    // keep this one, it's unique
                    this.identities.set(snKey, artifacts[0][1]);
                    this.idShortName.set(artifacts[0][0], snKey);
                }
                else {
                    for (const each of artifacts) {
                        ids.push(shortName(each[0], n), each);
                    }
                }
            }
        }
    }
    /** @internal */
    cloneKey(from) {
        super.cloneKey(from);
        this.identities = from.identities.greedyClone();
        this.idShortName = new Map(from.idShortName);
    }
    getShortNameOf(id) {
        return this.idShortName.get(id);
    }
    nameOrShortNameIs(value) {
        if (value !== undefined && value !== '') {
            const matches = this.identities.get(value);
            if (matches) {
                this.indexSchema.filter(matches);
            }
            else {
                return this.equals(value);
            }
        }
        return this.indexSchema;
    }
    /** deserializes an object graph back into this key */
    deserialize(content) {
        super.deserialize(content);
        this.doneInsertion();
    }
}
exports.IdentityKey = IdentityKey;
/** An key for string values. Does not support 'word' searches */
class SemverKey extends Key {
    compare(a, b) {
        return a.compare(b);
    }
    coerce(value) {
        if (typeof value === 'string') {
            return new semver_1.SemVer(value);
        }
        return value;
    }
    addWord(each, n) {
        // no parts
    }
    rangeMatch(value) {
        // This could be faster if we stored a reverse lookup
        // array that had the id for each key, but .. I don't
        // think the perf will suffer much doing it this way.
        const set = new Set();
        const range = new semver_1.Range(value);
        for (const node of this.values.entries()) {
            for (const id of node[1]) {
                if (!this.indexSchema.selectedElements || this.indexSchema.selectedElements.has(id)) {
                    // it's currently in the keep list.
                    if (range.test(node[0])) {
                        set.add(id);
                    }
                }
            }
        }
        this.indexSchema.filter(set.values());
        return this.indexSchema;
    }
    serialize() {
        const result = super.serialize();
        result.words = undefined;
        return result;
    }
}
exports.SemverKey = SemverKey;
/**
 * Base class for a custom IndexSchema
 *
 * @param TGraph - the object kind to be indexing
 * @param TSelf - the child class that is being constructed.
 */
class IndexSchema {
    index;
    /** the collection of keys in this IndexSchema */
    mapOfKeyObjects = new Map();
    /**
     * the selected element ids.
     *
     * if this is `undefined`, the whole set is currently selected
     */
    selectedElements;
    /**
     * filter the selected elements down to an intersection of the {selectedelements} ∩ {idsToKeep}
     *
     * @param idsToKeep the element ids to intersect with.
     */
    filter(idsToKeep) {
        if (this.selectedElements) {
            const selected = new Set();
            for (const each of idsToKeep) {
                if (this.selectedElements.has(each)) {
                    selected.add(each);
                }
            }
            this.selectedElements = selected;
        }
        else {
            this.selectedElements = new Set(idsToKeep);
        }
    }
    /**
     * Serializes this IndexSchema to a persistable object graph.
     */
    serialize() {
        const result = {};
        for (const [key, impl] of this.mapOfKeyObjects.entries()) {
            result[key] = impl.serialize();
        }
        return result;
    }
    /**
     * Deserializes a persistable object graph into the IndexSchema.
     *
     * replaces any existing data in the IndexSchema.
     * @param content the persistable object graph.
     */
    deserialize(content) {
        for (const [key, impl] of this.mapOfKeyObjects.entries()) {
            let anyMatches = false;
            for (const maybeIdentity of impl.alternativeIdentities) {
                const maybeKey = content[maybeIdentity];
                if (maybeKey) {
                    impl.deserialize(maybeKey);
                    anyMatches = true;
                    break;
                }
            }
            if (!anyMatches) {
                throw new Error((0, i18n_1.i) `Failed to deserialize index ${key}`);
            }
        }
    }
    /**
     * returns the selected
     */
    get items() {
        return this.selectedElements ? [...this.selectedElements].map(each => this.index.indexOfTargets[each]) : this.index.indexOfTargets;
    }
    /** @internal */
    constructor(index) {
        this.index = index;
    }
}
exports.IndexSchema = IndexSchema;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhlci5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJyZWdpc3RyaWVzL2luZGV4ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF1QztBQUN2QyxrQ0FBa0M7OztBQUVsQyxtQ0FBdUM7QUFDdkMsK0NBQWlDO0FBQ2pDLGtDQUE0QjtBQUM1QiwyQ0FBNEM7QUFDNUMsdUNBQWdEO0FBU2hEOzs7OztHQUtHO0FBQ0gsTUFBYSxLQUFLO0lBV007SUFWdEIsZ0JBQWdCO0lBQ2hCLFdBQVcsQ0FBZTtJQUMxQixnQkFBZ0I7SUFDaEIsY0FBYyxHQUFHLElBQUksS0FBSyxFQUFVLENBQUM7SUFFckM7Ozs7T0FJRztJQUNILFlBQXNCLGdCQUEwRTtRQUExRSxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQTBEO1FBQzlGLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsS0FBSztRQUNILElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsU0FBUztRQUNQLE9BQU87WUFDTCxLQUFLLEVBQUUsSUFBSSxDQUFDLGNBQWM7WUFDMUIsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFO1NBQ3RDLENBQUM7SUFDSixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILFdBQVcsQ0FBQyxPQUFZO1FBQ3RCLElBQUksQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUNwQyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVEOztPQUVH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