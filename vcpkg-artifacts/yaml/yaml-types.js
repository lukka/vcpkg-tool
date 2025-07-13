"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yaml = exports.YAMLScalar = exports.YAMLSequence = exports.YAMLDictionary = void 0;
const yaml_1 = require("yaml");
const error_kind_1 = require("../interfaces/error-kind");
const checks_1 = require("../util/checks");
class YAMLDictionary extends yaml_1.YAMLMap {
}
exports.YAMLDictionary = YAMLDictionary;
class YAMLSequence extends yaml_1.YAMLSeq {
}
exports.YAMLSequence = YAMLSequence;
class YAMLScalar extends yaml_1.Scalar {
}
exports.YAMLScalar = YAMLScalar;
class Yaml {
    parent;
    key;
    constructor(/** @internal */ node, parent, key) {
        this.parent = parent;
        this.key = key;
        this.node = node;
        if (!(this.constructor).create) {
            throw new Error(`class ${this.constructor.name} is missing implementation for create`);
        }
    }
    get fullName() {
        return !this.node ? '' : this.parent ? this.key ? `${this.parent.fullName}.${this.key}` : this.parent.fullName : this.key || '$';
    }
    /** returns the current node as a JSON string */
    toString() {
        return this.node?.toJSON() ?? '';
    }
    get keys() {
        return this.exists() && (0, yaml_1.isMap)(this.node) ? this.node.items.map(each => this.asString(each.key)) : [];
    }
    /**
     * Coercion function to string
     *
     * This will pass the coercion up to the parent if it exists
     * (or otherwise overridden in the subclass)
     *
     * Which allows for value overriding
     */
    asString(value) {
        if (this.parent) {
            return this.parent.asString(value);
        }
        return value === undefined ? undefined : ((0, yaml_1.isScalar)(value) ? value.value : value).toString();
    }
    /**
     * Coercion function to number
     *
     * This will pass the coercion up to the parent if it exists
     * (or otherwise overridden in the subclass)
     *
     * Which allows for value overriding
     */
    asNumber(value) {
        if (this.parent) {
            return this.parent.asNumber(value);
        }
        if ((0, yaml_1.isScalar)(value)) {
            value = value.value;
        }
        return typeof value === 'number' ? value : undefined;
    }
    /**
     * Coercion function to boolean
     *
     * This will pass the coercion up to the parent if it exists
     * (or otherwise overridden in the subclass)
     *
     * Which allows for value overriding
     */
    asBoolean(value) {
        if (this.parent) {
            return this.parent.asBoolean(value);
        }
        if ((0, yaml_1.isScalar)(value)) {
            value = value.value;
        }
        return typeof value === 'boolean' ? value : undefined;
    }
    /**
     * Coercion function to any primitive
     *
     * This will pass the coercion up to the parent if it exists
     * (or otherwise overridden in the subclass)
     *
     * Which allows for value overriding
     */
    asPrimitive(value) {
        if (this.parent) {
            return this.parent.asPrimitive(value);
        }
        if ((0, yaml_1.isScalar)(value)) {
            value = value.value;
        }
        switch (typeof value) {
            case 'boolean':
            case 'number':
            case 'string':
                return value;
        }
        return undefined;
    }
    get root() {
        return this.parent ? this.parent.root : this;
    }
    createNode() {
        return this.constructor.create();
    }
    /**@internal*/ static create() {
        throw new Error('creator not Not implemented on base class.');
    }
    _node;
    get node() {
        if (this._node) {
            return this._node;
        }
        if (this.key && this.parent && (0, yaml_1.isMap)(this.parent?.node)) {
            this._node = this.parent.node.get(this.key, true);
        }
        return this._node;
    }
    set node(n) {
        this._node = n;
    }
    sourcePosition(key) {
        if (!this.node) {
            return undefined;
        }
        if (key !== undefined) {
            if (((0, yaml_1.isMap)(this.node) || (0, yaml_1.isSeq)(this.node))) {
                const node = this.node.get(key, true);
                if (node) {
                    return node.range || undefined;
                }
                return undefined;
            }
            if ((0, yaml_1.isScalar)(this.node)) {
                throw new Error('Scalar does not have a key to get a source position');
            }
        }
        return this.node?.range || undefined;
    }
    /** will dispose of this object if it is empty (or forced) */
    dispose(force = false, deleteFromParent = true) {
        if ((this.empty || force) && this.node) {
            if (deleteFromParent) {
                this.parent?.deleteChild(this);
            }
            this.node = undefined;
        }
    }
    /** if this node has any data, this should return false */
    get empty() {
        if ((0, yaml_1.isCollection)(this.node)) {
            return !(this.node?.items.length);
        }
        else if ((0, yaml_1.isScalar)(this.node)) {
            return !(0, checks_1.isNullish)(this.node.value);
        }
        return false;
    }
    /** @internal */ exists() {
        if (this.node) {
            return true;
        }
        // well, if we're lazy and haven't instantiated it yet, check if it's created.
        if (this.key && this.parent && (0, yaml_1.isMap)(this.parent.node)) {
            this.node = this.parent.node.get(this.key);
            if (this.node) {
                return true;
            }
        }
        return false;
    }
    /** @internal */ assert(recreateIfDisposed = false, node = this.node) {
        if (this.node && this.node === node) {
            return; // quick and fast
        }
        if (recreateIfDisposed) {
            // ensure that this node is the node we're supposed to be.
            this.node = node;
            if (this.parent) {
                // ensure that the parent is not disposed
                this.parent.assert(true);
                if ((0, yaml_1.isMap)(this.parent.node)) {
                    if (this.key) {
                        // we have a parent, and the key, we can add the node.
                        // let's just check if there is one first
                        this.node = this.node || this.parent.node.get(this.key) || this.createNode();
                        this.parent.node.set(this.key, this.node);
                        return;
                    }
                    // the parent is a map, but we don't have a key, so we can't add the node.
                    throw new Error('Parent is a map, but we don\'t have a key');
                }
                if ((0, yaml_1.isSeq)(this.parent.node)) {
                    this.node = this.node || this.parent.node.get(this.key) || this.createNode();
                    this.parent.node.add(this.node);
                    return;
                }
                throw new Error('YAML parent is not a container.');
            }
        }
        throw new Error('YAML node is undefined');
    }
    deleteChild(child) {
        if (!child.node) {
            // this child is already disposed
            return;
        }
        this.assert();
        const node = this.node;
        if ((0, yaml_1.isMap)(node)) {
            if (child.key) {
                node.delete(child.key);
                child.dispose(true, false);
                this.dispose(); // clean up if this is empty
                return;
            }
        }
        if ((0, yaml_1.isSeq)(node)) {
            // child is in some kind of collection.
            // we should be able to find the child's index and remove it.
            const items = node.items;
            for (let i = 0; i < items.length; i++) {
                if (items[i] === child.node) {
                    node.delete(i);
                    child.dispose(true, false);
                    this.dispose(); // clean up if this is empty
                    return;
                }
            }
            // if we get here, we didn't find the child.
            // but, it's not in the object, so we're good I guess
            throw new Error('Child Node not found trying to delete');
            // return;
        }
        throw new Error('this node does not have children.');
    }
    *validate() {
        // shh.
    }
    *validateChildKeys(keys) {
        if ((0, yaml_1.isMap)(this.node)) {
            for (const key of this.keys) {
                if (keys.indexOf(key) === -1) {
                    yield {
                        message: `Unexpected '${key}' found in ${this.fullName}`,
                        range: this.sourcePosition(key),
                        category: error_kind_1.ErrorKind.InvalidChild,
                    };
                }
            }
        }
    }
    *validateIsObject() {
        if (this.node && !(0, yaml_1.isMap)(this.node)) {
            yield {
                message: `'${this.fullName}' is not an object`,
                range: this,
                category: error_kind_1.ErrorKind.IncorrectType
            };
        }
    }
    *validateIsSequence() {
        if (this.node && !(0, yaml_1.isSeq)(this.node)) {
            yield {
                message: `'${this.fullName}' is not an object`,
                range: this,
                category: error_kind_1.ErrorKind.IncorrectType
            };
        }
    }
    *validateIsSequenceOrPrimitive() {
        if (this.node && (!(0, yaml_1.isSeq)(this.node) && !(0, yaml_1.isScalar)(this.node))) {
            yield {
                message: `'${this.fullName}' is not a sequence or value`,
                range: this,
                category: error_kind_1.ErrorKind.IncorrectType
            };
        }
    }
    *validateIsObjectOrPrimitive() {
        if (this.node && (!(0, yaml_1.isMap)(this.node) && !(0, yaml_1.isScalar)(this.node))) {
            yield {
                message: `'${this.fullName}' is not an object or value`,
                range: this,
                category: error_kind_1.ErrorKind.IncorrectType
            };
        }
    }
    *validateChild(child, kind) {
        if (this.node && (0, yaml_1.isMap)(this.node)) {
            if (this.node.has(child)) {
                const c = this.node.get(child, true);
                if (!(0, yaml_1.isScalar)(c) || typeof c.value !== kind) {
                    yield {
                        message: `'${this.fullName}.${child}' is not a ${kind} value`,
                        range: c.range,
                        category: error_kind_1.ErrorKind.IncorrectType
                    };
                }
            }
        }
    }
}
exports.Yaml = Yaml;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieWFtbC10eXBlcy5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJ5YW1sL3lhbWwtdHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF1QztBQUN2QyxrQ0FBa0M7OztBQUVsQywrQkFBc0Y7QUFDdEYseURBQXFEO0FBRXJELDJDQUEyQztBQUUzQyxNQUFhLGNBQWUsU0FBUSxjQUFvQjtDQUFJO0FBQTVELHdDQUE0RDtBQUM1RCxNQUFhLFlBQWEsU0FBUSxjQUFZO0NBQUk7QUFBbEQsb0NBQWtEO0FBQ2xELE1BQWEsVUFBVyxTQUFRLGFBQVc7Q0FBSTtBQUEvQyxnQ0FBK0M7QUFLL0MsTUFBdUMsSUFBSTtJQUNlO0lBQStCO0lBQXZGLFlBQVksZ0JBQWdCLENBQUMsSUFBZSxFQUFZLE1BQW1CLEVBQVksR0FBWTtRQUEzQyxXQUFNLEdBQU4sTUFBTSxDQUFhO1FBQVksUUFBRyxHQUFILEdBQUcsQ0FBUztRQUNqRyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQXlCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3hELE1BQU0sSUFBSSxLQUFLLENBQUMsU0FBUyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksdUNBQXVDLENBQUMsQ0FBQztRQUN6RixDQUFDO0lBQ0gsQ0FBQztJQUVELElBQUksUUFBUTtRQUNWLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUM7SUFDbkksQ0FBQztJQUVELGdEQUFnRDtJQUNoRCxRQUFRO1FBQ04sT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUNuQyxDQUFDO0lBRUQsSUFBSSxJQUFJO1FBQ04sT0FBTyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksSUFBQSxZQUFLLEVBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDeEcsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDTyxRQUFRLENBQUMsS0FBVTtRQUMzQixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNoQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFFRCxPQUFPLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFBLGVBQVEsRUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDOUYsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxRQUFRLENBQUMsS0FBVTtRQUNqQixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNoQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFFRCxJQUFJLElBQUEsZUFBUSxFQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDcEIsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDdEIsQ0FBQztRQUNELE9BQU8sT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUN2RCxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILFNBQVMsQ0FBQyxLQUFVO1FBQ2xCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2hCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEMsQ0FBQztRQUVELElBQUksSUFBQSxlQUFRLEVBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUNwQixLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUN0QixDQUFDO1FBQ0QsT0FBTyxPQUFPLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQ3hELENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsV0FBVyxDQUFDLEtBQVU7UUFDcEIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDaEIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QyxDQUFDO1FBRUQsSUFBSSxJQUFBLGVBQVEsRUFBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ3BCLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ3RCLENBQUM7UUFDRCxRQUFRLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDckIsS0FBSyxTQUFTLENBQUM7WUFDZixLQUFLLFFBQVEsQ0FBQztZQUNkLEtBQUssUUFBUTtnQkFDWCxPQUFPLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBQ0QsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUdELElBQUksSUFBSTtRQUNOLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUMvQyxDQUFDO0lBRVMsVUFBVTtRQUNsQixPQUErQixJQUFJLENBQUMsV0FBWSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzVELENBQUM7SUFFRCxjQUFjLENBQUMsTUFBTSxDQUFDLE1BQU07UUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFTyxLQUFLLENBQXVCO0lBRXBDLElBQUksSUFBSTtRQUNOLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2YsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3BCLENBQUM7UUFFRCxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFBLFlBQUssRUFBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDeEQsSUFBSSxDQUFDLEtBQUssR0FBYSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM5RCxDQUFDO1FBRUQsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3BCLENBQUM7SUFFRCxJQUFJLElBQUksQ0FBQyxDQUF1QjtRQUM5QixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztJQUNqQixDQUFDO0lBRUQsY0FBYyxDQUFDLEdBQXFCO1FBQ2xDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZixPQUFPLFNBQVMsQ0FBQztRQUNuQixDQUFDO1FBQ0QsSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDdEIsSUFBSSxDQUFDLElBQUEsWUFBSyxFQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFBLFlBQUssRUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUMzQyxNQUFNLElBQUksR0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBTSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ2pELElBQUksSUFBSSxFQUFFLENBQUM7b0JBQ1QsT0FBTyxJQUFJLENBQUMsS0FBSyxJQUFJLFNBQVMsQ0FBQztnQkFDakMsQ0FBQztnQkFDRCxPQUFPLFNBQVMsQ0FBQztZQUNuQixDQUFDO1lBQ0QsSUFBSSxJQUFBLGVBQVEsRUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxxREFBcUQsQ0FBQyxDQUFDO1lBQ3pFLENBQUM7UUFDSCxDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssSUFBSSxTQUFTLENBQUM7SUFDdkMsQ0FBQztJQUVELDZEQUE2RDtJQUM3RCxPQUFPLENBQUMsS0FBSyxHQUFHLEtBQUssRUFBRSxnQkFBZ0IsR0FBRyxJQUFJO1FBQzVDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN2QyxJQUFJLGdCQUFnQixFQUFFLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2pDLENBQUM7WUFDRCxJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztRQUN4QixDQUFDO0lBQ0gsQ0FBQztJQUVELDBEQUEwRDtJQUMxRCxJQUFJLEtBQUs7UUFDTCxJQUFJLElBQUEsbUJBQVksRUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUMxQixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0QyxDQUFDO2FBQU0sSUFBSSxJQUFBLGVBQVEsRUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUM3QixPQUFPLENBQUMsSUFBQSxrQkFBUyxFQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkMsQ0FBQztRQUVELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxNQUFNO1FBQ3JCLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2QsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBQ0QsOEVBQThFO1FBQzlFLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUEsWUFBSyxFQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUN2RCxJQUFJLENBQUMsSUFBSSxHQUFhLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDckQsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2QsT0FBTyxJQUFJLENBQUM7WUFDZCxDQUFDO1FBQ0gsQ0FBQztRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUNELGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLEVBQUUsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJO1FBQ2xFLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRSxDQUFDO1lBQ3BDLE9BQU8sQ0FBQyxpQkFBaUI7UUFDM0IsQ0FBQztRQUVELElBQUksa0JBQWtCLEVBQUUsQ0FBQztZQUN2QiwwREFBMEQ7WUFDMUQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFFakIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ2hCLHlDQUF5QztnQkFDbkMsSUFBSSxDQUFDLE1BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRWhDLElBQUksSUFBQSxZQUFLLEVBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO29CQUM1QixJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQzt3QkFDYixzREFBc0Q7d0JBQ3RELHlDQUF5Qzt3QkFDekMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFjLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO3dCQUN2RixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQzFDLE9BQU87b0JBQ1QsQ0FBQztvQkFDRCwwRUFBMEU7b0JBQzFFLE1BQU0sSUFBSSxLQUFLLENBQUMsMkNBQTJDLENBQUMsQ0FBQztnQkFDL0QsQ0FBQztnQkFFRCxJQUFJLElBQUEsWUFBSyxFQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztvQkFDNUIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFjLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO29CQUN2RixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNoQyxPQUFPO2dCQUNULENBQUM7Z0JBRUQsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1lBQ3JELENBQUM7UUFDSCxDQUFDO1FBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFUyxXQUFXLENBQUMsS0FBcUI7UUFDekMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNoQixpQ0FBaUM7WUFDakMsT0FBTztRQUNULENBQUM7UUFFRCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFZCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3ZCLElBQUksSUFBQSxZQUFLLEVBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUNoQixJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDdkIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLDRCQUE0QjtnQkFDNUMsT0FBTztZQUNULENBQUM7UUFDSCxDQUFDO1FBRUQsSUFBSSxJQUFBLFlBQUssRUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ2hCLHVDQUF1QztZQUN2Qyw2REFBNkQ7WUFDM0QsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUN6QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUN4QyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2YsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQzNCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLDRCQUE0QjtvQkFDNUMsT0FBTztnQkFDVCxDQUFDO1lBQ0gsQ0FBQztZQUVELDRDQUE0QztZQUM1QyxxREFBcUQ7WUFDckQsTUFBTSxJQUFJLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO1lBQ3pELFVBQVU7UUFDWixDQUFDO1FBRUQsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRCxDQUFDLFFBQVE7UUFDUCxPQUFPO0lBQ1QsQ0FBQztJQUVTLENBQUMsaUJBQWlCLENBQUMsSUFBbUI7UUFDOUMsSUFBSSxJQUFBLFlBQUssRUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUNyQixLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDNUIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUM7b0JBQzdCLE1BQU07d0JBQ0osT0FBTyxFQUFFLGVBQWUsR0FBRyxjQUFjLElBQUksQ0FBQyxRQUFRLEVBQUU7d0JBQ3hELEtBQUssRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQzt3QkFDL0IsUUFBUSxFQUFFLHNCQUFTLENBQUMsWUFBWTtxQkFDakMsQ0FBQztnQkFDSixDQUFDO1lBQ0gsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBRVMsQ0FBQyxnQkFBZ0I7UUFDekIsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBQSxZQUFLLEVBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDbkMsTUFBTTtnQkFDSixPQUFPLEVBQUUsSUFBSSxJQUFJLENBQUMsUUFBUSxvQkFBb0I7Z0JBQzlDLEtBQUssRUFBRSxJQUFJO2dCQUNYLFFBQVEsRUFBRSxzQkFBUyxDQUFDLGFBQWE7YUFDbEMsQ0FBQztRQUNKLENBQUM7SUFDSCxDQUFDO0lBQ1MsQ0FBQyxrQkFBa0I7UUFDM0IsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBQSxZQUFLLEVBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDbkMsTUFBTTtnQkFDSixPQUFPLEVBQUUsSUFBSSxJQUFJLENBQUMsUUFBUSxvQkFBb0I7Z0JBQzlDLEtBQUssRUFBRSxJQUFJO2dCQUNYLFFBQVEsRUFBRSxzQkFBUyxDQUFDLGFBQWE7YUFDbEMsQ0FBQztRQUNKLENBQUM7SUFDSCxDQUFDO0lBRVMsQ0FBQyw2QkFBNkI7UUFDdEMsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFBLFlBQUssRUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFBLGVBQVEsRUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQzdELE1BQU07Z0JBQ0osT0FBTyxFQUFFLElBQUksSUFBSSxDQUFDLFFBQVEsOEJBQThCO2dCQUN4RCxLQUFLLEVBQUUsSUFBSTtnQkFDWCxRQUFRLEVBQUUsc0JBQVMsQ0FBQyxhQUFhO2FBQ2xDLENBQUM7UUFDSixDQUFDO0lBQ0gsQ0FBQztJQUVTLENBQUMsMkJBQTJCO1FBQ3BDLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBQSxZQUFLLEVBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBQSxlQUFRLEVBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUM3RCxNQUFNO2dCQUNKLE9BQU8sRUFBRSxJQUFJLElBQUksQ0FBQyxRQUFRLDZCQUE2QjtnQkFDdkQsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsUUFBUSxFQUFFLHNCQUFTLENBQUMsYUFBYTthQUNsQyxDQUFDO1FBQ0osQ0FBQztJQUNILENBQUM7SUFFUyxDQUFDLGFBQWEsQ0FBQyxLQUFhLEVBQUUsSUFBcUM7UUFDM0UsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUEsWUFBSyxFQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ2xDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztnQkFDekIsTUFBTSxDQUFDLEdBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUMzQyxJQUFJLENBQUMsSUFBQSxlQUFRLEVBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsS0FBSyxLQUFLLElBQUksRUFBRSxDQUFDO29CQUM1QyxNQUFNO3dCQUNKLE9BQU8sRUFBRSxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksS0FBSyxjQUFjLElBQUksUUFBUTt3QkFDN0QsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFNO3dCQUNmLFFBQVEsRUFBRSxzQkFBUyxDQUFDLGFBQWE7cUJBQ2xDLENBQUM7Z0JBQ0osQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztDQUNGO0FBNVVELG9CQTRVQyJ9