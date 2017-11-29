const express = require('express');
const router = express.Router();
const request = require('request-promise');
const config = require('config');
const aws = require('../../aws/aws.js');
const ssh = require('../../aws/ssh.js');

router.get('/connections', function (req, res) {
    const dataReceiver = config.servers['data-receiver'];

    request.get(dataReceiver.address + ':' + dataReceiver.port + '/mongo/accounts', {
        'bearer': config.token
    }).then(function (body) {
        console.log(body);
        res.end(JSON.stringify({'body': body}));
    }).catch(function (err) {
        console.log(err);
        res.end(JSON.stringify({'error': err}));
    });
});

router.post('/:username/connection', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    const dataReceiver = config.servers['data-receiver'];
    const username = req.params.username;
    const dbName = req.body.dbName;

    aws.getPublicDNS()
        .then(function (dns) {
            ssh.getMongoConnection(dns, dbName).then(function (connInfo) {
                const options = {
                    method: 'GET',
                    uri: dataReceiver.address + ':' + dataReceiver.port + '/api/v1/mongo/accounts/documents',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + config.token
                    }
                };

                return request(options)
                    .then(function (accounts) {
                        accounts = JSON.parse(accounts);

                        let user = null;
                        for (const accountNo in accounts) {
                            const account = accounts[accountNo];

                            if (account.username === username) {
                                user = account;
                            }
                        }

                        user.databases.push(connInfo);
                        delete user._id;

                        const options = {
                            method: 'PUT',
                            uri: dataReceiver.address + ':' + dataReceiver.port + '/api/v1/mongo/accounts/document',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + config.token
                            },
                            body: JSON.stringify({
                                query: {'username': username},
                                data: user
                            })
                        };

                        return request(options)
                            .then(function () {
                                res.end(JSON.stringify({'success': 1}));
                            })
                            .catch(function (err) {
                                res.end(JSON.stringify({'error': err}));
                            })
                    }).catch(function (err) {
                        console.log(err);
                        res.end(JSON.stringify({'error': err}));
                    });
            });
        })
        .catch(function (err) {
            console.log(err);
            res.end(JSON.stringify({'error': err}));
        });
});

module.exports = router;
