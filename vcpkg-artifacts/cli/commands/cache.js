"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheCommand = void 0;
const path_1 = require("path");
const i18n_1 = require("../../i18n");
const main_1 = require("../../main");
const command_1 = require("../command");
const console_table_1 = require("../console-table");
const styling_1 = require("../styling");
const clear_1 = require("../switches/clear");
class CacheCommand extends command_1.Command {
    command = 'cache';
    clear = new clear_1.Clear(this);
    async run() {
        if (this.clear.active) {
            await main_1.session.downloads.delete({ recursive: true });
            await main_1.session.downloads.createDirectory();
            (0, styling_1.log)((0, i18n_1.i) `Downloads folder cleared (${main_1.session.downloads.fsPath}) `);
            return true;
        }
        let files = [];
        try {
            files = await main_1.session.downloads.readDirectory();
        }
        catch {
            // shh
        }
        if (!files.length) {
            (0, styling_1.log)('The download cache is empty');
            return true;
        }
        const table = new console_table_1.Table('File', 'Size', 'Date');
        for (const [file, type] of files) {
            const stat = await file.stat();
            table.push((0, path_1.basename)(file.fsPath), stat.size.toString(), new Date(stat.mtime).toString());
        }
        (0, styling_1.log)(table.toString());
        (0, styling_1.log)();
        return true;
    }
}
exports.CacheCommand = CacheCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21pY3Jvc29mdC92Y3BrZy10b29sL21haW4vdmNwa2ctYXJ0aWZhY3RzLyIsInNvdXJjZXMiOlsiY2xpL2NvbW1hbmRzL2NhY2hlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1Q0FBdUM7QUFDdkMsa0NBQWtDOzs7QUFFbEMsK0JBQWdDO0FBRWhDLHFDQUErQjtBQUMvQixxQ0FBcUM7QUFFckMsd0NBQXFDO0FBQ3JDLG9EQUF5QztBQUN6Qyx3Q0FBaUM7QUFDakMsNkNBQTBDO0FBRTFDLE1BQWEsWUFBYSxTQUFRLGlCQUFPO0lBQzlCLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDM0IsS0FBSyxHQUFHLElBQUksYUFBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRWYsS0FBSyxDQUFDLEdBQUc7UUFDaEIsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3RCLE1BQU0sY0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUNwRCxNQUFNLGNBQU8sQ0FBQyxTQUFTLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDMUMsSUFBQSxhQUFHLEVBQUMsSUFBQSxRQUFDLEVBQUEsNkJBQTZCLGNBQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQztZQUNoRSxPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFDRCxJQUFJLEtBQUssR0FBMkIsRUFBRSxDQUFDO1FBQ3ZDLElBQUksQ0FBQztZQUNILEtBQUssR0FBRyxNQUFNLGNBQU8sQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDbEQsQ0FBQztRQUFDLE1BQU0sQ0FBQztZQUNQLE1BQU07UUFDUixDQUFDO1FBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNsQixJQUFBLGFBQUcsRUFBQyw2QkFBNkIsQ0FBQyxDQUFDO1lBQ25DLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUVELE1BQU0sS0FBSyxHQUFHLElBQUkscUJBQUssQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2hELEtBQUssTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQztZQUNqQyxNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUMvQixLQUFLLENBQUMsSUFBSSxDQUFDLElBQUEsZUFBUSxFQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQzNGLENBQUM7UUFDRCxJQUFBLGFBQUcsRUFBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUN0QixJQUFBLGFBQUcsR0FBRSxDQUFDO1FBRU4sT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0NBQ0Y7QUFqQ0Qsb0NBaUNDIn0=