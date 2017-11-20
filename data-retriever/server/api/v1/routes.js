const express = require('express');
const router = express.Router();
const db = require('../../database/db.js');
const logger = require('../../utils/logger.js');

router.get('/:database/collections', function (req, res) {
    const database = req.params.database;
    const token = req.get('Authorization');

    res.setHeader('Content-Type', 'application/json');

    res.send(database + '?auth=' + token);
});

router.get('/:database/:collection/documents', function (req, res) {
    const database = req.params.database;
    const collection = req.params.collection;
    const token = req.get('Authorization');

    res.setHeader('Content-Type', 'application/json');

    res.send(database + '/' + collection + '?auth=' + token);
});

module.exports = router;
