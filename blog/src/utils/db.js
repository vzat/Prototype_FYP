function getPosts(posts) {
    return fetch( process.env.REACT_APP_API_SERVER +
                  '/' + process.env.REACT_APP_DATABASE +
                  '/' + process.env.REACT_APP_COLLECTION +
                  '/documents', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + process.env.REACT_APP_API_TOKEN
        }
    }).then(function (res) {
        return res.json();
    }).then(posts);
};

function insertPost(post, status) {
    return fetch( process.env.REACT_APP_API_SERVER +
                  '/' + process.env.REACT_APP_DATABASE +
                  '/' + process.env.REACT_APP_COLLECTION +
                  '/document', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + process.env.REACT_APP_API_TOKEN
        },
        body: JSON.stringify({data: post})
    }).then(function (res) {
        return res.json();
    }).then(status);
};

const db = { getPosts, insertPost };
export default db;
