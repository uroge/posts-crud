import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actionTypes from '../../store/actions';

import axios from '../../axios';
import { app } from '../../firebase.utils';

import Post from '../../components/Post/Post';
import Modal from '../../components/Modal/Modal';
import Form from '../../components/Form/Form';
import Loader from '../../components/Loader/Loader';

import '../../sass/pages/allPosts.scss';

class AllPosts extends Component {
    state = {
        isDeleting: false,
        isModalOpened: false,
        showForm: false,
        name: '',
        description: '',
        preview: null,
        id: '',
        isLoading: false,
        isUploadSuccesfull: false
    }
    
    componentDidMount() {
        this.getPosts();
    }

    /**
     * Function that sets isUploadSuccessful to false
     * and closes modal
    */
    modalCloseHandler = () => {
        this.setState({ isUploadSuccessful: false });
    }

    /**
     * Function that sends GET request to firebase database,
     * and pushes data into redux store
    */
    getPosts = () => {
        axios.get('https://posts-crud-9a799-default-rtdb.firebaseio.com/posts.json')
        .then(response => {
            if(response.data) {
                const posts = [];
                for (let key in response.data) {
                    posts.push({ ...response.data[key], id: key });
                }

                this.props.addPosts(posts);
            }
        })
        .catch(error => console.log(error));
    }

    /**
     * Function that deletes specific post that is clicked on
     * @param {String} id - id of a post to delete
    */
    deletePostHandler = (id) => {
        axios.delete(`https://posts-crud-9a799-default-rtdb.firebaseio.com/posts/${id}.json`)
        .then(response => {
            const postsAfterDeleting = this.props.posts.filter(post => post.id !== id);

            this.props.deletePost(postsAfterDeleting);
        })
        .catch(error => console.log(error));
    }

    pinPostHandler = () => {
        console.log(this.props.posts);
    }

    /**
     * 
     * @param {Object} post - post that is being edited
    */
    editPostHandler = (post) => {
        this.setState({
            showForm: true,
            name: post.name,
            description: post.description,
            id: post.id
        });
    }

    /**
     * Function that edits specific post and sends patch request to database
     * @param {String} name - post current name
     * @param {String} description - post current description
     * @param {String} thumbnail - post thumbnail link from database
    */
    onFormSubmit = async (name, description, thumbnail) => {
        this.setState({ isLoading: true });
        if(name && description && thumbnail) {
            if(thumbnail.type.startsWith('image/')) {
                this.setState({ isLoading: true });
                const storageRef = app.storage().ref(`post-thumbnails/`);
                const fileRef = storageRef.child(thumbnail.name);
    
                await fileRef.put(thumbnail);
                const fileUrl = await fileRef.getDownloadURL();

                const newPostData = {
                    name: name,
                    description: description,
                    preview: fileUrl
                }
                
                axios.patch(`/posts/${this.state.id}.json`, newPostData)
                .then(response => {
                    console.log(response.data);
                    const postsAfterEditing = this.props.posts.filter(post => post.id !== this.state.id);
                    const posts = [...postsAfterEditing, response.data];

                    this.props.editPosts(posts);
                    this.setState({ isLoading: false });
                    this.setState({ showForm: false });
                })
                .catch(error => console.log(error));
            } else {
                alert('File type not supported');
            }
        } else {
            if(!name) {
                alert('You need to provide post name');
            } else if(!description) {
                alert('You need to provide post description');
            } else if(!thumbnail) {
                alert('You need to provide post thumbnail');
            }
        }
    }

    render() {
        let postsList = null;

        if(this.props.posts) {
            postsList = this.props.posts.map(post => {
                return <Post 
                key={Math.random()} 
                name={post.name} 
                description={post.description} 
                thumbnail={post.preview}
                delete={() => this.deletePostHandler(post.id)}
                pin={this.pinPostHandler}
                edit={() => this.editPostHandler(post)} />
            });
        }

        return (
            <div className="all-posts">
                <h1>All Posts</h1>
                { this.state.isLoading ? <Loader /> : null }
                <div className="all-posts__list" >
                    { postsList }
                </div>
                { this.state.isModalOpened ? 
                <Modal modalClosed={this.modalCloseHandler}>
                    You have successfully edited post
                    {/* <button className="all-posts__delete">Delete</button> */}
                </Modal> : null }

                { this.state.showForm ? 
                <Form method="patch" name={this.state.name} description={this.state.description} onSubmit={this.onFormSubmit} /> : null }
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
        deletePost: (posts) => dispatch({type: actionTypes.DELETE, posts: posts}),
        addPosts: (posts) => dispatch({type: actionTypes.GET, posts: posts}),
        editPosts: (posts) => dispatch({type: actionTypes.EDIT, posts: posts})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllPosts);