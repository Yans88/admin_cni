import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import SimpatikService from './SimpatikService';
import moment from 'moment';
import "moment/locale/id";
import MyLoading from '../components/loading/MyLoading';
import AppModal from '../components/modal/MyModal';
import { AppSwalSuccess } from '../components/modal/SwalSuccess';
import { Form, Figure } from 'react-bootstrap';
import NoImg from '../assets/noPhoto.jpg'

class SimpatikDetail extends Component {
    constructor(props) {
        super(props);
        this.initSelected = {
            id: '',
            img: '',
            id_operator: '',
            imgUpload: ''
        }
        this.state = {
            appsLoading: true,
            showConfirm: false,
            showConfirmKirim: false,
            showConfirmHold: false,
            isLoading: false,
            showSwalSuccess: false,
            showConfirmTransfer: false,
            remark_hold: '',
            dtRes: {},
            selected: this.initSelected,
            errMsg: this.initSelected,
            status: '',
            id: sessionStorage.getItem('idSimpatikCNI'),
        }
    }

    componentDidMount() {
        this.getData();
    }

    handleClose = () => {
        this.setState({
            ...this.state,
            showConfirm: false,
            errMsg: this.initSelected,
            showConfirmKirim: false,
            showConfirmHold: false,
            showConfirmTransfer: false,
            remark_hold: ''
        });
    };

