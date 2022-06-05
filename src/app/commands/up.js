import {workerData, parentPort} from 'node:worker_threads';
import {join} from 'node:path';

const STATUS_SUCCESS = 0;

export const up = async () => {
    const dirs = workerData.currentDir.split('/').filter((dir) => dir);

    if (dirs.length === 0) {
        throw new Error('Operation failed');
    }

    dirs.splice(-1);

    parentPort.postMessage({
        newContext: {
            currentDir: dirs.length === 0 ? '/' : '/' + join(...dirs),
            username: workerData.username,
        }
    });

    return STATUS_SUCCESS;
};

up();