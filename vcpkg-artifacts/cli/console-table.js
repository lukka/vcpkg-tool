"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
const assert_1 = require("assert");
const chalk_1 = require("chalk");
const strip_ansi_1 = require("strip-ansi");
function leftPad(text, length) {
    const remain = length - text.length;
    if (remain <= 0) {
        return text;
    }
    return text + ' '.repeat(remain);
}
class Table {
    columnNames;
    rows = new Array();
    constructor(...columnNames) {
        this.columnNames = columnNames;
    }
    push(...values) {
        assert_1.strict.equal(values.length, this.columnNames.length, 'unexpected number of arguments in table row');
        this.rows.push(Array.from(values));
    }
    toString() {
        const lengths = new Array(this.columnNames.length);
        for (let colNum = 0; colNum < this.columnNames.length; ++colNum) {
            lengths[colNum] = this.columnNames[colNum].length;
        }
        for (const row of this.rows) {
            for (let colNum = 0; colNum < this.columnNames.length; ++colNum) {
                const colLen = (0, strip_ansi_1.default)(row[colNum]).length;
                if (colLen > lengths[colNum]) {
                    lengths[colNum] = colLen;
                }
            }
        }
        const formattedRows = new Array();
        const thisFormattedRow = new Array(this.columnNames.length);
        for (let colNum = 0; colNum < this.columnNames.length; ++colNum) {
            thisFormattedRow[colNum] = (0, chalk_1.red)(leftPad(this.columnNames[colNum], lengths[colNum]));
        }
        formattedRows.push(thisFormattedRow.join(' '));
        for (const row of this.rows) {
            for (let colNum = 0; colNum < this.columnNames.length; ++colNum) {
                thisFormattedRow[colNum] = leftPad(row[colNum], lengths[colNum]);
            }
            formattedRows.push(thisFormattedRow.join(' '));
        }
        return formattedRows.join('\n');
    }
}
exports.Table = Table;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc29sZS10YWJsZS5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJjbGkvY29uc29sZS10YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBRWxDLG1DQUFnQztBQUNoQyxpQ0FBNEI7QUFDNUIsMkNBQW1DO0FBRW5DLFNBQVMsT0FBTyxDQUFDLElBQVksRUFBRSxNQUFjO0lBQzNDLE1BQU0sTUFBTSxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3BDLElBQUksTUFBTSxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQUMsT0FBTyxJQUFJLENBQUM7SUFBQyxDQUFDO0lBQ2pDLE9BQU8sSUFBSSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbkMsQ0FBQztBQUVELE1BQWEsS0FBSztJQUNDLFdBQVcsQ0FBZ0I7SUFDM0IsSUFBSSxHQUFHLElBQUksS0FBSyxFQUFpQixDQUFDO0lBQ25ELFlBQVksR0FBRyxXQUEwQjtRQUN2QyxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztJQUNqQyxDQUFDO0lBQ0QsSUFBSSxDQUFDLEdBQUcsTUFBcUI7UUFDM0IsZUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLDZDQUE2QyxDQUFDLENBQUM7UUFDcEcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFDRCxRQUFRO1FBQ04sTUFBTSxPQUFPLEdBQUcsSUFBSSxLQUFLLENBQVMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMzRCxLQUFLLElBQUksTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQztZQUNoRSxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDcEQsQ0FBQztRQUVELEtBQUssTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQzVCLEtBQUssSUFBSSxNQUFNLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDO2dCQUNoRSxNQUFNLE1BQU0sR0FBRyxJQUFBLG9CQUFTLEVBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO2dCQUM3QyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztvQkFDN0IsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQztnQkFDM0IsQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDO1FBRUQsTUFBTSxhQUFhLEdBQUcsSUFBSSxLQUFLLEVBQVUsQ0FBQztRQUMxQyxNQUFNLGdCQUFnQixHQUFHLElBQUksS0FBSyxDQUFTLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDcEUsS0FBSyxJQUFJLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUM7WUFDaEUsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBQSxXQUFHLEVBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRixDQUFDO1FBRUQsYUFBYSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUUvQyxLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUM1QixLQUFLLElBQUksTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQztnQkFDaEUsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNuRSxDQUFDO1lBRUQsYUFBYSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNqRCxDQUFDO1FBRUQsT0FBTyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLENBQUM7Q0FDRjtBQTNDRCxzQkEyQ0MifQ==