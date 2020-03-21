const shell = require('shelljs');

const UPLOAD_REMOTE = 'uploaded';

function promisifyCommand(command) {
    return new Promise((resolve, reject) => {
        shell.exec(command, (err, stdout, stderr) => {
            if (err) {
                return reject(err);
            }

            // console.error(stderr);
            return resolve(stdout && stdout.trim());
        });
    });
}

function checkIfGitInit() {
    return promisifyCommand('git rev-parse --is-inside-work-tree');
}

async function initGit() {
    const result = await promisifyCommand('git init');
    return result == 'true';
}

function createFile(fileName) {
    return promisifyCommand(`touch ${fileName}`);
}

async function pushToGit() {
    await promisifyCommand('git add .');
    await promisifyCommand('git commit -m "message here"');
    await promisifyCommand(`git push ${UPLOAD_REMOTE} master`);
}

function addRemoteGit(remote) {
    return promisifyCommand(`git remote add ${UPLOAD_REMOTE} ${remote}`);
}

async function main() {
    if (!shell.which('git')) {
        shell.echo('Sorry, this script requires git');
        shell.exit(1);
    } else {
        const isGitInit = await checkIfGitInit();
        if (!isGitInit) {
            await initGit();
        }
        await addRemoteGit('https://github.com/duysmile/temp-data.git');

        await createFile('test1.txt');
        await pushToGit();
    }
}

module.exports = main;