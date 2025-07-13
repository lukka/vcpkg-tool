"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseQuery = parseQuery;
exports.takeWhitespace = takeWhitespace;
const i18n_1 = require("../i18n");
const scanner_1 = require("./scanner");
function parseQuery(text) {
    const cursor = new scanner_1.Scanner(text);
    return QueryList.parse(cursor);
}
function takeWhitespace(cursor) {
    while (!cursor.eof && isWhiteSpace(cursor)) {
        cursor.take();
    }
}
function isWhiteSpace(cursor) {
    return cursor.kind === scanner_1.Kind.Whitespace;
}
class QueryList {
    queries = new Array();
    get isValid() {
        return !this.error;
    }
    error;
    constructor() {
        //
    }
    get length() {
        return this.queries.length;
    }
    static parse(cursor) {
        const result = new QueryList();
        try {
            cursor.scan(); // start the scanner
            for (const statement of QueryList.parseQuery(cursor)) {
                result.queries.push(statement);
            }
        }
        catch (error) {
            result.error = error;
        }
        return result;
    }
    static *parseQuery(cursor) {
        takeWhitespace(cursor);
        if (cursor.eof) {
            return;
        }
        yield Query.parse(cursor);
        takeWhitespace(cursor);
        if (cursor.eof) {
            return;
        }
        switch (cursor.kind) {
            case scanner_1.Kind.Comma:
                cursor.take();
                return yield* QueryList.parseQuery(cursor);
            case scanner_1.Kind.EndOfFile:
                return;
        }
        throw new scanner_1.MediaQueryError((0, i18n_1.i) `Expected comma, found ${JSON.stringify(cursor.text)}`, cursor.position.line, cursor.position.column);
    }
    get features() {
        const result = new Set();
        for (const query of this.queries) {
            for (const expression of query.expressions) {
                if (expression.feature) {
                    result.add(expression.feature);
                }
            }
        }
        return result;
    }
    match(properties) {
        if (this.isValid) {
            queries: for (const query of this.queries) {
                for (const { feature, constant, not } of query.expressions) {
                    // get the value from the context
                    const contextValue = stringValue(properties[feature]);
                    if (not) {
                        // negative/not present query
                        if (contextValue) {
                            // we have a value
                            if (constant && contextValue !== constant) {
                                continue; // the values are NOT a match.
                            }
                            if (!constant && contextValue === 'false') {
                                continue;
                            }
                        }
                        else {
                            // no value
                            if (!constant || contextValue === 'false') {
                                continue;
                            }
                        }
                    }
                    else {
                        // positive/present query
                        if (contextValue) {
                            if (contextValue === constant || contextValue !== 'false' && !constant) {
                                continue;
                            }
                        }
                        else {
                            if (constant === 'false') {
                                continue;
                            }
                        }
                    }
                    continue queries; // no match
                }
                // we matched a whole query, we're good
                return true;
            }
        }
        // no query matched.
        return false;
    }
}
function stringValue(value) {
    switch (typeof value) {
        case 'string':
        case 'number':
        case 'boolean':
            return value.toString();
        case 'object':
            return value === null ? 'true' : Array.isArray(value) ? stringValue(value[0]) || 'true' : 'true';
    }
    return undefined;
}
class Query {
    expressions;
    constructor(expressions) {
        this.expressions = expressions;
    }
    static parse(cursor) {
        const result = new Array();
        takeWhitespace(cursor);
        // eslint-disable-next-line no-constant-condition
        while (true) {
            result.push(Expression.parse(cursor));
            takeWhitespace(cursor);
            if (cursor.kind === scanner_1.Kind.AndKeyword) {
                cursor.take(); // consume and
                continue;
            }
            // the next token is not an 'and', so we bail now.
            return new Query(result);
        }
    }
}
class Expression {
    featureToken;
    constantToken;
    not;
    constructor(featureToken, constantToken, not) {
        this.featureToken = featureToken;
        this.constantToken = constantToken;
        this.not = not;
    }
    get feature() {
        return this.featureToken.text;
    }
    get constant() {
        return this.constantToken?.stringValue || this.constantToken?.text || undefined;
    }
    /** @internal */
    static parse(cursor, isNotted = false, inParen = false) {
        takeWhitespace(cursor);
        switch (cursor.kind) {
            case scanner_1.Kind.Identifier: {
                // start of an expression
                const feature = cursor.take();
                takeWhitespace(cursor);
                if (cursor.kind === scanner_1.Kind.Colon) {
                    cursor.take(); // consume colon;
                    // we have a constant for the
                    takeWhitespace(cursor);
                    switch (cursor.kind) {
                        case scanner_1.Kind.NumericLiteral:
                        case scanner_1.Kind.BooleanLiteral:
                        case scanner_1.Kind.Identifier:
                        case scanner_1.Kind.StringLiteral: {
                            // we have a good const value.
                            const constant = cursor.take();
                            return new Expression(feature, constant, isNotted);
                        }
                    }
                    throw new scanner_1.MediaQueryError((0, i18n_1.i) `Expected one of {Number, Boolean, Identifier, String}, found token ${JSON.stringify(cursor.text)}`, cursor.position.line, cursor.position.column);
                }
                return new Expression(feature, undefined, isNotted);
            }
            case scanner_1.Kind.NotKeyword:
                if (isNotted) {
                    throw new scanner_1.MediaQueryError((0, i18n_1.i) `Expression specified NOT twice`, cursor.position.line, cursor.position.column);
                }
                cursor.take(); // suck up the not token
                return Expression.parse(cursor, true, inParen);
            case scanner_1.Kind.OpenParen: {
                cursor.take();
                const result = Expression.parse(cursor, isNotted, inParen);
                takeWhitespace(cursor);
                if (cursor.kind !== scanner_1.Kind.CloseParen) {
                    throw new scanner_1.MediaQueryError((0, i18n_1.i) `Expected close parenthesis for expression, found ${JSON.stringify(cursor.text)}`, cursor.position.line, cursor.position.column);
                }
                cursor.take();
                return result;
            }
            default:
                throw new scanner_1.MediaQueryError((0, i18n_1.i) `Expected expression, found ${JSON.stringify(cursor.text)}`, cursor.position.line, cursor.position.column);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkaWEtcXVlcnkuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21pY3Jvc29mdC92Y3BrZy10b29sL21haW4vdmNwa2ctYXJ0aWZhY3RzLyIsInNvdXJjZXMiOlsibWVkaWFxdWVyeS9tZWRpYS1xdWVyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7QUFLbEMsZ0NBSUM7QUFFRCx3Q0FJQztBQWJELGtDQUE0QjtBQUM1Qix1Q0FBa0U7QUFFbEUsU0FBZ0IsVUFBVSxDQUFDLElBQVk7SUFDckMsTUFBTSxNQUFNLEdBQUcsSUFBSSxpQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRWpDLE9BQU8sU0FBUyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBRUQsU0FBZ0IsY0FBYyxDQUFDLE1BQWU7SUFDNUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDM0MsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2hCLENBQUM7QUFDSCxDQUFDO0FBRUQsU0FBUyxZQUFZLENBQUMsTUFBZTtJQUNuQyxPQUFPLE1BQU0sQ0FBQyxJQUFJLEtBQUssY0FBSSxDQUFDLFVBQVUsQ0FBQztBQUN6QyxDQUFDO0FBRUQsTUFBTSxTQUFTO0lBQ2IsT0FBTyxHQUFHLElBQUksS0FBSyxFQUFTLENBQUM7SUFDN0IsSUFBSSxPQUFPO1FBQ1QsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDckIsQ0FBQztJQUNELEtBQUssQ0FBbUI7SUFFeEI7UUFDRSxFQUFFO0lBQ0osQ0FBQztJQUVELElBQUksTUFBTTtRQUNSLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFDN0IsQ0FBQztJQUNELE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBZTtRQUMxQixNQUFNLE1BQU0s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