import {workerData, parentPort} from 'node:worker_threads';
import * as nos from 'node:os';

export const os = async () => {
    const argRegExp = /^--/;
    if (workerData.args.length !== 1 || !argRegExp.test(workerData.args[0])) {
        throw new Error('Invalid input');
    }

    const arg = workerData.args.pop();
    let requestedInfo;

    switch (arg) {
        case '--EOL' : requestedInfo = nos.EOL.replace('\n', '\\n').replace('\r', '\\r'); break;
        case '--cpus': requestedInfo = nos.cpus().map(value => {
                delete value['times'];
                value['speed'] /= 1000;
                return value;
            }); break;
        case '--homedir': requestedInfo = nos.homedir(); break;
        case '--username': requestedInfo = nos.hostname(); break;
        case '--architecture': requestedInfo = nos.arch(); break;
        default: throw new Error('Invalid input');
    }

    parentPort.postMessage({
        commandResult: requestedInfo,
    });
    return 0;
};

os();