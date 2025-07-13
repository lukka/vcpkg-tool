"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemandBlock = exports.Demands = void 0;
const yaml_1 = require("yaml");
const i18n_1 = require("../i18n");
const error_kind_1 = require("../interfaces/error-kind");
const media_query_1 = require("../mediaquery/media-query");
const Entity_1 = require("../yaml/Entity");
const EntityMap_1 = require("../yaml/EntityMap");
const exports_1 = require("./exports");
const installer_1 = require("./installer");
const Requires_1 = require("./Requires");
const ignore = new Set(['info', 'contacts', 'error', 'message', 'warning', 'requires']);
/**
 * A map of mediaquery to DemandBlock
 */
class Demands extends EntityMap_1.EntityMap {
    constructor(node, parent, key) {
        super(DemandBlock, node, parent, key);
    }
    get keys() {
        return super.keys.filter(each => !ignore.has(each));
    }
    /** @internal */
    *validate() {
        yield* super.validate();
        for (const [mediaQuery, demandBlock] of this) {
            if (ignore.has(mediaQuery)) {
                continue;
            }
            if (!(0, yaml_1.isMap)(demandBlock.node)) {
                yield {
                    message: `Conditional demand '${mediaQuery}' is not an object`,
                    range: demandBlock.node.range || [0, 0, 0],
                    category: error_kind_1.ErrorKind.IncorrectType
                };
                continue;
            }
            const query = (0, media_query_1.parseQuery)(mediaQuery);
            if (!query.isValid) {
                yield { message: (0, i18n_1.i) `Error parsing conditional demand '${mediaQuery}'- ${query.error?.message}`, range: this.sourcePosition(mediaQuery) /* mediaQuery.range! */, rangeOffset: query.error, category: error_kind_1.ErrorKind.ParseError };
                continue;
            }
            yield* demandBlock.validate();
        }
    }
}
exports.Demands = Demands;
class DemandBlock extends Entity_1.Entity {
    discoveredData = {};
    get error() { return this.asString(this.getMember('error')); }
    set error(value) { this.setMember('error', value); }
    get warning() { return this.asString(this.getMember('warning')); }
    set warning(value) { this.setMember('warning', value); }
    get message() { return this.asString(this.getMember('message')); }
    set message(value) { this.setMember('message', value); }
    requires = new Requires_1.Requires(undefined, this, 'requires');
    exports = new exports_1.Exports(undefined, this, 'exports');
    install = new installer_1.Installs(undefined, this, 'install');
    constructor(node, parent, key) {
        super(node, parent, key);
    }
    /** @internal */
    *validate() {
        yield* this.validateChildKeys(['error', 'warning', 'message', 'requires', 'exports', 'install']);
        yield* super.validate();
        if (this.exists()) {
            yield* this.validateChild('error', 'string');
            yield* this.validateChild('warning', 'string');
            yield* this.validateChild('message', 'string');
            yield* this.exports.validate();
            yield* this.requires.validate();
            yield* this.install.validate();
        }
    }
    evaluate(value) {
        if (!value || value.indexOf('$') === -1) {
            // quick exit if no expression or no variables
            return value;
        }
        // $$ -> escape for $
        value = value.replace(/\$\$/g, '\uffff');
        // $0 ... $9 -> replace contents with the values from the artifact
        value = value.replace(/\$([0-9])/g, (match, index) => this.discoveredData[match] || match);
        // restore escaped $
        return value.replace(/\uffff/g, '$');
    }
    asString(value) {
        if (value === undefined) {
            return value;
        }
        return this.evaluate((0, yaml_1.isScalar)(value) ? value.value : value);
    }
    asPrimitive(value) {
        if (value === undefined) {
            return value;
        }
        if ((0, yaml_1.isScalar)(value)) {
            value = value.value;
        }
        switch (typeof value) {
            case 'boolean':
            case 'number':
                return value;
            case 'string': {
                return this.evaluate(value);
            }
        }
        return undefined;
    }
}
exports.DemandBlock = DemandBlock;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVtYW5kcy5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJhbWYvZGVtYW5kcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBRWxDLCtCQUF1QztBQUN2QyxrQ0FBNEI7QUFDNUIseURBQXFEO0FBRXJELDJEQUF1RDtBQUN2RCwyQ0FBd0M7QUFDeEMsaURBQThDO0FBRTlDLHVDQUFvQztBQUNwQywyQ0FBdUM7QUFDdkMseUNBQXNDO0FBRXRDLE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFTLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBQ2hHOztHQUVHO0FBQ0gsTUFBYSxPQUFRLFNBQVEscUJBQXNDO0lBQ2pFLFlBQVksSUFBcUIsRUFBRSxNQUFhLEVBQUUsR0FBWTtRQUM1RCxLQUFLLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELElBQWEsSUFBSTtRQUNmLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQsZ0JBQWdCO0lBQ1AsQ0FBQyxRQUFRO1FBQ2hCLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUV4QixLQUFLLE1BQU0sQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7WUFDN0MsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7Z0JBQzNCLFNBQVM7WUFDWCxDQUFDO1lBQ0QsSUFBSSxDQUFDLElBQUEsWUFBSyxFQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUM3QixNQUFNO29CQUNKLE9BQU8sRUFBRSx1QkFBdUIsVUFBVSxvQkFBb0I7b0JBQzlELEtBQUssRUFBRSxXQUFXLENBQUMsSUFBSyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUMzQyxRQUFRLEVBQUUsc0JBQVMsQ0FBQyxhQUFhO2lCQUNsQyxDQUFDO2dCQUNGLFNBQVM7WUFDWCxDQUFDO1lBRUQsTUFBTSxLQUFLLEdBQUcsSUFBQSx3QkFBVSxFQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ25CLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBQSxRQUFDLEVBQUEscUNBQXFDLFVBQVUsTUFBTSxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFBLHVCQUF1QixFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxzQkFBUyxDQUFDLFVBQVUsRUFBRSxDQUFDO2dCQUN6TixTQUFTO1lBQ1gsQ0FBQztZQUVELEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNoQyxDQUFDO0lBQ0gsQ0FBQztDQUNGO0FBbkNELDBCQW1DQztBQUVELE1BQWEsV0FBWSxTQUFRLGVBQU07SUFDckMsY0FBYyxHQUEyQixFQUFFLENBQUM7SUFFNUMsSUFBSSxLQUFLLEtBQXlCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xGLElBQUksS0FBSyxDQUFDLEtBQXlCLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXhFLElBQUksT0FBTyxLQUF5QixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0RixJQUFJLE9BQU8sQ0FBQyxLQUF5QixJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUU1RSxJQUFJLE9BQU8sS0FBeUIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEYsSUFBSSxPQUFPLENBQUMsS0FBeUIsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFbkUsUUFBUSxHQUFHLElBQUksbUJBQVEsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ3JELE9BQU8sR0FBRyxJQUFJLGlCQUFPLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNsRCxPQUFPLEdBQUcsSUFBSSxvQkFBUSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFFNUQsWUFBWSxJQUFxQixFQUFFLE1BQWEsRUFBRSxHQUFZO1FBQzVELEtBQUssQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFRCxnQkFBZ0I7SUFDUCxDQUFDLFFBQVE7UUFDaEIsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBRWpHLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN4QixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDO1lBQ2xCLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzdDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQy9DLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBRS9DLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDL0IsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNoQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2pDLENBQUM7SUFDSCxDQUFDO0lBRU8sUUFBUSxDQUFDLEtBQWE7UUFDNUIsSUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDeEMsOENBQThDO1lBQzlDLE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUVELHFCQUFxQjtRQUNyQixLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFekMsa0VBQWtFO1FBQ2xFLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUM7UUFFM0Ysb0JBQW9CO1FBQ3BCLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVRLFFBQVEsQ0FBQyxLQUFVO1FBQzFCLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ3hCLE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUNELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFBLGVBQVEsRUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVRLFdBQVcsQ0FBQyxLQUFVO1FBQzdCLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ3hCLE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUNELElBQUksSUFBQSxlQUFRLEVBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUNwQixLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUN0QixDQUFDO1FBQ0QsUUFBUSxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ3JCLEtBQUssU0FBUyxDQUFDO1lBQ2YsS0FBSyxRQUFRO2dCQUNYLE9BQU8sS0FBSyxDQUFDO1lBRWYsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNkLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM5QixDQUFDO1FBQ0gsQ0FBQztRQUNELE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7Q0FDRjtBQTdFRCxrQ0E2RUMifQ==