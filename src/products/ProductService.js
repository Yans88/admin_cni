import axios from "axios";

let API_URL = process.env.REACT_APP_URL_API;

class ProductService {
    postData(param, action) {
        switch (action) {
            case "GET_DATA":
                return axios.post(API_URL + "/product", param)
            case "ADD_DATA":
                return axios.post(API_URL + "/simpan_product", param)
            case "VIEW_DETAIL":
                return axios.post(API_URL + "/product_detail", param)
            case "GET_IMAGE":
                return axios.post(API_URL + "/product_img", param)
            case "UPLOAD_IMAGE":
                return axios.post(API_URL + "/upl_img_prod", param)
            case "DEL_IMAGE":
                return axios.post(API_URL + "/del_img_prod", param)
            case "DELETE_DATA":
                return axios.post(API_URL + "/del_product", param)
            case "GET_PRODUCT":
                API_URL += "/product/?per_page=" + param.per_page + "&page_number=" + param.page_number + "&keyword=" + param.keyword;
                return axios.get(API_URL + param)
            default:
                return axios.post(API_URL + "/product", param)
        }
    }
}
export default new ProductService()