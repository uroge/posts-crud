import React, { Component } from 'react';
import '../../sass/components/form.scss';
import { FcAddImage } from 'react-icons/fc';

class Form extends Component {
    constructor(props) {
        super(props);
        this.inputOpenFileRef = React.createRef()
        
        this.state = {
            postName: props.name ? props.name : '',
            postDescription: props.description ? props.description : '',
            postThumbnail: null
        }
    }

    openFileInput = () => {
        this.inputOpenFileRef.current.click();
    }

    render() {
        return (
            <form method={this.props.method} autoComplete="off" className="form">
                <h2>{this.props.method === 'post' ? 'Create New Post' : 'Edit Post'}</h2>
                <label>Post Name:</label>
                <input type="text" name="postName" value={this.state.postName} onChange={ (event) => this.setState({postName: event.target.value}) }/>
                <label>Post Description:</label>
                <input type="text" name="postDescription" value={this.state.postDescription} onChange={ (event) => this.setState({postDescription: event.target.value}) }/>
                <label>Post Thumbnail:</label>
                <FcAddImage onClick={ this.openFileInput } className="form__image-icon"/>
                <input type="file" ref={this.inputOpenFileRef} name="postThumbnail" hidden onChange={ (event) => this.setState({postThumbnail: event.target.files[0]}) }/>

               { this.state.postThumbnail ? 
                <div style={{backgroundImage: `url(${URL.createObjectURL(this.state.postThumbnail)})`}} className="form__image"></div> 
               : null }

                <button 
                    type="button" 
                    onClick={() => this.props.onSubmit(this.state.postName, this.state.postDescription, this.state.postThumbnail) }>
                {this.props.method === 'post' ? 'Create New Post' : 'Edit Post'}</button>
            </form>
        );
    }
}

export default Form;