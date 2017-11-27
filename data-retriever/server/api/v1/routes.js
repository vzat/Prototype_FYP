const express = require('express');
const router = express.Router();
const db = require('../../database/db.js');

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

router.put('/:database/:collection/document', function (req, res) {
    const token = getToken(req.get('Authorization'));
    const database = req.params.database;
    const collection = req.params.collection;
    const query = req.body.query;
    const data = req.body.data;

    res.setHeader('Content-Type', 'application/json');

    db.replaceDocument(token, database, collection, query, data)
        .then(function () {
            res.send(JSON.stringify({}));
        })
        .catch(function (err) {
            res.send(JSON.stringify({'error': err}));
        });
});

module.exports = router;
