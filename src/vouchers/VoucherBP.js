import React, { Component } from 'react'
import { Button, Col, Figure, Form, Row } from 'react-bootstrap'
import noImg from '../assets/noPhoto.jpg'
import { connect } from 'react-redux';
import moment from 'moment';
import "moment/locale/id";
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import NumberFormat from 'react-number-format';
import AppButton from '../components/button/Button';
import { addData, addDataSuccess, postData } from './voucherService';
import { AppSwalSuccess } from '../components/modal/SwalSuccess';
import { Link } from 'react-router-dom';
import Loading from '../components/loading/MyLoading';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import { SelectProducts } from '../components/modal/MySelect';

var yesterday = moment().subtract(1, 'day');
var valid_startDate = function (current) {
    return current.isAfter(yesterday);
};

class VoucherBP extends Component {
    constructor(props) {
        super(props);
        this.initSelected = {
            title: '',
            img: ''
        }
        this.state = {
            validSd: valid_startDate,
            validEd: valid_startDate,
            appsLoading: false,
            img: '',
            kode_voucher: '',
            tipe: 3,
            imgUpload: noImg,
            errMsg: this.initSelected,
            isLoading: false,
			user_tertentu:0,
			is_limited:0,
			website:0,
			mobile:0,
			member:0,
			konsumen:0,
			is_show:0,
			new_konsumen:0,
        }
        this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
        this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
        this.handleChangeDesk = this.handleChangeDesk.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {

        const selectedId = sessionStorage.getItem('idVoucherCNI');
        if (selectedId > 0) {
            this.getData();
        }
        this.setState({ id_operator: this.props.user.id_operator });
    }

    getData = async () => {
        this.setState({ appsLoading: true, isLoading: true })
        const selectedIdCNI = sessionStorage.getItem('idVoucherCNI');
        const param = { id_voucher: selectedIdCNI }
        postData(param, 'VIEW_DETAIL')
            .then(response => {
                if (response.data.err_code === "00") {
                    const dtRes = response.data.data;
                    Object.keys(dtRes).map((key) => {
                        this.setState({ [key]: dtRes[key] });
                        this.setState({ imgUpload: dtRes.img });
                        //this.setState({ img: '' });
                        this.setState({ isLoading: false, appsLoading: false });
                        return 1;
                    });
                }
                if (response.data.err_code === "04") {
                    this.setState({ isLoading: false });
                }
            })
            .catch(e => {
                console.log(e);
                this.setState({ isLoading: false });
            });
    };

    handleSubmit() {
        var errors = this.state.errMsg;

        errors.title = !this.state.title ? "Title required" : '';
        errors.img = !this.state.img ? "Image required" : '';
        errors.img = !this.state.img && this.state.img.size > 2099200 ? "File size over 2MB" : errors.img;
        errors.produk_utama = !this.state.produk_utama ? "Produk utama Required" : '';
        errors.produk_bonus = !this.state.produk_bonus ? "Produk bonus Required" : '';
        errors.short_description = !this.state.short_description ? "Short Description Required" : '';
        errors.deskripsi = !this.state.deskripsi ? "Description Required" : '';
        errors.kuota = this.state.is_limited && !this.state.kuota ? "Kuota required" : '';
        errors.start_date = !this.state.start_date && "Start date required";
        errors.end_date = !this.state.end_date && "End date required";
		errors.kode_voucher = !this.state.kode_voucher ? "Kode Voucher required" : '';       
        this.setState({ ...this.state, id_operator: this.props.user.id_operator, isLoading: true, tipe: 1 });
        this.setState({ errors });
        if (this.validateForm(this.state.errMsg)) {
            this.props.onAdd(this.state);
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

    handleClose() {
        this.props.closeSwal();
        this.props.history.push('/vouchers');
    }

    handleChange(evt) {
        const name = evt.target.name;
        var value = evt.target.value;
        this.setState({ isLoading: false })
        //this.setState({ errMsg: { img: "" } })
        if (evt.target.name === "img") {
            value = evt.target.files[0];
            this.setState({ img: '' })
            if (!value) return;
            if (!value.name.match(/\.(jpg|jpeg|png)$/)) {
                this.setState({ errMsg: { img: "Extension Invalid" } })
                this.setState({ isLoading: true })
                return;
            }
            if (value.size > 2099200) {
                this.setState({ errMsg: { img: "File size over 2MB" } })
                this.setState({ isLoading: true })
                return;
            }
            let reader = new FileReader();
            reader.readAsDataURL(value);
            reader.onloadend = () => {
                this.setState({ img: value, imgUpload: reader.result })
            };
        }
        if (name === 'user_tertentu' || name === 'is_limited' || name === 'website' || name === 'mobile' || name === 'member' || name === 'konsumen' || name === 'is_show' || name=== 'new_konsumen') {
            value = evt.target.checked ? 1 : 0;
        }
        this.setState({
            ...this.state,
            isLoading: false,
            [name]: value,
            errMsg: {
                ...this.state.errMsg,
                [name]: ''
            }
        })
        //this.setState({ id_operator: this.props.user.id_operator });
        if (!this.state.id_operator) this.setState({ id_operator: this.props.user.id_operator });
    }

    handleChangeDesk(evt) {
        this.setState({
            ...this.state,
            deskripsi: evt,
            errMsg: {
                ...this.state.errMsg,
                deskripsi: ''
            }
        });
        if (!this.state.id_operator) this.setState({ ...this.state, id_operator: this.props.user.id_operator });
    }
    handleChangeStartDate(date) {
        this.setState({ ...this.state, errMsg: { ...this.state.errMsg, start_date: '' } })
        if (date) {
            const selectedDate = new Date(date);
            const _date = moment(selectedDate).format('YYYY-MM-DD');
            this.setState({ start_date: _date })
        } else {
            this.setState({ start_date: '' })
        }
        if (!this.state.id_operator) this.setState({ id_operator: this.props.user.id_operator });
    }
    handleChangeEndDate(date) {
        this.setState({ ...this.state, errMsg: { ...this.state.errMsg, end_date: '' } })
        if (date) {
            const selectedDate = new Date(date);
            const _date = moment(selectedDate).format('YYYY-MM-DD');
            this.setState({ end_date: _date })
        } else {
            this.setState({ end_date: '' })
        }
        if (!this.state.id_operator) this.setState({ id_operator: this.props.user.id_operator });
    }
    onchangeSelect = (item, vari) => {

        this.setState({
            ...this.state,
            [item]: vari.value,
            [item + '_name']: vari.label,
            errMsg: {
                ...this.state.errMsg,
                produk_utama: ''
            }
        });
    };
    renderView(mode, renderDefault, name) {
        // Only for years, months and days view
        if (mode === "time") return renderDefault();

        return (
            <div className="wrapper">
                {renderDefault()}
                <div className="controls">
                    <Button variant="warning" type="button" onClick={() => this.clear(name)}>Clear</Button>
                </div>
            </div>
        );
    }

    clear(name) {
        if (name === "end_date") {
            this.handleChangeEndDate();
        }
        if (name === "start_date") {
            this.handleChangeStartDate();
        }
    }

    render() {
        const { errMsg } = this.state;

        return (

            <div>

                <div className="content-wrapper">
                    {/* Content Header (Page header) */}
                    <div className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1 className="m-0">{this.state.isEdit ? ("Edit Voucher Bonus Produk") : "Add Voucher Bonus Produk"}</h1>
                                </div>

                            </div>
                        </div>
                    </div>

                    <section className="content">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    {/* card start */}
                                    {this.state.appsLoading ? (
                                        <Loading />
                                    ) : (
                                        <div className="card shadow-lg">
                                            <Form id="myForm">
                                                <div className="card-body my-card-body">
                                                    <Form.Row>
                                                        <Form.Group as={Col} xs={6} controlId="title">
                                                            <Form.Label>Title</Form.Label>

                                                            <Form.Control
                                                                value={this.state.title ? this.state.title : ''}
                                                                onChange={this.handleChange}
                                                                size="sm"
                                                                name="title"
                                                                type="text"
                                                                autoComplete="off"
                                                                placeholder="Title" />
                                                            {errMsg.title && (<span className="text-error badge badge-danger">{errMsg.title}</span>)}

                                                        </Form.Group>
                                                        
                                                        <Form.Group as={Col} xs={2} controlId="start_date">
                                                            <Form.Label>Start Date</Form.Label>
                                                            <Datetime
                                                                closeOnSelect={true}
                                                                timeFormat={false}
                                                                setViewDate={this.state.start_date ? (new Date(this.state.start_date)) : new Date()}
                                                                value={this.state.start_date ? (new Date(this.state.start_date)) : ''}
                                                                onChange={this.handleChangeStartDate}
                                                                inputProps={{
                                                                    readOnly: true,
                                                                    autoComplete: "off",
                                                                    placeholder: 'Start Date',
                                                                    name: 'start_date',
                                                                    className: 'form-control form-control-sm'
                                                                }}
                                                                renderView={(mode, renderDefault, start_date) =>
                                                                    this.renderView(mode, renderDefault, 'start_date')
                                                                }
                                                                locale="id" isValidDate={this.state.validSd}
                                                            />
                                                            {errMsg.start_date && (<span className="text-error badge badge-danger">{errMsg.start_date}</span>)}
                                                        </Form.Group>
                                                        <Form.Group as={Col} xs={2} controlId="is_limited">
                                                            <Form.Label>Limited</Form.Label>
                                                            <Row>
                                                                <Col xs={{ span: 1, offset: 2 }}>
                                                                    <Form.Check
                                                                        onChange={this.handleChange}
                                                                        checked={this.state.is_limited > 0 ? ("checked") : ""}
                                                                        label={this.state.is_limited > 0 ? ("Yes") : "No"}
                                                                        type="switch"
                                                                        name="is_limited"
                                                                        custom
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </Form.Group>
                                                        <Form.Group as={Col} xs={2} controlId="user_tertentu">
                                                            <Form.Label>User Tertentu</Form.Label>
                                                            <Row>
                                                                <Col xs={{ span: 1, offset: 2 }}>
                                                                    <Form.Check
																		disabled ={this.state.new_konsumen > 0 ? true :false}
                                                                        onChange={this.handleChange}
                                                                        checked={this.state.user_tertentu > 0 && this.state.new_konsumen === 0 ? ("checked") : ""}
                                                                        label={this.state.user_tertentu > 0 && this.state.new_konsumen === 0 ? ("Yes") : "No"}
                                                                        type="switch"
                                                                        name="user_tertentu"
                                                                        custom
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </Form.Group>
                                                    </Form.Row>

                                                    <Form.Row>
                                                        <Form.Group as={Col} xs={3} controlId="produk_utama">
                                                            <Form.Label>Produk Utama</Form.Label>
                                                            <SelectProducts
                                                                name="produk_utama"
                                                                myVal={this.state.produk_utama ? ({ value: this.state.produk_utama, label: this.state.produk_utama_name }) : ''}
                                                                onChange={this.onchangeSelect.bind(this, 'produk_utama')} />
                                                            {errMsg.produk_utama && (<span className="text-error badge badge-danger">{errMsg.produk_utama}</span>)}
                                                        </Form.Group>

                                                        <Form.Group as={Col} xs={3} controlId="produk_bonus">
                                                            <Form.Label>Produk Bonus</Form.Label>
                                                            <SelectProducts
                                                                name="produk_bonus"
                                                                myVal={this.state.produk_bonus ? ({ value: this.state.produk_bonus, label: this.state.produk_bonus_name }) : ''}
                                                                onChange={this.onchangeSelect.bind(this, 'produk_bonus')} />
                                                            {errMsg.produk_bonus && (<span className="text-error badge badge-danger">{errMsg.produk_bonus}</span>)}
                                                        </Form.Group>


                                                        <Form.Group as={Col} xs={2} controlId="end_date">
                                                            <Form.Label>End Date</Form.Label>
                                                            <Datetime
                                                                closeOnSelect={true}
                                                                timeFormat={false}
                                                                setViewDate={this.state.end_date ? (new Date(this.state.end_date)) : new Date()}
                                                                value={this.state.end_date ? (new Date(this.state.end_date)) : ''}
                                                                onChange={this.handleChangeEndDate}
                                                                inputProps={{
                                                                    readOnly: true,
                                                                    placeholder: 'End Date', autoComplete: "off",
                                                                    name: 'end_date', className: 'form-control form-control-sm'
                                                                }}
                                                                renderView={(mode, renderDefault) =>
                                                                    this.renderView(mode, renderDefault, 'end_date')
                                                                }
                                                                locale="id" isValidDate={this.state.validEd}
                                                            />
                                                            {errMsg.end_date && (<span className="text-error badge badge-danger">{errMsg.end_date}</span>)}
                                                        </Form.Group>

                                                        <Form.Group as={Col} xs={2} controlId="kuota">
                                                            <Form.Label>Kuota</Form.Label>
                                                            <NumberFormat
                                                                disabled={!this.state.is_limited}
                                                                onChange={this.handleChange}
                                                                name="kuota"
                                                                className="form-control form-control-sm"
                                                                value={this.state.kuota ? this.state.kuota : ''}
                                                                thousandSeparator={true}
                                                                decimalScale={2}
                                                                inputMode="numeric"
                                                                autoComplete="off"
                                                                placeholder="Kuota" />
                                                            {errMsg.kuota && (<span className="text-error badge badge-danger">{errMsg.kuota}</span>)}
                                                        </Form.Group>


                                                        <Form.Group as={Col} xs={2} controlId="mobile">
                                                            <Form.Label>Mobile</Form.Label>
                                                            <Row>
                                                                <Col xs={{ span: 1, offset: 2 }}>
                                                                    <Form.Check
                                                                        onChange={this.handleChange}
                                                                        checked={this.state.mobile > 0 ? ("checked") : ""}
                                                                        label={this.state.mobile > 0 ? ("Yes") : "No"}
                                                                        type="switch"
                                                                        name="mobile"
                                                                        custom
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </Form.Group>


                                                    </Form.Row>

                                                    <Form.Row>

                                                         <Form.Group as={Col} xs={3} controlId="kode_voucher">
                                                            <Form.Label>Kode Voucher</Form.Label>
                                                            <Form.Control
                                                                value={this.state.kode_voucher}
                                                                autoComplete="off"
                                                                onChange={this.handleChange}
                                                                size="sm"
                                                                name="kode_voucher"
                                                                type="text"
                                                                placeholder="Kode Voucher" />
															{errMsg.kode_voucher && (<span className="text-error badge badge-danger">{errMsg.kode_voucher}</span>)}
                                                        </Form.Group>
														<Form.Group as={Col} xs={1} controlId="is_show">
                                                            <Form.Label>Is Show</Form.Label>
                                                            <Row>
                                                                <Col xs={{ span: 1, offset: 2 }}>
                                                                    <Form.Check
                                                                        onChange={this.handleChange}
                                                                        checked={this.state.is_show > 0 ? ("checked") : ""}
                                                                        label={this.state.is_show > 0 ? ("Yes") : "No"}
                                                                        type="switch"
                                                                        name="is_show"
                                                                        custom
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </Form.Group>

                                                        <Form.Group as={Col} xs={2} controlId="website">
                                                            <Form.Label>Website</Form.Label>
                                                            <Row>
                                                                <Col xs={{ span: 1, offset: 2 }}>
                                                                    <Form.Check
                                                                        onChange={this.handleChange}
                                                                        checked={this.state.website > 0 ? ("checked") : ""}
                                                                        label={this.state.website > 0 ? ("Yes") : "No"}
                                                                        type="switch"
                                                                        name="website"
                                                                        custom
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </Form.Group>
                                                        <Form.Group as={Col} xs={2} controlId="member">
                                                            <Form.Label>Member</Form.Label>
                                                            <Row>
                                                                <Col xs={{ span: 1, offset: 2 }}>
                                                                    <Form.Check
																		disabled ={this.state.new_konsumen > 0 ? true :false}
                                                                        onChange={this.handleChange}
                                                                        checked={this.state.member > 0 && this.state.new_konsumen === 0 ? ("checked") : ""}
                                                                        label={this.state.member > 0 && this.state.new_konsumen === 0 ? ("Yes") : "No"}
                                                                        type="switch"
                                                                        name="member"
                                                                        custom
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </Form.Group>
                                                        <Form.Group as={Col} xs={2} controlId="konsumen">
                                                            <Form.Label>Konsumen</Form.Label>
                                                            <Row>
                                                                <Col xs={{ span: 1, offset: 2 }}>
                                                                    <Form.Check
																		disabled ={this.state.new_konsumen > 0 ? true :false}
                                                                        onChange={this.handleChange}
                                                                        checked={this.state.konsumen > 0 && this.state.new_konsumen === 0 ? ("checked") : ""}
                                                                        label={this.state.konsumen > 0 && this.state.new_konsumen === 0 ? ("Yes") : "No"}
                                                                        type="switch"
                                                                        name="konsumen"
                                                                        custom
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </Form.Group>
														<Form.Group as={Col} xs={2} controlId="new_konsumen">
                                                            <Form.Label>New Konsumen</Form.Label>
                                                            <Row>
                                                                <Col xs={{ span: 1, offset: 2 }}>
                                                                    <Form.Check
																		disabled ={this.state.konsumen > 0 || this.state.member > 0 || this.state.user_tertentu > 0 ? true :false}
                                                                        onChange={this.handleChange}
                                                                        checked={this.state.new_konsumen > 0 && this.state.konsumen === 0 && this.state.member === 0 && this.state.user_tertentu === 0 ? ("checked") : ""}
                                                                        label={this.state.new_konsumen > 0 && this.state.konsumen === 0 && this.state.member === 0 && this.state.user_tertentu === 0 ? ("Yes") : "No"}
                                                                        type="switch"
                                                                        name="new_konsumen"
                                                                        custom
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </Form.Group>
                                                    </Form.Row>

 <Form.Row>
                                                        <Form.Group as={Col} controlId="short_description">
                                                            <Form.Label>Short Description</Form.Label>
                                                            <Form.Control
                                                                value={this.state.short_description ? this.state.short_description : ''}
                                                                onChange={this.handleChange}
                                                                size="sm"
                                                                name="short_description"
                                                                type="text"
                                                                autoComplete="off"
                                                                placeholder="Short Description" />
                                                            {errMsg.short_description && (<span className="text-error badge badge-danger">{errMsg.short_description}</span>)}
                                                        </Form.Group>

                                                        
                                                    </Form.Row>

                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="deskripsi">
                                                            <Form.Label>Description</Form.Label>
                                                            {errMsg.deskripsi && (<span className="float-right text-error badge badge-danger">{errMsg.deskripsi}</span>)}
                                                            <SunEditor
                                                                defaultValue={this.state.deskripsi}
                                                                setContents={this.state.deskripsi}
                                                                onChange={this.handleChangeDesk}
                                                                setOptions={{
                                                                    placeholder: "Description ...",
                                                                    maxHeight: 200,
                                                                    height: 200,
                                                                    buttonList: [
                                                                        ['fontSize', 'formatBlock', 'bold', 'underline', 'italic', 'align', 'horizontalRule', 'list', 'lineHeight', 'link', 'strike', 'subscript', 'superscript', 'codeView', 'undo', 'redo', 'fontColor', 'hiliteColor', 'textStyle', 'paragraphStyle', 'blockquote', 'removeFormat']
                                                                    ]
                                                                }}
                                                            />


                                                        </Form.Group>
                                                        <Form.Group as={Col} xs={2} controlId="img">
                                                            <Form.Label>Image(500x500)</Form.Label>
                                                            {errMsg.img ? (<span className="float-right text-error badge badge-danger">{errMsg.img}</span>) : ''}
                                                            <Form.File
                                                                setfieldvalue={this.state.img}
                                                                onChange={this.handleChange}
                                                                size="sm"
                                                                name="img"
                                                                style={{ "color": "rgba(0, 0, 0, 0)" }} />
                                                            <Form.Text className="text-muted">
                                                                <em>- Images *.jpg, *.jpeg, *.png <br />- Maks. Size 2MB</em>
                                                            </Form.Text>

                                                        </Form.Group>

                                                        <Form.Group as={Col} xs={2} controlId="imagePreview">
                                                            <Form.Label style={{ "color": "rgba(0, 0, 0, 0)" }}>-----</Form.Label>
                                                            <Figure>
                                                                <Figure.Image
                                                                    thumbnail
                                                                    width={130}
                                                                    height={100}
                                                                    alt=""
                                                                    src={this.state.imgUpload}
                                                                />
                                                            </Figure>
                                                        </Form.Group>
                                                    </Form.Row>
													
													
                                                </div>
                                            </Form>
                                            <div className="card-footer">
                                                <Link to="/vouchers">
                                                    <Button variant="danger">Cancel</Button>{' '}
                                                </Link>
                                                <AppButton
                                                    type="button"
                                                    isLoading={this.state.isLoading}
                                                    onClick={this.handleSubmit.bind(this)}
                                                    theme="success">
                                                    Simpan
                                                </AppButton>
                                            </div>

                                        </div>

                                    )}
                                    {/* /.card */}
                                </div>
                            </div>
                        </div>
                    </section>

                    {this.props.showFormSuccess ? (<AppSwalSuccess
                        show={this.props.showFormSuccess}
                        title={this.props.contentMsg}
                        type={this.props.tipeSWAL}
                        handleClose={this.handleClose.bind(this)}
                    >
                    </AppSwalSuccess>) : ''}


                </div>
                <div>

                </div>

            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        user: state.auth.currentUser,
        contentMsg: state.voucher.contentMsg,
        showFormSuccess: state.voucher.showFormSuccess,
        tipeSWAL: state.voucher.tipeSWAL,
    }
}

const mapDispatchToPros = (dispatch) => {
    return {
        onAdd: (data) => {
            //console.log(data);
            dispatch(addData(data));
        },
        closeSwal: () => {
            const _data = {};
            _data['showFormSuccess'] = false;
            _data['contentMsg'] = null;
            dispatch(addDataSuccess(_data));

        }
    }
}
export default connect(mapStateToProps, mapDispatchToPros)(VoucherBP);