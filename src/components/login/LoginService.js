import axios from "axios";

const API_URL = process.env.REACT_APP_URL_API;
const CryptoJS = require("crypto-js");
const secretKey = process.env.REACT_APP_SECRET_KEY;;

export const loginAdmin = async (username, pass) => {
    const param = {
        username: username,
        pass: pass
    };
    let token = '';
    await axios.post(API_URL + '/login_admin', param).then(res => {
        const response = res.data;
        if (response.err_code === '00') {
            let data = response.data;
            let id_admin = data.id_admin;
            let name = data.name;
            let tgl = new Date();
            const _token = id_admin + 'Þ' + name + 'Þ' + tgl;
            token = CryptoJS.AES.encrypt(_token, secretKey).toString();
        } else {
            token = '';
        }
    });
    return token;
}

export const getProfileAdmin = async () => {
    const token = localStorage.getItem('tokenCNI');
    const dt = CryptoJS.AES.decrypt(token, secretKey);
    const dt_res = dt.toString(CryptoJS.enc.Utf8);
    const _dt = dt_res.split('Þ');
    let dt_user = {
        id_operator: null,
        name: '',
        password: null
    };
    const param = {
        id_admin: _dt[0],
        cms: 1
    };
    await axios.post(API_URL + '/admin_detail', param).then(res => {
        const response = res.data;
        if (response.err_code === '00') {
            let data = response.data;
            dt_user = data
            dt_user = {
                ...dt_user,
                id_operator: data.id_admin,
                
            };
        }
    });
    return dt_user;
}