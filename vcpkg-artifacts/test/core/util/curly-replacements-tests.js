"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
const curly_replacements_1 = require("../../../util/curly-replacements");
const assert_1 = require("assert");
describe('replaceCurlyBraces', () => {
    const replacements = new Map();
    replacements.set('exists', 'exists-replacement');
    replacements.set('another', 'some other replacement text');
    it('DoesNotTouchLiterals', () => {
        assert_1.strict.equal((0, curly_replacements_1.replaceCurlyBraces)('some literal text', replacements), 'some literal text');
    });
    it('DoesVariableReplacements', () => {
        assert_1.strict.equal((0, curly_replacements_1.replaceCurlyBraces)('some {exists} text', replacements), 'some exists-replacement text');
    });
    it('DoesMultipleVariableReplacements', () => {
        assert_1.strict.equal((0, curly_replacements_1.replaceCurlyBraces)('some {exists} {another} text', replacements), 'some exists-replacement some other replacement text text');
    });
    it('ThrowsForLeadingOnlyEscapes', () => {
        assert_1.strict.throws(() => {
            (0, curly_replacements_1.replaceCurlyBraces)('some {{exists} text', replacements);
        }, new Error('Found a mismatched } in \'some {{exists} text\'. For a literal }, use }} instead.'));
    });
    it('ConsidersTerminalCurlyAsPartOfVariable', () => {
        assert_1.strict.throws(() => {
            (0, curly_replacements_1.replaceCurlyBraces)('some {exists}} text', replacements);
        }, new Error('Found a mismatched } in \'some {exists}} text\'. For a literal }, use }} instead.'));
    });
    it('AllowsDoubleEscapes', () => {
        assert_1.strict.equal((0, curly_replacements_1.replaceCurlyBraces)('some {{{exists} text', replacements), 'some {exists-replacement text');
        assert_1.strict.equal((0, curly_replacements_1.replaceCurlyBraces)('some {exists}}} text', replacements), 'some exists-replacement} text');
        assert_1.strict.equal((0, curly_replacements_1.replaceCurlyBraces)('some {{exists}} text', replacements), 'some {exists} text');
        assert_1.strict.equal((0, curly_replacements_1.replaceCurlyBraces)('some {{{exists}}} text', replacements), 'some {exists-replacement} text');
        assert_1.strict.equal((0, curly_replacements_1.replaceCurlyBraces)('some {{{{{exists}}} text', replacements), 'some {{exists-replacement} text');
    });
    it('ThrowsForUnmatchedCurlies', () => {
        assert_1.strict.throws(() => {
            (0, curly_replacements_1.replaceCurlyBraces)('these are }{ not matched', replacements);
        }, new Error('Found a mismatched } in \'these are }{ not matched\'. For a literal }, use }} instead.'));
    });
    it('ThrowsForBadValues', () => {
        assert_1.strict.throws(() => {
            (0, curly_replacements_1.replaceCurlyBraces)('some {nonexistent} text', replacements);
        }, new Error('Could not find a value for {nonexistent} in \'some {nonexistent} text\'. To write the literal value, use \'{{nonexistent}}\' instead.'));
    });
    it('ThrowsForMismatchedBeginCurlies', () => {
        assert_1.strict.throws(() => {
            (0, curly_replacements_1.replaceCurlyBraces)('some {nonexistent', replacements);
        }, new Error('Found a mismatched { in \'some {nonexistent\'. For a literal {, use {{ instead.'));
    });
    it('ThrowsForMismatchedEndCurlies', () => {
        assert_1.strict.throws(() => {
            (0, curly_replacements_1.replaceCurlyBraces)('some }nonexistent', replacements);
        }, new Error('Found a mismatched } in \'some }nonexistent\'. For a literal }, use }} instead.'));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VybHktcmVwbGFjZW1lbnRzLXRlc3RzLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9taWNyb3NvZnQvdmNwa2ctdG9vbC9tYWluL3ZjcGtnLWFydGlmYWN0cy8iLCJzb3VyY2VzIjpbInRlc3QvY29yZS91dGlsL2N1cmx5LXJlcGxhY2VtZW50cy10ZXN0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7QUFFbEMseUVBQXNFO0FBQ3RFLG1DQUFnQztBQUVoQyxRQUFRLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxFQUFFO0lBQ2xDLE1BQU0sWUFBWSxHQUFHLElBQUksR0FBRyxFQUFrQixDQUFDO0lBQy9DLFlBQVksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLG9CQUFvQixDQUFDLENBQUM7SUFDakQsWUFBWSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsNkJBQTZCLENBQUMsQ0FBQztJQUUzRCxFQUFFLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFO1FBQzlCLGVBQU0sQ0FBQyxLQUFLLENBQUMsSUFBQSx1Q0FBa0IsRUFBQyxtQkFBbUIsRUFBRSxZQUFZLENBQUMsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0lBQzNGLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtRQUNsQyxlQUFNLENBQUMsS0FBSyxDQUFDLElBQUEsdUNBQWtCLEVBQUMsb0JBQW9CLEVBQUUsWUFBWSxDQUFDLEVBQUUsOEJBQThCLENBQUMsQ0FBQztJQUN2RyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRSxHQUFHLEVBQUU7UUFDMUMsZUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFBLHVDQUFrQixFQUFDLDhCQUE4QixFQUFFLFlBQVksQ0FBQyxFQUFFLDBEQUEwRCxDQUFDLENBQUM7SUFDN0ksQ0FBQyxDQUFDLENBQUM7SUFF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