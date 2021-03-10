const CryptoJS = require("crypto-js");
const secretKey = 'CNI';
const Helpers = {
    setToken: function (id_admin) {
        let tgl = new Date();
        tgl.setHours(tgl.getHours() + 2);
        let jam_exp = tgl.getHours();
        if (jam_exp >= 24) {
            jam_exp -= 24;
            tgl = tgl.setDate(tgl.getDate() + 1);
            tgl = tgl.setHours(tgl.getHours() + jam_exp);
        }
        let tgl_expired = tgl.toLocaleString("ID", { hour12: false });        
        let token = id_admin + 'Þ' + tgl_expired;
        if (token) {
            const encrypted = CryptoJS.AES.encrypt(token, secretKey).toString();
            localStorage.setItem("tokenCNI", encrypted);
        }
    },

    cekToken: function () {
        let token = localStorage.getItem("tokenCNI");
        if (token) {
            const dt = CryptoJS.AES.decrypt(token, secretKey);
            const dt_res = dt.toString(CryptoJS.enc.Utf8);
            let _dt = dt_res.split('Þ');
            let tgl_now = new Date().toLocaleString("ID", { timeZone: "Asia/Jakarta", hour12: false });
            let tgl_expired = _dt[1];
            localStorage.setItem("idCNI", CryptoJS.AES.encrypt(_dt[0], secretKey).toString());
            sessionStorage.setItem("nama", 'ert');
            if (tgl_expired < tgl_now) {
                localStorage.removeItem("tokenCNI");
                sessionStorage.removeItem('nama');
            }

        } else {
            localStorage.removeItem("tokenCNI");
            sessionStorage.removeItem('nama');
        }
        return localStorage.getItem("tokenCNI");
    },
    myDecrypt: function (token) {
        return CryptoJS.AES.decrypt(token, secretKey).toString(CryptoJS.enc.Utf8)
    }
}
export default Helpers;