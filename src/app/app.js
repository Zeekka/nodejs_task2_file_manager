import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Worker} from 'node:worker_threads';

class FileManager {
    init() {
        const argv = process.argv.slice(2);
        const nameRegExp = /^--username/;

        while (argv.length > 0) {
            let arg = argv.shift();
            if (nameRegExp.test(arg)) {
                this.username = arg.split('=')[1];
            }
        }

        if (!this.username) {
            this.username = 'Guest';
        }

        this.currentDir = os.homedir();
    }

    updateContext(newContext) {
        this.username = newContext.username;
        this.currentDir = newContext.currentDir;
    }

    printCurrentDir() {
        console.log('You are currently in ' + this.currentDir);
    }

    run() {
        console.log('Welcome to the File Manager ' + this.username);
        this.printCurrentDir();

        process.stdin.on('data', (command) => {
            const parsedCommand = command.toString().replace('\n', '').split(' '),
                commandName = parsedCommand[0],
                commandArgs = parsedCommand.slice(1);

            this.runCommand(commandName, commandArgs);
        });
    }

    async runCommand(command, commandArgs) {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));

        try {
            const commandWorker = new Worker(path.join(__dirname, 'commands', command + '.js'), {
                workerData: {
                    currentDir: this.currentDir,
                    username: this.username,
                    args: commandArgs,
                },
            }).on('message', (response) => {
                if (response.commandResult) {
                    console.log(response.commandResult);
                }

                if (response.newContext) {
                    this.updateContext(response.newContext)
                }

                this.printCurrentDir();
            }).on('error', () => {
                console.log('Operation failed');
                this.printCurrentDir();
            });
        } catch (err) {
            console.log('Operation failed');
        }
    }
}

export default FileManager;