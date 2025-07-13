"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contacts = exports.Contact = void 0;
const Entity_1 = require("../yaml/Entity");
const EntityMap_1 = require("../yaml/EntityMap");
const strings_1 = require("../yaml/strings");
class Contact extends Entity_1.Entity {
    get email() { return this.asString(this.getMember('email')); }
    set email(value) { this.setMember('email', value); }
    roles = new strings_1.Strings(undefined, this, 'role');
    /** @internal */
    *validate() {
        yield* super.validate();
        yield* this.validateChildKeys(['email', 'role']);
        yield* this.validateChild('email', 'string');
    }
}
exports.Contact = Contact;
class Contacts extends EntityMap_1.EntityMap {
    constructor(node, parent, key) {
        super(Contact, node, parent, key);
    }
    /** @internal */
    *validate() {
        yield* super.validate();
        if (this.exists()) {
            for (const [key, contact] of this) {
                yield* contact.validate();
            }
        }
    }
}
exports.Contacts = Contacts;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGFjdC5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJhbWYvY29udGFjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBS2xDLDJDQUF3QztBQUN4QyxpREFBOEM7QUFDOUMsNkNBQTBDO0FBRzFDLE1BQWEsT0FBUSxTQUFRLGVBQU07SUFDakMsSUFBSSxLQUFLLEtBQXlCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xGLElBQUksS0FBSyxDQUFDLEtBQXlCLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRS9ELEtBQUssR0FBRyxJQUFJLGlCQUFPLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN0RCxnQkFBZ0I7SUFDUCxDQUFDLFFBQVE7UUFDaEIsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3hCLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2pELEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQy9DLENBQUM7Q0FDRjtBQVhELDBCQVdDO0FBRUQsTUFBYSxRQUFTLFNBQVEscUJBQWtDO0lBQzlELFlBQVksSUFBcUIsRUFBRSxNQUFhLEVBQUUsR0FBWTtRQUM1RCxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUNELGdCQUFnQjtJQUNQLENBQUMsUUFBUTtRQUNoQixLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDeEIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQztZQUNsQixLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7Z0JBQ2xDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUM1QixDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7Q0FDRjtBQWJELDRCQWFDIn0=