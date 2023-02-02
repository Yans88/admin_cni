import axios from "axios";

let API_URL = process.env.REACT_APP_URL_API;

class TransService {
    postData(param, action) {

        switch (action) {
            case "GET_DATA":
                return axios.post(API_URL + "/list_ulasan", param)
            case "VIEW_DETAIL":
                return axios.post(API_URL + "/transaksi_detail", param)
            case "UPD_STATUS":
                return axios.post(API_URL + "/set_onprocess", param)
            case "UPD_STATUS_ULASAN":
                return axios.post(API_URL + "/appr_rej_ulasan", param)
            default:
                return axios.post(API_URL + "/simpan_admin", param)
        }
    }
}

export default new TransService()