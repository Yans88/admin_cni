import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux';
import TransService from './TransService';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import "moment/locale/id";
import MyLoading from '../components/loading/MyLoading';
import AppModal from '../components/modal/MyModal';
import {AppSwalSuccess} from '../components/modal/SwalSuccess';
import {Figure} from 'react-bootstrap';
import NoImg from '../assets/noPhoto.jpg';
import {FaTimes} from "react-icons/fa";

class UlasanDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appsLoading: true,
            showConfirm: false,
            isLoading: false,
            showSwalSuccess: false,
            id_product: 0,
            id_operator: 0,
            status: 1,
            dtRes: {},
            errMsg: null,
            id_transaksi: sessionStorage.getItem('idTransCNI'),
        }
    }

    componentDidMount() {

        this.getData();
    }

    handleSave = () => {
        this.setState({
            ...this.state,
            isLoading: true
        })
        const queryString = {
            id_transaksi: this.state.id_transaksi,
            id_operator: this.props.user.id_operator
        }

        TransService.postData(queryString, "UPD_STATUS").then((res) => {
            const err_code = res.data.err_code;
            if (err_code === '00') {
                this.setState({
                    ...this.state,
                    isLoading: false,
                    showConfirm: false,
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
                showConfirm: false
            });
        });

    }

    getData = () => {
        this.setState({appsLoading: true});
        const selectedIdCNI = sessionStorage.getItem('idTransCNIUlasan');
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

    showFormApprove = async (record) => {
        this.setState({
            ...this.state,
            show: true,
            showReject: false,
            isLoading: false,
            id_transaksi: record.id_trans,
            id_product: record.id_product,
            status: 2,
            id_operator: this.props.user.id_operator
        })
    }

    showFormReject = async (record) => {
        this.setState({
            ...this.state,
            show: false,
            showReject: true,
            isLoading: false,
            id_transaksi: record.id_trans,
            id_product: record.id_product,
            status: 3,
            id_operator: this.props.user.id_operator
        })
    }

    handleClose = () => {
        this.setState({
            show: false,
            showReject: false,
            isLoading: false,
            errMsg: '',
            showSwalSuccess: false,
        });

    };

    closeSwal = () => {
        this.setState({
            show: false,
            showReject: false,
            isLoading: false,
            errMsg: '',
            showSwalSuccess: false,
        });
        this.getData();
    }

    handleProses() {
        this.setState({
            ...this.state,
            isLoading: true
        });
        const param = {
            id_transaksi: this.state.id_transaksi,
            id_product: this.state.id_product,
            status: this.state.status,
            id_operator: this.state.id_operator
        }

        TransService.postData(param, "UPD_STATUS_ULASAN").then((res) => {
            const err_code = res.data.err_code;
            if (err_code === '00') {
                this.setState({
                    ...this.state,
                    show: false,
                    showReject: false,
                    isLoading: false,
                    errMsg: <div
                        dangerouslySetInnerHTML={{__html: '<div style="font-size:20px; text-align:center;"><strong>Success</strong>, Data berhasil diupdate</div>'}}/>,
                    showSwalSuccess: true

                });
            }
        }).catch((error) => {
            console.log(error);
            this.setState({
                ...this.state,
                isLoading: false,
                showConfirm: false
            });
        });
    }

    render() {

        const contentProgress = <div
            dangerouslySetInnerHTML={{__html: '<div id="caption" style=padding-bottom:20px;">Apakah anda yakin <br/>memproses ulasan ini ?</div>'}}/>;

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
                                                                </Fragment>


                                                            </td>
                                                            <td><strong>Phone</strong></td>
                                                            <td><strong>:</strong></td>
                                                            <td>{this.state.dtRes.phone_member}</td>
                                                            <td><strong>No.VA</strong></td>
                                                            <td><strong>:</strong></td>
                                                            <td>{this.state.dtRes.payment === 2 ? this.state.dtRes.key_payment : "-"}</td>

                                                        </tr>
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

                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <strong>{this.state.dtRes.tipe_pengiriman !== 1 ? "Origin" : "DC Name"}</strong>
                                                            </td>
                                                            <td><strong>:</strong></td>

                                                            {this.state.dtRes.tipe_pengiriman !== 1 ? (
                                                                    <Fragment>
                                                                        <td>{this.state.dtRes.wh_name + "     " + this.state.dtRes.prov_origin + "(" + this.state.dtRes.kode_origin + ")"}</td>
                                                                        <td><strong>Alamat Pengiriman</strong></td>
                                                                        <td><strong>:</strong></td>
                                                                        <td colSpan="4">{this.state.dtRes.nama_penerima + ", "
                                                                            + this.state.dtRes.alamat + ", " + this.state.dtRes.kec_name + ", "
                                                                            + this.state.dtRes.city_name + ", " + this.state.dtRes.provinsi_name + ", "
                                                                            + this.state.dtRes.kode_pos + ", " + this.state.dtRes.phone_penerima}
                                                                            {this.state.dtRes.is_dropship ? (<span
                                                                                className="badge bg-warning">Dropship</span>) : ""}
                                                                        </td>
                                                                    </Fragment>
                                                                ) :
                                                                <td colSpan="7">{this.state.dtRes.wh_name + "     " + this.state.dtRes.prov_origin}</td>}

                                                        </tr>
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
                                                            <th style={{width: 200, textAlign: 'center'}}>Product Name
                                                            </th>
                                                            <th style={{width: 250, textAlign: 'center'}}>Ulasan</th>
                                                            <th style={{width: 80, textAlign: 'center'}}>Rating</th>
                                                            <th style={{width: 155, textAlign: 'center'}}>Photo</th>

                                                            <th style={{"textAlign": "center", width: 70}}>Action</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {this.state.dtRes.list_item.map((dt, i) => (
                                                            <tr key={i}>
                                                                <td align="center">{i + 1}.</td>
                                                                <td>{dt.product_name}</td>
                                                                <td>
                                                                    {dt.ulasan}
                                                                </td>
                                                                <td align="center">
                                                                    <NumberFormat
                                                                        value={dt.rating}
                                                                        thousandSeparator={true}
                                                                        decimalScale={2}
                                                                        displayType={'text'}
                                                                    />
                                                                </td>
                                                                <td align="center">
                                                                    <Figure>
                                                                        <Figure.Image
                                                                            thumbnail
                                                                            width={150}
                                                                            height={120}
                                                                            alt={dt.product_name}
                                                                            src={dt.img_ulasan ? dt.img_ulasan : NoImg}
                                                                        />

                                                                    </Figure>
                                                                </td>
                                                                <td align="center">
                                                                    {dt.status_ulasan === 1 ? (
                                                                        <Fragment>
                                                                            <button
                                                                                onClick={e => this.showFormApprove(dt)}
                                                                                className="btn btn-xs btn-success"
                                                                                style={{marginBottom: '3px'}}>
                                                                                <i className="fa fa-check"></i> Approve
                                                                            </button>
                                                                            <button
                                                                                onClick={e => this.showFormReject(dt)}
                                                                                style={{marginBottom: '3px', width: 70}}
                                                                                className="btn btn-danger btn-xs"
                                                                            >
                                                                                <FaTimes/> Reject
                                                                            </button>
                                                                        </Fragment>
                                                                    ) : ''}
                                                                    {dt.status_ulasan === 2 ? (
                                                                        <button

                                                                            className="btn btn-xs btn-success"
                                                                            style={{marginBottom: '3px', width: 80}}>
                                                                            Approved {moment(new Date(dt.tgl_status_ulasan)).format('DD-MM-YYYY')}
                                                                            <br/> {moment(new Date(dt.tgl_status_ulasan)).format('HH:mm')}
                                                                        </button>
                                                                    ) : ''}
                                                                    {dt.status_ulasan === 3 ? (
                                                                        <button

                                                                            className="btn btn-xs btn-danger"
                                                                            style={{marginBottom: '3px', width: 80}}>
                                                                            Rejected <br/> {moment(new Date(dt.tgl_status_ulasan)).format('DD-MM-YYYY')}
                                                                            <br/> {moment(new Date(dt.tgl_status_ulasan)).format('HH:mm')}
                                                                        </button>
                                                                    ) : ''}
                                                                </td>
                                                            </tr>
                                                        ))}


                                                        </tbody>
                                                    </table>


                                                </div>
                                                <div className="card-footer clearfix">
                                                    <button type="button" onClick={() => this.props.history.goBack()}
                                                            className="btn bnt-flat btn-danger">Back
                                                    </button>
                                                    {this.state.dtRes.status === 1 &&
                                                        <button type="button" onClick={this.confirmProcess}
                                                                style={{marginLeft: 3}}
                                                                className="btn bnt-flat btn-warning">Process</button>}

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
                            show={this.state.show}
                            size="sm"
                            form={contentProgress}
                            handleClose={this.handleClose.bind(this)}
                            backdrop="static"
                            keyboard={false}
                            title="Confirm Approve"
                            titleButton="Approve"
                            themeButton="success"
                            isLoading={this.state.isLoading}
                            formSubmit={this.handleProses.bind(this)}
                        ></AppModal>

                        <AppModal
                            show={this.state.showReject}
                            size="sm"
                            form={contentProgress}
                            handleClose={this.handleClose.bind(this)}
                            backdrop="static"
                            keyboard={false}
                            title="Confirm Reject"
                            titleButton="Reject"
                            themeButton="danger"
                            isLoading={this.state.isLoading}
                            formSubmit={this.handleProses.bind(this)}
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
export default connect(mapStateToProps, '')(UlasanDetail);