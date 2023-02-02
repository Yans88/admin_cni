import {
    ADD_DATA_LOADING,
    ADD_DATA_SUCCESS,
    CHG_PROPS,
    FETCH_DATA_ERROR,
    FETCH_DATA_LOADING,
    FETCH_DATA_SETTING
} from '../types';

const defaultState = {
    data: {},
    error: null,
    isLoading: false,
    isAddLoading: false,
    contentMsg: null,
    showFormSuccess: false,
    tipeSWAL: "success"
}

const settingReducer = (state = defaultState, action) => {
    switch (action.type) {
        case FETCH_DATA_SETTING:
            return {...state, data: action.payload.data}
        case CHG_PROPS:
            return {...state, data: {...state.data, [action.payload.key]: action.payload.value}}
        case FETCH_DATA_LOADING:
            return {...state, isLoading: action.payload}
        case ADD_DATA_LOADING:
            return {...state, isAddLoading: action.payload}
        case FETCH_DATA_ERROR:
            return {...state, error: action.payload}
        case ADD_DATA_SUCCESS:
            return {
                ...state,
                tipeSWAL: action.payload.tipeSWAL,
                showFormSuccess: action.payload.showFormSuccess,
                contentMsg: action.payload.contentMsg,
                isAddLoading: action.payload.isAddLoading
            }
        default:
            return state
    }
}

export default settingReducer;