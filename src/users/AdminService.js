import axios from "axios";

let API_URL = process.env.REACT_APP_URL_API;

class AdminService {
    postDataUsers(param, action) {         
        switch (action) {
            case "GET_DATA":
                return axios.post(API_URL + "/admin", param)
            case "ADD_DATA":
                return axios.post(API_URL + "/simpan_admin", param)
            case "EDIT_DATA":                
                return axios.post(API_URL + "/edit_admin", param)
            case "DELETE_DATA":
                return axios.post(API_URL + "/del_admin", param)
            default:
                return axios.post(API_URL + "/simpan_admin", param)
        }
    }
}
export default new AdminService()