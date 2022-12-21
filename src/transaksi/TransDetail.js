import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux';
import TransService from './TransService';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import "moment/locale/id";
import MyLoading from '../components/loading/MyLoading';
import AppModal from '../components/modal/MyModal';
import {AppSwalSuccess} from '../components/modal/SwalSuccess';
import ReactToPrint from "react-to-print";
import CetakResi from './CetakResi';
import {Form} from 'react-bootstrap';

class TransDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appsLoading: true,
            showConfirm: false,
            showConfirmKirim: false,
            showConfirmHold: false,
            isLoading: false,
            showSwalSuccess: false,
            remark_hold: '',
            dtRes: {},
            errMsg: null,
            id_transaksi: sessionStorage.getItem('idTransCNI'),
        }
    }

    componentDidMount() {
        this.getData();
    }

    handleClose = () => {
        this.setState({
            ...this.state,
            showConfirm: false,
            errMsg: null,
            showConfirmKirim: false,
            showConfirmHold: false,
            remark_hold: ''
        });
    };

    closeSwal = () => {
        this.setState({
            ...this.state,
            errMsg: null,
            showSwalSuccess: false
        });
        this.getData();
    }

    handleSave = (action) => {
        this.setState({
            ...this.state,
            isLoading: true
        })
        const queryString = {
            id_transaksi: this.state.id_transaksi,
            id_operator: this.props.user.id_operator,
            remark: this.state.remark_hold
        }

        TransService.postData(queryString, action).then((res) => {
            const err_code = res.data.err_code;
            if (err_code === '00') {
                this.setState({
                    ...this.state,
                    isLoading: false,
                    showConfirm: false,
                    showConfirmKirim: false,
                    showConfirmHold: false,
                    errMsg: <div
                        dangerouslySetInnerHTML={{__html: '<div style="font-size:20px; text-align:center;"><strong>Success</strong>, Data berhasil diupdate</div>'}}/>,
                    showSwalSuccess: true,
                    dtRes: {...this.state.dtRes, status: 3}
                });
            }
        }).catch((error) => {
            console.log(error);
            this.setState({
                ...this.state,
                isLoading: false,
                showConfirm: false,
                showConfirmKirim: false,
                showConfirmHold: false,
            });
        });

    }

    confirmProcess = () => {
        this.setState({...this.state, showConfirm: true, errMsg: null});
    }

    confirmKirim = () => {
        this.setState({...this.state, showConfirmKirim: true, errMsg: null});
    }

    confirmHold = () => {
        this.setState({...this.state, showConfirmHold: true, errMsg: null, remark_hold: ''});
    }

    getData = () => {
        this.setState({appsLoading: true});
        const selectedIdCNI = sessionStorage.getItem('idTransCNI');
        const queryString = {id_transaksi: selectedIdCNI}
        TransService.postData(queryString, "VIEW_DETAIL")
            .then(response => {
                setTimeout(() => {
                    if (response.data.err_code === "00") {
                        this.setState({
                            ...this.state,
                            dtRes: response.data.data
                        });
                    }
                    if (response.data.err_code === "04") {
                        this.setState({
                            ...this.state,
                            dtRes: {},
                        });
                    }
                    this.setState({appsLoading: false});
                }, 400);
            })
            .catch(e => {
                console.log(e);
                this.setState({appsLoading: false});
            });
    };

    handleChange(evt) {
        const name = evt.target.name;
        var value = evt.target.value;
        this.setState({
            [name]: value
        })
    }


    render() {
        let action_kirim = this.state.dtRes.logistic_name === "JNE" ? "KIRIM_PAKET" : '';
        action_kirim = this.state.dtRes.logistic_name === "Lion Parcel" ? "KIRIM_PAKET_LP" : action_kirim;

        const contentConfirm = <div
            dangerouslySetInnerHTML={{__html: '<div id="caption" style=padding-bottom:20px;">Apakah anda yakin<br/><b>memproses</b> transaksi ini ?</div>'}}/>;
        const contentConfirmKirim = <div
            dangerouslySetInnerHTML={{__html: '<div id="caption" style=padding-bottom:20px;">Apakah anda yakin<br/><b>mengirimkan</b> paket ini ?</div>'}}/>;

        const frmUser = <Form id="myForm">
            <div id="caption">
                Transaksi ini akan di <b>hold</b>, <br/>Apakah anda yakin ?
            </div>
            <Form.Group controlId="remark_hold">
                <Form.Label>Remark</Form.Label>
                <Form.Control size="sm" name="remark_hold" as="textarea" rows={5} value={this.state.remark_hold}
                              onChange={this.handleChange.bind(this)} placeholder="Remark . . ."/>
            </Form.Group>
        </Form>;

        const frmUser2 = <Form id="myForm">
            <div id="caption">
                Apakah anda yakin<br/><b>memproses</b> transaksi ini ?
            </div>
            <Form.Group controlId="remark_hold">
                <Form.Label>Remark</Form.Label>
                <Form.Control size="sm" name="remark_hold" as="textarea" rows={5} value={this.state.remark_hold}
                              onChange={this.handleChange.bind(this)} placeholder="Remark . . ."/>
            </Form.Group>
        </Form>;

        return (
            <div>

                <div>
                    <div className="content-wrapper">
                        {/* Content Header (Page header) */}
                        <div className="content-header">
                            <div className="container-fluid">
                                <div className="row mb-2">
                                    <div className="col-sm-6">
                                        <h1 className="m-0">Transaksi Detail</h1>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <section className="content">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-12">
                                        {this.state.appsLoading ? (
                                            <MyLoading/>
                                        ) : (
                                            <div className="card shadow-lg">
                                                <div className="card-body">
                                                    <table className="table table-condensed">

                                                        <tbody>
                                                        <tr>
                                                            <td style={{
                                                                "backgroundColor": "rgba(0,0,0,.1)",
                                                                "fontWeight": "bold",
                                                                "fontSize": "16px"
                                                            }} colSpan="9" align="center">
                                                                Information
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td width="8%"><strong>Order ID</strong></td>
                                                            <td width="1%"><strong>:</strong></td>
                                                            <td width="23%">
                                                                {this.state.dtRes.id_transaksi} {this.state.dtRes.is_dropship ? (
                                                                <span
                                                                    className="badge bg-warning">Dropship</span>) : ""}
                                                            </td>
                                                            <td width="8%"><strong>Name</strong></td>
                                                            <td width="1%"><strong>:</strong></td>
                                                            <td width="28%">{this.state.dtRes.nama_member}</td>

                                                            <td width="12%"><strong>Payment Date</strong></td>
                                                            <td width="1%"><strong>:</strong></td>

                                                            <td width="17%">{this.state.dtRes.payment_date ? moment(new Date(this.state.dtRes.payment_date)).format('DD MMMM YYYY HH:mm') : "-"}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Order Date</strong></td>
                                                            <td><strong>:</strong></td>
                                                            <td>{moment(new Date(this.state.dtRes.created_at)).format('DD MMMM YYYY HH:mm')}</td>
                                                            <td><strong>Email</strong></td>
                                                            <td><strong>:</strong></td>
                                                            <td>{this.state.dtRes.email}</td>
                                                            <td><strong>Payment</strong></td>
                                                            <td><strong>:</strong></td>
                                                            <td>{this.state.dtRes.payment_name}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Status</strong></td>
                                                            <td><strong>:</strong></td>
                                                            <td>
                                                                <Fragment>
                                                                    {this.state.dtRes.status === 0 &&
                                                                        <span className="badge bg-warning">Waiting Payment</span>}
                                                                    {this.state.dtRes.status === 1 && <span
                                                                        className="badge bg-info">Payment Complete</span>}
                                                                    {this.state.dtRes.status === 2 &&
                                                                        <span className="badge bg-danger">Expired Payment</span>}
                                                                    {this.state.dtRes.status === 3 && <span
                                                                        className="badge bg-warning">On Process</span>}
                                                                    {this.state.dtRes.status === 4 &&
                                                                        <span className="badge bg-info">Dikirim</span>}
                                                                    {this.state.dtRes.status === 5 && <span
                                                                        className="badge bg-success">Completed</span>}
                                                                    {this.state.dtRes.status === 95678 &&
                                                                        <span className="badge bg-warning">Hold</span>}
                                                                </Fragment>


                                                            </td>
                                                            <td><strong>Phone</strong></td>
                                                            <td><strong>:</strong></td>
                                                            <td>{this.state.dtRes.phone_member}</td>
                                                            <td><strong>No.VA</strong></td>
                                                            <td><strong>:</strong></td>
                                                            <td>{this.state.dtRes.payment === 2 ? this.state.dtRes.key_payment : "-"}</td>

                                                        </tr>
                                                        {this.state.dtRes.tipe_pengiriman > 0 ? (
                                                            <tr>
                                                                <td><strong>Pengiriman</strong></td>
                                                                <td><strong>:</strong></td>
                                                                <td>
                                                                    {this.state.dtRes.tipe_pengiriman === 1 ? "Ambil dari DC terdekat" : ""}
                                                                    {this.state.dtRes.tipe_pengiriman === 2 ? "Kirim dari DC terdekat" : ""}
                                                                    {this.state.dtRes.tipe_pengiriman === 3 ? "Dikirim dari sales counter CNI" : ""}
                                                                </td>
                                                                <td><strong>CNOTE</strong></td>
                                                                <td><strong>:</strong></td>
                                                                <td>{this.state.dtRes.cnote_no && this.state.dtRes.tipe_pengiriman !== 1 ? this.state.dtRes.cnote_no : "-"}</td>
                                                                <td><strong>Layanan</strong></td>
                                                                <td><strong>:</strong></td>
                                                                {this.state.dtRes.tipe_pengiriman !== 1 ? (
                                                                    <td>{this.state.dtRes.logistic_name + " - " + this.state.dtRes.service_code}</td>) : (
                                                                    <td>-</td>)}

                                                            </tr>) : ''}
                                                        <tr>
                                                            <td><strong>Kode DC</strong></td>
                                                            <td>:</td>
                                                            <td>{this.state.dtRes.iddc}</td>
                                                            <td><strong>Nomor N</strong></td>
                                                            <td>:</td>
                                                            <td>{this.state.dtRes.cni_id ? this.state.dtRes.cni_id : '-'}</td>
                                                            <td><strong>Jenis Transaksi</strong></td>
                                                            <td>:</td>
                                                            <td>{parseInt(this.state.dtRes.is_regmitra) === 1 ? 'FPK' : 'Reguler'}</td>
                                                        </tr>
                                                        {this.state.dtRes.tipe_pengiriman > 0 ? (
                                                            <tr>
                                                                <td>
                                                                    <strong>{this.state.dtRes.tipe_pengiriman !== 1 ? "Origin" : "DC Name"}</strong>
                                                                </td>
                                                                <td><strong>:</strong></td>
                                                                {this.state.dtRes.tipe_pengiriman !== 1 ? (
                                                                        <Fragment>
                                                                            <td>{this.state.dtRes.wh_name + "     " + this.state.dtRes.prov_origin + "(" + this.state.dtRes.kode_origin + ")"}</td>

                                                                        </Fragment>
                                                                    ) :
                                                                    <td>{this.state.dtRes.wh_name + "     " + this.state.dtRes.prov_origin}</td>}
                                                                <td><strong>Alamat Pengiriman</strong></td>
                                                                <td><strong>:</strong></td>
                                                                <td colSpan="4">{this.state.dtRes.nama_penerima + ", "
                                                                    + this.state.dtRes.alamat + ", " + this.state.dtRes.kec_name + ", "
                                                                    + this.state.dtRes.city_name + ", " + this.state.dtRes.provinsi_name + ", "
                                                                    + this.state.dtRes.kode_pos + ", " + this.state.dtRes.phone_penerima}
                                                                    {this.state.dtRes.is_dropship ? (<span
                                                                        className="badge bg-warning">Dropship</span>) : ""}
                                                                </td>
                                                            </tr>) : ''}
                                                        {this.state.dtRes.tipe_pengiriman > 0 ? (
                                                            <tr>
                                                                <td><strong>Remark Hold</strong></td>
                                                                <td><strong>:</strong></td>
                                                                <td colSpan="7">{this.state.dtRes.remark_hold ? this.state.dtRes.remark_hold : '-'}</td>
                                                            </tr>) : ''}
                                                        {this.state.dtRes.tipe_pengiriman > 0 ? (
                                                            <tr>
                                                                <td><strong>Remark Onprocess</strong></td>
                                                                <td><strong>:</strong></td>
                                                                <td colSpan="7">{this.state.dtRes.remark_onprocess ? this.state.dtRes.remark_onprocess : '-'}</td>
                                                            </tr>
                                                        ) : ''}
                                                        <tr>
                                                            <td style={{
                                                                "backgroundColor": "rgba(0,0,0,.08)",
                                                                "fontWeight": "bold",
                                                                "fontSize": "16px"
                                                            }} colSpan="9" align="center">List Item
                                                            </td>
                                                        </tr>

                                                        </tbody>
                                                    </table>

                                                    <table className="table table-bordered"
                                                           style={{borderBottom: "none", borderLeft: "none"}}>
                                                        <thead>
                                                        <tr>
                                                            <th style={{width: 40, textAlign: 'center'}}>No.</th>
                                                            <th style={{width: 400, textAlign: 'center'}}>Product</th>
                                                            <th style={{width: 80, textAlign: 'center'}}>PV</th>
                                                            <th style={{width: 80, textAlign: 'center'}}>RV</th>
                                                            <th style={{width: 80, textAlign: 'center'}}>Qty</th>
                                                            <th style={{
                                                                width: 100,
                                                                textAlign: 'center'
                                                            }}>Weight(Gram)
                                                            </th>
                                                            <th style={{"textAlign": "center", width: 150}}>Price</th>
                                                            <th style={{"textAlign": "center", width: 150}}>Sub Total
                                                            </th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {this.state.dtRes.list_item.map((dt, i) => (
                                                            <tr key={i}>
                                                                <td align="center">{i + 1}.</td>
                                                                <td>{dt.kode_produk + ' - ' + dt.product_name}</td>
                                                                <td align="right">
                                                                    <NumberFormat
                                                                        value={dt.pv}
                                                                        thousandSeparator={true}
                                                                        decimalScale={2}
                                                                        displayType={'text'}
                                                                    />
                                                                </td>
                                                                <td align="right">
                                                                    <NumberFormat
                                                                        value={dt.rv}
                                                                        thousandSeparator={true}
                                                                        decimalScale={2}
                                                                        displayType={'text'}
                                                                    />
                                                                </td>
                                                                <td align="center">
                                                                    <NumberFormat
                                                                        value={dt.jml}
                                                                        thousandSeparator={true}
                                                                        decimalScale={2}
                                                                        displayType={'text'}
                                                                    />
                                                                </td>
                                                                <td align="right">
                                                                    <NumberFormat
                                                                        value={dt.berat}
                                                                        thousandSeparator={true}
                                                                        decimalScale={2}
                                                                        displayType={'text'}
                                                                    />
                                                                </td>
                                                                <td align="right">
                                                                    <NumberFormat
                                                                        value={dt.harga}
                                                                        thousandSeparator={true}
                                                                        decimalScale={2}
                                                                        displayType={'text'}
                                                                    />
                                                                </td>
                                                                <td align="right">
                                                                    <NumberFormat
                                                                        value={dt.ttl_harga}
                                                                        thousandSeparator={true}
                                                                        decimalScale={2}
                                                                        displayType={'text'}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))}

                                                        <tr>
                                                            <td align="right" colSpan="7" style={{border: "none"}}>
                                                                <strong>Total Belanjaan</strong></td>
                                                            <td align="right">
                                                                <NumberFormat
                                                                    value={this.state.dtRes.ttl_belanjaan}
                                                                    thousandSeparator={true}
                                                                    decimalScale={2}
                                                                    displayType={'text'}
                                                                />
                                                            </td>

                                                        </tr>
                                                        <tr>
                                                            <td align="right" colSpan="7" style={{border: "none"}}>
                                                                <strong>Ongkos
                                                                    Kirim({this.state.dtRes.ttl_weight / 1000}Kg)</strong>
                                                            </td>
                                                            <td align="right">
                                                                <NumberFormat
                                                                    value={this.state.dtRes.ongkir_origin ? this.state.dtRes.ongkir_origin : this.state.dtRes.ongkir}
                                                                    thousandSeparator={true}
                                                                    decimalScale={2}
                                                                    displayType={'text'}
                                                                />
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td align="right" colSpan="7" style={{border: "none"}}>
                                                                <strong>eWallet</strong>
                                                            </td>
                                                            <td align="right">
                                                                <NumberFormat
                                                                    value={this.state.dtRes.ewallet ? this.state.dtRes.ewallet : '0'}
                                                                    thousandSeparator={true}
                                                                    decimalScale={2}
                                                                    displayType={'text'}
                                                                />
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td align="right" colSpan="7" style={{border: "none"}}>
                                                                <strong>Voucher {this.state.dtRes.type_voucher === 1 ? " Potongan Ongkir" : this.state.dtRes.type_voucher === 2 ? " Potongan Harga" : this.state.dtRes.type_voucher === 2 ? " Free Produk" : ""}
                                                                    : {this.state.dtRes.kode_voucher ? this.state.dtRes.kode_voucher : '-'}</strong>
                                                            </td>
                                                            <td align="right">
                                                                {this.state.dtRes.type_voucher !== 3 && this.state.dtRes.kode_voucher ? (
                                                                    <NumberFormat
                                                                        value={this.state.dtRes.type_voucher === 1 ? Number(this.state.dtRes.ongkir_origin) - Number(this.state.dtRes.ongkir) : -this.state.dtRes.pot_voucher}
                                                                        thousandSeparator={true}
                                                                        decimalScale={2}
                                                                        displayType={'text'}
                                                                    />) : '0'}
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td colSpan="7" style={{border: "none"}}></td>

                                                            <td align="right"
                                                                style={{"backgroundColor": "rgba(0,0,0,.04)"}}>
                                                                <strong><NumberFormat
                                                                    value={this.state.dtRes.ttl_price}
                                                                    thousandSeparator={true}
                                                                    decimalScale={2}
                                                                    displayType={'text'}
                                                                /></strong></td>
                                                        </tr>


                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="card-footer clearfix">
                                                    <button type="button" onClick={() => this.props.history.goBack()}
                                                            className="btn btn-flat btn-danger btn-sm">Back
                                                    </button>

                                                    {(this.state.dtRes.status === 1 || this.state.dtRes.status === 95678) && this.state.dtRes.tipe_pengiriman === 3 && this.props.user.transaksi_setprocess > 0 &&
                                                        <button type="button" onClick={this.confirmProcess}
                                                                style={{marginLeft: 3}}
                                                                className="btn bnt-flat btn-warning btn-sm">Process</button>}

                                                    {this.state.dtRes.status === 3 && this.props.user.transaksi_setkirimpaket > 0 && this.state.dtRes.tipe_pengiriman === 3 &&
                                                        <button type="button" onClick={this.confirmKirim}
                                                                style={{marginLeft: 3}}
                                                                className="btn btn-flat btn-success btn-sm">Kirim
                                                            Paket</button>}

                                                    {this.state.dtRes.status === 3 && this.state.dtRes.tipe_pengiriman === 3 &&
                                                        <button type="button" onClick={this.confirmHold}
                                                                style={{marginLeft: 3}}
                                                                className="btn btn-flat btn-warning btn-sm">Hold</button>}
                                                    {this.state.dtRes.status === 4 && this.state.dtRes.tipe_pengiriman !== 1 && (
                                                        <Fragment>
                                                            <ReactToPrint
                                                                trigger={() => <button
                                                                    className="btn btn-flat btn-info btn-sm"
                                                                    style={{marginLeft: 3}}>Cetak Resi</button>}
                                                                content={() => this.componentRef}/>
                                                            <CetakResi
                                                                dataFromParent={this.state.dtRes}
                                                                ref={el => (this.componentRef = el)}/>
                                                        </Fragment>
                                                    )}
                                                </div>


                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </section>
                        {this.state.showSwalSuccess ? (<AppSwalSuccess
                            show={this.state.showSwalSuccess}
                            title={this.state.errMsg}
                            type="success"
                            handleClose={this.closeSwal.bind(this)}>
                        </AppSwalSuccess>) : ''}
                        <AppModal
                            show={this.state.showConfirm}
                            size="sm"
                            form={this.state.dtRes.status === 95678 ? frmUser2 : contentConfirm}
                            handleClose={this.handleClose.bind(this)}
                            backdrop="static"
                            keyboard={false}
                            title="Confirm"
                            titleButton="Yes, Process"
                            themeButton="warning"
                            isLoading={this.state.isLoading}
                            formSubmit={this.handleSave.bind(this, "UPD_STATUS")}
                        ></AppModal>

                        <AppModal
                            show={this.state.showConfirmKirim}
                            size="sm"
                            form={contentConfirmKirim}
                            handleClose={this.handleClose.bind(this)}
                            backdrop="static"
                            keyboard={false}
                            title="Confirm"
                            titleButton="Ya, Kirim paket ini"
                            themeButton="warning"
                            isLoading={this.state.isLoading}
                            formSubmit={this.handleSave.bind(this, action_kirim)}
                        ></AppModal>

                        <AppModal
                            show={this.state.showConfirmHold}
                            size="sm"
                            form={frmUser}
                            handleClose={this.handleClose.bind(this)}
                            backdrop="static"
                            keyboard={false}
                            title="Confirm"
                            titleButton="Ya, Hold transaksi ini"
                            themeButton="warning"
                            isLoading={this.state.isLoading}
                            formSubmit={this.handleSave.bind(this, 'SET_HOLD')}
                        ></AppModal>

                    </div>
                    <div>

                    </div>

                </div>

            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    user: state.auth.currentUser
});
export default connect(mapStateToProps, '')(TransDetail);