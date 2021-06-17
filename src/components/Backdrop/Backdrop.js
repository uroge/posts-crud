import React from 'react';

import '../../sass/components/backdrop.scss';

const backdrop = (props) => (
    <div className="backdrop" onClick={props.clicked}></div>
);

export default backdrop;