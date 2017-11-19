const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const app = express();

module.exports = new Promise(function (resolve, reject) {
    app.set('port', process.env.SERVER_PORT || 3001);
    app.use(cors());
    app.use(bodyParser.json());

    app.get('/', function (req, res) {
        res.end('Hello World');
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
