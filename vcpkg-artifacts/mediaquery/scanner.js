"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaQueryError = exports.Scanner = exports.Kind = exports.messages = exports.MessageCategory = void 0;
exports.format = format;
const i18n_1 = require("../i18n");
const character_codes_1 = require("./character-codes");
var MessageCategory;
(function (MessageCategory) {
    MessageCategory[MessageCategory["Warning"] = 0] = "Warning";
    MessageCategory[MessageCategory["Error"] = 1] = "Error";
    MessageCategory[MessageCategory["Suggestion"] = 2] = "Suggestion";
    MessageCategory[MessageCategory["Message"] = 3] = "Message";
})(MessageCategory || (exports.MessageCategory = MessageCategory = {}));
exports.messages = {
    DigitExpected: { code: 1100, category: MessageCategory.Error, text: 'Digit expected (0-9)' },
    HexDigitExpected: { code: 1101, category: MessageCategory.Error, text: 'Hex Digit expected (0-F,0-f)' },
    BinaryDigitExpected: { code: 1102, category: MessageCategory.Error, text: 'Binary Digit expected (0,1)' },
    UnexpectedEndOfFile: { code: 1103, category: MessageCategory.Error, text: 'Unexpected end of file while searching for \'{0}\'' },
    InvalidEscapeSequence: { code: 1104, category: MessageCategory.Error, text: 'Invalid escape sequence' },
};
function format(text, ...args) {
    return text.replace(/{(\d+)}/g, (_match, index) => '' + args[+index] || '<ARGMISSING>');
}
// All conflict markers consist of the same character repeated seven times.  If it is
// a <<<<<<< or >>>>>>> marker then it is also followed by a space.
const mergeConflictMarkerLength = 7;
var Kind;
(function (Kind) {
    Kind[Kind["Unknown"] = 0] = "Unknown";
    Kind[Kind["EndOfFile"] = 1] = "EndOfFile";
    Kind[Kind["SingleLineComment"] = 2] = "SingleLineComment";
    Kind[Kind["MultiLineComment"] = 3] = "MultiLineComment";
    Kind[Kind["NewLine"] = 4] = "NewLine";
    Kind[Kind["Whitespace"] = 5] = "Whitespace";
    // We detect and provide better error recovery when we encounter a git merge marker.  This
    // allows us to edit files with git-conflict markers in them in a much more pleasant manner.
    Kind[Kind["ConflictMarker"] = 6] = "ConflictMarker";
    // Literals
    Kind[Kind["NumericLiteral"] = 7] = "NumericLiteral";
    Kind[Kind["StringLiteral"] = 8] = "StringLiteral";
    // Boolean Literals
    Kind[Kind["BooleanLiteral"] = 9] = "BooleanLiteral";
    Kind[Kind["TrueKeyword"] = 10] = "TrueKeyword";
    Kind[Kind["FalseKeyword"] = 11] = "FalseKeyword";
    // Punctuation
    Kind[Kind["OpenBrace"] = 12] = "OpenBrace";
    Kind[Kind["CloseBrace"] = 13] = "CloseBrace";
    Kind[Kind["OpenParen"] = 14] = "OpenParen";
    Kind[Kind["CloseParen"] = 15] = "CloseParen";
    Kind[Kind["OpenBracket"] = 16] = "OpenBracket";
    Kind[Kind["CloseBracket"] = 17] = "CloseBracket";
    Kind[Kind["Dot"] = 18] = "Dot";
    Kind[Kind["Elipsis"] = 19] = "Elipsis";
    Kind[Kind["Semicolon"] = 20] = "Semicolon";
    Kind[Kind["Comma"] = 21] = "Comma";
    Kind[Kind["QuestionDot"] = 22] = "QuestionDot";
    Kind[Kind["LessThan"] = 23] = "LessThan";
    Kind[Kind["OpenAngle"] = 23] = "OpenAngle";
    Kind[Kind["LessThanSlash"] = 24] = "LessThanSlash";
    Kind[Kind["GreaterThan"] = 25] = "GreaterThan";
    Kind[Kind["CloseAngle"] = 25] = "CloseAngle";
    Kind[Kind["LessThanEquals"] = 26] = "LessThanEquals";
    Kind[Kind["GreaterThanEquals"] = 27] = "GreaterThanEquals";
    Kind[Kind["EqualsEquals"] = 28] = "EqualsEquals";
    Kind[Kind["ExclamationEquals"] = 29] = "ExclamationEquals";
    Kind[Kind["EqualsEqualsEquals"] = 30] = "EqualsEqualsEquals";
    Kind[Kind["ExclamationEqualsEquals"] = 31] = "ExclamationEqualsEquals";
    Kind[Kind["EqualsArrow"] = 32] = "EqualsArrow";
    Kind[Kind["Plus"] = 33] = "Plus";
    Kind[Kind["Minus"] = 34] = "Minus";
    Kind[Kind["Asterisk"] = 35] = "Asterisk";
    Kind[Kind["AsteriskAsterisk"] = 36] = "AsteriskAsterisk";
    Kind[Kind["Slash"] = 37] = "Slash";
    Kind[Kind["Percent"] = 38] = "Percent";
    Kind[Kind["PlusPlus"] = 39] = "PlusPlus";
    Kind[Kind["MinusMinus"] = 40] = "MinusMinus";
    Kind[Kind["LessThanLessThan"] = 41] = "LessThanLessThan";
    Kind[Kind["GreaterThanGreaterThan"] = 42] = "GreaterThanGreaterThan";
    Kind[Kind["GreaterThanGreaterThanGreaterThan"] = 43] = "GreaterThanGreaterThanGreaterThan";
    Kind[Kind["Ampersand"] = 44] = "Ampersand";
    Kind[Kind["Bar"] = 45] = "Bar";
    Kind[Kind["Caret"] = 46] = "Caret";
    Kind[Kind["Exclamation"] = 47] = "Exclamation";
    Kind[Kind["Tilde"] = 48] = "Tilde";
    Kind[Kind["AmpersandAmpersand"] = 49] = "AmpersandAmpersand";
    Kind[Kind["BarBar"] = 50] = "BarBar";
    Kind[Kind["Question"] = 51] = "Question";
    Kind[Kind["Colon"] = 52] = "Colon";
    Kind[Kind["At"] = 53] = "At";
    Kind[Kind["QuestionQuestion"] = 54] = "QuestionQuestion";
    // Assignments
    Kind[Kind["Equals"] = 55] = "Equals";
    Kind[Kind["PlusEquals"] = 56] = "PlusEquals";
    Kind[Kind["MinusEquals"] = 57] = "MinusEquals";
    Kind[Kind["AsteriskEquals"] = 58] = "AsteriskEquals";
    Kind[Kind["AsteriskAsteriskEquals"] = 59] = "AsteriskAsteriskEquals";
    Kind[Kind["SlashEquals"] = 60] = "SlashEquals";
    Kind[Kind["PercentEquals"] = 61] = "PercentEquals";
    Kind[Kind["LessThanLessThanEquals"] = 62] = "LessThanLessThanEquals";
    Kind[Kind["GreaterThanGreaterThanEquals"] = 63] = "GreaterThanGreaterThanEquals";
    Kind[Kind["GreaterThanGreaterThanGreaterThanEquals"] = 64] = "GreaterThanGreaterThanGreaterThanEquals";
    Kind[Kind["AmpersandEquals"] = 65] = "AmpersandEquals";
    Kind[Kind["BarEquals"] = 66] = "BarEquals";
    Kind[Kind["BarBarEquals"] = 67] = "BarBarEquals";
    Kind[Kind["AmpersandAmpersandEquals"] = 68] = "AmpersandAmpersandEquals";
    Kind[Kind["QuestionQuestionEquals"] = 69] = "QuestionQuestionEquals";
    Kind[Kind["CaretEquals"] = 70] = "CaretEquals";
    // Identifiers
    Kind[Kind["Identifier"] = 71] = "Identifier";
    // Keywords
    Kind[Kind["KeywordsStart"] = 1000] = "KeywordsStart";
    Kind[Kind["AndKeyword"] = 1001] = "AndKeyword";
    Kind[Kind["NotKeyword"] = 1002] = "NotKeyword";
    Kind[Kind["KeywordsEnd"] = 1003] = "KeywordsEnd";
    // Tokens that can represent elements
    Kind[Kind["Elements"] = 2000] = "Elements";
    Kind[Kind["Model"] = 2001] = "Model";
    Kind[Kind["Enum"] = 2002] = "Enum";
    Kind[Kind["EnumValue"] = 2003] = "EnumValue";
    Kind[Kind["Import"] = 2004] = "Import";
    Kind[Kind["TypeAlias"] = 2005] = "TypeAlias";
    Kind[Kind["ParameterAlias"] = 2006] = "ParameterAlias";
    Kind[Kind["ResponseAlias"] = 2007] = "ResponseAlias";
    Kind[Kind["Interface"] = 2008] = "Interface";
    Kind[Kind["Operation"] = 2009] = "Operation";
    Kind[Kind["Annotation"] = 2010] = "Annotation";
    Kind[Kind["Documentation"] = 2011] = "Documentation";
    Kind[Kind["Label"] = 2012] = "Label";
    Kind[Kind["Preamble"] = 2013] = "Preamble";
    Kind[Kind["Property"] = 2014] = "Property";
    Kind[Kind["Parameter"] = 2015] = "Parameter";
    Kind[Kind["TemplateDeclaration"] = 2016] = "TemplateDeclaration";
    Kind[Kind["TemplateParameters"] = 2017] = "TemplateParameters";
    Kind[Kind["Parent"] = 2018] = "Parent";
    Kind[Kind["Response"] = 2019] = "Response";
    Kind[Kind["ResponseExpression"] = 2020] = "ResponseExpression";
    Kind[Kind["Result"] = 2021] = "Result";
    Kind[Kind["TypeExpression"] = 2022] = "TypeExpression";
    Kind[Kind["Union"] = 2023] = "Union";
})(Kind || (exports.Kind = Kind = {}));
const keywords = new Map([
    ['NOT', Kind.NotKeyword],
    ['not', Kind.NotKeyword],
    ['AND', Kind.AndKeyword],
    ['and', Kind.AndKeyword],
    ['true', Kind.BooleanLiteral], // TrueKeyword
    ['false', Kind.BooleanLiteral] // FalseKeyword
]);
class Scanner {
    #offset = 0;
    #line = 0;
    #column = 0;
    #map = new Array();
    #length;
    #text;
    #ch;
    #chNext;
    #chNextNext;
    #chSz;
    #chNextSz;
    #chNextNextSz;
    /** The assumed tab width. If this is set before scanning, it enables accurate Position tracking. */
    tabWidth = 2;
    // current token information
    /** the character offset within the document */
    offset;
    /** the token kind */
    kind;
    /** the text of the current token (when appropriate) */
    text;
    /** the string value of current string literal token (unquoted, unescaped) */
    stringValue;
    /** returns the Position (line/column) of the current token */
    get position() {
        return this.positionFromOffset(this.offset);
    }
    constructor(text) {
        this.#text = text;
        this.#length = text.length;
        this.advance(0);
        this.markPosition();
        // let's hide these, then we can clone this nicely.
        Object.defineProperty(this, 'tabWidth', { enumerable: false });
    }
    get eof() {
        return this.#offset > (this.#length);
    }
    advance(count) {
        let codeOrChar;
        let newOffset;
        let offsetAdvancedBy = 0;
        switch (count) {
            case undefined:
            case 1:
                offsetAdvancedBy = this.#chSz;
                this.#offset += this.#chSz;
                this.#ch = this.#chNext;
                this.#chSz = this.#chNextSz;
                this.#chNext = this.#chNextNext;
                this.#chNextSz = this.#chNextNextSz;
                newOffset = this.#offset + this.#chSz + this.#chNextSz;
                codeOrChar = this.#text.charCodeAt(newOffset);
                this.#chNextNext = (this.#chNextNextSz = (0, character_codes_1.sizeOf)(codeOrChar)) === 1 ? codeOrChar : this.#text.codePointAt(newOffset);
                return offsetAdvancedBy;
            case 2:
                offsetAdvancedBy = this.#chSz + this.#chNextSz;
                this.#offset += this.#chSz + this.#chNextSz;
                this.#ch = this.#chNextNext;
                this.#chSz = this.#chNextNextSz;
                newOffset = this.#offset + this.#chSz;
                codeOrChar = this.#text.charCodeAt(newOffset);
                this.#chNext = (this.#chNextSz = (0, character_codes_1.sizeOf)(codeOrChar)) === 1 ? codeOrChar : this.#text.codePointAt(newOffset);
                newOffset += this.#chNextSz;
                codeOrChar = this.#text.charCodeAt(newOffset);
                this.#chNextNext = (this.#chNextNextSz = (0, character_codes_1.sizeOf)(codeOrChar)) === 1 ? codeOrChar : this.#text.codePointAt(newOffset);
                return offsetAdvancedBy;
            default:
            case 3:
                offsetAdvancedBy = this.#chSz + this.#chNextSz + this.#chNextNextSz;
                count -= 3;
                while (count) {
                    // skip over characters while we work.
                    offsetAdvancedBy += (0, character_codes_1.sizeOf)(this.#text.charCodeAt(this.#offset + offsetAdvancedBy));
                }
                this.#offset += offsetAdvancedBy;
            // eslint-disable-next-line no-fallthrough
            case 0:
                newOffset = this.#offset;
                codeOrChar = this.#text.charCodeAt(newOffset);
                this.#ch = (this.#chSz = (0, character_codes_1.sizeOf)(codeOrChar)) === 1 ? codeOrChar : this.#text.codePointAt(newOffset);
                newOffset += this.#chSz;
                codeOrChar = this.#text.charCodeAt(newOffset);
                this.#chNext = (this.#chNextSz = (0, character_codes_1.sizeOf)(codeOrChar)) === 1 ? codeOrChar : this.#text.codePointAt(newOffset);
                newOffset += this.#chNextSz;
                codeOrChar = this.#text.charCodeAt(newOffset);
                this.#chNextNext = (this.#chNextNextSz = (0, character_codes_1.sizeOf)(codeOrChar)) === 1 ? codeOrChar : this.#text.codePointAt(newOffset);
                return offsetAdvancedBy;
        }
    }
    next(token, count = 1, value) {
        const originalOffset = this.#offset;
        const offsetAdvancedBy = this.advance(count);
        this.text = value || this.#text.substr(originalOffset, offsetAdvancedBy);
        this.#column += count;
        return this.kind = token;
    }
    /** adds the current position to the token to the offset:position map */
    markPosition() {
        this.#map.push({ offset: this.#offset, column: this.#column, line: this.#line });
    }
    /** updates the position and marks the location  */
    newLine(count = 1) {
        this.text = this.#text.substr(this.#offset, count);
        this.advance(count);
        this.#line++;
        this.#column = 0;
        this.markPosition(); // make sure the map has the new location
        return this.kind = Kind.NewLine;
    }
    start() {
        if (this.offset === undefined) {
            this.scan();
        }
        return this;
    }
    /**
     * Identifies and returns the next token type in the document
     *
     * @returns the state of the scanner will have the properties `token`, `value`, `offset` pointing to the current token at the end of this call.
     *
     * @notes before this call, `#offset` is pointing to the next character to be evaluated.
     *
     */
    scan() {
        // this token starts at
        this.offset = this.#offset;
        this.stringValue = undefined;
        if (!this.eof) {
            switch (this.#ch) {
                case 13 /* CharacterCodes.carriageReturn */:
                    return this.newLine(this.#chNext === 10 /* CharacterCodes.lineFeed */ ? 2 : 1);
                case 10 /* CharacterCodes.lineFeed */:
                    return this.newLine();
                case 9 /* CharacterCodes.tab */:
                case 11 /* CharacterCodes.verticalTab */:
                case 12 /* CharacterCodes.formFeed */:
                case 32 /* CharacterCodes.space */:
                case 160 /* CharacterCodes.nonBreakingSpace */:
                case 5760 /* CharacterCodes.ogham */:
                case 8192 /* CharacterCodes.enQuad */:
                case 8193 /* CharacterCodes.emQuad */:
                case 8194 /* CharacterCodes.enSpace */:
                case 8195 /* CharacterCodes.emSpace */:
                case 8196 /* CharacterCodes.threePerEmSpace */:
                case 8197 /* CharacterCodes.fourPerEmSpace */:
                case 8198 /* CharacterCodes.sixPerEmSpace */:
                case 8199 /* CharacterCodes.figureSpace */:
                case 8200 /* CharacterCodes.punctuationSpace */:
                case 8201 /* CharacterCodes.thinSpace */:
                case 8202 /* CharacterCodes.hairSpace */:
                case 8203 /* CharacterCodes.zeroWidthSpace */:
                case 8239 /* CharacterCodes.narrowNoBreakSpace */:
                case 8287 /* CharacterCodes.mathematicalSpace */:
                case 12288 /* CharacterCodes.ideographicSpace */:
                case 65279 /* CharacterCodes.byteOrderMark */:
                    return this.scanWhitespace();
                case 40 /* CharacterCodes.openParen */:
                    return this.next(Kind.OpenParen);
                case 41 /* CharacterCodes.closeParen */:
                    return this.next(Kind.CloseParen);
                case 44 /* CharacterCodes.comma */:
                    return this.next(Kind.Comma);
                case 58 /* CharacterCodes.colon */:
                    return this.next(Kind.Colon);
                case 59 /* CharacterCodes.semicolon */:
                    return this.next(Kind.Semicolon);
                case 91 /* CharacterCodes.openBracket */:
                    return this.next(Kind.OpenBracket);
                case 93 /* CharacterCodes.closeBracket */:
                    return this.next(Kind.CloseBracket);
                case 123 /* CharacterCodes.openBrace */:
                    return this.next(Kind.OpenBrace);
                case 125 /* CharacterCodes.closeBrace */:
                    return this.next(Kind.CloseBrace);
                case 126 /* CharacterCodes.tilde */:
                    return this.next(Kind.Tilde);
                case 64 /* CharacterCodes.at */:
                    return this.next(Kind.At);
                case 94 /* CharacterCodes.caret */:
                    return this.#chNext === 61 /* CharacterCodes.equals */ ? this.next(Kind.CaretEquals, 2) : this.next(Kind.Caret);
                case 37 /* CharacterCodes.percent */:
                    return this.#chNext === 61 /* CharacterCodes.equals */ ? this.next(Kind.PercentEquals, 2) : this.next(Kind.Percent);
                case 63 /* CharacterCodes.question */:
                    return this.#chNext === 46 /* CharacterCodes.dot */ && !(0, character_codes_1.isDigit)(this.#chNextNext) ?
                        this.next(Kind.QuestionDot, 2) :
                        this.#chNext === 63 /* CharacterCodes.question */ ?
                            this.#chNextNext === 61 /* CharacterCodes.equals */ ?
                                this.next(Kind.QuestionQuestionEquals, 3) :
                                this.next(Kind.QuestionQuestion, 2) :
                            this.next(Kind.Question);
                case 33 /* CharacterCodes.exclamation */:
                    return this.#chNext === 61 /* CharacterCodes.equals */ ?
                        this.#chNextNext === 61 /* CharacterCodes.equals */ ?
                            this.next(Kind.ExclamationEqualsEquals, 3) :
                            this.next(Kind.ExclamationEquals, 2) :
                        this.next(Kind.Exclamation);
                case 38 /* CharacterCodes.ampersand */:
                    return this.#chNext === 38 /* CharacterCodes.ampersand */ ?
                        this.#chNextNext === 61 /* CharacterCodes.equals */ ?
                            this.next(Kind.AmpersandAmpersandEquals, 3) :
                            this.next(Kind.AmpersandAmpersand, 2) :
                        this.#chNext === 61 /* CharacterCodes.equals */ ?
                            this.next(Kind.AmpersandEquals, 2) :
                            this.next(Kind.Ampersand);
                case 42 /* CharacterCodes.asterisk */:
                    return this.#chNext === 42 /* CharacterCodes.asterisk */ ?
                        this.#chNextNext === 61 /* CharacterCodes.equals */ ?
                            this.next(Kind.AsteriskAsteriskEquals, 3) :
                            this.next(Kind.AsteriskAsterisk, 2) :
                        this.#chNext === 61 /* CharacterCodes.equals */ ?
                            this.next(Kind.AsteriskEquals, 2) :
                            this.next(Kind.Asterisk);
                case 43 /* CharacterCodes.plus */:
                    return this.#chNext === 43 /* CharacterCodes.plus */ ?
                        this.next(Kind.PlusPlus, 2) :
                        this.#chNext === 61 /* CharacterCodes.equals */ ?
                            this.next(Kind.PlusEquals, 2) :
                            this.next(Kind.Plus);
                case 45 /* CharacterCodes.minus */:
                    return this.#chNext === 45 /* CharacterCodes.minus */ ?
                        this.next(Kind.MinusMinus, 2) :
                        this.#chNext === 61 /* CharacterCodes.equals */ ?
                            this.next(Kind.MinusEquals, 2) :
                            this.next(Kind.Minus);
                case 46 /* CharacterCodes.dot */:
                    return (0, character_codes_1.isDigit)(this.#chNext) ?
                        this.scanNumber() :
                        this.#chNext === 46 /* CharacterCodes.dot */ && this.#chNextNext === 46 /* CharacterCodes.dot */ ?
                            this.next(Kind.Elipsis, 3) :
                            this.next(Kind.Dot);
                case 47 /* CharacterCodes.slash */:
                    return this.#chNext === 47 /* CharacterCodes.slash */ ?
                        this.scanSingleLineComment() :
                        this.#chNext === 42 /* CharacterCodes.asterisk */ ?
                            this.scanMultiLineComment() :
                            this.#chNext === 61 /* CharacterCodes.equals */ ?
                                this.next(Kind.SlashEquals) :
                                this.next(Kind.Slash);
                case 48 /* CharacterCodes._0 */:
                    return this.#chNext === 120 /* CharacterCodes.x */ || this.#chNext === 88 /* CharacterCodes.X */ ?
                        this.scanHexNumber() :
                        this.#chNext === 66 /* CharacterCodes.B */ || this.#chNext === 66 /* CharacterCodes.B */ ?
                            this.scanBinaryNumber() :
                            this.scanNumber();
                case 49 /* CharacterCodes._1 */:
                case 50 /* CharacterCodes._2 */:
                case 51 /* CharacterCodes._3 */:
                case 52 /* CharacterCodes._4 */:
                case 53 /* CharacterCodes._5 */:
                case 54 /* CharacterCodes._6 */:
                case 55 /* CharacterCodes._7 */:
                case 56 /* CharacterCodes._8 */:
                case 57 /* CharacterCodes._9 */:
                    return this.scanNumber();
                case 60 /* CharacterCodes.lessThan */:
                    return this.isConflictMarker() ?
                        this.next(Kind.ConflictMarker, mergeConflictMarkerLength) :
                        this.#chNext === 60 /* CharacterCodes.lessThan */ ?
                            this.#chNextNext === 61 /* CharacterCodes.equals */ ?
                                this.next(Kind.LessThanLessThanEquals, 3) :
                                this.next(Kind.LessThanLessThan, 2) :
                            this.#chNext === 61 /* CharacterCodes.equals */ ?
                                this.next(Kind.LessThanEquals, 2) :
                                this.next(Kind.LessThan);
                case 62 /* CharacterCodes.greaterThan */:
                    return this.isConflictMarker() ?
                        this.next(Kind.ConflictMarker, mergeConflictMarkerLength) :
                        this.next(Kind.GreaterThan);
                case 61 /* CharacterCodes.equals */:
                    return this.isConflictMarker() ?
                        this.next(Kind.ConflictMarker, mergeConflictMarkerLength) :
                        this.#chNext === 61 /* CharacterCodes.equals */ ?
                            this.#chNextNext === 61 /* CharacterCodes.equals */ ?
                                this.next(Kind.EqualsEqualsEquals, 3) :
                                this.next(Kind.EqualsEquals, 2) :
                            this.#chNext === 62 /* CharacterCodes.greaterThan */ ?
                                this.next(Kind.EqualsArrow, 2) :
                                this.next(Kind.Equals);
                case 124 /* CharacterCodes.bar */:
                    return this.isConflictMarker() ?
                        this.next(Kind.ConflictMarker, mergeConflictMarkerLength) :
                        this.#chNext === 124 /* CharacterCodes.bar */ ?
                            this.#chNextNext === 61 /* CharacterCodes.equals */ ?
                                this.next(Kind.BarBarEquals, 3) :
                                this.next(Kind.BarBar, 2) :
                            this.#chNext === 61 /* CharacterCodes.equals */ ?
                                this.next(Kind.BarEquals, 2) :
                                this.next(Kind.Bar);
                case 39 /* CharacterCodes.singleQuote */:
                case 34 /* CharacterCodes.doubleQuote */:
                case 96 /* CharacterCodes.backtick */:
                    return this.scanString();
                default:
                    // FYI:
                    // Well-known characters that are currently not processed
                    //   # \
                    // will need to update the scanner if there is a need to recognize them
                    return (0, character_codes_1.isIdentifierStart)(this.#ch) ? this.scanIdentifier() : this.next(Kind.Unknown);
            }
        }
        this.text = '';
        return this.kind = Kind.EndOfFile;
    }
    take() {
        const result = { ...this };
        this.scan();
        return result;
    }
    takeWhitespace() {
        while (!this.eof && this.kind === Kind.Whitespace) {
            this.take();
        }
    }
    /**
   * When the current token is greaterThan, this will return any tokens with characters
   * after the greater than character. This has to be scanned separately because greater
   * thans appear in positions where longer tokens are incorrect, e.g. `model x<y>=y;`.
   * The solution is to call rescanGreaterThan from the parser in contexts where longer
   * tokens starting with `>` are allowed (i.e. when parsing binary expressions).
   */
    rescanGreaterThan() {
        if (this.kind === Kind.GreaterThan) {
            return this.#ch === 62 /* CharacterCodes.greaterThan */ ?
                this.#chNext === 61 /* CharacterCodes.equals */ ?
                    this.next(Kind.GreaterThanGreaterThanEquals, 3) :
                    this.next(Kind.GreaterThanGreaterThan, 2) :
                this.#ch === 61 /* CharacterCodes.equals */ ?
                    this.next(Kind.GreaterThanEquals, 2) :
                    this.next(Kind.GreaterThan);
        }
        return this.kind;
    }
    isConflictMarker() {
        // Conflict markers must be at the start of a line.
        if (this.#offset === 0 || (0, character_codes_1.isLineBreak)(this.#text.charCodeAt(this.#offset - 1))) {
            if ((this.#offset + mergeConflictMarkerLength) < this.#length) {
                for (let i = 0; i < mergeConflictMarkerLength; i++) {
                    if (this.#text.charCodeAt(this.#offset + i) !== this.#ch) {
                        return false;
                    }
                }
                return this.#ch === 61 /* CharacterCodes.equals */ || this.#text.charCodeAt(this.#offset + mergeConflictMarkerLength) === 32 /* CharacterCodes.space */;
            }
        }
        return false;
    }
    scanWhitespace() {
        // since whitespace are not always 1 character wide, we're going to mark the position before the whitespace.
        this.markPosition();
        do {
            // advance the position
            this.#column += this.widthOfCh;
            this.advance();
        } while ((0, character_codes_1.isWhiteSpaceSingleLine)(this.#ch));
        // and after...
        this.markPosition();
        this.text = this.#text.substring(this.offset, this.#offset);
        return this.kind = Kind.Whitespace;
    }
    scanDigits() {
        const start = this.#offset;
        while ((0, character_codes_1.isDigit)(this.#ch)) {
            this.advance();
        }
        return this.#text.substring(start, this.#offset);
    }
    scanNumber() {
        const start = this.#offset;
        const main = this.scanDigits();
        let decimal;
        let scientific;
        if (this.#ch === 46 /* CharacterCodes.dot */) {
            this.advance();
            decimal = this.scanDigits();
        }
        if (this.#ch === 69 /* CharacterCodes.E */ || this.#ch === 101 /* CharacterCodes.e */) {
            this.assert((0, character_codes_1.isDigit)(this.#chNext), (0, i18n_1.i) `ParseError: Digit expected (0-9)`);
            this.advance();
            scientific = this.scanDigits();
        }
        this.text = scientific ?
            decimal ?
                `${main}.${decimal}e${scientific}` :
                `${main}e${scientific}` :
            decimal ?
                `${main}.${decimal}` :
                main;
        // update the position
        this.#column += (this.#offset - start);
        return this.kind = Kind.NumericLiteral;
    }
    scanHexNumber() {
        this.assert((0, character_codes_1.isHexDigit)(this.#chNextNext), (0, i18n_1.i) `ParseError: Hex Digit expected (0-F,0-f)`);
        this.advance(2);
        this.text = `0x${this.scanUntil((ch) => !(0, character_codes_1.isHexDigit)(ch), 'Hex Digit')}`;
        return this.kind = Kind.NumericLiteral;
    }
    scanBinaryNumber() {
        this.assert((0, character_codes_1.isBinaryDigit)(this.#chNextNext), (0, i18n_1.i) `ParseError: Binary Digit expected (0,1)`);
        this.advance(2);
        this.text = `0b${this.scanUntil((ch) => !(0, character_codes_1.isBinaryDigit)(ch), 'Binary Digit')}`;
        return this.kind = Kind.NumericLiteral;
    }
    get widthOfCh() {
        return this.#ch === 9 /* CharacterCodes.tab */ ? (this.#column % this.tabWidth || this.tabWidth) : 1;
    }
    scanUntil(predicate, expectedClose, consumeClose) {
        const start = this.#offset;
        do {
            // advance the position
            if ((0, character_codes_1.isLineBreak)(this.#ch)) {
                this.advance(this.#ch === 13 /* CharacterCodes.carriageReturn */ && this.#chNext === 10 /* CharacterCodes.lineFeed */ ? 2 : 1);
                this.#line++;
                this.#column = 0;
                this.markPosition(); // make sure the map has the new location
            }
            else {
                this.#column += this.widthOfCh;
                this.advance();
            }
            if (this.eof) {
                this.assert(!expectedClose, (0, i18n_1.i) `Unexpected end of file while searching for '${expectedClose}'`);
                break;
            }
        } while (!predicate(this.#ch, this.#chNext, this.#chNextNext));
        if (consumeClose) {
            this.advance(consumeClose);
        }
        // and after...
        this.markPosition();
        return this.#text.substring(start, this.#offset);
    }
    scanSingleLineComment() {
        this.text = this.scanUntil(character_codes_1.isLineBreak);
        return this.kind = Kind.SingleLineComment;
    }
    scanMultiLineComment() {
        this.text = this.scanUntil((ch, chNext) => ch === 42 /* CharacterCodes.asterisk */ && chNext === 47 /* CharacterCodes.slash */, '*/', 2);
        return this.kind = Kind.MultiLineComment;
    }
    scanString() {
        const quote = this.#ch;
        const quoteLength = 1;
        const closing = String.fromCharCode(this.#ch);
        let escaped = false;
        let crlf = false;
        let isEscaping = false;
        const text = this.scanUntil((ch, chNext, chNextNext) => {
            if (isEscaping) {
                isEscaping = false;
                return false;
            }
            if (ch === 92 /* CharacterCodes.backslash */) {
                isEscaping = escaped = true;
                return false;
            }
            if (ch == 13 /* CharacterCodes.carriageReturn */) {
                if (chNext == 10 /* CharacterCodes.lineFeed */) {
                    crlf = true;
                }
                return false;
            }
            return ch === quote;
        }, closing, quoteLength);
        // TODO: optimize to single pass over string, easier if we refactor some bookkeeping first.
        // strip quotes
        let value = text.substring(quoteLength, text.length - quoteLength);
        // Normalize CRLF to LF when interpreting value of multi-line string
        // literals. Matches JavaScript behavior and ensures program behavior does
        // not change due to line-ending conversion.
        if (crlf) {
            value = value.replace(/\r\n/g, '\n');
        }
        if (escaped) {
            value = this.unescapeString(value);
        }
        this.text = text;
        this.stringValue = value;
        return this.kind = Kind.StringLiteral;
    }
    unescapeString(text) {
        let result = '';
        let start = 0;
        let pos = 0;
        const end = text.length;
        while (pos < end) {
            let ch = text.charCodeAt(pos);
            if (ch != 92 /* CharacterCodes.backslash */) {
                pos++;
                continue;
            }
            result += text.substring(start, pos);
            pos++;
            ch = text.charCodeAt(pos);
            switch (ch) {
                case 114 /* CharacterCodes.r */:
                    result += '\r';
                    break;
                case 110 /* CharacterCodes.n */:
                    result += '\n';
                    break;
                case 116 /* CharacterCodes.t */:
                    result += '\t';
                    break;
                case 39 /* CharacterCodes.singleQuote */:
                    result += '\'';
                    break;
                case 34 /* CharacterCodes.doubleQuote */:
                    result += '"';
                    break;
                case 92 /* CharacterCodes.backslash */:
                    result += '\\';
                    break;
                case 96 /* CharacterCodes.backtick */:
                    result += '`';
                    break;
                default:
                    throw new MediaQueryError((0, i18n_1.i) `Invalid escape sequence`, this.position.line, this.position.column);
            }
            pos++;
            start = pos;
        }
        result += text.substring(start, pos);
        return result;
    }
    scanIdentifier() {
        this.text = this.scanUntil((ch) => !(0, character_codes_1.isIdentifierPart)(ch));
        return this.kind = keywords.get(this.text) ?? Kind.Identifier;
    }
    /**
   * Returns the zero-based line/column from the given offset
   * (binary search thru the token start locations)
   * @param offset the character position in the document
   */
    positionFromOffset(offset) {
        let position = { line: 0, column: 0, offset: 0 };
        // eslint-disable-next-line keyword-spacing
        if (offset < 0 || offset > this.#length) {
            return { line: position.line, column: position.column };
        }
        let first = 0; //left endpoint
        let last = this.#map.length - 1; //right endpoint
        let middle = Math.floor((first + last) / 2);
        while (first <= last) {
            middle = Math.floor((first + last) / 2);
            position = this.#map[middle];
            if (position.offset === offset) {
                return { line: position.line, column: position.column };
            }
            if (position.offset < offset) {
                first = middle + 1;
                continue;
            }
            last = middle - 1;
            position = this.#map[last];
        }
        return { line: position.line, column: position.column + (offset - position.offset) };
    }
    static *TokensFrom(text) {
        const scanner = new Scanner(text).start();
        while (!scanner.eof) {
            yield scanner.take();
        }
    }
    assert(assertion, message) {
        if (!assertion) {
            const p = this.position;
            throw new MediaQueryError(message, p.line, p.column);
        }
    }
}
exports.Scanner = Scanner;
class MediaQueryError extends Error {
    line;
    column;
    constructor(message, line, column) {
        super(message);
        this.line = line;
        this.column = column;
    }
}
exports.MediaQueryError = MediaQueryError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nhbm5lci5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJtZWRpYXF1ZXJ5L3NjYW5uZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF1QztBQUN2QyxrQ0FBa0M7OztBQTBCbEMsd0JBRUM7QUExQkQsa0NBQTRCO0FBQzVCLHVEQUF5SztBQUV6SyxJQUFZLGVBS1g7QUFMRCxXQUFZLGVBQWU7SUFDekIsMkRBQU8sQ0FBQTtJQUNQLHVEQUFLLENBQUE7SUFDTCxpRUFBVSxDQUFBO0lBQ1YsMkRBQU8sQ0FBQTtBQUNULENBQUMsRUFMVyxlQUFlLCtCQUFmLGVBQWUsUUFLMUI7QUFRWSxRQUFBLFFBQVEsR0FBRztJQUN0QixhQUFhLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxlQUFlLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxzQkFBc0IsRUFBRTtJQUM1RixnQkFBZ0IsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLGVBQWUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLDhCQUE4QixFQUFFO0lBQ3ZHLG1CQUFtQixFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsZUFBZSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsNkJBQTZCLEVBQUU7SUFDekcsbUJBQW1CLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxlQUFlLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxvREFBb0QsRUFBRTtJQUNoSSxxQkFBcUIsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLGVBQWUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLHlCQUF5QixFQUFFO0NBQ3hHLENBQUM7QUFFRixTQUFnQixN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