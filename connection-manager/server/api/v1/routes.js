const express = require('express');
const router = express.Router();
const request = require('request-promise');
const config = require('config');
const aws = require('./aws/aws.js');
const ssh = require('./aws/ssh,js');

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

router.post('/connection', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    aws.getPublicDNS()
        .then(function (dns) {
            ssh.getMongoConnection(dns).then(function (connInfo) {
                res.end(JSON.stringify(connInfo));
            });
        })
        .catch(function (err) {
            console.log(err);
            res.end(JSON.stringify({'error': err}));
        });
});

module.exports = router;
