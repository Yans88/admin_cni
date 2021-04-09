import React, { Component } from 'react'
import { Button, Col, Figure, Form, Row } from 'react-bootstrap'
import { SelectCategory } from '../components/modal/MySelect';
import noImg from '../assets/noPhoto.jpg'
import { connect } from 'react-redux';
import moment from 'moment';
import "moment/locale/id";
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import NumberFormat from 'react-number-format';
import AppButton from '../components/button/Button';
import ProductService from './ProductService';
import { AppSwalSuccess } from '../components/modal/SwalSuccess';
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';
import Loading from '../components/loading/MyLoading';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

const cookie = new Cookies();

//https://www.npmjs.com/package/react-datetime


var yesterday = moment().subtract(1, 'day');
var valid_startDate = function (current) {
    return current.isAfter(yesterday);
};
class ProductForm extends Component {
   
    constructor(props) {
        super(props);

        this.initialState = {
            id_product: '',
            product_name: '',
            id_category: '',
            category_name: '',
            deskripsi: '',
            berat: '',
            kondisi: '',
            min_pembelian: '',
            video_url: '',
            img: '',
            imgUpload: '',
            short_description: '',
            qty: '',
            special_promo: '',
            start_date: '',
            end_date: '',
            harga_member: '',
            harga_konsumen: '',
            id_operator: ''
        }
        this.state = {
            validSd: valid_startDate,
            validEd: valid_startDate,
            isLoading: false,
            showSwalSuccess: false,
            errMsg: this.initialState,
            validated: false,
            isEdit: false,
            appsLoading: false,
            id_product: '',
            product_name: '',
            id_category: '',
            category_name: '',
            deskripsi: "",
            berat: '',
            kondisi: '',
            min_pembelian: '',
            video_url: '',
            img: '',
            imgUpload: noImg,
            short_description: "",
            qty: '',
            special_promo: '',
            start_date: '',
            end_date: '',
            harga_member: '',
            harga_konsumen: '',
            id_operator: '',
            test: 'Halo'
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onchangeSelect = this.onchangeSelect.bind(this);
        this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
        this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
        this.handleChangeDesk = this.handleChangeDesk.bind(this);
        this.closeSwal = this.closeSwal.bind(this);
    }

    componentDidMount() {
        const pathName = this.props.location.pathname.replace('/', '');
        const selectedIdCNI = cookie.get('selectedIdCNI');
        if (pathName === 'edit_product' && (selectedIdCNI > 0 || !selectedIdCNI)) {
            this.setState({ isEdit: true });
                this.getData();
        }
        this.setState({ id_operator: this.props.user.id_operator });
    }

    
    getData = async () => {
        this.setState({ appsLoading: true, isLoading: true })
        const selectedIdCNI = cookie.get('selectedIdCNI');
        const queryString = { id_product: selectedIdCNI }
        await ProductService.postData(queryString, 'VIEW_DETAIL')
            .then(response => {
                if (response.data.err_code === "00") {
                    const dtRes = response.data.data;
                    Object.keys(this.initialState).map((key) => {
                        this.setState({ [key]: dtRes[key] });
                        this.setState({ imgUpload: dtRes.img });
                        this.setState({ img: '' });
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


    handleChangeStartDate(date) {
        if (date) {
            const selectedDate = new Date(date);
            const _date = moment(selectedDate).format('YYYY-MM-DD HH:mm');
            this.setState({ start_date: _date })
        } else {
            this.setState({ start_date: '' })
        }
        if (!this.state.id_operator) this.setState({ id_operator: this.props.user.id_operator });
    }
    handleChangeEndDate(date) {
        if (date) {
            const selectedDate = new Date(date);
            const _date = moment(selectedDate).format('YYYY-MM-DD HH:mm');
            this.setState({ end_date: _date })
        } else {
            this.setState({ end_date: '' })
        }
        if (!this.state.id_operator) this.setState({ id_operator: this.props.user.id_operator });
    }
    handleChange(evt) {
        const name = evt.target.name;
        var value = evt.target.value;
        this.setState({ isLoading: false })
        this.setState({ errMsg: { img: "" } })
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
        if (name === 'special_promo') {
            value = evt.target.checked ? 1 : 0;
        }
        this.setState({
            [name]: value
        })
        //this.setState({ id_operator: this.props.user.id_operator });
        if (!this.state.id_operator) this.setState({ id_operator: this.props.user.id_operator });
    }

    handleChangeDesk(evt) {
        this.setState({ ...this.state, deskripsi: evt });
        if (!this.state.id_operator) this.setState({ ...this.state, id_operator: this.props.user.id_operator });
    }

    onchangeSelect(evt) {
        this.setState({ id_category: evt.value, category_name: evt.label })
        if (!this.state.id_operator) this.setState({ ...this.state, id_operator: this.props.user.id_operator });
    };

    handleSubmit(evt) {
        const form = evt.currentTarget;
        this.setState({ isLoading: true });
        let error = false;
        if (form.checkValidity() === false) {
            this.setState({ isLoading: false });
            //if (!this.state.img) this.setState({ ...this, errMsg: { ...this, img: "Image Required" } })
            if (!this.state.id_category) this.setState({ ...this, errMsg: { ...this, id_category: "Required" } })
            error = true;
            evt.preventDefault();
            evt.stopPropagation();
        }
        //if (!this.state.img) this.setState({ ...this, errMsg: { ...this, img: "Image Required" } })
        if (!this.state.id_category) this.setState({ ...this, errMsg: { ...this, id_category: "Required" } })
        if (!this.state.id_category) {
            error = true;
            this.setState({ isLoading: false });
            evt.preventDefault();
            evt.stopPropagation();
        }

        this.setState({ validated: true })

        if (!error) {
            let err_code = '';
            let _data = new FormData();
            Object.keys(this.initialState).map((key) => {
                _data.append(key, this.state[key]);
                return 1;
            });
            _data.append("id_operator", this.props.user.id_operator);
            ProductService.postData(_data, 'ADD_DATA').then((res) => {
                err_code = res.data.err_code;
                if (err_code === '00') {
                    this.setState({ showSwalSuccess: true })
                } else {
                    console.log(res.data);
                }

            }).catch((error) => {
                evt.preventDefault();
                evt.stopPropagation();
                this.setState({ isLoading: true, validated: false })
            });
        }
        evt.preventDefault();
        evt.stopPropagation();
    }

    closeSwal() {
        this.setState({ showSwalSuccess: false })
        Object.keys(this.initialState).map((key) => {
            this.setState({ [key]: '' })
            this.setState({ isLoading: false });
            return 1;
        });
        this.props.history.push('/products');
    }

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

        let contentSwal = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong>Success</strong>, Data berhasil disimpan</div>' }} />;
        // const withValueCap = (inputObj) => {
        //     const { value } = inputObj;
        //     if (value <= 100) return inputObj;
        // };

        return (

            <div>

                <div className="content-wrapper">
                    {/* Content Header (Page header) */}
                    <div className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1 className="m-0">{this.state.isEdit ? ("Edit Product") : "Add Product"}</h1>
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
                                            <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                                                <div className="card-body my-card-body">
                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="product_name">
                                                            <Form.Label>Product Name</Form.Label>
                                                            <Form.Control
                                                                value={this.state.product_name}
                                                                autoComplete="off"
                                                                onChange={this.handleChange}
                                                                size="sm"
                                                                name="product_name"
                                                                type="text"
                                                                required
                                                                placeholder="Product Name" />
                                                            <Form.Control.Feedback type="invalid">
                                                                <span className="badge badge-danger">Product Name is Required</span>
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                        <Form.Group as={Col} xs={2} controlId="berat">
                                                            <Form.Label>Weight(Gram)</Form.Label>
                                                            <NumberFormat
                                                                name="berat"
                                                                onChange={this.handleChange}
                                                                className="form-control form-control-sm"
                                                                value={this.state.berat}
                                                                thousandSeparator={true}
                                                                decimalScale={2}
                                                                inputMode="numeric"
                                                                required
                                                                autoComplete="off"
                                                                placeholder="Weight(Gram)" />
                                                            <Form.Control.Feedback type="invalid">
                                                                <span className="badge badge-danger">Weight is Required</span>
                                                            </Form.Control.Feedback>
                                                        </Form.Group>

                                                        <Form.Group as={Col} xs={2} controlId="qty">
                                                            <Form.Label>Quantity</Form.Label>
                                                            <NumberFormat
                                                                onChange={this.handleChange}
                                                                name="qty"
                                                                className="form-control form-control-sm"
                                                                value={this.state.qty ? this.state.qty : 0}
                                                                thousandSeparator={true}
                                                                decimalScale={2}
                                                                inputMode="numeric"
                                                                autoComplete="off"
                                                                placeholder="Quantity" />
                                                        </Form.Group>
                                                        <Form.Group as={Col} xs={2} controlId="min_pembelian">
                                                            <Form.Label>Min. Pembelian</Form.Label>
                                                            <NumberFormat
                                                                onChange={this.handleChange}
                                                                name="min_pembelian"
                                                                className="form-control form-control-sm"
                                                                value={this.state.min_pembelian ? this.state.min_pembelian : ''}
                                                                thousandSeparator={true}
                                                                decimalScale={2}
                                                                inputMode="numeric"
                                                                autoComplete="off"
                                                                placeholder="Min. Pembelian" />

                                                        </Form.Group>
                                                    </Form.Row>

                                                    <Form.Row>
                                                        <Form.Group as={Col} xs={3} controlId="category">
                                                            <Form.Label>Category</Form.Label>
                                                            <SelectCategory
                                                                myVal={this.state.id_category ? ({ value: this.state.id_category, label: this.state.category_name }) : ''}
                                                                onChange={this.onchangeSelect}                                                                
                                                            />
                                                            {this.state.errMsg.id_category ? (<span className="text-error badge badge-danger">{this.state.errMsg.id_category}</span>) : ''}
                                                        </Form.Group>
                                                        <Form.Group as={Col} xs={3} controlId="kondisi">
                                                            <Form.Label>Kondisi</Form.Label>
                                                            <Form.Control
                                                                value={this.state.kondisi ? this.state.kondisi : ''}
                                                                onChange={this.handleChange}
                                                                size="sm"
                                                                name="kondisi"
                                                                type="text"
                                                                autoComplete="off"
                                                                placeholder="Kondisi" />
                                                        </Form.Group>
                                                        <Form.Group as={Col} xs={2} controlId="start_date">
                                                            <Form.Label>Start Date</Form.Label>
                                                            <Datetime
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
                                                        </Form.Group>

                                                        <Form.Group as={Col} xs={2} controlId="end_date">
                                                            <Form.Label>End Date</Form.Label>
                                                            <Datetime
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
                                                        </Form.Group>
                                                        <Form.Group as={Col} xs={2} controlId="special_promo">
                                                            <Form.Label>Special Promo</Form.Label>
                                                            <Row>
                                                                <Col xs={{ span: 1, offset: 3 }}>
                                                                    <Form.Check
                                                                        onChange={this.handleChange}
                                                                        checked={this.state.special_promo > 0 ? ("checked") : ""}
                                                                        label={this.state.special_promo > 0 ? ("Yes") : "No"}
                                                                        type="switch"
                                                                        name="special_promo"
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
                                                                required
                                                                value={this.state.short_description ? this.state.short_description : ''}
                                                                onChange={this.handleChange}
                                                                size="sm"
                                                                name="short_description"
                                                                type="text"
                                                                autoComplete="off"
                                                                placeholder="Short Description" />
                                                            <Form.Control.Feedback type="invalid">
                                                                <span className="badge badge-danger">Short Description is Required</span>
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                        <Form.Group as={Col} controlId="video_url">
                                                            <Form.Label>URL Video</Form.Label>
                                                            <Form.Control
                                                                value={this.state.video_url ? this.state.video_url : ''}
                                                                onChange={this.handleChange}
                                                                size="sm"
                                                                name="video_url"
                                                                type="text"
                                                                autoComplete="off"
                                                                placeholder="URL Video" />
                                                        </Form.Group>
                                                        <Form.Group as={Col} controlId="harga_member">
                                                            <Form.Label>Harga Member</Form.Label>
                                                            <NumberFormat
                                                                required
                                                                onChange={this.handleChange}
                                                                name="harga_member"
                                                                className="form-control form-control-sm"
                                                                value={this.state.harga_member ? this.state.harga_member : ''}
                                                                thousandSeparator={true}
                                                                decimalScale={2}
                                                                inputMode="numeric"
                                                                autoComplete="off"
                                                                placeholder="Harga Member" />
                                                        </Form.Group>

                                                        <Form.Group as={Col} controlId="harga_konsumen">
                                                            <Form.Label>Harga Konsumen</Form.Label>
                                                            <NumberFormat
                                                                required
                                                                onChange={this.handleChange}
                                                                name="harga_konsumen"
                                                                className="form-control form-control-sm"
                                                                value={this.state.harga_konsumen ? this.state.harga_konsumen : ''}
                                                                thousandSeparator={true}
                                                                decimalScale={2}
                                                                inputMode="numeric"
                                                                autoComplete="off"
                                                                placeholder="Harga Konsumen" />
                                                        </Form.Group>

                                                    </Form.Row>

                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="deskripsi">
                                                            <Form.Label>Description</Form.Label>
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
                                                            <Form.Label>Image</Form.Label>
                                                            {this.state.errMsg.img ? (<span className="float-right text-error badge badge-danger">{this.state.errMsg.img}</span>) : ''}
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

                                                <div className="card-footer">
                                                    <Link to="/products">
                                                        <Button variant="danger">Cancel</Button>{' '}
                                                    </Link>
                                                    <AppButton
                                                        isLoading={this.state.isLoading}
                                                        type="submit"
                                                        theme="success">
                                                        Simpan
                                                </AppButton>
                                                </div>
                                            </Form>
                                        </div>

                                    )}
                                    {/* /.card */}
                                </div>
                            </div>
                        </div>
                    </section>

                    {this.state.showSwalSuccess ? (<AppSwalSuccess
                        show={this.state.showSwalSuccess}
                        title={contentSwal}
                        type="success"
                        handleClose={this.closeSwal}                >
                    </AppSwalSuccess>) : ''}


                </div>
                <div>

                </div>

            </div>
        )
    }
}

const mapStateToProps = (state) => ({ user: state.auth.currentUser });

export default connect(mapStateToProps, '')(ProductForm);
