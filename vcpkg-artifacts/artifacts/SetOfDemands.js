"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetOfDemands = void 0;
const media_query_1 = require("../mediaquery/media-query");
const exceptions_1 = require("../util/exceptions");
const linq_1 = require("../util/linq");
class SetOfDemands {
    _demands = new Map();
    constructor(metadata, session) {
        this._demands.set('', metadata);
        for (const [query, demands] of metadata.conditionalDemands) {
            if ((0, media_query_1.parseQuery)(query).match(session.context)) {
                session.channels.debug(`Matching demand query: '${query}'`);
                this._demands.set(query, demands);
            }
        }
    }
    get installer() {
        const install = linq_1.linq.entries(this._demands).where(([query, demand]) => demand.install.length > 0).toArray();
        if (install.length > 1) {
            // bad. There should only ever be one install block.
            throw new exceptions_1.MultipleInstallsMatched(install.map(each => each[0]));
        }
        return install[0]?.[1].install || [];
    }
    get errors() {
        return linq_1.linq.values(this._demands).selectNonNullable(d => d.error).toArray();
    }
    get warnings() {
        return linq_1.linq.values(this._demands).selectNonNullable(d => d.warning).toArray();
    }
    get messages() {
        return linq_1.linq.values(this._demands).selectNonNullable(d => d.message).toArray();
    }
    get exports() {
        return linq_1.linq.values(this._demands).selectNonNullable(d => d.exports).toArray();
    }
    get requires() {
        const d = this._demands;
        const rq1 = linq_1.linq.values(d).selectNonNullable(d => d.requires).toArray();
        const result = {};
        for (const dict of rq1) {
            for (const [query, demands] of dict) {
                result[query] = demands;
            }
        }
        const rq = [...d.values()].map(each => each.requires).filter(each => each);
        for (const dict of rq) {
            for (const [query, demands] of dict) {
                result[query] = demands;
            }
        }
        return result;
    }
}
exports.SetOfDemands = SetOfDemands;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2V0T2ZEZW1hbmRzLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9taWNyb3NvZnQvdmNwa2ctdG9vbC9tYWluL3ZjcGtnLWFydGlmYWN0cy8iLCJzb3VyY2VzIjpbImFydGlmYWN0cy9TZXRPZkRlbWFuZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF1QztBQUN2QyxrQ0FBa0M7OztBQUtsQywyREFBdUQ7QUFFdkQsbURBQTZEO0FBQzdELHVDQUFvQztBQUdwQyxNQUFhLFlBQVk7SUFDdkIsUUFBUSxHQUFHLElBQUksR0FBRyxFQUFtQixDQUFDO0lBRXRDLFlBQVksUUFBc0IsRUFBRSxPQUFnQjtRQUNsRCxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFaEMsS0FBSyxNQUFNLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxJQUFJLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzNELElBQUksSUFBQSx3QkFBVSxFQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztnQkFDN0MsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsMkJBQTJCLEtBQUssR0FBRyxDQUFDLENBQUM7Z0JBQzVELElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNwQyxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFFRCxJQUFJLFNBQVM7UUFDWCxNQUFNLE9BQU8sR0FBRyxXQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxF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