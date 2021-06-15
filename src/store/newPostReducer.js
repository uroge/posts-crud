import * as actionTypes from './actions';

const initialState = {
    posts: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET:
            return {
                ...state,
                posts: [...action.posts]
            };
        
        case actionTypes.DELETE:
            return {
                ...state,
                posts: [...action.posts]
            }

        case actionTypes.EDIT:
            return {
                ...state,
                posts: [...action.posts]
            }
        default:
            return state;
    }
};

export default reducer;