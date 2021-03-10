import MemberService from "../members/MemberService";

export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const LOAD_USER = 'LOAD_USER';
export const GET_DATA = 'GET_DATA';
export const VIEW_DETAIL = 'VIEW_DETAIL';

export function getMembers(param) {
    return (dispatch)=>{
        MemberService.postData(param, GET_DATA).then(function (response) {
            console.log(response);
            dispatch({
                type: GET_DATA, 
                payload: {
                    data: response.data,
                    errorMessage: false
                }
            })
        }).catch(function (error) {
            dispatch({
                type: VIEW_DETAIL, 
                payload: {
                    data: null,
                    errorMessage: error
                }
            })
        });
    }
}

