import axios from 'axios';
import {
    FORM_DATA,
    FORM_DELETE,
    ADD_DATA_LOADING,
    ADD_DATA_SUCCESS,
    ADD_DATA_ERROR,
    CLEAR_ADD_DATA_ERROR,
    FETCH_DATA_LOADING,
    FETCH_DATA_VOUCHERS,
    FETCH_DATA_ERROR,
    CONFIRM_PUBLISH_VOUCHER
} from '../store/types';

const API_URL = process.env.REACT_APP_URL_API;

export const fetchDataSuccess = (data) => {
    return {
        type: FETCH_DATA_VOUCHERS,
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

export const addDataError = (data) => {
    return {
        type: ADD_DATA_ERROR,
        payload: data
    }
}

export const addDataSuccess = (data) => {
    return {
        type: ADD_DATA_SUCCESS,
        payload: data
    }
}

export const clearAddDataError = (data) => {
    return {
        type: CLEAR_ADD_DATA_ERROR,
        payload: data
    }
}

export const fetchData = (param) => {
    let isLoading = true;
    return async (dispatch) => {
        dispatch(fetchDataLoading(isLoading));
        return await axios.post(API_URL + "/voucher", param)
            .then(response => {
                const data = {};
                data['data'] = response.data.data
                data['total_data'] = response.data.total_data
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

export const addForm = (dt) => {
    const data = {};
    data['errorPriority'] = null;
    data['showFormAdd'] = dt;
    data['isAddLoading'] = false;
    return {
        type: FORM_DATA,
        payload: data
    }
}

export const showConfirmDel = (dt) => {
    const data = {};
    data['errorPriority'] = null;
    data['showFormDelete'] = dt;
    data['isAddLoading'] = false;
    return {
        type: FORM_DELETE,
        payload: data
    }
}

export const showConfirmPublish = (dt) => {
    const data = {};
    data['errorPriority'] = null;
    data['showFormPublish'] = dt;
    data['isAddLoading'] = false;
    return {
        type: CONFIRM_PUBLISH_VOUCHER,
        payload: data
    }
}

export const addData = (param) => {
    let isLoading = true;
    const form = Object.keys(param).reduce((f, k) => {
        f.append(k, param[k]);
        return f;
    }, new FormData());
    return async (dispatch) => {
        dispatch(fetchAddDataLoading(isLoading));
        await axios.post(API_URL + "/simpan_voucher", form)
            .then(response => {
                const err_code = response.data.err_code;

                if (err_code === '00') {
                    dispatch(addForm(false));
                    const _data = {};
                    _data['showFormSuccess'] = true;
                    _data['tipeSWAL'] = "success";
                    _data['contentMsg'] = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong>Success</strong>, Data berhasil disimpan</div>' }} />;
                    dispatch(addDataSuccess(_data));
                }

            }).catch(error => {

            })
    }

}

export const deleteData = (param) => {
    let isLoading = true;
    return async (dispatch) => {
        dispatch(fetchAddDataLoading(isLoading));
        const _data = {};
        await axios.post(API_URL + "/del_voucher", param)
            .then(response => {
                dispatch(showConfirmDel(false));
                const err_code = response.data.err_code;
                if (err_code === '00') {
                    _data['showFormSuccess'] = true;
                    _data['tipeSWAL'] = "success";
                    _data['contentMsg'] = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong>Success</strong>, Data berhasil dihapus</div>' }} />;
                    dispatch(addDataSuccess(_data));
                } else {
                    let isLoading = false;
                    _data['showFormSuccess'] = true;
                    _data['tipeSWAL'] = "error";
                    _data['contentMsg'] = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong>Failed</strong>, Something wrong</div>' }} />;
                    dispatch(addDataSuccess(_data));
                    dispatch(fetchAddDataLoading(isLoading));
                }

            }).catch(error => {
                console.log(error);
                let isLoading = false;
                dispatch(showConfirmDel(false));
                _data['showFormSuccess'] = true;
                _data['tipeSWAL'] = "error";
                _data['contentMsg'] = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong>Failed</strong>, Something wrong</div>' }} />;
                dispatch(addDataSuccess(_data));
                dispatch(fetchAddDataLoading(isLoading));
            })
    }
}

export const publishData = (param) => {
    let isLoading = true;
    return async (dispatch) => {
        dispatch(fetchAddDataLoading(isLoading));
        const _data = {};
        await axios.post(API_URL + "/publish_voucher", param)
            .then(response => {
                dispatch(showConfirmPublish(false));
                const err_code = response.data.err_code;
                if (err_code === '00') {
                    _data['showFormSuccess'] = true;
                    _data['tipeSWAL'] = "success";
                    _data['contentMsg'] = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong>Success</strong>, Voucher berhasil dipublish</div>' }} />;
                    dispatch(addDataSuccess(_data));
                } else {
                    let isLoading = false;
                    _data['showFormSuccess'] = true;
                    _data['tipeSWAL'] = "error";
                    _data['contentMsg'] = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong>Failed</strong>, Something wrong</div>' }} />;
                    dispatch(addDataSuccess(_data));
                    dispatch(fetchAddDataLoading(isLoading));
                }

            }).catch(error => {
                console.log(error);
                let isLoading = false;
                dispatch(showConfirmPublish(false));
                _data['showFormSuccess'] = true;
                _data['tipeSWAL'] = "error";
                _data['contentMsg'] = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong>Failed</strong>, Something wrong</div>' }} />;
                dispatch(addDataSuccess(_data));
                dispatch(fetchAddDataLoading(isLoading));
            })
    }
}

export const postData = (param, action) => {
    switch (action) {
        case "VIEW_DETAIL":
            return axios.post(API_URL + "/voucher_detail", param)
        case "GET_LIST_PRODUK":
            return axios.post(API_URL + "/list_produk", param)
        case "SAVE_PRODUK":
            return axios.post(API_URL + "/assign_produk", param)
        case "REMOVE_PRODUK":
            return axios.post(API_URL + "/remove_produk", param)
        case "GET_LIST_MEMBER":
            return axios.post(API_URL + "/list_member", param)
        case "SAVE_MEMBER":
            return axios.post(API_URL + "/assign_member", param)
        case "REMOVE_MEMBER":
            return axios.post(API_URL + "/remove_member", param)
        default:
            return axios.post(API_URL + "/voucher", param)
    }
}