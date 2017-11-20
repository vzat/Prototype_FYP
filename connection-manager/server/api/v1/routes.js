const express = require('express');
const router = express.Router();
const request = require('request-promise');
const config = require('config');

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

module.exports = router;
