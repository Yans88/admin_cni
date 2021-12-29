import axios from 'axios';
import {
    FETCH_DATA_LOADING,
    FETCH_DATA_SUCCESS_HEADER,
    FETCH_DATA_ERROR,
    FETCH_DATA_SUCCESS_DETAIL,
    FETCH_DATA_SUCCESS_EXPORT_HEADER,
    FETCH_DATA_SUCCESS_EXPORT_DETAIL
} from '../store/types';

const API_URL = process.env.REACT_APP_URL_API;

export const fetchDataSuccessHeader = (data) => {
    return {
        type: FETCH_DATA_SUCCESS_HEADER,
        payload: data
    }
}

export const fetchDataSuccessDetail = (data) => {
    return {
        type: FETCH_DATA_SUCCESS_DETAIL,
        payload: data
    }
}

export const fetchDataSuccessExportHeader = (data) => {
    return {
        type: FETCH_DATA_SUCCESS_EXPORT_HEADER,
        payload: data
    }
}

export const fetchDataLoading = (data) => {
    return {
        type: FETCH_DATA_LOADING,
        payload: data
    }
}

export const fetchDataSuccessExportDetail = (data) => {
    return {
        type: FETCH_DATA_SUCCESS_EXPORT_DETAIL,
        payload: data
    }
}

export const fetchDataError = (data) => {
    return {
        type: FETCH_DATA_ERROR,
        payload: data
    }
}



export const fetchDataHeader = (param) => {
    let isLoading = true;
    return async (dispatch) => {
        dispatch(fetchDataLoading(isLoading));
        return await axios.post(API_URL + "/report", param)
            .then(response => {
                const data = {};
                data['data'] = response.data.data
                data['total_data'] = response.data.total_data
                dispatch(fetchDataSuccessHeader(data));
                isLoading = false;
                dispatch(fetchDataLoading(isLoading));
            }).catch(error => {
                const errorpayload = {};
                errorpayload['message'] = 'Something wrong';
                errorpayload['status'] = error.response ? error.response.status : 404;
                dispatch(fetchDataError(errorpayload));
                isLoading = false;
                dispatch(fetchDataLoading(isLoading));
            })
    }
}

export const fetchExportHeader = (param) => {
    let isLoading = true;
    return async (dispatch) => {
        dispatch(fetchDataLoading(isLoading));
        return await axios.post(API_URL + "/export_header", param)
            .then(response => {
                const data = {};
                data['data_report'] = response.data.data;
                       
                dispatch(fetchDataSuccessExportHeader(data));
                isLoading = false;
                
            }).catch(error => {
                const errorpayload = {};
                errorpayload['message'] = 'Something wrong';
                errorpayload['status'] = error.response ? error.response.status : 404;
                dispatch(fetchDataError(errorpayload));
                isLoading = false;
                dispatch(fetchDataLoading(isLoading));
            })
    }
}

export const fetchDataDetail = (param) => {
    let isLoading = true;
    return async (dispatch) => {
        dispatch(fetchDataLoading(isLoading));
        return await axios.post(API_URL + "/report_detail", param)
            .then(response => {
                const data = {};
                data['data'] = response.data.data
                data['total_data'] = response.data.total_data
                dispatch(fetchDataSuccessDetail(data));
                isLoading = false;
                dispatch(fetchDataLoading(isLoading));
            }).catch(error => {
                const errorpayload = {};
                errorpayload['message'] = 'Something wrong';
                errorpayload['status'] = error.response ? error.response.status : 404;
                dispatch(fetchDataError(errorpayload));
                isLoading = false;
                dispatch(fetchDataLoading(isLoading));
            })
    }
}

export const fetchExportDetail = (param) => {
    let isLoading = true;
    return async (dispatch) => {
        dispatch(fetchDataLoading(isLoading));
        return await axios.post(API_URL + "/export_detail", param)
            .then(response => {
                const data = {};
                data['data_report'] = response.data.data;
                       
                dispatch(fetchDataSuccessExportDetail(data));
                isLoading = false;
                
            }).catch(error => {
                const errorpayload = {};
                errorpayload['message'] = 'Something wrong';
                errorpayload['status'] = error.response ? error.response.status : 404;
                dispatch(fetchDataError(errorpayload));
                isLoading = false;
                dispatch(fetchDataLoading(isLoading));
            })
    }
}