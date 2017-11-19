const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const morgan = require('morgan')
const app = express();

module.exports = new Promise(function (resolve, reject) {
    app.set('port', process.env.SERVER_PORT || 4001);
    app.use(cors());
    app.use(bodyParser.json());
    app.use(morgan('combined'))

    app.get('/', function (req, res) {
        res.end('Data Retriever');
    });

    // app.use('/api/v1', routes);

    const listen = app.listen(app.get('port'), function () {
        console.log('Connection Manager Server listening on port ' + app.get('port'));
        resolve(app);
    });

    listen.on('error', function (err) {
        console.log(err);
        reject(err);
    });
});
