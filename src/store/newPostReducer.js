import * as actionTypes from './actions';

const initialState = {
    posts: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.NEW:
            return {
                ...state,
                posts: [...state.posts, action.post]
            };
        
        case actionTypes.DELETE:
            return {
                ...state,
                posts: [...action.posts]
            }
        default:
            return state;
    }
};

export default reducer;