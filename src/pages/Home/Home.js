import React, { Component } from 'react';
import Form from '../../components/Form/Form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { app } from '../../firebase.utils';
import axios from '../../axios';
import { Redirect } from 'react-router-dom';
import '../../sass/pages/home.scss';

import Loader from '../../components/Loader/Loader';
import Modal from '../../components/Modal/Modal';

class Home extends Component {
    state = {
        isLoading: false,
        isUploadSuccessful: false,
        redirect: false
    }

    /**
     * Functions that sets isUploadSuccessful
     * to false and closes modal
    */
    modalCloseHandler = () => {
        this.setState({ isUploadSuccessful: false, redirect: true });
    }

    /**
     * Function that sends post to database when form is submitted
     * @param {String} name - post name
     * @param {String} description - post description
     * @param {File} thumbnail - post thumbnail
    */
    onFormSubmit = async (name, description, thumbnail) => {
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
                
                axios.post('/posts.json', newPostData)
                .then(response => {
                    this.setState({ isLoading: false });
                    this.setState({ isUploadSuccessful: true });
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
        return (
            <div className="home">
                <h1>Posts</h1>
                { this.state.isUploadSuccessful ? <Modal show={this.state.isUploadSuccessful} modalClosed={this.modalCloseHandler}>
                    You've successfully created a new Post
                </Modal> : null }
                { this.state.redirect ? <Redirect from="/" to="/all-posts" /> : null }
                { this.state.isLoading ? <Loader /> : null}
                <Form method="post" onSubmit={ this.onFormSubmit } isUploadSuccessful={this.state.isUploadSuccessful}/>
                <Link to="/all-posts" className="home__link">See All Posts</Link>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        posts: state.posts
    }
}

export default connect(mapStateToProps)(Home);