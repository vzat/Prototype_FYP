function getConnections(username, connections) {
    return fetch('http://localhost:4001/api/v1/mongo/accounts/documents', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer z321'
        }
    }).then(function (res) {
        return res.json().then(function (json) {
            for (const recordNo in json) {
                const record = json[recordNo];

                if (record.username === username && record.databases) {
                    let conns = [];
                    for (const databaseNo in record.databases) {
                        conns.push(record.databases[databaseNo].name);
                    }
                    if (conns.length === 0) {
                        conns.push('You have no connections');
                    }
                    return conns;
                }
            }
            return ['Username not found'];
        })
    }).then(connections);
}

const db = { getConnections };
export default db;
