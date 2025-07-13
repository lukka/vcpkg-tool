"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
const linq_1 = require("./util/linq");
const promise_1 = require("./util/promise");
if (!Map.prototype.getOrDefault) {
    Object.defineProperties(Map.prototype, {
        getOrDefault: {
            value: function (key, defaultValue) {
                let v = this.get(key);
                if (!v) {
                    this.set(key, v = typeof defaultValue === 'function' ? defaultValue() : defaultValue);
                }
                return v;
            }
        }
    });
}
if (!Array.prototype.insert) {
    /**
     * adding some linq-like functionality to the Array type
     */
    Object.defineProperties(Array.prototype, {
        where: { value: Array.prototype.filter },
        select: { value: Array.prototype.map },
        any: { value: Array.prototype.some },
        all: { value: Array.prototype.every },
        insert: { value: function (position, items) { return this.splice(position, 0, ...items); } },
        selectMany: { value: Array.prototype.flatMap },
        count: {
            value: function (predicate) {
                let v = 0;
                const all = [];
                for (const each of this) {
                    const test = predicate(each);
                    if (test.then) {
                        all.push(test.then((antecedent) => {
                            if (antecedent) {
                                v++;
                            }
                        }));
                        continue;
                    }
                    if (test) {
                        v++;
                    }
                }
                if (all.length) {
                    return Promise.all(all).then(() => v);
                }
                return v;
            }
        },
        groupByMap: {
            value: function (keySelector, selector) {
                const result = new linq_1.ManyMap();
                for (const each of this) {
                    result.push(keySelector(each), selector(each));
                }
                return result;
            }
        },
        groupBy: {
            value: function (keySelector, selector) {
                const result = {};
                for (const each of this) {
                    const key = keySelector(each);
                    (result[key] = result[key] || new Array()).push(selector(each));
                }
                return result;
            }
        },
        last: {
            get() {
                return this[this.length - 1];
            }
        },
        first: {
            get() {
                return this[0];
            }
        },
        forEachAsync: {
            value: function (fn) {
                return new promise_1.Queue().enqueueMany(this, fn);
            }
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0cy5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJleHBvcnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1Q0FBdUM7QUFDdkMsa0NBQWtDOztBQUVsQyxzQ0FBc0M7QUFDdEMsNENBQXVDO0FBOEV2QyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNoQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRTtRQUNyQyxZQUFZLEVBQUU7WUFDWixLQUFLLEVBQUUsVUFBVSxHQUFRLEVBQUUsWUFBaUI7Z0JBQzFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQztvQkFDUCxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsT0FBTyxZQUFZLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ3hGLENBQUM7Z0JBQ0QsT0FBTyxDQUFDLENBQUM7WUFDWCxDQUFDO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDNUI7O09BRUc7SUFDSCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRTtRQUN2QyxLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUU7UUFDeEMsTUFBTSxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1FBQ3RDLEdB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