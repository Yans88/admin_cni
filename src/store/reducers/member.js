import * as ActionTypes from '../actions';
const initialState = {
    getMemberList: null,
    errorMessage: false
};

const members = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.GET_DATA:
            return {
                ...state,
                getMemberList: action.payload.data,
                errorMessage: action.payload.errorMessage
            };

        case ActionTypes.VIEW_DETAIL:
            return {
                ...state,
                currentUser: action.currentUser
            };
        default:
            return { ...state };
    }
};

export default members;
