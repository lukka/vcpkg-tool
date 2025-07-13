"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Options = void 0;
const yaml_1 = require("yaml");
const yaml_types_1 = require("./yaml-types");
class Options extends yaml_types_1.Yaml {
    static create() {
        return new yaml_types_1.YAMLSequence();
    }
    has(option) {
        if (this.node) {
            return this.node.items.some(each => each.value === option);
        }
        return false;
    }
    set(option, value) {
        this.assert(true);
        if (value) {
            this.node.add(new yaml_1.Scalar(option));
        }
        else {
            this.node.delete(option);
        }
    }
    *validate() {
        yield* super.validate();
        yield* this.validateIsSequence();
    }
}
exports.Options = Options;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3B0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJ5YW1sL09wdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF1QztBQUN2QyxrQ0FBa0M7OztBQUVsQywrQkFBOEI7QUFFOUIsNkNBQWtEO0FBR2xELE1BQThCLE9BQVEsU0FBUSxpQkFBa0I7SUFFOUQsTUFBTSxDQUFVLE1BQU07UUFDcEIsT0FBTyxJQUFJLHlCQUFZLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBRUQsR0FBRyxDQUFDLE1BQWM7UUFDaEIsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssTUFBTSxDQUFDLENBQUM7UUFDN0QsQ0FBQztRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELEdBQUcsQ0FBQyxNQUFjLEVBQUUsS0FBYztRQUNoQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLElBQUksS0FBSyxFQUFFLENBQUM7WUFDVixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLGFBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLENBQUM7YUFBTSxDQUFDO1lBQ04sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0IsQ0FBQztJQUNILENBQUM7SUFFUSxDQUFDLFFBQVE7UUFDaEIsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3hCLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0lBQ25DLENBQUM7Q0FDRjtBQTFCRCwwQkEwQkMifQ==