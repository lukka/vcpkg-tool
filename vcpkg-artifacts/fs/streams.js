"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressTrackingStream = void 0;
const stream_1 = require("stream");
const channels_1 = require("../util/channels");
const percentage_scaler_1 = require("../util/percentage-scaler");
class ProgressTrackingStream extends stream_1.Transform {
    stopwatch = new channels_1.Stopwatch;
    scaler;
    currentPosition;
    constructor(start, end) {
        super();
        this.scaler = new percentage_scaler_1.PercentageScaler(start, end);
        this.currentPosition = start;
    }
    _transform(chunk, encoding, callback) {
        if (encoding !== 'buffer') {
            return callback(new Error('unexpected chunk type'));
        }
        const chunkBuffer = chunk;
        this.currentPosition += chunkBuffer.byteLength;
        this.emit('progress', this.scaler.scalePosition(this.currentPosition), this.currentPosition, this.stopwatch.total);
        return callback(null, chunk);
    }
    get currentPercentage() {
        return this.scaler.scalePosition(this.currentPosition);
    }
}
exports.ProgressTrackingStream = ProgressTrackingStream;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyZWFtcy5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJmcy9zdHJlYW1zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1Q0FBdUM7QUFDdkMsa0NBQWtDOzs7QUFFbEMsbUNBQW9FO0FBQ3BFLCtDQUE2QztBQUM3QyxpRUFBNkQ7QUFVN0QsTUFBYSxzQkFBdUIsU0FBUSxrQkFBUztJQUNsQyxTQUFTLEdBQUcsSUFBSSxvQkFBUyxDQUFDO0lBQzFCLE1BQU0sQ0FBbUI7SUFDbEMsZUFBZSxDQUFTO0lBRWhDLFlBQVksS0FBYSxFQUFFLEdBQVc7UUFDcEMsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksb0NBQWdCLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQy9DLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO0lBQy9CLENBQUM7SUFFUSxVQUFVLENBQUMsS0FBVSxFQUFFLFFBQXdCLEVBQUUsUUFBMkI7UUFDbkYsSUFBWSxRQUFRLEtBQUssUUFBUSxFQUFFLENBQUM7WUFDbEMsT0FBTyxRQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO1FBQ3RELENBQUM7UUFFRCxNQUFNLFdBQVcsR0FBVyxLQUFLLENBQUM7UUFDbEMsSUFBSSxDQUFDLGVBQWUsSUFBSSxXQUFXLENBQUMsVUFBVSxDQUFDO1FBQy9DLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkgsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxJQUFJLGlCQUFpQjtRQUNuQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUN6RCxDQUFDO0NBQ0Y7QUF6QkQsd0RBeUJDIn0=