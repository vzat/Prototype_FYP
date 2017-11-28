function createConnection(username, dbName, status) {
    return fetch('http://localhost:3001/api/v1/' + username + '/connection', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer z321'
        },
        body: JSON.stringify({'dbName': dbName})
    }).then(function (res) {
        return res.json();
    }).then(status);
}

const conn = { createConnection };
export default conn;
