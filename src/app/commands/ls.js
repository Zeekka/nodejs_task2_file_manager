import {readdir} from 'node:fs/promises';
import {workerData, parentPort} from 'node:worker_threads';

const STATUS_SUCCESS = 0;

export const ls = async () => {
    const listResult = await readdir(workerData.currentDir).catch(err => err);

    if (listResult instanceof Error) {
        throw new Error('Operation failed');
    }

    parentPort.postMessage({
        commandResult: listResult.join(' '),
    });

    return STATUS_SUCCESS;
};

ls();