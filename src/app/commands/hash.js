import {workerData, parentPort} from 'node:worker_threads';
import {readFile, lstat} from 'node:fs/promises';
import {assemblePathForSingleArg} from '../helpers/composers.js';
import {createHash} from 'node:crypto';

export const hash = async () => {
    const path = await assemblePathForSingleArg(workerData.currentDir, workerData.args);
    const pathStats = await lstat(path);

    if (!pathStats.isFile()) {
        throw new Error('Operation failed');
    }

    readFile(path, {
        encoding: "UTF8",
    }).then((content) => {
            const hash = createHash('sha256')
                .update(content)
                .digest('hex');

            parentPort.postMessage({
                commandResult: hash,
            });
        }
    ).catch(err => err);

    return 0;
};

hash();