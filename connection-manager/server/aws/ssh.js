const node_ssh = require('node-ssh');
let ssh = new node_ssh();
const crypto = require('crypto');

module.exports = {
    getMongoConnection: function (host, dbName) {
        return ssh.connect({
            host: host,
            username: 'ubuntu',
            privateKey: './server/keys/MongoDB_1.pem'
        })
            .then(function() {
                let userPromise = crypto.randomBytes(5);
                let passPromise = crypto.randomBytes(5);

                return Promise.all([userPromise, passPromise])
                    .then(function (values) {
                        // const username = values[0]
                        const username = 'ubuntu';
                        const password = values[1]
                        // --env MONGO_INITDB_ROOT_USERNAME=' + username + ' --env MONGO_INITDB_ROOT_PASSWORD=' + password + '
                        return ssh.execCommand('docker run -d -p 27017 --restart=always mongo', { cwd: '/var' })
                            .then(function (data) {
                                const containerID = data.stdout;
                                console.log(data.stderr);
                                return ssh.execCommand('docker port ' + containerID, { cwd: '/var' })
                                    .then(function (data) {
                                        const port = data.stdout.substring(data.stdout.indexOf(':') + 1);
                                        return ssh.execCommand('docker exec ' + containerID + ' mongo --eval "db = db.getSiblingDB(\'' + dbName + '\'); db.dummy.insert({});"')
                                            .then(function () {
                                                // ssh.dispose();
                                                const connectionInfo = {
                                                    name: dbName,
                                                    address: host,
                                                    port: port,
                                                    username: username,
                                                    password: password,
                                                    type: 'single-node'
                                                };
                                                return connectionInfo;
                                            })
                                            .catch(function (err) {
                                                return err;
                                            })



                                        // const port = data.stdout.substring(data.stdout.indexOf(':') + 1);
                                        // const uri = 'mongodb://<username>:<password>@' + host + ':' + port;
                                    });
                            });
                    }).catch(function (err) {
                        console.log(err);
                    });
            });
    }
};

// ssh.connect({
//     host: 'ec2-52-34-206-13.us-west-2.compute.amazonaws.com',
//     username: 'ubuntu',
//     privateKey: './MongoDB_1.pem'
// })
// .then(function() {
//     ssh.execCommand('echo "Hello World"', { cwd: '/var' })
//         .then(function(data) {
//             console.log(data.stdout);
//             console.log(data.stderr);
//         });
// })

// mySSH.getMongoConn('ec2-52-34-67-4.us-west-2.compute.amazonaws.com', 'ubuntu', './MongoDB_1.pem', 'user', 'pass').then(function (data) {
//     console.log(data);
// })

// TODO:
// Assign your own port so it's constant even when restarting
// Proxy the aws uri so it's constart for the customer or use elastic ip
// Create Connection Manager and integrate awsCli and ssh into it (as services?)
