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

const db = { getCollections, getDocuments };
export default db;
