const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const db = require('./database/db.js');
const logger = require('./utils/logger.js');
const routes = require('./api/v1/routes.js');

module.exports = new Promise(function (resolve, reject) {
    // Connect to local db
    db.connectLocal().then(function () {
        app.set('port', process.env.SERVER_PORT || 4001);
        app.use(cors());
        app.use(bodyParser.json());
        app.use(morgan('combined'));

        app.get('/', function (req, res) {
            res.end('Data Retriever');
        });

        app.use('/api/v1', routes);

        db.connect('a123', 'blog')
            .then(function (db) {
                logger.log('info', db);
            })
            .catch(function (err) {
                logger.log('error', err);
            });

        const listen = app.listen(app.get('port'), function () {
            logger.log('info', 'Connection Manager Server listening on port ' + app.get('port'));
            resolve(app);
        });

        listen.on('error', function (err) {
            logger.log('error', err);
            reject(err);
        });
    });

});
