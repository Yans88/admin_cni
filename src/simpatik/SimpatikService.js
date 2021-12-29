import axios from "axios";

let API_URL = process.env.REACT_APP_URL_API;

class SimpatikService {
    postData(param, action) {

        switch (action) {
            case "GET_DATA":
                return axios.post(API_URL + "/list_simpatik", param)
            case "VIEW_DETAIL":
                return axios.post(API_URL + "/detail_simpatik", param)
            case "UPD_STATUS":
                return axios.post(API_URL + "/upd_status", param)
            case "UPL_BUKTI_TRANSFER":
                return axios.post(API_URL + "/upl_bukti_transfer", param)
            default:
                return axios.post(API_URL + "/list_simpatik", param)
        }
    }
}
export default new SimpatikService()