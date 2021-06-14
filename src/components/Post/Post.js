import React from 'react';
import '../../sass/components/post.scss';

import { AiFillEdit } from 'react-icons/ai';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { BiPin } from 'react-icons/bi';

const post = (props) => {
    return(
        <div className="post">
            <div className="post__icons">
                <BiPin className="post__icon pin" onClick={props.pin}/>
                <AiFillEdit className="post__icon edit" onClick={() => console.log('Edit')}/>
                <RiDeleteBin6Fill className="post__icon delete" onClick={props.delete}/>
            </div>
            <h3 className="post__name">{props.name}</h3>
            <p className="post__description">{props.description}</p>
            <div style={{backgroundImage: `url(${props.thumbnail})`}} className="post__thumbnail"></div>
        </div>
    );
}

export default post;