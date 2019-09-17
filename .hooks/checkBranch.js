const execSync = require('child_process').execSync;
code = execSync('git rev-parse --abbrev-ref HEAD');
let branch = code.toString('utf8').trim();

if(branch === 'master'){
    process.exit(0);
}else{
    console.error(`Branch is not master! It is ${branch}`);
    process.exit(1);
}