import {
    FETCH_DATA_SUCCESS_EXPORT_DETAIL,
    FETCH_DATA_LOADING,
    FETCH_DATA_SUCCESS_HEADER,
    FETCH_DATA_ERROR,
    FETCH_DATA_SUCCESS_DETAIL,
    FETCH_DATA_SUCCESS_EXPORT_HEADER
} from '../types';

const defaultState = {
    data: [],
    data_report: [],
    data_detail: [],
    data_report_detail:[],
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

const reportReducer = (state = defaultState, action) => {
    switch (action.type) {
        case FETCH_DATA_SUCCESS_HEADER:
            return { ...state, data: action.payload.data, totalData: action.payload.total_data }
        case FETCH_DATA_SUCCESS_EXPORT_HEADER:
            return { ...state, data_report: action.payload.data_report }
        case FETCH_DATA_SUCCESS_EXPORT_DETAIL:
            return { ...state, data_report_detail: action.payload.data_report }
        case FETCH_DATA_SUCCESS_DETAIL:
            return { ...state, data_detail: action.payload.data, totalData: action.payload.total_data }
        case FETCH_DATA_LOADING:
            return { ...state, isLoading: action.payload }
        case FETCH_DATA_ERROR:
            return { ...state, error: action.payload }
        default:
            return state
    }
}

export default reportReducer;