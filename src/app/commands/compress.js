import {workerData, parentPort} from 'node:worker_threads';
import {assemblePathForTwoArgs} from '../helpers/composers.js';
import {open} from 'node:fs/promises';
import fs from 'node:fs';
import zlib from 'node:zlib';

export const compress = async () => {
    const commandContext = await assemblePathForTwoArgs(workerData.currentDir, workerData.args);
    const fd = await open(commandContext.src).catch(err => err);

    if (fd instanceof Error) {
        throw new Error('Operation failed');
    }

    const readStream = fd.createReadStream();
    const gZip = zlib.createBrotliCompress();
    const writeStream = fs.createWriteStream(commandContext.dest);

    readStream
        .pipe(gZip)
        .pipe(writeStream);

    parentPort.postMessage({});
    return 0;
};

compress();