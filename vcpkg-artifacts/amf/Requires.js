"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Requires = void 0;
const yaml_1 = require("yaml");
const CustomScalarMap_1 = require("../yaml/CustomScalarMap");
const version_reference_1 = require("./version-reference");
class Requires extends CustomScalarMap_1.CustomScalarMap {
    constructor(node, parent, key) {
        super(version_reference_1.VersionReference, node, parent, key);
    }
    set(key, value) {
        if (typeof value === 'string') {
            this.assert(true); // if we don't have a node at the moment, we need to create one.
            this.node.set(key, new yaml_1.Scalar(value));
            return;
        }
        if (value.raw) {
            this.assert(true); // if we don't have a node at the moment, we need to create one.
            this.node.set(key, new yaml_1.Scalar(value.raw));
        }
        if (value.resolved) {
            this.assert(true); // if we don't have a node at the moment, we need to create one.
            this.node.set(key, new yaml_1.Scalar(`${value.range} ${value.resolved}`));
        }
        else {
            this.assert(true); // if we don't have a node at the moment, we need to create one.
            this.node.set(key, new yaml_1.Scalar(value.range));
        }
    }
}
exports.Requires = Requires;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVxdWlyZXMuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21pY3Jvc29mdC92Y3BrZy10b29sL21haW4vdmNwa2ctYXJ0aWZhY3RzLyIsInNvdXJjZXMiOlsiYW1mL1JlcXVpcmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1Q0FBdUM7QUFDdkMsa0NBQWtDOzs7QUFFbEMsK0JBQThCO0FBRTlCLDZEQUEwRDtBQUUxRCwyREFBdUQ7QUFFdkQsTUFBYSxRQUFTLFNBQVEsaUNBQWlDO0lBQzdELFlBQVksSUFBcUIsRUFBRSxNQUFhLEVBQUUsR0FBWTtRQUM1RCxLQUFLLENBQUMsb0NBQWdCLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRVEsR0FBRyxDQUFDLEdBQVcsRUFBRSxLQUFvRDtRQUM1RSxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRSxDQUFDO1lBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBRyxnRUFBZ0U7WUFDckYsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksYUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDdEMsT0FBTztRQUNULENBQUM7UUFDRCxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNkLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBRyxnRUFBZ0U7WUFDckYsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksYUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzVDLENBQUM7UUFDRCxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNuQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUcsZ0VBQWdFO1lBQ3JGLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLGFBQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNyRSxDQUFDO2FBQU0sQ0FBQztZQUNOLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBRyxnRUFBZ0U7WUFDckYsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzlDLENBQUM7SUFDSCxDQUFDO0NBQ0Y7QUF2QkQsNEJBdUJDIn0=