import {workerData, parentPort} from 'node:worker_threads';
import {join, sep} from 'node:path';

export const up = async () => {
    const dirs = workerData.currentDir.split(sep).filter((dir) => dir);

    if (dirs.length === 0) {
        throw new Error('Operation failed');
    }

    dirs.splice(-1);

    parentPort.postMessage({
        newContext: {
            currentDir: dirs.length === 0 ? sep : sep + join(...dirs),
            username: workerData.username,
        }
    });

    return 0;
};

up();