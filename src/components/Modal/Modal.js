import React from 'react';

import '../../sass/components/modal.scss';

const modal = (props) => {
    let modalContent = '';

    if(props.success) {
        modalContent = 'You\'ve successfully created a post';
    } else if (props.edit) {
        modalContent = 'You\'ve successfully edited post';
    } else if (props.delete) {
        modalContent = (
            <>
                <p>Are you sure you want to delete this post?</p>
                <button className="all-posts__delete" onClick={props.deletePost}>Delete</button>
            </>
        );
    }
    return (
    <div className="modal">
        <div className="modal__content">
            {/* {props.children} */}
            { modalContent }
            <button className="modal__btn" onClick={props.modalClosed}>&times;</button>
        </div>
    </div>
    );
};

export default modal;