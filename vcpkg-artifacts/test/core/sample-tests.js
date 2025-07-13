"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
const artifact_1 = require("../../artifacts/artifact");
const assert_1 = require("assert");
const mocha_1 = require("mocha");
(0, mocha_1.describe)('sanitization of paths', () => {
    (0, mocha_1.it)('makes nice clean paths', () => {
        assert_1.strict.equal((0, artifact_1.sanitizePath)(''), '');
        assert_1.strict.equal((0, artifact_1.sanitizePath)('.'), '');
        assert_1.strict.equal((0, artifact_1.sanitizePath)('..'), '');
        assert_1.strict.equal((0, artifact_1.sanitizePath)('..../....'), '');
        assert_1.strict.equal((0, artifact_1.sanitizePath)('..../foo/....'), 'foo');
        assert_1.strict.equal((0, artifact_1.sanitizePath)('..../..foo/....'), '..foo');
        assert_1.strict.equal((0, artifact_1.sanitizePath)('.config'), '.config');
        assert_1.strict.equal((0, artifact_1.sanitizePath)('\\.config'), '.config');
        assert_1.strict.equal((0, artifact_1.sanitizePath)('..\\.config'), '.config');
        assert_1.strict.equal((0, artifact_1.sanitizePath)('/bar'), 'bar');
        assert_1.strict.equal((0, artifact_1.sanitizePath)('\\this\\is\\a//test/of//a\\path//..'), 'this/is/a/test/of/a/path');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FtcGxlLXRlc3RzLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9taWNyb3NvZnQvdmNwa2ctdG9vbC9tYWluL3ZjcGtnLWFydGlmYWN0cy8iLCJzb3VyY2VzIjpbInRlc3QvY29yZS9zYW1wbGUtdGVzdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF1QztBQUN2QyxrQ0FBa0M7O0FBRWxDLHVEQUF3RDtBQUN4RCxtQ0FBZ0M7QUFDaEMsaUNBQXFDO0FBRXJDLElBQUEsZ0JBQVEsRUFBQyx1QkFBdUIsRUFBRSxHQUFHLEVBQUU7SUFDckMsSUFBQSxVQUFFLEVBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFO1FBQ2hDLGVBQU0sQ0FBQyxLQUFLLENBQUMsSUFBQSx1QkFBWSxFQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ25DLGVBQU0sQ0FBQyxLQUFLLENBQUMsSUFBQSx1QkFBWSxFQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3BDLGVBQU0sQ0FBQyxLQUFLLENBQUMsSUFBQSx1QkFBWSxFQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3JDLGVBQU0sQ0FBQyxLQUFLLENBQUMsSUFBQSx1QkFBWSxFQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzVDLGVBQU0sQ0FBQyxLQUFLLENBQUMsSUFBQSx1QkFBWSxFQUFDLGVBQWUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ25ELGVBQU0sQ0FBQyxLQUFLLENBQUMsSUFBQSx1QkFBWSxFQUFDLGlCQUFpQixDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDdkQsZUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFBLHVCQUFZLEVBQUMsU0FBUyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDakQsZUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFBLHVCQUFZLEVBQUMsV0FBVyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDbkQsZUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFBLHVCQUFZLEVBQUMsYUFBYSxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDckQsZUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFBLHVCQUFZLEVBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDMUMsZUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFBLHVCQUFZLEVBQUMscUNBQXFDLENBQUMsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO0lBQ2hHLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==