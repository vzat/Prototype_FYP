function getCollections(database, token, connections) {
    return fetch('http://localhost:4001/api/v1/' + database + '/collections', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(function (res) {
        return res.json();
    }).then(connections);
};

function getDocuments(database, collection, token, documents) {
    return fetch('http://localhost:4001/api/v1/' + database + '/' + collection + '/documents', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(function (res) {
        return res.json();
    }).then(documents);
};

function createCollection(database, token, collectionName, status) {
    return fetch('http://localhost:4001/api/v1/' + database + '/collection', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({'name': collectionName})
    }).then(function (res) {
        return res.json();
    }).then(status);
}

const db = { getCollections, getDocuments, createCollection };
export default db;
