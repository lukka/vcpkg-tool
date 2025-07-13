"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistriesDeclaration = exports.RegistryDeclaration = void 0;
const yaml_1 = require("yaml");
const error_kind_1 = require("../interfaces/error-kind");
const Entity_1 = require("../yaml/Entity");
const strings_1 = require("../yaml/strings");
const yaml_types_1 = require("../yaml/yaml-types");
class RegistryDeclaration extends Entity_1.Entity {
    location = new strings_1.Strings(undefined, this, 'location');
    get registryKind() { return this.asString(this.getMember('kind')); }
    set registryKind(value) { this.setMember('kind', value); }
    /** @internal */
    *validate() {
        yield* super.validate();
        //
        if (this.registryKind === undefined) {
            yield {
                message: 'Registry missing \'kind\'',
                range: this,
                category: error_kind_1.ErrorKind.FieldMissing,
            };
        }
    }
}
exports.RegistryDeclaration = RegistryDeclaration;
class RegistriesDeclaration extends yaml_types_1.Yaml {
    *[Symbol.iterator]() {
        if ((0, yaml_1.isMap)(this.node)) {
            for (const { key, value } of this.node.items) {
                const v = this.createRegistry(value);
                if (v) {
                    yield [key, v];
                }
            }
        }
        if ((0, yaml_1.isSeq)(this.node)) {
            for (const item of this.node.items) {
                if ((0, yaml_1.isMap)(item)) {
                    const name = this.asString(item.get('name'));
                    if (name) {
                        const v = this.createRegistry(item);
                        if (v) {
                            yield [name, v];
                        }
                    }
                }
            }
        }
    }
    clear() {
        this.dispose(true);
    }
    createNode() {
        return new yaml_types_1.YAMLSequence();
    }
    add(name, location, kind) {
        if (this.get(name)) {
            throw new Error(`Registry ${name} already exists.`);
        }
        this.assert(true);
        if ((0, yaml_1.isMap)(this.node)) {
            throw new Error('Not Implemented as a map right now.');
        }
        if ((0, yaml_1.isSeq)(this.node)) {
            const m = new yaml_1.YAMLMap();
            this.node.add(m);
            m.set('name', name);
            m.set('location', location?.formatted);
            m.set('kind', kind);
        }
        return this.get(name);
    }
    delete(key) {
        const n = this.node;
        if ((0, yaml_1.isMap)(n)) {
            const result = n.delete(key);
            this.dispose();
            return result;
        }
        if ((0, yaml_1.isSeq)(n)) {
            let removed = false;
            const items = n.items;
            for (let i = items.length - 1; i >= 0; i--) {
                const item = items[i];
                if ((0, yaml_1.isMap)(item) && item.get('name') === key) {
                    removed ||= n.delete(i);
                }
            }
            this.dispose();
            return removed;
        }
        return false;
    }
    get(key) {
        const n = this.node;
        if ((0, yaml_1.isMap)(n)) {
            return this.createRegistry(n.get(key, true));
        }
        if ((0, yaml_1.isSeq)(n)) {
            for (const item of n.items) {
                if ((0, yaml_1.isMap)(item) && item.get('name') === key) {
                    return this.createRegistry(item);
                }
            }
        }
        return undefined;
    }
    has(key) {
        const n = this.node;
        if ((0, yaml_1.isMap)(n)) {
            return n.has(key);
        }
        if ((0, yaml_1.isSeq)(n)) {
            for (const item of n.items) {
                if ((0, yaml_1.isMap)(item) && item.get('name') === key) {
                    return true;
                }
            }
        }
        return false;
    }
    get length() {
        if ((0, yaml_1.isMap)(this.node) || (0, yaml_1.isSeq)(this.node)) {
            return this.node.items.length;
        }
        return 0;
    }
    get keys() {
        if ((0, yaml_1.isMap)(this.node)) {
            return this.node.items.map(({ key }) => this.asString(key) || '');
        }
        if ((0, yaml_1.isSeq)(this.node)) {
            const result = new Array();
            for (const item of this.node.items) {
                if ((0, yaml_1.isMap)(item)) {
                    const n = this.asString(item.get('name'));
                    if (n) {
                        result.push(n);
                    }
                }
            }
            return result;
        }
        return [];
    }
    createRegistry(node) {
        if ((0, yaml_1.isMap)(node)) {
            const k = this.asString(node.get('kind'));
            const l = this.asString(node.get('location'));
            // simplistic check to see if we're pointing to a file or a https:// url
            if (k === 'artifact' && l) {
                return new RegistryDeclaration(node, this);
            }
        }
        return undefined;
    }
    /** @internal */
    *validate() {
        yield* super.validate();
        if (this.exists()) {
            for (const [key, registry] of this) {
                yield* registry.validate();
            }
        }
    }
}
exports.RegistriesDeclaration = RegistriesDeclaration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0cmllcy5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJhbWYvcmVnaXN0cmllcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBRWxDLCtCQUE2QztBQUU3Qyx5REFBcUQ7QUFHckQsMkNBQXdDO0FBQ3hDLDZDQUEwQztBQUMxQyxtREFBOEU7QUFFOUUsTUFBYSxtQkFBb0IsU0FBUSxlQUFNO0lBQ3BDLFFBQVEsR0FBRyxJQUFJLGlCQUFPLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztJQUU3RCxJQUFJLFlBQVksS0FBeUIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEYsSUFBSSxZQUFZLENBQUMsS0FBeUIsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFOUUsZ0JBQWdCO0lBQ1AsQ0FBQyxRQUFRO1FBQ2hCLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN4QixFQUFFO1FBQ0YsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ3BDLE1BQU07Z0JBQ0osT0FBTyxFQUFFLDJCQUEyQjtnQkFDcEMsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsUUFBUSxFQUFFLHNCQUFTLENBQUMsWUFBWTthQUNqQyxDQUFDO1FBQ0osQ0FBQztJQUNILENBQUM7Q0FDRjtBQWxCRCxrREFrQkM7QUFFRCxNQUFhLHFCQUFzQixTQUFRLGlCQUFtQztJQUM1RSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNoQixJQUFJLElB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