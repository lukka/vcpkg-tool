"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceCurlyBraces = replaceCurlyBraces;
const i18n_1 = require("../i18n");
function replaceCurlyBraces(subject, properties) {
    // One of these tokens:
    // {{
    // }}
    // {variable}
    // {
    // }
    // (anything that has no {}s)
    const tokenRegex = /{{|}}|{([^}]+)}|{|}|[^{}]+/y;
    const resultElements = [];
    for (;;) {
        const thisMatch = tokenRegex.exec(subject);
        if (thisMatch === null) {
            return resultElements.join('');
        }
        const wholeMatch = thisMatch[0];
        if (wholeMatch === '{{') {
            resultElements.push('{');
            continue;
        }
        if (wholeMatch === '}}') {
            resultElements.push('}');
            continue;
        }
        if (wholeMatch === '{' || wholeMatch === '}') {
            throw new Error((0, i18n_1.i) `Found a mismatched ${wholeMatch} in '${subject}'. For a literal ${wholeMatch}, use ${wholeMatch}${wholeMatch} instead.`);
        }
        const variableName = thisMatch[1];
        if (variableName) {
            const variableValue = properties.get(variableName);
            if (typeof variableValue !== 'string') {
                throw new Error((0, i18n_1.i) `Could not find a value for {${variableName}} in '${subject}'. To write the literal value, use '{{${variableName}}}' instead.`);
            }
            resultElements.push(variableValue);
            continue;
        }
        resultElements.push(wholeMatch);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VybHktcmVwbGFjZW1lbnRzLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9taWNyb3NvZnQvdmNwa2ctdG9vbC9tYWluL3ZjcGtnLWFydGlmYWN0cy8iLCJzb3VyY2VzIjpbInV0aWwvY3VybHktcmVwbGFjZW1lbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1Q0FBdUM7QUFDdkMsa0NBQWtDOztBQUlsQyxnREE0Q0M7QUE5Q0Qsa0NBQTRCO0FBRTVCLFNBQWdCLGtCQUFrQixDQUFDLE9BQWUsRUFBRSxVQUErQjtJQUNqRix1QkFBdUI7SUFDdkIsS0FBSztJQUNMLEtBQUs7SUFDTCxhQUFhO0lBQ2IsSUFBSTtJQUNKLElBQUk7SUFDSiw2QkFBNkI7SUFDN0IsTUFBTSxVQUFVLEdBQUcsNkJBQTZCLENBQUM7SUFDakQsTUFBTSxjQUFjLEdBQW1CLEVBQUUsQ0FBQztJQUMxQyxTQUFTLENBQUM7UUFDUixNQUFNLFNBQVMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzNDLElBQUksU0FBUyxLQUFLLElBQUksRUFBRSxDQUFDO1lBQ3ZCLE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNqQyxDQUFDO1FBRUQsTUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLElBQUksVUFBVSxLQUFLLElBQUksRUFBRSxDQUFDO1lBQ3hCLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDekIsU0FBUztRQUNYLENBQUM7UUFFRCxJQUFJLFVBQVUsS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUN4QixjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3pCLFNBQVM7UUFDWCxDQUFDO1FBRUQsSUFBSSxVQUFVLEtBQUssR0FBRyxJQUFJLFVBQVUsS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUM3QyxNQUFNLElBQUksS0FBSyxDQUFDLElBQUEsUUFBQyxFQUFBLHNCQUFzQixVQUFVLFFBQVEsT0FBTyxvQkFBb0IsVUFBVSxTQUFTLFVBQVUsR0FBRyxVQUFVLFdBQVcsQ0FBQyxDQUFDO1FBQzdJLENBQUM7UUFFRCxNQUFNLFlBQVksR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEMsSUFBSSxZQUFZLEVBQUUsQ0FBQztZQUNqQixNQUFNLGFBQWEsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ25ELElBQUksT0FBTyxhQUFhLEtBQUssUUFBUSxFQUFFLENBQUM7Z0JBQ3RDLE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBQSxRQUFDLEVBQUEsK0JBQStCLFlBQVksU0FBUyxPQUFPLHlDQUF5QyxZQUFZLGNBQWMsQ0FBQyxDQUFDO1lBQ25KLENBQUM7WUFFRCxjQUFjLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ25DLFNBQVM7UUFDWCxDQUFDO1FBRUQsY0FBYyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNsQyxDQUFDO0FBQ0gsQ0FBQyJ9