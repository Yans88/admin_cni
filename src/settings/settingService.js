import axios from 'axios';
import {
    ADD_DATA_LOADING,
    ADD_DATA_SUCCESS,
    FETCH_DATA_LOADING,
    FETCH_DATA_SETTING,
    CHG_PROPS,
    FETCH_DATA_ERROR
} from '../store/types';

const API_URL = process.env.REACT_APP_URL_API;

export const fetchDataSuccess = (data) => {
    return {
        type: FETCH_DATA_SETTING,
        payload: data
    }
}

export const fetchDataLoading = (data) => {
    return {
        type: FETCH_DATA_LOADING,
        payload: data
    }
}

export const fetchAddDataLoading = (data) => {
    return {
        type: ADD_DATA_LOADING,
        payload: data
    }
}

export const fetchDataError = (data) => {
    return {
        type: FETCH_DATA_ERROR,
        payload: data
    }
}

export const addDataSuccess = (data) => {
    return {
        type: ADD_DATA_SUCCESS,
        payload: data
    }
}

export const chgProps = (data) => {
    return {
        type: CHG_PROPS,
        payload: data
    }
}

export const fetchData = () => {
    let isLoading = true;
    const param = { cms: 1 }
    return async (dispatch) => {
        dispatch(fetchDataLoading(isLoading));
        return await axios.post(API_URL + "/master_data", param)
            .then(response => {
                const data = {};
                data['data'] = response.data.data
                dispatch(fetchDataSuccess(data));
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

export const addData = (param) => {
    let isLoading = true;
    return async (dispatch) => {
        dispatch(fetchAddDataLoading(isLoading));
        const _data = {};
        await axios.post(API_URL + "/upd_setting", param)
            .then(response => {
                const err_code = response.data.err_code;
                if (err_code === '00') {
                    _data['showFormSuccess'] = true;
                    _data['tipeSWAL'] = "success";
                    _data['contentMsg'] = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong>Success</strong>, Data berhasil disimpan</div>' }} />;
                    dispatch(addDataSuccess(_data));
                }
            }).catch(error => {
                console.log(error);
                isLoading = false;
                _data['showFormSuccess'] = true;
                _data['tipeSWAL'] = "error";
                _data['contentMsg'] = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong>Failed</strong>, Something wrong</div>' }} />;
                dispatch(addDataSuccess(_data));
                dispatch(fetchAddDataLoading(isLoading));
            })
    }

}