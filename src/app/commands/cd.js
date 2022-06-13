import {workerData, parentPort} from 'node:worker_threads';
import {assemblePathForSingleArg} from '../helpers/composers.js';
import {access} from 'node:fs/promises';

export const cd = async () => {
    const newDest = await assemblePathForSingleArg(workerData.currentDir, workerData.args);
    const accessResult = await access(newDest).catch(err => err);

    if (accessResult instanceof Error) {
        throw new Error('Operation failed');
    }

    parentPort.postMessage({
        newContext: {
            currentDir: newDest,
            username: workerData.username,
        }
    });

    return 0;
};

cd();