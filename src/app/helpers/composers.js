import path from 'node:path';

export const assemblePathForSingleArg = async (currentDir, args) =>  {
    if (args.length !== 1) {
        throw new Error('Operation failed');
    }
    const dest = args[0];
    let newDest;
    if (!path.isAbsolute(dest)) {
        newDest = path.join(currentDir, dest);
    } else {
        newDest = dest;
    }

    return newDest;
}