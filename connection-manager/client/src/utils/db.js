function getConnections(username, connections) {
    // Use address instead of localhost
    return fetch('http://localhost:4001/api/v1/mongo/accounts/documents', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer z321'
        }
    }).then(function (res) {
        return res.json();
    }).then(connections);
}

const db = { getConnections };
export default db;
