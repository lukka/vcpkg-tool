"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeEval = void 0;
exports.createSandbox = createSandbox;
exports.setLocale = setLocale;
exports.i = i;
/* eslint-disable @typescript-eslint/no-var-requires */
const vm = require("vm");
/**
 * Creates a reusable safe-eval sandbox to execute code in.
 */
function createSandbox() {
    const sandbox = vm.createContext({});
    return (code, context) => {
        const response = 'SAFE_EVAL_' + Math.floor(Math.random() * 1000000);
        sandbox[response] = {};
        if (context) {
            Object.keys(context).forEach(key => sandbox[key] = context[key]);
            vm.runInContext(`try {  ${response} = ${code} } catch (e) { ${response} = undefined }`, sandbox);
            for (const key of Object.keys(context)) {
                delete sandbox[key];
            }
        }
        else {
            vm.runInContext(`${response} = ${code}`, sandbox);
        }
        return sandbox[response];
    };
}
exports.safeEval = createSandbox();
let currentLocale = require('./locales/messages.json');
function setLocale(newLocale) {
    if (newLocale) {
        currentLocale = require(newLocale);
    }
}
/**
 * generates the translation key for a given message
 *
 * @param literals
 * @returns the key
 */
function indexOf(literals) {
    const content = literals.flatMap((k, i) => [k, '$']);
    content.length--; // drop the trailing undefined.
    return content.join('').trim().replace(/ [a-z]/g, ([a, b]) => b.toUpperCase()).replace(/[^a-zA-Z$]/g, '');
}
/**
 * Support for tagged template literals for i18n.
 *
 * Leverages translation files in ../i18n
 *
 * @param literals the literal values in the tagged template
 * @param values the inserted values in the template
 *
 * @translator
 */
function i(literals, ...values) {
    const key = indexOf(literals);
    if (key) {
        const str = currentLocale[key]; // get localized string
        if (str) {
            // fill out the template string.
            return (0, exports.safeEval)(`\`${str}\``, values.reduce((p, c, i) => { p[`p${i}`] = c; return p; }, {}));
        }
    }
    // if the translation isn't available, just resolve the string template normally.
    return String.raw(literals, ...values);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bi5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJpMThuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1Q0FBdUM7QUFDdkMsa0NBQWtDOzs7QUFPbEMsc0NBZ0JDO0FBT0QsOEJBSUM7QUF5QkQsY0FXQztBQXBFRCx1REFBdUQ7QUFDdkQseUJBQXlCO0FBQ3pCOztHQUVHO0FBQ0gsU0FBZ0IsYUFBYTtJQUMzQixNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3JDLE9BQU8sQ0FBQyxJQUFZLEVBQUUsT0FBYSxFQUFFLEVBQUU7UUFDckMsTUFBTSxRQUFRLEdBQUcsWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxDQUFDO1FBQ3BFLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDdkIsSUFBSSxPQUFPLEVBQUUsQ0FBQztZQUNaLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2pFLEVBQUUsQ0FBQyxZQUFZLENBQUMsVUFBVSxRQUFRLE1BQU0sSUFBSSxrQkFBa0IsUUFBUSxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNqRyxLQUFLLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztnQkFDdkMsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdEIsQ0FBQztRQUNILENBQUM7YUFBTSxDQUFDO1lBQ04sRUFBRSxDQUFDLFlBQVksQ0FBQyxHQUFHLFFBQVEsTUFBTSxJQUFJLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNwRCxDQUFDO1FBQ0QsT0FBTyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDM0IsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVZLFFBQUEsUUFBUSxHQUFHLGFBQWEsRUFBRSxDQUFDO0FBR3hDLElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBRXZELFNBQWdCLFNBQVMsQ0FBQyxTQUE2QjtJQUNyRCxJQUFJLFNBQVMsRUFBRSxDQUFDO1FBQ2QsYUFBYSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNyQyxDQUFDO0FBQ0gsQ0FBQztBQUdEOzs7OztHQUtHO0FBQ0gsU0FBUyxPQUFPLENBQUMsUUFBOEI7SUFDN0MsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDckQsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsK0JBQStCO0lBQ2pELE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDNUcsQ0FBQztBQUVEOzs7Ozs7Ozs7R0FTRztBQUNILFNBQWdCLENBQUMsQ0FBQyxRQUE4QixFQUFFLEdBQUcsTUFBMkQ7SUFDOUcsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzlCLElBQUksR0FBRyxFQUFFLENBQUM7UUFDUixNQUFNLEdBQUcsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyx1QkFBdUI7UUFDdkQsSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUNSLGdDQUFnQztZQUNoQyxPQUFPLElBQUEsZ0JBQVEsRUFBQyxLQUFLLEdBQUcsSUFBSSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3BHLENBQUM7SUFDSCxDQUFDO0lBQ0QsaUZBQWlGO0lBQ2pGLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxNQUFNLENBQUMsQ0FBQztBQUN6QyxDQUFDIn0=