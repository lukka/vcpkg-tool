"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomScalarMap = void 0;
const yaml_1 = require("yaml");
const BaseMap_1 = require("./BaseMap");
class CustomScalarMap extends BaseMap_1.BaseMap {
    factory;
    constructor(factory, node, parent, key) {
        super(node, parent, key);
        this.factory = factory;
    }
    add(key) {
        this.assert(true);
        this.node.set(key, '');
        return this.get(key);
    }
    *[Symbol.iterator]() {
        if (this.node) {
            for (const { key, value } of this.node.items) {
                if ((0, yaml_1.isScalar)(value)) {
                    yield [key, new this.factory(value, this, key)];
                }
            }
        }
    }
    get(key) {
        if (this.node) {
            const v = this.node.get(key, true);
            if ((0, yaml_1.isScalar)(v)) {
                return new this.factory(v, this, key);
            }
        }
        return undefined;
    }
    set(key, value) {
        if (value === undefined || value === null) {
            throw new Error('Cannot set undefined or null to a map');
        }
        if (value.empty) {
            throw new Error('Cannot set an empty entity to a map');
        }
        this.assert(true); // if we don't have a node at the moment, we need to create one.
        this.node.set(key, new yaml_1.Scalar(value));
    }
    *validate() {
        yield* this.validateIsObject();
    }
}
exports.CustomScalarMap = CustomScalarMap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3VzdG9tU2NhbGFyTWFwLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9taWNyb3NvZnQvdmNwa2ctdG9vbC9tYWluL3ZjcGtnLWFydGlmYWN0cy8iLCJzb3VyY2VzIjpbInlhbWwvQ3VzdG9tU2NhbGFyTWFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1Q0FBdUM7QUFDdkMsa0NBQWtDOzs7QUFFbEMsK0JBQXdDO0FBRXhDLHVDQUFvQztBQUlwQyxNQUE4QixlQUErQyxTQUFRLGlCQUFPO0lBQzFEO0lBQWhDLFlBQWdDLE9BQXdDLEVBQUUsSUFBcUIsRUFBRSxNQUFhLEVBQUUsR0FBWTtRQUMxSCxLQUFLLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztRQURLLFlBQU8sR0FBUCxPQUFPLENBQWlDO0lBRXhFLENBQUM7SUFFRCxHQUFHLENBQUMsR0FBVztRQUNiLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUUsQ0FBQztJQUN4QixDQUFDO0lBR0QsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDaEIsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZCxLQUFLLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDN0MsSUFBSSxJQUFBLGVBQVEsRUFBQyxLQUFLLENBQUMsRUFBRSxDQUFDO29CQUNwQixNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFFRCxHQUFHLENBQUMsR0FBVztRQUNiLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2QsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ25DLElBQUksSUFBQSxlQUFRLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztnQkFDaEIsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN4QyxDQUFDO1FBQ0gsQ0FBQztRQUNELE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFRCxHQUFHLENBQUMsR0FBVyxFQUFFLEtBQWU7UUFDOUIsSUFBSSxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUMxQyxNQUFNLElBQUksS0FBSyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7UUFDM0QsQ0FBQztRQUVELElBQUksS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMscUNBQXFDLENBQUMsQ0FBQztRQUN6RCxDQUFDO1FBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFHLGdFQUFnRTtRQUVyRixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxhQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRVEsQ0FBQyxRQUFRO1FBQ2hCLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQ2pDLENBQUM7Q0FDRjtBQWpERCwwQ0FpREMifQ==