    closeSwal = () => {
        this.setState({
            ...this.state,
            status: '',
            errMsg: this.initSelected,
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
            id: this.state.id,
            id_operator: this.props.user.id_operator,
            status: this.state.status,
            keterangan: this.state.remark_hold
        }

        SimpatikService.postData(queryString, action).then((res) => {
            const err_code = res.data.err_code;
            if (err_code === '00') {
                this.setState({
                    ...this.state,
                    isLoading: false,
                    showConfirm: false,
                    showConfirmKirim: false,
                    showConfirmHold: false,
                    errMsg: <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong>Success</strong>, Data berhasil diupdate</div>' }} />,
                    showSwalSuccess: true,
                    //dtRes: { ...this.state.dtRes, status: 2 }
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
        this.setState({ ...this.state, showConfirm: true, errMsg: this.initSelected, status: 2 });
    }

    confirmKirim = () => {
        this.setState({ ...this.state, showConfirmKirim: true, errMsg: this.initSelected, status: 5, remark_hold: '' });
    }

    confirmHold = () => {
        this.setState({ ...this.state, showConfirmHold: true, errMsg: this.initSelected, remark_hold: '', status: 3 });
    }

    confirmTransfer = () => {
        this.setState({ ...this.state, showConfirmTransfer: true, errMsg: this.initSelected, remark_hold: '' });
    }

    getData = () => {
        this.setState({ appsLoading: true });
        const selectedIdCNI = sessionStorage.getItem('idSimpatikCNI');
        const queryString = { id: selectedIdCNI }
        SimpatikService.postData(queryString, "VIEW_DETAIL")
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
                    this.setState({ appsLoading: false });
                }, 400);
            })
            .catch(e => {
                console.log(e);
                this.setState({ appsLoading: false });
            });
    };

    handleSubmit() {
        var errors = this.state.errMsg;
        this.setState({
            ...this.state,
            loadingForm: true,
        });
        errors.img = !this.state.selected.img ? "Image required" : '';
        if (this.state.selected.img) {
            var fileSize = this.state.selected.img.size;
            if (fileSize > 2099200) { // satuan bytes 2099200 => 2MB
                errors.img = "File size over 2MB";
            }
        }
        if (!this.state.selected.id_operator) this.setState({ selected: { ...this.state.selected, id_operator: this.props.user.id_operator } });

        this.setState({ errors });
        if (this.validateForm(this.state.errMsg)) {
            let _data = new FormData();
            _data.append('id', this.state.id);
            _data.append('id_operator', this.props.user.id_operator);
            _data.append('bukti_transfer', this.state.selected.img);
            SimpatikService.postData(_data, "UPL_BUKTI_TRANSFER").then((res) => {
                const err_code = res.data.err_code;
                if (err_code === '00') {
                    this.setState({
                        ...this.state,
                        isLoading: false,
                        showConfirm: false,
                        showConfirmKirim: false,
                        showConfirmHold: false,
                        showConfirmTransfer: false,
                        errMsg: <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong>Success</strong>, Data berhasil diupdate</div>' }} />,
                        showSwalSuccess: true,
                        //dtRes: { ...this.state.dtRes, status: 2 }
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
                    showConfirmTransfer: false,
                });
            });
        } else {
            console.error('Invalid Form')
        }
        // this.setState({
        //     ...this.state,
        //     loadingForm: false,
        // });
    }

    validateForm(errors) {
        let valid = true;
        Object.values(errors).forEach(
            (val) => val.length > 0 && (valid = false)
        );
        return valid;
    }

    handleChange(evt) {
        const name = evt.target.name;
        var value = evt.target.value;
        if (!this.state.selected.id_operator) this.setState({ selected: { ...this.state.selected, id_operator: this.props.user.id_operator } });
        if (name === "img") {
            value = evt.target.files[0];
            this.setState({ selected: { ...this.state.selected, imgUpload: "", img: "" } });
            if (!value) return;
            if (!value.name.match(/\.(jpg|jpeg|png)$/)) {
                this.setState({ loadingForm: true, errMsg: { ...this.state.errMsg, img: "Please select valid image(.jpg .jpeg .png)" } });

                //setLoading(true);
                return;
            }
            if (value.size > 2099200) {
                this.setState({ loadingForm: true, errMsg: { ...this.state.errMsg, img: "File size over 2MB" } });

                //setLoading(true);
                return;
            }
            let reader = new FileReader();
            reader.readAsDataURL(value);
            reader.onloadend = () => {
                this.setState({ loadingForm: false, selected: { ...this.state.selected, imgUpload: reader.result, img: value } });
            };
        }
        this.setState({
            [name]: value
        })


    }


    render() {
        const contentConfirm = <div dangerouslySetInnerHTML={{ __html: '<div id="caption" style=padding-bottom:20px;">Apakah anda yakin<br/><b>memproses</b> pengajuan ini ?</div>' }} />;
        const { selected, errMsg } = this.state;

        const frmUser = <Form id="myForm">
            <div id="caption">
                Pengajuan ini akan di <b>Approve</b>, Apakah anda yakin ?
            </div>
            <Form.Group controlId="remark_hold">
                <Form.Label>Keterangan</Form.Label>
                <Form.Control size="sm" name="remark_hold" as="textarea" rows={5} value={this.state.remark_hold} onChange={this.handleChange.bind(this)} placeholder="Keterangan . . ." />
            </Form.Group>
        </Form>;

        const frmUser3 = <Form id="myForm">
            <div id="caption">
                Pengajuan ini akan di <b>Reject</b>, Apakah anda yakin ?
            </div>
            <Form.Group controlId="remark_hold">
                <Form.Label>Keterangan</Form.Label>
                <Form.Control size="sm" name="remark_hold" as="textarea" rows={5} value={this.state.remark_hold} onChange={this.handleChange.bind(this)} placeholder="Keterangan . . ." />
            </Form.Group>
        </Form>;

        const frmUser4 = <Form id="myForm">

            <Form.Group controlId="image">
                <Form.Label>Image</Form.Label>{errMsg.img ?
                    (<span className="float-right text-error badge badge-danger">{errMsg.img}</span>) : ''}
                <Form.File size="sm" name="img" setfieldvalue={selected.img} onChange={this.handleChange.bind(this)} />
            </Form.Group>
            {selected.imgUpload ? (<Form.Group controlId="imagePreview" style={{ marginBottom: 0 }}>
                <Figure>
                    <Figure.Image
                        thumbnail
                        width={130}
                        height={100}
                        alt=""
                        src={selected.imgUpload}
                    />
                </Figure>
            </Form.Group>) : ''}
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
                                        <h1 className="m-0">Simpatik Detail</h1>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <section className="content">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-12">
                                        {this.state.appsLoading ? (
                                            <MyLoading />
                                        ) : (
                                            <div className="card shadow-lg">
                                                <div className="card-body">
                                                    <table className="table table-condensed">

                                                        <tbody>
                                                            <tr>
                                                                <td style={{ "backgroundColor": "rgba(0,0,0,.1)", "fontWeight": "bold", "fontSize": "16px" }} colSpan="9" align="center">
                                                                    Information </td>
                                                            </tr>
                                                            <tr>

                                                                <td width="20%"><strong>CNI ID</strong></td>
                                                                <td width="1%"><strong>:</strong></td>
                                                                <td width="29%">
                                                                    {this.state.dtRes.cni_id}
                                                                </td>

                                                                <td width="20%"><strong>Name</strong></td>
                                                                <td width="1%"><strong>:</strong></td>
                                                                <td width="29%">{this.state.dtRes.nama}</td>



                                                            </tr>
                                                            <tr>
                                                                <td><strong>Request Date</strong></td>
                                                                <td><strong>:</strong></td>
                                                                <td>{moment(new Date(this.state.dtRes.created_at)).format('DD MMMM YYYY HH:mm')}</td>
                                                                <td><strong>Phone</strong></td>
                                                                <td><strong>:</strong></td>
                                                                <td>{this.state.dtRes.phone}</td>

                                                            </tr>
                                                            <tr>
                                                                <td><strong>Status</strong></td>
                                                                <td><strong>:</strong></td>
                                                                <td>
                                                                    <Fragment>
                                                                        {this.state.dtRes.status === 1 && <span className="badge bg-warning">Waiting ...</span>}

                                                                        {this.state.dtRes.status === 2 && <span className="badge bg-info">Diterima </span>}
                                                                        {this.state.dtRes.status === 3 && <span className="badge bg-warning">Approved</span>}
                                                                        {this.state.dtRes.status === 4 && <span className="badge bg-success">completed</span>}
                                                                        {this.state.dtRes.status === 5 && <span className="badge bg-danger">Rejected</span>}

                                                                    </Fragment>
                                                                </td>
                                                                <td><strong>Keterangan</strong></td>
                                                                <td><strong>:</strong></td>
                                                                <td>{this.state.dtRes.keterangan}</td>





                                                            </tr>




                                                            <tr>
                                                                <td style={{ "backgroundColor": "rgba(0,0,0,.08)", "fontWeight": "bold", "fontSize": "16px" }} colSpan="6" align="center">Informasi Kecelakan</td>
                                                            </tr>


                                                            <tr>

                                                                <td width="20%"><strong>Tanggal Kecelakan</strong></td>
                                                                <td width="1%"><strong>:</strong></td>
                                                                <td width="29%">{moment(new Date(this.state.dtRes.tgl_kecelakaan)).format('DD MMMM YYYY')} <b>Di Kota</b> {this.state.dtRes.nama_kota_kecelakaan}</td>

                                                                <td><strong>Luka yang dialami</strong></td>
                                                                <td><strong>:</strong></td>
                                                                <td>{this.state.dtRes.luka_dialami}</td>



                                                            </tr>
                                                            <tr>
                                                                <td><strong>Kategori Santunan</strong></td>
                                                                <td><strong>:</strong></td>
                                                                <td>{this.state.dtRes.kat_santunan}</td>
                                                                <td width="20%"><strong>Lama Rawat Inap</strong></td>
                                                                <td width="1%"><strong>:</strong></td>
                                                                <td width="29%">{this.state.dtRes.lama_rawat_inap}</td>

                                                            </tr>

                                                            <tr>

                                                                <td width="20%"><strong>Penyebab Kecelakan</strong></td>
                                                                <td width="1%"><strong>:</strong></td>
                                                                <td colSpan="4">{this.state.dtRes.penyebab_kecelakaan}</td>

                                                            </tr>




                                                            <tr>

                                                                <td width="15%"><strong>Apakah pernah kecelakaan sebelumnya</strong></td>
                                                                <td width="1%"><strong>:</strong></td>
                                                                <td width="37%">{this.state.dtRes.pernah_kecelakaan_sebelumnya}{this.state.dtRes.pernah_kecelakaan_sebelumnya === 'Ya' && moment(new Date(this.state.dtRes.tgl_pernah_kecelakaan_sebelumnya)).format('DD MMMM YYYY')}</td>
                                                                <td><strong>Apakah berdampak cacat</strong></td>
                                                                <td><strong>:</strong></td>
                                                                <td>{this.state.dtRes.berdampak_cacat}</td>
                                                            </tr>

                                                            <tr>

                                                                <td width="20%"><strong>Rincian penyebabnya</strong></td>
                                                                <td width="1%"><strong>:</strong></td>
                                                                <td colSpan="4">{this.state.dtRes.rincian_penyebabnya}</td>

                                                            </tr>
                                                            <tr>

                                                                <td width="20%"><strong>Meninggal Rincian penyebabnya</strong></td>
                                                                <td width="1%"><strong>:</strong></td>
                                                                <td colSpan="4">{this.state.dtRes.meninggal_rincian_penyebabnya}</td>

                                                            </tr>



                                                        </tbody>
                                                    </table>
                                                    <br />
                                                    <div className="row">
                                                        <div className={this.state.dtRes.status === 4 ? "col-3" : "col-4"} style={{ textAlign: "center" }}>
                                                            <Figure>
                                                                <Figure.Image
                                                                    thumbnail
                                                                    width={250}
                                                                    height={200}
                                                                    alt="Nama Dokter"
                                                                    src={this.state.dtRes.nama_dokter ? (this.state.dtRes.nama_dokter) : (NoImg)}
                                                                />

                                                                <Figure.Caption>
                                                                    Nama Dokter
                                                                </Figure.Caption>
                                                            </Figure>
                                                        </div>
                                                        <div className={this.state.dtRes.status === 4 ? "col-3" : "col-4"} style={{ textAlign: "center" }}>
                                                            <Figure>
                                                                <Figure.Image
                                                                    thumbnail
                                                                    width={250}
                                                                    height={200}
                                                                    alt="No.Ref dokter"
                                                                    src={this.state.dtRes.no_ref_dokter ? (this.state.dtRes.no_ref_dokter) : (NoImg)}
                                                                />

                                                                <Figure.Caption>
                                                                    No.Ref Dokter
                                                                </Figure.Caption>
                                                            </Figure>


                                                        </div>

                                                        <div className={this.state.dtRes.status === 4 ? "col-3" : "col-4"} style={{ textAlign: "center" }}>
                                                            <Figure>
                                                                <Figure.Image
                                                                    thumbnail
                                                                    width={250}
                                                                    height={200}
                                                                    alt="No.Hp dokter"
                                                                    src={this.state.dtRes.no_hp_dokter ? (this.state.dtRes.no_hp_dokter) : (NoImg)}
                                                                />

                                                                <Figure.Caption>
                                                                    No.Hp Dokter
                                                                </Figure.Caption>
                                                            </Figure>
                                                        </div>
                                                        {this.state.dtRes.status === 4 && (
                                                            <div className="col-3" style={{ textAlign: "center" }}>
                                                                <Figure>
                                                                    <Figure.Image
                                                                        thumbnail
                                                                        width={250}
                                                                        height={200}
                                                                        alt="Bukti Transfer"
                                                                        src={this.state.dtRes.bukti_transfer ? (this.state.dtRes.bukti_transfer) : (NoImg)}
                                                                    />

                                                                    <Figure.Caption>
                                                                        Bukti Transfer
                                                                    </Figure.Caption>
                                                                </Figure>
                                                            </div>
                                                        )}
                                                    </div>



                                                </div>
                                                <div className="card-footer clearfix">
                                                    <button type="button" onClick={() => this.props.history.goBack()} className="btn btn-flat btn-danger btn-sm">Back</button>
                                                    {(this.state.dtRes.status === 1) && <button type="button" onClick={this.confirmProcess} style={{ marginLeft: 3 }} className="btn bnt-flat btn-warning btn-sm">Diterima</button>}
                                                    {this.state.dtRes.status === 2 &&
                                                        <Fragment>
                                                            <button type="button" onClick={this.confirmHold} style={{ marginLeft: 3 }} className="btn bnt-flat btn-success btn-sm">Approve</button> 	<button type="button" onClick={this.confirmKirim} className="btn bnt-flat btn-warning btn-sm">Reject</button>
                                                        </Fragment>
                                                    }
                                                    {(this.state.dtRes.status === 3) && <button type="button" onClick={this.confirmTransfer} style={{ marginLeft: 3 }} className="btn bnt-flat btn-warning btn-sm">Upload bukti transfer</button>}
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
                            form={contentConfirm}
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
                            form={frmUser3}
                            handleClose={this.handleClose.bind(this)}
                            backdrop="static"
                            keyboard={false}
                            title="Confirm"
                            titleButton="Ya, Reject pengajuan ini"
                            themeButton="warning"
                            isLoading={this.state.isLoading}
                            formSubmit={this.handleSave.bind(this, 'UPD_STATUS')}
                        ></AppModal>

                        <AppModal
                            show={this.state.showConfirmHold}
                            size="sm"
                            form={frmUser}
                            handleClose={this.handleClose.bind(this)}
                            backdrop="static"
                            keyboard={false}
                            title="Confirm"
                            titleButton="Ya, Approve pengajuan ini"
                            themeButton="success"
                            isLoading={this.state.isLoading}
                            formSubmit={this.handleSave.bind(this, 'UPD_STATUS')}
                        ></AppModal>

                        <AppModal
                            show={this.state.showConfirmTransfer}
                            size="sm"
                            form={frmUser4}
                            handleClose={this.handleClose.bind(this)}
                            backdrop="static"
                            keyboard={false}
                            title="Upload bukti transfer"
                            titleButton="Upload"
                            themeButton="success"
                            isLoading={this.state.isLoading}
                            formSubmit={this.handleSubmit.bind(this)}
                        ></AppModal>

                    </div>
                    <div>

                    </div>

                </div >

            </div >
        )
    }
}


const mapStateToProps = (state) => ({
    user: state.auth.currentUser
});
export default connect(mapStateToProps, '')(SimpatikDetail);