import {
    FORM_DATA,
    FORM_DELETE,
    ADD_DATA_LOADING,
    ADD_DATA_SUCCESS,
    ADD_DATA_ERROR,
    CLEAR_ADD_DATA_ERROR,
    FETCH_DATA_LOADING,
    FETCH_DATA_SUCCESS_NEWS,
    FETCH_DATA_ERROR
} from '../types';

const defaultState = {
    data: [],
    totalData: 0,
    error: null,
    isLoading: false,
    isAddLoading: false,
    errorPriority: null,
    contentMsg: null,
    showFormAdd: false,
    showFormSuccess: false,
    showFormDelete: false,
    tipeSWAL: "success"
}

const newsReducer = (state = defaultState, action) => {
    switch (action.type) {
        case FETCH_DATA_SUCCESS_NEWS:
            return { ...state, data: action.payload.data, totalData: action.payload.total_data }
        case FETCH_DATA_LOADING:
            return { ...state, isLoading: action.payload }
        case FORM_DATA:
            return {
                ...state,
                isAddLoading: action.payload.isAddLoading,
                showFormAdd: action.payload.showFormAdd,
                errorPriority: action.payload.errorPriority
            }
        case FORM_DELETE:
            return {
                ...state,
                isAddLoading: action.payload.isAddLoading,
                showFormDelete: action.payload.showFormDelete,
                errorPriority: action.payload.errorPriority
            }
        case ADD_DATA_LOADING:
            return { ...state, isAddLoading: action.payload }
        case FETCH_DATA_ERROR:
            return { ...state, error: action.payload }
        case ADD_DATA_ERROR:
            return { ...state, errorPriority: action.payload }
        case CLEAR_ADD_DATA_ERROR:
            return { ...state, errorPriority: null, isAddLoading: false }
        case ADD_DATA_SUCCESS:
            return {
                ...state,                
                tipeSWAL: action.payload.tipeSWAL,
                showFormSuccess: action.payload.showFormSuccess,
                contentMsg: action.payload.contentMsg
            }
        default:
            return state
    }
}

export default newsReducer;