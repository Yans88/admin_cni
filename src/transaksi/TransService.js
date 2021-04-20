import axios from "axios";

let API_URL = process.env.REACT_APP_URL_API;

class TransService {
    postData(param, action) {
        console.log(param);
        switch (action) {
            case "GET_DATA":
                return axios.post(API_URL + "/list_transaksi", param)
            case "VIEW_DETAIL":
                return axios.post(API_URL + "/transaksi_detail", param)
            case "UPD_STATUS":
                return axios.post(API_URL + "/set_onprocess", param)
            default:
                return axios.post(API_URL + "/simpan_admin", param)
        }
    }
}
export default new TransService()