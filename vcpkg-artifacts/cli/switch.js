"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switch = void 0;
const assert_1 = require("assert");
const i18n_1 = require("../i18n");
const format_1 = require("./format");
class Switch {
    command;
    title = '';
    required;
    constructor(command, options) {
        this.command = command;
        command.switches.push(this);
        this.required = options?.required || false;
    }
    get valid() {
        return this.required || this.active;
    }
    #values;
    get values() {
        return this.#values || (this.#values = this.command.commandLine.claim(this.switch) || []);
    }
    get value() {
        const v = this.values;
        assert_1.strict.ok(v.length < 2, (0, i18n_1.i) `Expected a single value for ${(0, format_1.cmdSwitch)(this.switch)} - found multiple`);
        return v[0];
    }
    get requiredValue() {
        const v = this.values;
        assert_1.strict.ok(v.length == 1 && v[0], (0, i18n_1.i) `Expected a single value for '--${this.switch}'.`);
        return v[0];
    }
    get active() {
        const v = this.values;
        return !!v && v.length > 0 && v[0] !== 'false';
    }
    get isRangeOfVersions() {
        return !!/[*[\]()~^]/.exec(this.value ?? '');
    }
}
exports.Switch = Switch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dpdGNoLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9taWNyb3NvZnQvdmNwa2ctdG9vbC9tYWluL3ZjcGtnLWFydGlmYWN0cy8iLCJzb3VyY2VzIjpbImNsaS9zd2l0Y2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF1QztBQUN2QyxrQ0FBa0M7OztBQUVsQyxtQ0FBZ0M7QUFDaEMsa0NBQTRCO0FBRTVCLHFDQUFxQztBQUdyQyxNQUFzQixNQUFNO0lBS0o7SUFIYixLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ1gsUUFBUSxDQUFVO0lBRTNCLFlBQXNCLE9BQWdCLEVBQUUsT0FBZ0M7UUFBbEQsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUNwQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sRUFBRSxRQUFRLElBQUksS0FBSyxDQUFDO0lBQzdDLENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN0QyxDQUFDO0lBRUQsT0FBTyxDQUFpQjtJQUN4QixJQUFJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDNUYsQ0FBQztJQUVELElBQUksS0FBSztRQUNQLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDdEIsZUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxJQUFBLFFBQUMsRUFBQSwrQkFBK0IsSUFBQSxrQkFBUyxFQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUNuRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNkLENBQUM7SUFFRCxJQUFJLGFBQWE7UUFDZixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3RCLGVBQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUEsUUFBQyxFQUFBLGtDQUFrQyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQztRQUNyRixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNkLENBQUM7SUFFRCxJQUFJLE1BQU07UUFDUixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3RCLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssT0FBTyxDQUFDO0lBQ2pELENBQUM7SUFDRCxJQUFJLGlCQUFpQjtRQUNuQixPQUFPLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLENBQUM7SUFDL0MsQ0FBQztDQUNGO0FBdENELHdCQXNDQyJ9