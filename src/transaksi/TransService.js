import axios from "axios";

let API_URL = process.env.REACT_APP_URL_API;

class TransService {
    postData(param, action) {

        switch (action) {
            case "GET_DATA":
                return axios.post(API_URL + "/list_transaksi", param)
            case "VIEW_DETAIL":
                return axios.post(API_URL + "/transaksi_detail", param)
            case "UPD_STATUS":
                return axios.post(API_URL + "/set_onprocess", param)
            case "KIRIM_PAKET":
                return axios.post(API_URL + "/generate_resi", param)
			case "KIRIM_PAKET_LP":
                return axios.post(API_URL + "/generate_resi_lp", param)
            case "SET_HOLD":
                return axios.post(API_URL + "/set_hold", param)
            default:
                return axios.post(API_URL + "/simpan_admin", param)
        }
    }
}
export default new TransService()