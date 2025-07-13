"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Info = void 0;
const i18n_1 = require("../i18n");
const error_kind_1 = require("../interfaces/error-kind");
const Entity_1 = require("../yaml/Entity");
const Options_1 = require("../yaml/Options");
class Info extends Entity_1.Entity {
    // See corresponding properties in MetadataFile
    get id() { return this.asString(this.getMember('id')) || ''; }
    get version() { return this.asString(this.getMember('version')) || ''; }
    get summary() { return this.asString(this.getMember('summary')); }
    get description() { return this.asString(this.getMember('description')); }
    options = new Options_1.Options(undefined, this, 'options');
    get priority() { return this.asNumber(this.getMember('priority')) || 0; }
    /** @internal */
    *validate() {
        yield* super.validate();
        yield* this.validateChildKeys(['version', 'id', 'summary', 'priority', 'description', 'options']);
        if (!this.has('id')) {
            yield { message: (0, i18n_1.i) `Missing identity '${'info.id'}'`, range: this, category: error_kind_1.ErrorKind.FieldMissing };
        }
        else if (!this.childIs('id', 'string')) {
            yield { message: (0, i18n_1.i) `info.id should be of type 'string', found '${this.kind('id')}'`, range: this.sourcePosition('id'), category: error_kind_1.ErrorKind.IncorrectType };
        }
        if (!this.has('version')) {
            yield { message: (0, i18n_1.i) `Missing version '${'info.version'}'`, range: this, category: error_kind_1.ErrorKind.FieldMissing };
        }
        else if (!this.childIs('version', 'string')) {
            yield { message: (0, i18n_1.i) `info.version should be of type 'string', found '${this.kind('version')}'`, range: this.sourcePosition('version'), category: error_kind_1.ErrorKind.IncorrectType };
        }
        if (this.childIs('summary', 'string') === false) {
            yield { message: (0, i18n_1.i) `info.summary should be of type 'string', found '${this.kind('summary')}'`, range: this.sourcePosition('summary'), category: error_kind_1.ErrorKind.IncorrectType };
        }
        if (this.childIs('description', 'string') === false) {
            yield { message: (0, i18n_1.i) `info.description should be of type 'string', found '${this.kind('description')}'`, range: this.sourcePosition('description'), category: error_kind_1.ErrorKind.IncorrectType };
        }
        if (this.childIs('options', 'sequence') === false) {
            yield { message: (0, i18n_1.i) `info.options should be a sequence, found '${this.kind('options')}'`, range: this.sourcePosition('options'), category: error_kind_1.ErrorKind.IncorrectType };
        }
    }
}
exports.Info = Info;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mby5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJhbWYvaW5mby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBRWxDLGtDQUE0QjtBQUM1Qix5REFBcUQ7QUFHckQsMkNBQXdDO0FBQ3hDLDZDQUEwQztBQUcxQyxNQUFhLElBQUssU0FBUSxlQUFNO0lBQzlCLCtDQUErQztJQUMvQyxJQUFJLEVBQUUsS0FBYSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFdEUsSUFBSSxPQUFPLEtBQWEsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRWhGLElBQUksT0FBTyxLQUF5QixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV0RixJQUFJLFdBQVcsS0FBeUIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFckYsT0FBTyxHQUFHLElBQUksaUJBQU8sQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBRTNELElBQUksUUFBUSxLQUFhLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVqRixnQkFBZ0I7SUFDUCxDQUFDLFFBQVE7UUFD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