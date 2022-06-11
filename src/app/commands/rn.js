import {workerData, parentPort} from 'node:worker_threads';
import {assemblePathForSingleArg} from '../helpers/composers.js';
import {rename} from 'node:fs/promises';
import path from 'node:path';

export const rn = async () => {
    if (workerData.args.length !== 2) {
        throw new Error('Invalid input');
    }

    const newFileName = workerData.args.splice(-1).pop();
    const file = await assemblePathForSingleArg(workerData.currentDir, workerData.args);
    const renameResult = await rename(file, path.join(path.dirname(file), newFileName)).catch(err => err);

    if (renameResult instanceof Error) {
        throw new Error('Operation failed');
    }

    parentPort.postMessage({});
    return 0;
};

rn();