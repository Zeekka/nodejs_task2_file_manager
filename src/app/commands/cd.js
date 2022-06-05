import {workerData, parentPort} from 'node:worker_threads';
import {access} from 'node:fs/promises';
import path from 'node:path';

export const cd = async () => {
    if (workerData.args.length !== 1) {
        throw new Error('Operation failed');
    }
    const dest = workerData.args[0];
    let newDest;
    if (!path.isAbsolute(dest)) {
        newDest = path.join(workerData.currentDir, dest);
    } else {
        newDest = dest;
    }

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