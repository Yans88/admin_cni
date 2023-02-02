import axios from "axios";

let API_URL = process.env.REACT_APP_URL_API;

class CategoryService {
    postData(param, action) {
        switch (action) {
            case "GET_DATA":
                return axios.post(API_URL + "/banner", param)
            case "ADD_DATA":
                return axios.post(API_URL + "/simpan_banner", param)
            case "EDIT_DATA":
                return axios.post(API_URL + "/simpan_banner", param)
            case "DELETE_DATA":
                return axios.post(API_URL + "/del_banner", param)
            default:
                return axios.post(API_URL + "/banner", param)
        }
    }
}

export default new CategoryService()