import React, { Component } from 'react';
import Form from '../../components/Form/Form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';

import { app } from '../../firebase.utils';
import axios from '../../axios';

import '../../sass/pages/home.scss';

import Loader from '../../components/Loader/Loader';
import Modal from '../../components/Modal/Modal';

class Home extends Component {
    state = {
        isLoading: false,
        isUploadSuccessful: false
    }

    modalCloseHandler = () => {
        this.setState({ isUploadSuccessful: false });
    }

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
                
                // this.props.addNewPost(newPostData);
                axios.post('/posts.json', newPostData)
                .then(response => {
                    console.log(response);

                    const newPostData = {
                        name: name,
                        description: description,
                        preview: fileUrl,
                        id: response.data.name
                    }

                    this.props.addNewPost(newPostData);
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

const mapDispatchToProps = dispatch => {
    return {
        addNewPost: (post) => dispatch({type: actionTypes.NEW, post: post})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);