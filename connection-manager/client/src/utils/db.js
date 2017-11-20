function getConnections(connections) {
    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer z321');

    // Doesn't work with this
    // http://localhost:4001
    return fetch('/api/v1/mongo/accounts/documents', {
        method: 'GET',
        headers: headers
    })
    .then(parseJSON)
    .then(connections);
}

function parseJSON(response) {
    return response.json();
}

const db = { getConnections };
export default db;
