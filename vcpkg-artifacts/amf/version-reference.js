"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionReference = void 0;
const semver_1 = require("semver");
const yaml_types_1 = require("../yaml/yaml-types");
// nuget-semver parser doesn't have a ts typings package
// eslint-disable-next-line @typescript-eslint/no-var-requires
const parseRange = require('@snyk/nuget-semver/lib/range-parser');
class VersionReference extends yaml_types_1.Yaml {
    get raw() {
        return this.node?.value || undefined;
    }
    set raw(value) {
        if (value === undefined) {
            this.dispose(true);
        }
        else {
            this.node = new yaml_types_1.YAMLScalar(value);
        }
    }
    static create() {
        return new yaml_types_1.YAMLScalar('');
    }
    split() {
        const v = this.raw;
        if (v) {
            const [, a, b] = /(.+)\s+([\d\\.]+)/.exec(v) || [];
            if (/\[|\]|\(|\)/.exec(v)) {
                // looks like a nuget version range.
                try {
                    const range = parseRange(a || v);
                    let str = '';
                    if (range._components[0].minOperator) {
                        str = `${range._components[0].minOperator} ${range._components[0].minOperand}`;
                    }
                    if (range._components[0].maxOperator) {
                        str = `${str} ${range._components[0].maxOperator} ${range._components[0].maxOperand}`;
                    }
                    const newRange = new semver_1.Range(str);
                    newRange.raw = a || v;
                    if (b) {
                        const ver = new semver_1.SemVer(b, true);
                        return [newRange, ver];
                    }
                    return [newRange, undefined];
                }
                catch (E) {
                    // ignore and fall thru
                }
            }
            if (a) {
                // we have at least a range going on here.
                try {
                    const range = new semver_1.Range(a, true);
                    const ver = new semver_1.SemVer(b, true);
                    return [range, ver];
                }
                catch (E) {
                    // ignore and fall thru
                }
            }
            // the range or version didn't resolve correctly.
            // must be a range alone.
            return [new semver_1.Range(v, true), undefined];
        }
        return [new semver_1.Range('*', true), undefined];
    }
    get range() {
        return this.split()[0];
    }
    set range(ver) {
        this.raw = `${ver.raw} ${this.resolved?.raw || ''}`.trim();
    }
    get resolved() {
        return this.split()[1];
    }
    set resolved(ver) {
        this.raw = `${this.range.raw} ${ver?.raw || ''}`.trim();
    }
}
exports.VersionReference = VersionReference;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVyc2lvbi1yZWZlcmVuY2UuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21pY3Jvc29mdC92Y3BrZy10b29sL21haW4vdmNwa2ctYXJ0aWZhY3RzLyIsInNvdXJjZXMiOlsiYW1mL3ZlcnNpb24tcmVmZXJlbmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1Q0FBdUM7QUFDdkMsa0NBQWtDOzs7QUFFbEMsbUNBQXVDO0FBRXZDLG1EQUFzRDtBQUd0RCx3REFBd0Q7QUFDeEQsOERBQThEO0FBQzlELE1BQU0sVUFBVSxHQUFRLE9BQU8sQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO0FBRXZFLE1BQWEsZ0JBQWlCLFNBQVEsaUJBQWdCO0lBQ3BELElBQUksR0FBRztRQUNMLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLElBQUksU0FBUyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxJQUFJLEdBQUcsQ0FBQyxLQUF5QjtRQUMvQixJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUN4QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JCLENBQUM7YUFBTSxDQUFDO1lBQ04sSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLHVCQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEMsQ0FBQztJQUNILENBQUM7SUFFRCxNQUFNLENBQVUsTUFBTTtRQUNwQixPQUFPLElBQUksdUJBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRU8sS0FBSztRQUVYLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDbkIsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUVOLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBRW5ELElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUMxQixvQ0FBb0M7Z0JBQ3BDLElBQUksQ0FBQztvQkFDSCxNQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNqQyxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7b0JBQ2IsSUFBSSxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO3dCQUNyQyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsSUFBSSxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO29CQUNqRixDQUFDO29CQUNELElBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQzt3QkFDckMsR0FBRyxHQUFHLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxJQUFJLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7b0JBQ3hGLENBQUM7b0JBQ0QsTUFBTSxRQUFRLEdBQUcsSUFBSSxjQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ2hDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFFdEIsSUFBSSxDQUFDLEVBQUUsQ0FBQzt3QkFDTixNQUFNLEdBQUcsR0FBRyxJQUFJLGVBQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBQ2hDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ3pCLENBQUM7b0JBRUQsT0FBTyxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFFL0IsQ0FBQztnQkFBQyxPQUFPLENBQUMsRUFBRSxDQUFDO29CQUNYLHVCQUF1QjtnQkFDekIsQ0FBQztZQUNILENBQUM7WUFFRCxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUNOLDBDQUEwQztnQkFDMUMsSUFBSSxDQUFDO29CQUNILE1BQU0sS0FBSyxHQUFHLElBQUksY0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDakMsTUFBTSxHQUFHLEdBQUcsSUFBSSxlQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUNoQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUN0QixDQUFDO2dCQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7b0JBQ1gsdUJBQXVCO2dCQUN6QixDQUFDO1lBQ0gsQ0FBQztZQUNELGlEQUFpRDtZQUNqRCx5QkFBeUI7WUFDekIsT0FBTyxDQUFDLElBQUksY0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUN6QyxDQUFDO1FBQ0QsT0FBTyxDQUFDLElBQUksY0FBSyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBQ0QsSUFBSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUNELElBQUksS0FBSyxDQUFDLEdBQVU7UUFDbEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDN0QsQ0FBQztJQUVELElBQUksUUFBUTtRQUNWLE9BQU8sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFDRCxJQUFJLFFBQVEsQ0FBQyxHQUF1QjtRQUNsQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksR0FBRyxFQUFFLEdBQUcsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMxRCxDQUFDO0NBQ0Y7QUEvRUQsNENBK0VDIn0=