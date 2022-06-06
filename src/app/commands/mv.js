import {workerData, parentPort} from 'node:worker_threads';
import {assemblePathForTwoArgs} from '../helpers/composers.js';
import {rename} from 'node:fs/promises';

export const mv = async () => {
    const commandContext = await assemblePathForTwoArgs(workerData.currentDir, workerData.args);

    const renameResult = await rename(commandContext.src, commandContext.dest).catch(err => err);

    if (renameResult instanceof Error) {
        throw new Error('Operation failed');
    }

    parentPort.postMessage({});
    return 0;
};

mv();