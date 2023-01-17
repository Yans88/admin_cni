import React, { Component } from 'react'
import NumberFormat from 'react-number-format';
import LogoJNE from '../assets/jnelogo.jpg'
import LogoLP from '../assets/logoLionParcel.png'
import Moment from 'react-moment';
var Barcode = require('react-barcode');

export default class CetakResi extends Component {
    render() {
        const {
            id_transaksi,
            cnote_no,
            type_logistic,
            ttl_weight,
            ongkir,
            nama_penerima,
            kode_origin,
            kode_jne_prov,
            kode_lp_prov,
            phone_penerima,
            alamat,
            kec_name,
            city_name,
            provinsi_name,
            kode_pos,
            wh_name,
            alamat_wh,
            phone_wh,
            service_code, list_item
        } = this.props.dataFromParent;
        var weight = ttl_weight > 1000 ? ttl_weight / 1000 : 1;
		//const type_logistic = 2;
        const config = {
            displayValue: false,
            width: 3,
            height: 50
        };
        const config2 = {
            displayValue: false,
            width: 5,
            height: 80
        };
        return (
            <div className='print-source'>

                <table className="tbl_cetak_resi">
                    <tbody><tr>
                        <td colSpan={3} align="center" style={{ width: "50%" }}>
                            {type_logistic === 1 && (<img width={130} height={100} src={LogoJNE} alt="JNE" />)}
                            {type_logistic === 2 && (<img width={140} height={95} src={LogoLP} alt="Lion Parcels" />)}
                        </td>
                        <td colSpan={4} align="center" style={{ width: "50%", fontSize: 24, paddingTop: 20 }}>No Order: <b>MCNI/{id_transaksi}</b><br />
                            {type_logistic === 1 && <Barcode value={"MCNI/" + id_transaksi} {...config} />}
                        </td>
                    </tr>
                        <tr>
                            <td colSpan={3}>Dari :</td>
                            <td colSpan={4}>Kepada :</td>
                        </tr>
                        <tr>
                            <td colSpan={3}><b>PT.CITRA NUSA INSAN CEMERLANG</b></td>
                            <td colSpan={4}><b>{nama_penerima}</b></td>
                        </tr>
                        <tr>
                            <td colSpan={3} valign="top">({wh_name}) {alamat_wh} {phone_wh}</td>
                            <td colSpan={4} valign="top">{alamat} ({kode_pos}), Kec.{kec_name} {city_name} - {provinsi_name} No. Telp : {phone_penerima}</td>
                        </tr>
                        <tr>
                            <td style={{ paddingTop: 30, paddingBottom: 10 }}>Layanan :</td>
                            <td style={{ paddingTop: 30, paddingBottom: 10 }}>Berat :</td>
                            <td style={{ paddingTop: 30, paddingBottom: 10 }}>Estimasi Ongkir :</td>
                            <td style={{ paddingTop: 30, paddingBottom: 10 }}>Packing Kayu :</td>
                            <td style={{ paddingTop: 30, paddingBottom: 10 }}>Qty :</td>
                            <td style={{ paddingTop: 30, paddingBottom: 10 }}>Asal :</td>
                            <td style={{ paddingTop: 30, paddingBottom: 10 }}>Tujuan :</td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: "bold", paddingBottom: 20 }}>{service_code}</td>
                            <td style={{ fontWeight: "bold", paddingBottom: 20 }}>
                                <NumberFormat
                                    value={weight}
                                    thousandSeparator={true}
                                    decimalScale={2}
                                    displayType={'text'}
                                /> Kg
                            </td>
                            <td style={{ fontWeight: "bold", paddingBottom: 20 }}>
                                <NumberFormat
                                    value={ongkir}
                                    thousandSeparator={true}
                                    decimalScale={2}
                                    displayType={'text'}
                                />
                            </td>
                            <td style={{ fontWeight: "bold", paddingBottom: 20 }}>NO</td>
                            <td style={{ fontWeight: "bold", paddingBottom: 20 }}>{list_item.length}</td>
                            <td style={{ fontWeight: "bold", paddingBottom: 20 }}>{kode_origin.substring(0, 3)}</td>
                            <td style={{ fontWeight: "bold", paddingBottom: 20 }}>{type_logistic === 1 ? kode_jne_prov.substring(0, 3) : kode_lp_prov.substring(0, 3)}</td>

                        </tr>
                        {type_logistic === 2 && (
                            <tr>
                                <td colSpan="7" style={{ fontSize: 15 }}>Asuransi : ...................................... </td>
                            </tr>
                        )}
                        <tr className="data_resi">
                            <td colSpan={7} align="center" >
                                -------------------------------------------------------------------------------------------------------------------<br />
                                {type_logistic === 1 ? "No.Resi" : "STT No."} <br />
                                <Barcode value={cnote_no} {...config2} /><br />
                                {cnote_no}<br />
                                -------------------------------------------------------------------------------------------------------------------
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={3} style={{ fontSize: 12 }}>Deskripsi :</td>
                            <td colSpan={4} style={{ fontSize: 12 }}>Instruksi Khusus :</td>
                        </tr>
                        <tr>
                            <td colSpan={7} align="right" className="tgl_terbit">Tanggal Terbit :
                                <Moment format="YYYY-MM-DD HH:mm:ss" >{new Date()}</Moment>
                            </td>
                        </tr>
                    </tbody></table>
                <br />
                <table className="tbl_cetak_resi_produk">
                    <thead>
                        <tr>
                            <td style={{ width: "15%" }}>No.</td>
                            <td>Nama Produk</td>
                            <td align="right" style={{ width: "10%" }}>Jumlah</td>
                        </tr>
                    </thead>
                    <tbody>
                        {list_item.map((dt, i) => (
                            <tr key={i}>
                                <td>{i + 1}.</td>
                                <td>{dt.kode_produk+' - '+dt.product_name}</td>
                                <td align="right">{dt.jml}</td>
                            </tr>
                        ))}
                        <tr style={{ backgroundColor: "white" }}>
                            <td colSpan={3} style={{ paddingTop: 10 }}>Catatan :</td>
                        </tr>
                        <tr style={{ backgroundColor: "white" }}>
                            <td align="center" colSpan={3} style={{ paddingTop: 10, fontSize: 12, marginRight: -30 }}>==================================================================== Gunting disini ====================================================================</td>
                        </tr>
                    </tbody>
                </table>



            </div>
        )
    }
}