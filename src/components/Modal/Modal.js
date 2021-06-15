import React from 'react';

import '../../sass/components/modal.scss';

const modal = (props) => (
    <div className="modal">
        <div className="modal__content">
            {props.children}
            <button className="modal__btn" onClick={props.modalClosed}>&times;</button>
        </div>
    </div>
);

export default modal;