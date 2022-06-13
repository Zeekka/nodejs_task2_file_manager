import path from 'node:path';

export const assemblePathForSingleArg = async (currentDir, args) =>  {
    if (args.length !== 1) {
        throw new Error('Invalid input');
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

export const assemblePathForTwoArgs = async (currentDir, args) =>  {
    if (args.length !== 2) {
        throw new Error('Invalid input');
    }

    const dest = await assemblePathForSingleArg(currentDir, args.splice(-1));
    const src = await assemblePathForSingleArg(currentDir, args.splice(-1));

    return {
        src: src,
        dest: dest
    }
}