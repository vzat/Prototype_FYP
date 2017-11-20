const express = require('express');
const router = express.Router();
const db = require('../../database/db.js');
const logger = require('../../utils/logger.js');

function getToken(auth) {
    let token = auth;

    if (auth.indexOf('Bearer') !== -1) {
        token = auth.substring('Bearer'.length + 1)
    }

    return token;
}

router.get('/:database/collections', function (req, res) {
    const database = req.params.database;
    const token = getToken(req.get('Authorization'));

    res.setHeader('Content-Type', 'application/json');

    res.send(database + '?auth=' + token);
});

router.get('/:database/:collection/documents', function (req, res) {
    const database = req.params.database;
    const collection = req.params.collection;
    const token = getToken(req.get('Authorization'));

    res.setHeader('Content-Type', 'application/json');

    res.send(database + '/' + collection + '?auth=' + token);
});

module.exports = router;
