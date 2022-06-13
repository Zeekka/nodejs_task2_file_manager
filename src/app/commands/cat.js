import {workerData, parentPort} from 'node:worker_threads';
import {assemblePathForSingleArg} from '../helpers/composers.js';
import {open} from 'node:fs/promises';

export const cat = async () => {
    const src = await assemblePathForSingleArg(workerData.currentDir, workerData.args);
    const fd = await open(src).catch(err => err);

    if (fd instanceof Error) {
        throw new Error('Operation failed');
    }

    const readStream = fd.createReadStream();

    readStream.on('data', chunk => {
        parentPort.postMessage({
            commandResult: chunk.toString(),
        });
    });

    return 0;
};

cat();