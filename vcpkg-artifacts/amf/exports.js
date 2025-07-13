"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exports = void 0;
const BaseMap_1 = require("../yaml/BaseMap");
const ScalarMap_1 = require("../yaml/ScalarMap");
const strings_1 = require("../yaml/strings");
class Exports extends BaseMap_1.BaseMap {
    aliases = new ScalarMap_1.ScalarMap(undefined, this, 'aliases');
    defines = new ScalarMap_1.ScalarMap(undefined, this, 'defines');
    environment = new strings_1.StringsMap(undefined, this, 'environment');
    locations = new ScalarMap_1.ScalarMap(undefined, this, 'locations');
    msbuild_properties = new ScalarMap_1.ScalarMap(undefined, this, 'msbuild-properties');
    paths = new strings_1.StringsMap(undefined, this, 'paths');
    properties = new strings_1.StringsMap(undefined, this, 'properties');
    tools = new ScalarMap_1.ScalarMap(undefined, this, 'tools');
    /** @internal */
    *validate() {
        yield* super.validate();
        yield* this.validateChildKeys([
            'aliases',
            'defines',
            'environment',
            'locations',
            'msbuild-properties',
            'paths',
            'properties',
            'tools'
        ]);
    }
}
exports.Exports = Exports;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0cy5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJhbWYvZXhwb3J0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBS2xDLDZDQUEwQztBQUMxQyxpREFBOEM7QUFDOUMsNkNBQTZDO0FBRTdDLE1BQWEsT0FBUSxTQUFRLGlCQUFPO0lBQ2xDLE9BQU8sR0FBc0IsSUFBSSxxQkFBUyxDQUFTLFNBQVMsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDL0UsT0FBTyxHQUFzQixJQUFJLHFCQUFTLENBQVMsU0FBUyxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMvRSxXQUFXLEdBQWUsSUFBSSxvQkFBVSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDekUsU0FBUyxHQUFzQixJQUFJLHFCQUFTLENBQVMsU0FBUyxFQUFFLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNuRixrQkFBa0IsR0FBc0IsSUFBSSxxQkFBUyxDQUFTLFNBQVMsRUFBRSxJQUFJLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztJQUNyRyxLQUFLLEdBQWUsSUFBSSxvQkFBVSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDN0QsVUFBVSxHQUFlLElBQUksb0JBQVUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ3ZFLEtBQUssR0FBc0IsSUFBSSxxQkFBUyxDQUFTLFNBQVMsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFFM0UsZ0JBQWdCO0lBQ1AsQ0FBQyxRQUFRO1FBQ2hCLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN4QixLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUM7WUFDNUIsU0FBUztZQUNULFNBQVM7WUFDVCxhQUFhO1lBQ2IsV0FBVztZQUNYLG9CQUFvQjtZQUNwQixPQUFPO1lBQ1AsWUFBWTtZQUNaLE9BQU87U0FDUixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUF4QkQsMEJBd0JDIn0=