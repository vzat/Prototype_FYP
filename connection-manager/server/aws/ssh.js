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
                        const username = values[0].toString('base64');
                        const password = values[1].toString('base64');
                        // --env MONGO_INITDB_ROOT_USERNAME=' + username + ' --env MONGO_INITDB_ROOT_PASSWORD=' + password + '
                        return ssh.execCommand('docker run -d -p 27017 --restart=always mongo', { cwd: '/var' })
                            .then(function (data) {
                                const containerID = data.stdout;
                                return ssh.execCommand('docker port ' + containerID, { cwd: '/var' })
                                    .then(function (data) {
                                        const port = data.stdout.substring(data.stdout.indexOf(':') + 1);
                                        return ssh.execCommand('docker exec ' + containerID + ' mongo --eval "db = db.getSiblingDB(\'' + dbName + '\'); db.test.insert({});"')
                                            .then(function () {
                                                ssh.dispose();
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
                                    });
                            });
                    }).catch(function (err) {
                        console.log(err);
                    });
            });
    }
};
