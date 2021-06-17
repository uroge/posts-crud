import * as actionTypes from './actions';

const initialState = {
    posts: [],
    pinnedPosts: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET:
            return {
                ...state,
                posts: [...action.posts]
            };
        
        case actionTypes.GET_PINNED:
            return {
                ...state,
                pinnedPosts: [...action.pinnedPosts]
            };
    
        case actionTypes.DELETE:
            return {
                ...state,
                posts: [...action.posts]
            }

        case actionTypes.DELETE_PINNED:
            return {
                ...state,
                pinnedPosts: [...action.pinnedPosts]
            }

        case actionTypes.EDIT:
            return {
                ...state,
                posts: [...action.posts]
            }
        
        case actionTypes.PIN:
            const pinned = action.post;
            const postsLeft = state.posts.filter(post => post.id !== pinned.id);

            return {
                ...state,
                posts: [...postsLeft],
                pinnedPosts: [...state.pinnedPosts, pinned]
            }

        case actionTypes.UNPIN:
            const postToUnpin = action.post;
            const unpinedPosts = state.pinnedPosts.filter(post => post.id !== postToUnpin.id);
        
            return {
                ...state,
                posts: [...state.posts, postToUnpin],
                pinnedPosts: [...unpinedPosts]
            }

        default:
            return state;
    }
};

export default reducer;