"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channels = exports.Stopwatch = void 0;
const node_events_1 = require("node:events");
/**
 * @internal
 *
 * Tracks timing of events
*/
class Stopwatch {
    start;
    last;
    constructor() {
        this.last = this.start = process.uptime() * 1000;
    }
    get time() {
        const now = process.uptime() * 1000;
        const result = Math.floor(now - this.last);
        this.last = now;
        return result;
    }
    get total() {
        const now = process.uptime() * 1000;
        return Math.floor(now - this.start);
    }
}
exports.Stopwatch = Stopwatch;
/** Exposes a set of events that are used to communicate with the user
 *
 * Warning, Error, Message, Debug
 */
class Channels extends node_events_1.EventEmitter {
    /** @internal */
    stopwatch;
    warning(text) {
        typeof text === 'string' ? this.emit('warning', text, this.stopwatch.total) : text.forEach(t => this.emit('warning', t, this.stopwatch.total));
    }
    error(text) {
        typeof text === 'string' ? this.emit('error', text, this.stopwatch.total) : text.forEach(t => this.emit('error', t, this.stopwatch.total));
    }
    message(text) {
        typeof text === 'string' ? this.emit('message', text, this.stopwatch.total) : text.forEach(t => this.emit('message', t, this.stopwatch.total));
    }
    debug(text) {
        typeof text === 'string' ? this.emit('debug', text, this.stopwatch.total) : text.forEach(t => this.emit('debug', t, this.stopwatch.total));
    }
    constructor(session) {
        super();
        this.stopwatch = session.stopwatch;
    }
}
exports.Channels = Channels;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbm5lbHMuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21pY3Jvc29mdC92Y3BrZy10b29sL21haW4vdmNwa2ctYXJ0aWZhY3RzLyIsInNvdXJjZXMiOlsidXRpbC9jaGFubmVscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBRWxDLDZDQUEyQztBQVczQzs7OztFQUlFO0FBQ0YsTUFBYSxTQUFTO0lBQ3BCLEtBQUssQ0FBUztJQUNkLElBQUksQ0FBUztJQUNiO1FBQ0UsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7SUFDbkQsQ0FBQztJQUNELElBQUksSUFBSTtRQUNOLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDcEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBQ2hCLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFDRCxJQUFJLEtBQUs7UUFDUCxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ3BDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3RDLENBQUM7Q0FDRjtBQWhCRCw4QkFnQkM7QUFFRDs7O0dBR0c7QUFDSCxNQUFhLFFBQVMsU0FBUSwwQkFBWTtJQUN4QyxnQkFBZ0I7SUFDUCxTQUFTLENBQVk7SUFFOUIsT0FBTyxDQUFDLElBQTRCO1FBQ2xDLE9BQU8sSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ2pKLENBQUM7SUFDRCxLQUFLLENBQUMsSUFBNEI7UUFDaEMsT0FBTyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDN0ksQ0FBQztJQUNELE9BQU8sQ0FBQyxJQUE0QjtRQUNsQyxPQUFPLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNqSixDQUFDO0lBQ0QsS0FBSyxDQUFDLElBQTRCO1FBQ2hDLE9BQU8sSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzdJLENBQUM7SUFDRCxZQUFZLE9BQWdCO1FBQzFCLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO0lBQ3JDLENBQUM7Q0FDRjtBQXBCRCw0QkFvQkMifQ==