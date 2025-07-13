"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringsMap = exports.Strings = void 0;
const EntityMap_1 = require("./EntityMap");
const ScalarSequence_1 = require("./ScalarSequence");
class Strings extends ScalarSequence_1.ScalarSequence {
    constructor(node, parent, key) {
        super(node, parent, key);
    }
}
exports.Strings = Strings;
class StringsMap extends EntityMap_1.EntityMap {
    constructor(node, parent, key) {
        super(Strings, node, parent, key);
    }
}
exports.StringsMap = StringsMap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5ncy5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJ5YW1sL3N0cmluZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF1QztBQUN2QyxrQ0FBa0M7OztBQUdsQywyQ0FBd0M7QUFDeEMscURBQWtEO0FBSWxELE1BQWEsT0FBUSxTQUFRLCtCQUFzQjtJQUNqRCxZQUFZLElBQWdDLEVBQUUsTUFBYSxFQUFFLEdBQVk7UUFDdkUsS0FBSyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDM0IsQ0FBQztDQUNGO0FBSkQsMEJBSUM7QUFFRCxNQUFhLFVBQVcsU0FBUSxxQkFBNEQ7SUFDMUYsWUFBWSxJQUFxQixFQUFFLE1BQWEsRUFBRSxHQUFZO1FBQzVELEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNwQyxDQUFDO0NBQ0Y7QUFKRCxnQ0FJQyJ9