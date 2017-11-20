const express = require('express');
const router = express.Router();
const db = require('../../database/db.js');
const logger = require('../../utils/logger.js');

function getToken(auth) {
    let token = auth;

    if (auth.indexOf('Bearer') !== -1) {
        token = auth.substring('Bearer'.length + 1);
    }

    return token;
}

router.get('/:database/collections', function (req, res) {
    const database = req.params.database;
    const token = getToken(req.get('Authorization'));

    res.setHeader('Content-Type', 'application/json');

    db.getCollections(token, database)
        .then(function (collections) {
            res.send(JSON.stringify(collections));
        })
        .catch(function (err) {
            res.send(JSON.stringify({'error': err}));
        });
});

router.get('/:database/:collection/documents', function (req, res) {
    const database = req.params.database;
    const collection = req.params.collection;
    const token = getToken(req.get('Authorization'));

    res.setHeader('Content-Type', 'application/json');

    db.getDocuments(token, database, collection)
        .then(function (documents) {
            res.send(JSON.stringify(documents));
        })
        .catch(function (err) {
            res.send(JSON.stringify({'error': err}));
        });
});

module.exports = router;
