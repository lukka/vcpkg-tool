"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
const filesystem_1 = require("../../fs/filesystem");
const hash_1 = require("../../util/hash");
const assert_1 = require("assert");
const stream_1 = require("stream");
const util_1 = require("util");
const SuiteLocal_1 = require("./SuiteLocal");
const pipeline = (0, util_1.promisify)(stream_1.pipeline);
function writeAsync(writable, chunk) {
    return new Promise((resolve, reject) => {
        if (writable.write(chunk, (error) => {
            // callback gave us an error.
            if (error) {
                reject(error);
            }
        })) {
            // returned true, we're good to go.
            resolve();
        }
        else {
            // returned false
            // we were told to wait for it to drain.
            writable.once('drain', resolve);
            writable.once('error', reject);
        }
    });
}
describe('LocalFileSystemTests', () => {
    const local = new SuiteLocal_1.SuiteLocal();
    const fs = local.fs;
    after(local.after.bind(local));
    it('create/delete folder', async () => {
        const tmp = local.tempFolderUri;
        // create a path to a folder
        const someFolder = tmp.join('someFolder');
        // create the directory
        await fs.createDirectory(someFolder);
        // is there a directory there?
        assert_1.strict.ok(await fs.isDirectory(someFolder), `the directory ${someFolder.fsPath} should exist`);
        // delete it
        await fs.delete(someFolder, { recursive: true });
        // make sure it's gone!
        assert_1.strict.ok(!(await fs.isDirectory(someFolder)), `the directory ${someFolder.fsPath} should not exist`);
    });
    it('create/read file', async () => {
        const tmp = local.tempFolderUri;
        const file = tmp.join('hello.txt');
        const expectedText = 'hello world';
        const expectedBuffer = Buffer.from(expectedText, 'utf8');
        await fs.writeFile(file, expectedBuffer);
        // is there a file there?
        assert_1.strict.ok(await fs.isFile(file), `the file ${file.fsPath} is not present`);
        // read it back
        const actualBuffer = await fs.readFile(file);
        assert_1.strict.deepEqual(expectedBuffer, actualBuffer, 'contents should be the same');
        const actualText = actualBuffer.toString();
        assert_1.strict.equal(expectedText, actualText, 'text should be equal too');
    });
    it('readDirectory', async () => {
        const tmp = local.tempFolderUri;
        const thisFolder = fs.file(__dirname);
        // look in the current folder
        const files = await fs.readDirectory(thisFolder);
        // find this file
        const found = files.find(each => each[0].fsPath.indexOf('local-file-system') > -1);
        // should be a file, right?
        assert_1.strict.ok(found?.[1] && filesystem_1.FileType.File, `${__filename} should be a path`);
    });
    it('read/write stream', async () => {
        const tmp = local.tempFolderUri;
        const thisFile = fs.file(__filename);
        const outputFile = tmp.join('output.txt');
        const outStream = await fs.writeStream(outputFile);
        const outStreamDone = new Promise((resolve, reject) => {
            outStream.once('close', resolve);
            outStream.once('error', reject);
        });
        let text = '';
        // you can iterate thru a stream with 'for await' without casting because I forced the return type to be AsnycIterable<Buffer>
        for await (const chunk of await fs.readStream(thisFile)) {
            text += chunk.toString('utf8');
            await writeAsync(outStream, chunk);
        }
        // close the stream once we're done.
        outStream.end();
        await outStreamDone;
        assert_1.strict.equal((await fs.stat(outputFile)).size, (await fs.stat(thisFile)).size, 'outputFile should be the same length as the input file');
        assert_1.strict.equal((await fs.stat(thisFile)).size, text.length, 'buffer should be the same size as the input file');
    });
    it('calculate hashes', async () => {
        const tmp = local.tempFolderUri;
        const path = local.resourcesFolderUri.join('small-file.txt');
        assert_1.strict.equal(await (0, hash_1.hash)(await fs.readStream(path), path, 0, 'sha256', {}), '9cfed8b9e45f47e735098c399fb523755e4e993ac64d81171c93efbb523a57e6', 'hash should match');
        assert_1.strict.equal(await (0, hash_1.hash)(await fs.readStream(path), path, 0, 'sha384', {}), '8168d029154548a4e1dd5212b722b03d6220f212f8974f6bd45e71715b13945e343c9d1097f8e393db22c8a07d8cf6f6', 'hash should match');
        assert_1.strict.equal(await (0, hash_1.hash)(await fs.readStream(path), path, 0, 'sha512', {}), '1bacd5dd190731b5c3d2a2ad61142b4054137d6adff5fb085543dcdede77e4a1446225ca31b2f4699b0cda4534e91ea372cf8d73816df3577e38700c299eab5e', 'hash should match');
    });
    it('reads blocks via open', async () => {
        const file = local.resourcesFolderUri.join('small-file.txt');
        const handle = await file.openFile();
        let bytesRead = 0;
        for await (const chunk of handle.readStream(0, 3)) {
            bytesRead += chunk.length;
            assert_1.strict.equal(chunk.length, 4, 'chunk should be 4 bytes long');
            assert_1.strict.equal(chunk.toString('utf-8'), 'this', 'chunk should be a word');
        }
        assert_1.strict.equal(bytesRead, 4, 'Stream should read some bytes');
        bytesRead = 0;
        // should be able to read that same chunk again.
        for await (const chunk of handle.readStream(0, 3)) {
            bytesRead += chunk.length;
            assert_1.strict.equal(chunk.length, 4, 'chunk should be 4 bytes long');
            assert_1.strict.equal(chunk.toString('utf-8'), 'this', 'chunk should be a word');
        }
        assert_1.strict.equal(bytesRead, 4, 'Stream should read some bytes');
        bytesRead = 0;
        for await (const chunk of handle.readStream()) {
            bytesRead += chunk.length;
            assert_1.strict.equal(chunk.byteLength, 23, 'chunk should be 23 bytes long');
            assert_1.strict.equal(chunk.toString('utf-8'), 'this is a small file.\n\n', 'File contents should equal known result');
        }
        assert_1.strict.equal(bytesRead, 23, 'Stream should read some bytes');
        await handle.close();
    });
    it('reads blocks via open in a large file', async () => {
        const file = local.resourcesFolderUri.join('large-file.txt');
        const handle = await file.openFile();
        let bytesRead = 0;
        for await (const chunk of handle.readStream()) {
            if (bytesRead === 0) {
                assert_1.strict.equal(chunk.length, 32768, 'first chunk should be 32768 bytes long');
            }
            else {
                assert_1.strict.equal(chunk.length, 4134, 'second chunk should be 4134 bytes long');
            }
            bytesRead += chunk.length;
        }
        assert_1.strict.equal(bytesRead, 36902, 'Stream should read some bytes');
        await handle.close();
    });
    it('read/write stream with pipe ', async () => {
        const tmp = local.tempFolderUri;
        const thisFile = fs.file(__filename);
        const thisFileText = (await fs.readFile(thisFile)).toString();
        const outputFile = tmp.join('output2.txt');
        const inputStream = await fs.readStream(thisFile);
        const outStream = await fs.writeStream(outputFile);
        await pipeline(inputStream, outStream);
        assert_1.strict.ok(fs.isFile(outputFile), `there should be a file at ${outputFile.fsPath}`);
        const outFileText = (await fs.readFile(outputFile)).toString();
        assert_1.strict.equal(outFileText, thisFileText);
        // this will throw if it fails.
        await fs.delete(outputFile);
        // make sure it's gone!
        assert_1.strict.ok(!(await fs.isFile(outputFile)), `the file ${outputFile.fsPath} should not exist`);
    });
    it('can copy files', async () => {
        // now copy the files from the test folder
        const files = await local.fs.copy(local.resourcesFolderUri.join('vcpkg-ce-catalog-2ffbc04d6856a1d03c5de0ab94404f90636f7855'), local.tempFolderUri.join('copy-test-target'));
        assert_1.strict.ok(files == 10, `There should be at exactly 10 files copied. Copied ${files}`);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWwtZmlsZS1zeXN0ZW0tdGVzdHMuanMiLCJzb3VyY2VSb290IjoiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21pY3Jvc29mdC92Y3BrZy10b29sL21haW4vdmNwa2ctYXJ0aWZhY3RzLyIsInNvdXJjZXMiOlsidGVzdC9jb3JlL2xvY2FsLWZpbGUtc3lzdGVtLXRlc3RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1Q0FBdUM7QUFDdkMsa0NBQWtDOztBQUVsQyxvREFBK0M7QUFDL0MsMENBQXVDO0FBQ3ZDLG1DQUFnQztBQUNoQyxtQ0FBNEQ7QUFDNUQsK0JBQWlDO0FBQ2pDLDZDQUEwQztBQUUxQyxNQUFNLFFBQVEsR0FBRyxJQUFBLGdCQUFTLEVBQUMsaUJBQVksQ0FBQyxDQUFDO0FBRXpDLFNBQVMsVUFBVSxDQUFDLFFBQWtCLEVBQUUsS0FBYTtJQUNuRCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ3JDLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUErQixFQUFFLEVBQUU7WUFDNUQsNkJBQTZCO1lBQzdCLElBQUksS0FBSyxFQUFFLENBQUM7Z0JBQ1YsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2hCLENBQUM7UUFDSCxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ0gsbUNBQW1DO1lBQ25DLE9BQU8sRUFBRSxDQUFDO1FBQ1osQ0FBQzthQUFNLENBQUM7WUFDTixpQkFBaUI7WUFDakIsd0NBQXdDO1lBQ3hDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ2hDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2pDLENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCxRQUFRLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFO0lBQ3BDLE1B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