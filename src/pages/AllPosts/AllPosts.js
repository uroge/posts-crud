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
import Backdrop from '../../components/Backdrop/Backdrop';

import '../../sass/pages/allPosts.scss';

class AllPosts extends Component {
    state = {
        isDeleting: false,
        isEditSucessfull: false,
        showForm: false,
        name: '',
        description: '',
        preview: null,
        id: '',
        isLoading: false,
        isPostBeingDeleted: false,
        isPinnedPostBeingDeleted: false,
        deletedPostId: null
    }
    
    componentDidMount() {
        this.getPosts();
    }

    /**
     * Function that sets isUploadSuccessful to false
     * and closes modal
    */
    modalCloseHandler = () => {
        this.setState({ isEditSucessfull: false });
        this.setState({ isPostBeingDeleted: false });
    }

    /**
     * Function that sets showForm to false
     * and closes form when backdrop is clicked
    */
    editFormClosed = () => {
        this.setState({ showForm: false });
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

        axios.get('https://posts-crud-9a799-default-rtdb.firebaseio.com/pinned-posts.json')
        .then(response => {
            if(response.data) {
                const posts = [];
                for (let key in response.data) {
                    posts.push({ ...response.data[key], id: key });
                }

                this.props.addPinnedPosts(posts);
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
            this.setState({ isPostBeingDeleted: false });
            console.log(id);
        })
        .catch(error => console.log(error));
    }

    /**
     * Function that deletes specific pinnedPost that is clicked on
     * @param {String} id - id of a post to delete
    */
    deletePinnedPostHandler = (id) => {
        axios.delete(`https://posts-crud-9a799-default-rtdb.firebaseio.com/pinned-posts/${id}.json`)
        .then(response => {
            const pinnedPostsAfterDeleting = this.props.pinnedPosts.filter(pinnedPost => pinnedPost.id !== id);

            this.props.deletePinnedPost(pinnedPostsAfterDeleting);
            this.setState({ isPinnedPostBeingDeleted: false });
            console.log(id);
        })
        .catch(error => console.log(error));
    }

    /**
     * Function that passes post to pinPost function and
     * pushes post to the pinnedPosts array in the store,
     * and moves post to pinned-posts table in database
     * @param {Object} post - post that should be pinned
    */
    pinPostHandler = async (post) => {
        const oldRef = app.database().ref(`posts/${post.id}`);
        const newRef = app.database().ref(`pinned-posts/${post.id}`);

        try {
          const snap = await oldRef.once('value');
          await newRef.set(snap.val());
          await oldRef.set(null);
        } catch(err) {
             console.log(err.message);
        }

        this.props.pinPost(post);
    }

    /**
     * Function that passes post to pinPost function and
     * pushes post to the pinnedPosts array in the store,
     * and moves post to posts table in database
     * @param {Object} post - post that should be pinned
    */
    unpinPostHandler = async (post) => {
        const oldRef = app.database().ref(`pinned-posts/${post.id}`);
        const newRef = app.database().ref(`posts/${post.id}`);

        try {
          const snap = await oldRef.once('value');
          await newRef.set(snap.val());
          await oldRef.set(null);
        } catch(err) {
             console.log(err.message);
        }

        this.props.unpinPost(post);
    }

    /**
     * Function that sets new values of post that
     * should be edited
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
                    const postsAfterEditing = this.props.posts.filter(post => post.id !== this.state.id);
                    const posts = [...postsAfterEditing, response.data];

                    this.props.editPosts(posts);
                    this.setState({ isLoading: false });
                    this.setState({ showForm: false });
                    this.setState({ isEditSucessfull: true })
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
        let pinnedPostsList = null;
        let modal = null;

        if(this.state.isEditSucessfull) {
            modal = <Modal modalClosed={ this.modalCloseHandler } edit={true}/>;
        }

        if(this.state.isPostBeingDeleted) {
            modal = <Modal modalClosed={ this.modalCloseHandler } delete={true} deletePost={() => this.deletePostHandler(this.state.deletedPostId)} />;
        }

        if(this.state.isPinnedPostBeingDeleted) {
            modal = <Modal modalClosed={ this.modalCloseHandler } delete={true} deletePost={() => this.deletePinnedPostHandler(this.state.deletedPostId)} />;
        }

        if(this.props.pinnedPosts) {
            pinnedPostsList = this.props.pinnedPosts.map(post => {
                return <Post 
                key={Math.random()} 
                name={post.name} 
                description={post.description} 
                thumbnail={post.preview}
                // delete={() => this.deletePinnedPostHandler(post.id)}
                delete={() => {
                    this.setState({isPinnedPostBeingDeleted: true, deletedPostId: post.id});
                }}
                pin={() => this.unpinPostHandler(post)}
                edit={() => this.editPostHandler(post)}
                pinned={true} />
            });
        }

        if(this.props.posts) {
            postsList = this.props.posts.map(post => {
                return <Post
                key={Math.random()}
                name={post.name}
                description={post.description}
                thumbnail={post.preview}
                delete={() => {
                    this.setState({isPostBeingDeleted: true, deletedPostId: post.id});
                }}
                pin={() => this.pinPostHandler(post)}
                edit={() => this.editPostHandler(post)} />
            });
        }

        return (
            <div className="all-posts">
                <h1>All Posts</h1>
                { this.state.isLoading ? <Loader /> : null }
                <div className="all-posts__list" >
                    { pinnedPostsList }
                    { postsList }
                </div>
                { modal }

                { this.state.showForm ? 
                <div>
                    <Backdrop clicked={this.editFormClosed} />
                    <Form method="patch" name={this.state.name} description={this.state.description} onSubmit={this.onFormSubmit} />
                </div>
                 : null }
                <Link to="/" className="all-posts__link">Make New Post</Link>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        posts: state.posts,
        pinnedPosts: state.pinnedPosts
    }
}

const mapDispatchToProps = dispatch => {
    return {
        deletePost: (posts) => dispatch({type: actionTypes.DELETE, posts: posts}),
        deletePinnedPost: (pinnedPosts) => dispatch({type: actionTypes.DELETE_PINNED, pinnedPosts: pinnedPosts}),
        addPosts: (posts) => dispatch({type: actionTypes.GET, posts: posts}),
        editPosts: (posts) => dispatch({type: actionTypes.EDIT, posts: posts}),
        pinPost: (post) => dispatch({type: actionTypes.PIN, post: post}),
        unpinPost: (post) => dispatch({type: actionTypes.UNPIN, post: post}),
        addPinnedPosts: (pinnedPosts) => dispatch({type: actionTypes.GET_PINNED, pinnedPosts: pinnedPosts})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllPosts);