import React, { Component } from 'react';
import './App.css';
import db from './utils/db.js'

class App extends Component {
    state = {
        posts: {
        },
        title: '',
        body: ''
    };

    componentDidMount = () => {
        this.getPosts();
    };

    getPosts = () => {
        return db.getPosts(posts => {
            console.log(posts);
            this.setState({
                posts: posts
            });
        });
    };

    setTitle = (event) => {
        this.setState({
            title: event.target.value
        });
    };

    setBody = (event) => {
        this.setState({
            body: event.target.value
        });
    };

    submitPost = () => {
        const title = this.state.title;
        const body = this.state.body;

        if (title !== '' && body !== '')
        {
            this.setState({
                title: '',
                body: ''
            });

            const post = {
                title: title,
                body: body
            };

            console.log(post);

            db.insertPost(post, status => {
                this.getPosts();
            });
        }
    };

    render() {
        const posts = this.state.posts;
        const postList = Object.keys(posts).map((postNo) => (
            <div className = "post">
                <hr/>
                <h2> {posts[postNo].title} </h2>
                <p> <pre>{posts[postNo].body}</pre> </p>
            </div>
        ));

        return (
            <div className="App">
                <header className="App-header">
                    <h1>Blog</h1>
                </header>

                { postList }

                <br/>


                <textarea
                    rows = "1"
                    cols = "100"
                    name = "title"
                    placeholder = "Title"
                    value = {this.state.title}
                    onChange = {this.setTitle} />

                <br/>

                <textarea
                    rows = "10"
                    cols = "100"
                    name = "body"
                    placeholder = "Body"
                    value = {this.state.body}
                    onChange = {this.setBody} />

                <br/>

                <button onClick = {this.submitPost}> Submit </button>
            </div>
        );
      }
}

export default App;
