"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash = hash;
const assert_1 = require("assert");
const crypto_1 = require("crypto");
const streams_1 = require("../fs/streams");
async function hash(stream, uri, size, algorithm = 'sha256', events) {
    stream = await stream;
    try {
        const p = new streams_1.ProgressTrackingStream(0, size);
        p.on('progress', (filePercentage) => events.hashVerifyProgress?.(uri.fsPath, filePercentage));
        for await (const chunk of stream.pipe(p).pipe((0, crypto_1.createHash)(algorithm)).setEncoding('hex')) {
            // it should be done reading here
            return chunk;
        }
    }
    finally {
        stream.destroy();
    }
    (0, assert_1.fail)('Should have returned a chunk from the pipe');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFzaC5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJ1dGlsL2hhc2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVDQUF1QztBQUN2QyxrQ0FBa0M7O0FBWWxDLG9CQWVDO0FBekJELG1DQUE4QjtBQUM5QixtQ0FBb0M7QUFFcEMsMkNBQXVEO0FBT2hELEtBQUssVUFBVSxJQUFJLENBQUMsTUFBZ0IsRUFBRSxHQUFRLEVBQUUsSUFBWSxFQUFFLFlBQTRDLFFBQVEsRUFBRSxNQUFpQztJQUMxSixNQUFNLEdBQUcsTUFBTSxNQUFNLENBQUM7SUFFdEIsSUFBSSxDQUFDO1FBQ0gsTUFBTSxDQUFDLEdBQUcsSUFBSSxnQ0FBc0IsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxjQUFjLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUU5RixJQUFJLEtBQUssRUFBRSxNQUFNLEtBQUssSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFBLG1CQUFVLEVBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUN4RixpQ0FBaUM7WUFDakMsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO0lBQ0gsQ0FBQztZQUFTLENBQUM7UUFDVCxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUNELElBQUEsYUFBSSxFQUFDLDRDQUE0QyxDQUFDLENBQUM7QUFDckQsQ0FBQyJ9