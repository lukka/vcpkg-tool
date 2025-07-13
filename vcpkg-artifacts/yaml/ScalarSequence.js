"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScalarSequence = void 0;
const yaml_1 = require("yaml");
const error_kind_1 = require("../interfaces/error-kind");
const yaml_types_1 = require("./yaml-types");
/**
 * ScalarSequence is expressed as either a single scalar value or a sequence of scalar values.
 */
class ScalarSequence extends yaml_types_1.Yaml {
    static create() {
        return new yaml_types_1.YAMLScalar('');
    }
    get length() {
        if (this.node) {
            if ((0, yaml_1.isSeq)(this.node)) {
                return this.node.items.length;
            }
            if ((0, yaml_1.isScalar)(this.node)) {
                return 1;
            }
        }
        return 0;
    }
    has(value) {
        for (const each of this) {
            if (value === each) {
                return true;
            }
        }
        return false;
    }
    add(value) {
        if (value === undefined || value === null) {
            throw new Error('Cannot add undefined or null to a sequence');
        }
        // check if the value is already in the set
        if (this.has(value)) {
            return;
        }
        if (!this.node) {
            // if we don't have a node at the moment, we need to create one.
            this.assert(true);
            this.node.value = value;
            return;
        }
        if ((0, yaml_1.isScalar)(this.node)) {
            // this is currently a single item.
            // we need to convert it to a sequence
            const n = this.node;
            const seq = new yaml_types_1.YAMLSequence();
            seq.add(n);
            this.dispose(true);
            this.assert(true, seq);
            // fall thru to the sequnce add
        }
        if ((0, yaml_1.isSeq)(this.node)) {
            this.node.add((new yaml_1.Scalar(value)));
        }
    }
    delete(value) {
        if ((0, yaml_1.isSeq)(this.node)) {
            for (let i = 0; i < this.node.items.length; i++) {
                if (value === this.asPrimitive(this.node.items[i])) {
                    this.node.items.splice(i, 1);
                    return true;
                }
            }
        }
        if ((0, yaml_1.isScalar)(this.node) && this.node.value === value) {
            this.dispose(true);
            return true;
        }
        return false;
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
            return yield this.asPrimitive(this.node.value);
        }
        if ((0, yaml_1.isSeq)(this.node)) {
            for (const each of this.node.items.values()) {
                const v = this.asPrimitive(each);
                if (v !== undefined) {
                    yield v;
                }
            }
        }
    }
    clear() {
        if ((0, yaml_1.isSeq)(this.node)) {
            // just make sure the collection is emptied first
            this.node.items.length = 0;
        }
        this.dispose(true);
    }
    *validate() {
        if (this.node && !(0, yaml_1.isSeq)(this.node) && !(0, yaml_1.isScalar)(this.node)) {
            yield {
                message: `'${this.fullName}' is not an sequence or primitive value`,
                range: this,
                category: error_kind_1.ErrorKind.IncorrectType
            };
        }
    }
}
exports.ScalarSequence = ScalarSequence;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2NhbGFyU2VxdWVuY2UuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21pY3Jvc29mdC92Y3BrZy10b29sL21haW4vdmNwa2ctYXJ0aWZhY3RzLyIsInNvdXJjZXMiOlsieWFtbC9TY2FsYXJTZXF1ZW5jZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBRWxDLCtCQUF3RDtBQUN4RCx5REFBcUQ7QUFFckQsNkNBQXlFO0FBRXpFOztHQUVHO0FBRUgsTUFBOEIsY0FBMkMsU0FBUSxpQkFBMEM7SUFDekgsTUFBTSxDQUFVLE1BQU07UUFDcEIsT0FBTyxJQUFJLHVCQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVELElBQUksTUFBTTtRQUNSLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2QsSUFBSSxJQUFBLFlBQUssRUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFDckIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7WUFDaEMsQ0FBQztZQUNELElBQUksSUFBQSxlQUFRLEVBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQ3hCLE9BQU8sQ0FBQyxDQUFDO1lBQ1gsQ0FBQztRQUNILENBQUM7UUFDRCxPQUFPLENBQUMsQ0FBQztJQUNYLENBQUM7SUFFRCxHQUFHLENBQUMsS0FBZTtRQUNqQixLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ3hCLElBQUksS0FBSyxLQUFLLElBQUksRUFBRSxDQUFDO2dCQUNuQixPQUFPLElBQUksQ0FBQztZQUNkLENBQUM7UUFDSCxDQUFDO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsR0FBRyxDQUFDLEtBQWU7UUFDakIsSUFBSSxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssS0FBSyxJ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