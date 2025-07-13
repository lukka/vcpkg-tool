"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const yaml_1 = require("yaml");
const checks_1 = require("../util/checks");
const yaml_types_1 = require("./yaml-types");
/** An object that is backed by a YamlMAP node */
class Entity extends yaml_types_1.Yaml {
    /**@internal*/ static create() {
        return new yaml_types_1.YAMLDictionary();
    }
    setMember(name, value) {
        this.assert(true);
        if ((0, checks_1.isNullish)(value)) {
            this.node.delete(name);
            return;
        }
        this.node.set(name, new yaml_1.Scalar(value));
    }
    getMember(name) {
        return this.exists() ? this.node?.get(name, false) : undefined;
    }
    *validate() {
        yield* super.validate();
        yield* this.validateIsObject();
    }
    has(key, kind) {
        if (this.node) {
            switch (kind) {
                case 'sequence':
                    return (0, yaml_1.isSeq)(this.node.get(key));
                case 'entity':
                    return (0, yaml_1.isMap)(this.node.get(key));
                case 'scalar':
                    return (0, yaml_1.isScalar)(this.node.get(key));
                default:
                    return this.node.has(key);
            }
        }
        return false;
    }
    kind(key) {
        if (this.node) {
            const v = this.node.get(key, true);
            if (v === undefined) {
                return 'undefined';
            }
            if ((0, yaml_1.isSeq)(v)) {
                return 'sequence';
            }
            else if ((0, yaml_1.isMap)(v)) {
                return 'entity';
            }
            else if ((0, yaml_1.isScalar)(v)) {
                if (typeof v.value === 'string') {
                    return 'string';
                }
                else if (typeof v.value === 'number') {
                    return 'number';
                }
                else if (typeof v.value === 'boolean') {
                    return 'boolean';
                }
            }
        }
        return undefined;
    }
    childIs(key, kind) {
        if (this.node) {
            const v = this.node.get(key, true);
            if (v === undefined) {
                return undefined;
            }
            switch (kind) {
                case 'sequence':
                    return (0, yaml_1.isSeq)(v);
                case 'entity':
                    return (0, yaml_1.isMap)(v);
                case 'scalar':
                    return (0, yaml_1.isScalar)(v);
                case 'string':
                    return (0, yaml_1.isScalar)(v) && typeof v.value === 'string';
                case 'number':
                    return (0, yaml_1.isScalar)(v) && typeof v.value === 'number';
                case 'boolean':
                    return (0, yaml_1.isScalar)(v) && typeof v.value === 'boolean';
            }
        }
        return false;
    }
}
exports.Entity = Entity;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW50aXR5LmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9taWNyb3NvZnQvdmNwa2ctdG9vbC9tYWluL3ZjcGtnLWFydGlmYWN0cy8iLCJzb3VyY2VzIjpbInlhbWwvRW50aXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1Q0FBdUM7QUFDdkMsa0NBQWtDOzs7QUFFbEMsK0JBQXNEO0FBRXRELDJDQUEyQztBQUMzQyw2Q0FBcUU7QUFFckUsaURBQWlEO0FBRWpELE1BQThCLE1BQU8sU0FBUSxpQkFBb0I7SUFDL0QsY0FBYyxDQUFDLE1BQU0sQ0FBVSxNQUFNO1FBQ25DLE9BQU8sSUFBSSwyQkFBYyxFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVTLFNBQVMsQ0FBQyxJQUFZLEVBQUUsS0FBNEI7UUFDNUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVsQixJQUFJLElBQUEsa0JBQVMsRUFBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZCLE9BQU87UUFDVCxDQUFDO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksYUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVTLFNBQVMsQ0FBQyxJQUFZO1FBQzlCLE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBd0IsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDeEYsQ0FBQztJQUV5QixDQUFDLFFBQVE7UUFDakMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3hCLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxD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