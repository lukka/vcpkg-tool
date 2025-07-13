"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntitySequence = void 0;
const yaml_1 = require("yaml");
const yaml_types_1 = require("./yaml-types");
/**
 * EntitySequence is expressed as either a single entity or a sequence of entities.
 */
class EntitySequence extends yaml_types_1.Yaml {
    factory;
    constructor(factory, node, parent, key) {
        super(node, parent, key);
        this.factory = factory;
    }
    static create() {
        return new yaml_types_1.YAMLDictionary();
    }
    get length() {
        if (this.node) {
            if ((0, yaml_1.isSeq)(this.node)) {
                return this.node.items.length;
            }
            if ((0, yaml_1.isMap)(this.node)) {
                return 1;
            }
        }
        return 0;
    }
    add(value) {
        if (value === undefined || value === null) {
            throw new Error('Cannot add undefined or null to a sequence');
        }
        if (value.empty) {
            throw new Error('Cannot add an empty entity to a sequence');
        }
        if (!this.node) {
            // if we don't have a node at the moment, we need to create one.
            this.assert(true, value.node);
            return;
        }
        if ((0, yaml_1.isMap)(this.node)) {
            // this is currently a single item.
            // we need to convert it to a sequence
            const n = this.node;
            const seq = new yaml_types_1.YAMLSequence();
            seq.add(n);
            this.node = seq;
            // fall thru to the sequnce add
        }
        if ((0, yaml_1.isSeq)(this.node)) {
            this.node.add(value.node);
            return;
        }
    }
    get(index) {
        if ((0, yaml_1.isSeq)(this.node)) {
            return this.node.items[index];
        }
        if ((0, yaml_1.isScalar)(this.node) && index === 0) {
            return this.node.value;
        }
        return undefined;
    }
    *[Symbol.iterator]() {
        if ((0, yaml_1.isScalar)(this.node)) {
            return yield new this.factory(this.node);
        }
        yield* EntitySequence.generator(this);
    }
    clear() {
        if ((0, yaml_1.isSeq)(this.node)) {
            // just make sure the collection is emptied first
            this.node.items.length = 0;
        }
        this.dispose(true);
    }
    static *generator(sequence) {
        if ((0, yaml_1.isSeq)(sequence.node)) {
            for (const item of sequence.node.items) {
                yield new sequence.factory(item);
            }
        }
    }
}
exports.EntitySequence = EntitySequence;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW50aXR5U2VxdWVuY2UuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21pY3Jvc29mdC92Y3BrZy10b29sL21haW4vdmNwa2ctYXJ0aWZhY3RzLyIsInNvdXJjZXMiOlsieWFtbC9FbnRpdHlTZXF1ZW5jZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBRWxDLCtCQUE4QztBQUM5Qyw2Q0FBaUY7QUFFakY7O0dBRUc7QUFFSCxNQUE4QixjQUFzRCxTQUFRLGlCQUFtQztJQUM3RjtJQUFoQyxZQUFnQyxPQUFnRCxFQUFFLElBQXFCLEVBQUUsTUFBYSxFQUFFLEdBQVk7UUFDbEksS0FBSyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFESyxZQUFPLEdBQVAsT0FBTyxDQUF5QztJQUVoRixDQUFDO0lBRUQsTUFBTSxDQUFVLE1BQU07UUFDcEIsT0FBTyxJQUFJLDJCQUFjLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBQ0QsSUFBSSxNQUFNO1FBQ1IsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZCxJQUFJLElBQUEsWUFBSyxFQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUNyQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztZQUNoQyxDQUFDO1lBQ0QsSUFBSSxJQUFBLFlBQUssRUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFDckIsT0FBTyxDQUFDLENBQUM7WUFDWCxDQUFDO1FBQ0gsQ0FBQztRQUNELE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVELEdBQUcsQ0FBQyxLQUFlO1FBQ2pCLElBQUksS0FBSyxLQUFLLFNBQVMsSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDMUMsTUFBTSxJQUFJLEtBQUssQ0FBQyw0Q0FBNEMsQ0FB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