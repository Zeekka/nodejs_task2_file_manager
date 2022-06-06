import {workerData, parentPort} from 'node:worker_threads';
import {assemblePathForSingleArg} from '../helpers/composers.js';
import {readFile} from 'node:fs/promises';

export const cat = async () => {
    const dest = await assemblePathForSingleArg(workerData.currentDir, workerData.args);

    const readResult = await readFile(dest, {
        encoding: "UTF8",
    }).catch(err => err);

    if (readResult instanceof Error) {
        throw new Error('Operation failed');
    }

    parentPort.postMessage({
        commandResult: readResult,
    });

    return 0;
};

cat();