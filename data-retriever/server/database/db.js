const MongoClient = require('mongodb').MongoClient;
const logger = require('../utils/logger.js');
const config = require('config');
let localDB = null;

// function connect(token) {
//     return localDB.collections().then(function () {
//
//     });
// };

function getConnectionInfo(token, database) {
    return new Promise(function (resolve, reject) {
        const accounts = localDB.collection('accounts');
        accounts.findOne({'token': token}).then(function (account, err) {
            if (err) {
                reject(err);
            }

            const dbs = account.databases;

            // Check if token and db exist
            for (const dbNo in dbs) {
                const db = dbs[dbNo];
                if (db.name === database) {
                    resolve(db);
                }
            }

            reject('Incorrect token or database');
        });
    });
}

function connect (token, database) {
    return new Promise(function (resolve, reject) {
        getConnectionInfo(token, database)
            .then(function (conn) {
                const uri = 'mongodb://' + conn.address + ':' + conn.port + '/' + conn.name;
                MongoClient.connect(uri)
                    .then(function (db) {
                        logger.log('info', 'Connected to ' + uri);
                        resolve(db);
                    })
                    .catch(function (err) {
                        logger.log('error', err);
                        reject(err);
                    });
            })
            .catch(function (err) {
                logger.log('error', err);
                reject(err);
            });
    });
}

module.exports = {
    connectLocal: function () {
        const uri = 'mongodb://' + config.db.server + ':' + config.db.port + '/mongo';
        let retries = 0;

        return new Promise(function (resolve, reject) {
            let interval = setInterval(function () {
                MongoClient.connect(uri)
                    .then(function (database) {
                        logger.log('info', 'Connected to ' + uri);
                        localDB = database;
                        clearInterval(interval);
                        resolve();
                    })
                    .catch(function (err) {
                        if (retries % 10 === 0) {
                            logger.log('warn', err);
                        }
                        if (++retries >= config.db.maxRetries) {
                            logger.log('info', err);
                            clearInterval(interval);
                            reject('Cannot connect to the database');
                        }
                    });
            }, config.db.intervalRetries);
        });
    },
    getCollections: function (token, database) {
        return new Promise(function (resolve, reject) {
            connect(token, database)
                .then(function (db) {
                    db.listCollections().toArray()
                        .then(function (collections) {
                            resolve(collections);
                        })
                        .catch(function (err) {
                            reject(err);
                        })
                        .finally(function () {
                            db.close();
                        });
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    },
    getDocuments: function (token, database, collectionName) {
        return new Promise(function (resolve, reject) {
            connect(token, database)
              .then(function (db) {
                  const collection = db.collection(collectionName);
                  collection.find().toArray()
                      .then(function (documents) {
                          resolve(documents);
                      })
                      .catch(function (err) {
                          reject(err);
                      })
                      .finally(function () {
                          db.close();
                      });
              })
              .catch(function (err) {
                  reject(err);
              });
        });
    },
    replaceDocument: function (token, database, collectionName, query, data) {
        return new Promise(function (resolve, reject) {
            connect(token, database)
                .then(function (db) {
                    const collection = db.collection(collectionName);
                    collection.replaceOne(query, data)
                        .then(function () {
                            resolve();
                        })
                        .catch(function (err) {
                            reject(err);
                        })
                        .finally(function () {
                            db.close();
                        });
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    }
};
