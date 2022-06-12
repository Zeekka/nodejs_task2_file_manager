import {readdir} from 'node:fs/promises';
import {workerData, parentPort} from 'node:worker_threads';

export const ls = async () => {
    if (workerData.args.length !== 0) {
        throw new Error('Invalid input');
    }

    const listResult = await readdir(workerData.currentDir).catch(err => err);

    if (listResult instanceof Error) {
        throw new Error('Operation failed');
    }

    parentPort.postMessage({
        commandResult: listResult.join(' '),
    });

    return 0;
};

ls();