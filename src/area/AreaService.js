import axios from "axios";

let API_URL = process.env.REACT_APP_URL_API;

class AreaService {
    postData(param, action) {
       
        switch (action) {
            case "GET_PROV":
                return axios.post(API_URL + "/provinsi", param)
            case "GET_CITY":
                return axios.post(API_URL + "/city", param)
            case "GET_KEC":
                return axios.post(API_URL + "/kecamatan", param)
            case "ADD_PROV":
                return axios.post(API_URL + "/simpan_provinsi", param)
            case "DEL_PROV":
                return axios.post(API_URL + "/del_provinsi", param)
            case "ADD_CITY":
                return axios.post(API_URL + "/simpan_city", param)
            case "DEL_CITY":
                return axios.post(API_URL + "/del_city", param)
            case "ADD_KEC":
                return axios.post(API_URL + "/simpan_kec", param)
            case "DEL_KEC":
                return axios.post(API_URL + "/del_kec", param)
            case "GET_WH":
                return axios.post(API_URL + "/get_warehouse", param)
            case "ADD_WH":
                return axios.post(API_URL + "/add_warehouse", param)
            case "DEL_WH":
                return axios.post(API_URL + "/del_warehouse", param)
            case "GET_AREA":
                return axios.post(API_URL + "/get_area", param)
            case "ADD_AREA":
                console.log(param);
                console.log(action);
                return axios.post(API_URL + "/assign_area", param)
            case "REMOVE_AREA":
                
                return axios.post(API_URL + "/remove_area", param)
            default:
                return axios.post(API_URL + "/provinsi", param)
        }
    }
}
export default new AreaService()