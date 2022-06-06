import {workerData, parentPort} from 'node:worker_threads';
import {writeFile, access} from 'node:fs/promises';
import {assemblePathForSingleArg} from '../helpers/composers.js';

export const add = async () => {
    const newDest = await assemblePathForSingleArg(workerData.currentDir, workerData.args);
    const accessResult = await access(newDest).catch(err => err);

    if (!accessResult) {
        throw new Error('Operation failed');
    }

    try {
        await writeFile(newDest, '');
    } catch (e) {
        throw new Error('Operation failed');
    }

    parentPort.postMessage({
        commandResult: 'Successfully created file at the ' + newDest,
    });

    return 0;
};

add();