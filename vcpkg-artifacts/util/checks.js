"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPrimitive = isPrimitive;
exports.isNullish = isNullish;
exports.isIterable = isIterable;
exports.checkOptionalString = checkOptionalString;
exports.checkOptionalBool = checkOptionalBool;
exports.checkOptionalArrayOfStrings = checkOptionalArrayOfStrings;
exports.isGithubRepo = isGithubRepo;
const yaml_1 = require("yaml");
const i18n_1 = require("../i18n");
const error_kind_1 = require("../interfaces/error-kind");
/** @internal */
function isPrimitive(value) {
    switch (typeof value) {
        case 'string':
        case 'number':
        case 'boolean':
            return true;
    }
    return false;
}
/** @internal */
function isNullish(value) {
    return value === null || value === undefined || value === '' || value === 0;
}
/** @internal */
function isIterable(source) {
    return !!source && typeof (source) !== 'string' && !!source[Symbol.iterator];
}
function* checkOptionalString(parent, range, name) {
    switch (typeof parent.get(name)) {
        case 'string':
        case 'undefined':
            break;
        default:
            yield { message: (0, i18n_1.i) `${name} must be a string`, range: range, category: error_kind_1.ErrorKind.IncorrectType };
    }
}
function* checkOptionalBool(parent, range, name) {
    switch (typeof parent.get(name)) {
        case 'boolean':
        case 'undefined':
            break;
        default:
            yield { message: (0, i18n_1.i) `${name} must be a bool`, range: range, category: error_kind_1.ErrorKind.IncorrectType };
    }
}
function checkOptionalArrayOfStringsImpl(parent, range, name) {
    const val = parent.get(name);
    if ((0, yaml_1.isSeq)(val)) {
        for (const entry of val.items) {
            if (!(0, yaml_1.isScalar)(entry) || typeof entry.value !== 'string') {
                return true;
            }
        }
    }
    else if (typeof val !== 'undefined') {
        return true;
    }
    return false;
}
function* checkOptionalArrayOfStrings(parent, range, name) {
    if (checkOptionalArrayOfStringsImpl(parent, range, name)) {
        yield { message: (0, i18n_1.i) `${name} must be an array of strings, or unset`, range: range, category: error_kind_1.ErrorKind.IncorrectType };
    }
}
function isGithubRepo(uri) {
    return uri.authority.toLowerCase() === 'github.com' && !!(/\/[a-zA-Z0-9-_]*\/[a-zA-Z0-9-_]*$/g.exec(uri.path));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tzLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9taWNyb3NvZnQvdmNwa2ctdG9vbC9tYWluL3ZjcGtnLWFydGlmYWN0cy8iLCJzb3VyY2VzIjpbInV0aWwvY2hlY2tzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1Q0FBdUM7QUFDdkMsa0NBQWtDOztBQVNsQyxrQ0FRQztBQUdELDhCQUVDO0FBR0QsZ0NBRUM7QUFFRCxrREFRQztBQUVELDhDQVFDO0FBaUJELGtFQUlDO0FBRUQsb0NBRUM7QUF0RUQsK0JBQWdEO0FBQ2hELGtDQUE0QjtBQUM1Qix5REFBcUQ7QUFJckQsZ0JBQWdCO0FBQ2hCLFNBQWdCLFdBQVcsQ0FBQyxLQUFVO0lBQ3BDLFFBQVEsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNyQixLQUFLLFFBQVEsQ0FBQztRQUNkLEtBQUssUUFBUSxDQUFDO1FBQ2QsS0FBSyxTQUFTO1lBQ1osT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUVELGdCQUFnQjtBQUNoQixTQUFnQixTQUFTLENBQUMsS0FBVTtJQUNsQyxPQUFPLEtBQUssS0FBSyxJQUFJLElBQUksS0FBSyxLQUFLLFNBQVMsSUFBSSxLQUFLLEtBQUssRUFBRSxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUM7QUFDOUUsQ0FBQztBQUVELGdCQUFnQjtBQUNoQixTQUFnQixVQUFVLENBQUksTUFBVztJQUN2QyxPQUFPLENBQUMsQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvRSxDQUFDO0FBRUQsUUFBZSxDQUFDLENBQUMsbUJBQW1CLENBQUMsTUFBZSxFQUFFLEtBQStCLEVBQUUsSUFBWTtJQUNqRyxRQUFRLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ2hDLEtBQUssUUFBUSxDQUFDO1FBQ2QsS0FBSyxXQUFXO1lBQ2QsTUFBTTtRQUNSO1lBQ0UsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFBLFFBQUMsRUFBQSxHQUFHLElBQUksbUJBQW1CLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsc0JBQVMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUNwRyxDQUFDO0FBQ0gsQ0FBQztBQUVELFFBQWUsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLE1BQWUsRUFBRSxLQUErQixFQUFFLElBQVk7SUFDL0YsUUFBUSxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNoQyxLQUFLLFNBQVMsQ0FBQztRQUNmLEtBQUssV0FBVztZQUNkLE1BQU07UUFDUjtZQUNFLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBQSxRQUFDLEVBQUEsR0FBRyxJQUFJLGlCQUFpQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLHNCQUFTLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDbEcsQ0FBQztBQUNILENBQUM7QUFFRCxTQUFTLCtCQUErQixDQUFDLE1BQWUsRUFBRSxLQUErQixFQUFFLElBQVk7SUFDckcsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QixJQUFJLElBQUEsWUFBSyxFQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7UUFDZixLQUFLLE1BQU0sS0FBSyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsSUFBQSxlQUFRLEVBQUMsS0FBSyxDQUFDLElBQUksT0FBTyxLQUFLLENBQUMsS0FBSyxLQUFLLFFBQVEsRUFBRSxDQUFDO2dCQUN4RCxPQUFPLElBQUksQ0FBQztZQUNkLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztTQUFNLElBQUksT0FBTyxHQUFHLEtBQUssV0FBVyxFQUFFLENBQUM7UUFDdEMsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBRUQsUUFBZSxDQUFDLENBQUMsMkJBQTJCLENBQUMsTUFBZSxFQUFFLEtBQStCLEVBQUUsSUFBWTtJQUN6RyxJQUFJLCtCQUErQixDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUN6RCxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUEsUUFBQyxFQUFBLEdBQUcsSUFBSSx3Q0FBd0MsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxzQkFBUyxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3ZILENBQUM7QUFDSCxDQUFDO0FBRUQsU0FBZ0IsWUFBWSxDQUFDLEdBQVE7SUFDbkMsT0FBTyxHQUFHLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxLQUFLLFlBQVksSUFBSSxDQUFDLENBQUMsQ0FBQyxvQ0FBb0MsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDakgsQ0FBQyJ9