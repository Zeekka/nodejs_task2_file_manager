import {workerData, parentPort} from 'node:worker_threads';
import {assemblePathForSingleArg} from '../helpers/composers.js';
import {rm as remove} from 'node:fs/promises';

export const rm = async () => {
    const dest = await assemblePathForSingleArg(workerData.currentDir, workerData.args);
    const rmResult = await remove(dest).catch(err => err);

    if (rmResult instanceof Error) {
        throw new Error('Operation failed');
    }

    parentPort.postMessage({});

    return 0;
};

rm();