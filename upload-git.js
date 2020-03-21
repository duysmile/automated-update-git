const shell = require('shelljs');

const UPLOAD_REMOTE = 'uploaded';
const USERNAME = 'duysmile';
const PASSWORD = 'thao240796';

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
    await promisifyCommand(`git push https://${USERNAME}:${PASSWORD}@github.com/duysmile/temp-data.git master`);
}

async function pullGit() {
    await promisifyCommand(`git stash`);
    await promisifyCommand(`git pull https://${USERNAME}:${PASSWORD}@github.com/duysmile/temp-data.git master`);
}

function addRemoteGit(remote) {
    return promisifyCommand(`git remote add ${UPLOAD_REMOTE} ${remote}`);
}

async function configGit() {
    await promisifyCommand('git config --global user.email "duy210697@gmail.com"');
    await promisifyCommand('git config --global user.name "duy21"');
} 

async function main() {
    if (!shell.which('git')) {
        shell.echo('Sorry, this script requires git');
        shell.exit(1);
    } else {
        // const isGitInit = await checkIfGitInit();
        // console.log('........', isGitInit);
        // if (!isGitInit) {
        await initGit();
        await pullGit();
        await configGit();
        // }
        // await addRemoteGit('https://github.com/duysmile/temp-data.git');

        await createFile('test1.txt');
        await pushToGit();
    }
}

module.exports = main;
