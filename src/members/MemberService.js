import axios from "axios";

let API_URL = process.env.REACT_APP_URL_API;

class MemberService {
    postData(param, action) {  
        switch (action) {
            case "GET_DATA":
                return axios.post(API_URL + "/members", param)
            case "VIEW_DETAIL":
                return axios.post(API_URL + "/profile_member", param)
            default:
                return axios.post(API_URL + "/members", param)
        }
    }
}
export default new MemberService()