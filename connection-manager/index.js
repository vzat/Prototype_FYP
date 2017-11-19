global.Promise=require('bluebird');

const server = require('./server');
const spawn = require('cross-spawn');

server.then(function () {
    spawn('npm', ['start'], {cwd: 'client'});
    console.log('Connection Manager Client listening on port 3000');
});
