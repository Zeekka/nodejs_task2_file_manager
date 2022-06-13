import {workerData, parentPort} from 'node:worker_threads';
import {assemblePathForTwoArgs} from '../helpers/composers.js';
import {cp as copy} from 'node:fs/promises';

export const cp = async () => {
    const commandContext = await assemblePathForTwoArgs(workerData.currentDir, workerData.args);

    const cpResult = await copy(commandContext.src, commandContext.dest, {
        errorOnExist: true,
        force: false,
        recursive: true,
    }).catch(err => err);

    if (cpResult instanceof Error) {
        throw new Error('Operation failed');
    }

    parentPort.postMessage({});
    return 0;
};

cp();