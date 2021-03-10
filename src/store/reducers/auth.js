import * as ActionTypes from '../actions';

const CryptoJS = require("crypto-js");
const secretKey = process.env.REACT_APP_SECRET_KEY;

let dt = '';
let dt_res = '';
let _dt = '';

const initialState = {
    isLoggedIn: !!localStorage.getItem('tokenCNI'),
    token: localStorage.getItem('tokenCNI'),
    currentUser: {
        id_operator: null,
        name: '',
        password: null
    }
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.LOGIN_USER:
            dt = CryptoJS.AES.decrypt(action.token, secretKey);
            dt_res = dt.toString(CryptoJS.enc.Utf8);
            _dt = dt_res.split('Þ');
            localStorage.setItem("tokenCNI", action.token);
            return {
                ...state,
                isLoggedIn: true,
                token: action.token,
                currentUser: {
                    id_operator: _dt[0],
                    name: _dt[1],
                    password: null
                }
            };
        case ActionTypes.LOGOUT_USER:
            localStorage.removeItem('tokenCNI');
            return {
                ...state,
                isLoggedIn: false,
                token: null,
                currentUser: {
                    id_operator: null,
                    name: '',
                    password: null
                }
            };
        case ActionTypes.LOAD_USER:
            return {
                ...state,
                currentUser: action.currentUser
            };
        default:
            return { ...state };
    }
};

export default reducer;
