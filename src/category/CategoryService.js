import axios from "axios";

let API_URL = process.env.REACT_APP_URL_API;

class CategoryService {
    postData(param, action) {       
        console.log(param);
        
        switch (action) {
            case "GET_DATA":
                return axios.post(API_URL + "/category", param)
            case "ADD_DATA":
                return axios.post(API_URL + "/simpan_category", param)
            case "EDIT_DATA":                
                return axios.post(API_URL + "/simpan_category", param)
            case "DELETE_DATA":
                return axios.post(API_URL + "/del_category", param)
            default:
                return axios.post(API_URL + "/category", param)
        }
    }
}
export default new CategoryService()