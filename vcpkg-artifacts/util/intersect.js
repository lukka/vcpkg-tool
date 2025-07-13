"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.intersect = intersect;
/**
 * Creates an intersection object from two source objects.
 *
 * Typescript nicely supports defining intersection types (ie, Foo & Bar )
 * But if you have two seperate *instances*, and you want to use them as the implementation
 * of that intersection, the language doesn't solve that for you.
 *
 * This function creates a strongly typed proxy type around the two objects,
 * and returns members for the intersection of them.
 *
 * This works well for properties and member functions the same.
 *
 * Members in the primary object will take precedence over members in the secondary object if names conflict.
 *
 * This can also be used to "add" arbitrary members to an existing type (without mutating the original object)
 *
 * @example
 * const combined = intersect( new Foo(), { test: () => { console.debug('testing'); } });
 * combined.test(); // writes out 'testing' to console
 *
 * @param primary primary object - members from this will have precedence.
 * @param secondary secondary object - members from this will be used if primary does not have a member
 */
// eslint-disable-next-line @typescript-eslint/ban-types
function intersect(primary, secondary, filters = ['constructor']) {
    // eslint-disable-next-line keyword-spacing
    return new Proxy({ primary, secondary }, {
        // member get proxy handler
        get(target, property, receiver) {
            // check for properties on the objects first
            const propertyName = property.toString();
            // provide custom JON impl.
            if (propertyName === 'toJSON') {
                return () => {
                    const allKeys = this.ownKeys();
                    const o = {};
                    for (const i of allKeys) {
                        const v = this.get(target, i);
                        if (typeof v !== 'function') {
                            o[i] = v;
                        }
                    }
                    return o;
                };
            }
            const pv = target.primary[property];
            const sv = target.secondary[property];
            if (pv !== undefined) {
                if (typeof pv === 'function') {
                    return pv.bind(primary);
                }
                return pv;
            }
            if (sv !== undefined) {
                if (typeof sv === 'function') {
                    return sv.bind(secondary);
                }
                return sv;
            }
            return undefined;
        },
        // member set proxy handler
        set(target, property, value) {
            const propertyName = property.toString();
            if (Object.getOwnPropertyNames(target.primary).indexOf(propertyName) > -1) {
                return target.primary[property] = value;
            }
            if (Object.getOwnPropertyNames(target.secondary).indexOf(propertyName) > -1) {
                return target.secondary[property] = value;
            }
            return undefined;
        },
        ownKeys(target) {
            return [...new Set([
                    ...Object.getOwnPropertyNames(Object.getPrototypeOf(primary)),
                    ...Object.getOwnPropertyNames(primary),
                    ...Object.getOwnPropertyNames(Object.getPrototypeOf(secondary)),
                    ...Object.getOwnPropertyNames(secondary)
                ].filter(each => filters.indexOf(each) === -1))];
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJzZWN0LmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9taWNyb3NvZnQvdmNwa2ctdG9vbC9tYWluL3ZjcGtnLWFydGlmYWN0cy8iLCJzb3VyY2VzIjpbInV0aWwvaW50ZXJzZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1Q0FBdUM7QUFDdkMsa0NBQWtDOztBQTBCbEMsOEJBZ0VDO0FBeEZEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBc0JHO0FBQ0gsd0RBQXdEO0FBQ3hELFNBQWdCLFNBQVMsQ0FBc0MsT0FBVSxFQUFFLFNBQWEsRUFBRSxPQUFPLEdBQUcsQ0FBQyxhQUFhLENBQUM7SUFDakgsMkNBQTJDO0lBQzNDLE9BQW9CLElBQUksS0FBSyxDQUFDLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxFQUFPO1FBQ3pELDJCQUEyQjtRQUMzQixHQUFHLENBQUMsTUFBcUMsRUFBRSxRQUF5QixFQUFFLFFBQWE7WUFDakYsNENBQTRDO1lBQzVDLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUV6QywyQkFBMkI7WUFDM0IsSUFBSSxZQUFZLEtBQUssUUFBUSxFQUFFLENBQUM7Z0JBQzlCLE9BQU8sR0FBRyxFQUFFO29CQUNWLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDL0IsTUFBTSxDQUFDLEdBQVEsRUFBRSxDQUFDO29CQUNsQixLQUFLLE1BQU0sQ0FBQyxJQUFJLE9BQU8sRUFBRSxDQUFDO3dCQUN4QixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDOUIsSUFBSSxPQUFPLENBQUMsS0FBSyxVQUFVLEVBQUUsQ0FBQzs0QkFDNUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDWCxDQUFDO29CQUNILENBQUM7b0JBQ0QsT0FBTyxDQUFDLENBQUM7Z0JBQ1gsQ0FBQyxDQUFDO1lBQ0osQ0FBQztZQUVELE1BQU0sRUFBRSxHQUFTLE1BQU0sQ0FBQyxPQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDM0MsTUFBTSxFQUFFLEdBQVMsTUFBTSxDQUFDLFNBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUU3QyxJQUFJLEVBQUUsS0FBSyxTQUFTLEVBQUUsQ0FBQztnQkFDckIsSUFBSSxPQUFPLEVBQUUsS0FBSyxVQUFVLEVBQUUsQ0FBQztvQkFDN0IsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUMxQixDQUFDO2dCQUNELE9BQU8sRUFBRSxDQUFDO1lBQ1osQ0FBQztZQUVELElBQUksRUFBRSxLQUFLLFNBQVMsRUFBRSxDQUFDO2dCQUNyQixJQUFJLE9BQU8sRUFBRSxLQUFLLFVBQVUsRUFBRSxDQUFDO29CQUM3QixPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzVCLENBQUM7Z0JBQ0QsT0FBTyxFQUFFLENBQUM7WUFDWixDQUFDO1lBRUQsT0FBTyxTQUFTLENBQUM7UUFDbkIsQ0FBQztRQUVELDJCQUEyQjtRQUMzQixHQUFHLENBQUMsTUFBcUMsRUFBRSxRQUF5QixFQUFFLEtBQVU7WUFDOUUsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBRXpDLElBQUksTUFBTSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztnQkFDMUUsT0FBYSxNQUFNLENBQUMsT0FBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUNqRCxDQUFDO1lBQ0QsSUFBSSxNQUFNLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUM1RSxPQUFhLE1BQU0sQ0FBQyxTQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsS0FBSyxDQUFDO1lBQ25ELENBQUM7WUFDRCxPQUFPLFNBQVMsQ0FBQztRQUNuQixDQUFDO1FBQ0QsT0FBTyxDQUFDLE1BQXFDO1lBQzNDLE9BQU8sQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDO29CQUNqQixHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUM3RCxHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUM7b0JBQ3RDLEdBQUcsTUFBTSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQy9ELEdBQUcsTUFBTSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQztpQkFBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0YsQ0FBQztLQUVGLENBQUMsQ0FBQztBQUNMLENBQUMifQ==