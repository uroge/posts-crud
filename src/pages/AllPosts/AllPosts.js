import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actionTypes from '../../store/actions';

import axios from '../../axios';
import Post from '../../components/Post/Post';

import '../../sass/pages/allPosts.scss';

class AllPosts extends Component {
    state = {
        posts: []
    }
    
    componentDidMount() {
        this.getPosts();
    }

    getPosts = () => {
        axios.get('https://posts-crud-9a799-default-rtdb.firebaseio.com/posts.json')
        .then(response => {
            if(response.data) {
                this.setState({ posts: Object.values(response.data) });
            }
        })
        .catch(error => console.log(error));
    }

    deletePostHandler = (id) => {
        console.log(this.props.posts);
        axios.delete(`https://posts-crud-9a799-default-rtdb.firebaseio.com/posts/${id}.json`)
        .then(response => console.log(response))
        .catch(error => console.log(error));

        const postsAfterDeleting = this.props.posts.filter(post => post.id !== id);

        this.props.deletePost(postsAfterDeleting);
    }

    pinPostHandler = () => {
        console.log(this.props.posts);
    }

    render() {
        let postsList = null;

        if(this.state.posts) {
            postsList = this.state.posts.map(post => {
                return <Post 
                key={Math.random()} 
                name={post.name} 
                description={post.description} 
                thumbnail={post.preview}
                delete={() => this.deletePostHandler(post.id)}
                pin={this.pinPostHandler} />
            });
        }

        return (
            <div className="all-posts">
                <h1>All Posts</h1>
                <div className="all-posts__list">
                    { postsList }
                </div>
                <Link to="/" className="all-posts__link">Make New Post</Link>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        posts: state.posts
    }
}

const mapDispatchToProps = dispatch => {
    return {
        deletePost: (posts) => dispatch({type: actionTypes.DELETE, posts: posts})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllPosts);