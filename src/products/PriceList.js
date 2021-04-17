import React, { Component, Fragment } from 'react'

import { Alert, Button, Col, Collapse, Form, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import "moment/locale/id";
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import AppButton from '../components/button/Button';
import AppModal from '../components/modal/MyModal';
import ReactDatatable from '@ashvin27/react-datatable';

import { postData, addData, addForm, addDataSuccess, showConfirmDel, deleteData, clearAddDataError } from './pricelistService';
import { AppSwalSuccess } from '../components/modal/SwalSuccess';
import Cookies from 'universal-cookie';
import NumberFormat from 'react-number-format';

const cookie = new Cookies();

var yesterday = moment().subtract(1, 'day');
var valid_startDate = function (current) {
    return current.isAfter(yesterday);
};

class PriceList extends Component {
    constructor(props) {
        super(props);
        this.initSelected = {
            id_pricelist: "",
            pv: "",
            rv: "",
            harga_member: "",
            hm_non_ppn: "",
            ppn_hm: "",
            harga_konsumen: "",
            hk_non_ppn: "",
            ppn_hk: "",
            status: "",
            id_product: "",
            id_operator: ""
        }
        this.state = {
            validSd: valid_startDate,
            validEd: valid_startDate,
            show: false,
            deleteForm: false,
            dtRes: [],
            loadTbl: false,
            isLoadingSelected: true,
            isLoadingArea: false,
            showSwalSuccess: false,
            loadArea: false,
            showFormAreaa: false,
            sort_order: "ASC",
            sort_column: "id_pricelist",
            start_date: "",
            end_date: "",
            keyword: '',
            page_number: 1,
            per_page: 10,
            totalData: 0,
            productName: '',
            id_product: '',
            selected: this.initSelected,
            errMsg: this.initSelected,
            loadingForm: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
        this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    getData = async () => {
        const selectedId = cookie.get('pricelistIdCNI');
        this.setState({
            ...this.state,
            appsLoading: true,
            loadTbl: true,
            id_product: selectedId,
            selected: { ...this.state.selected, id_product: selectedId }
        });
        let param = {};
        param = this.state;
        param['id_product'] = selectedId;
        postData(param, 'VIEW_PRICELIST')
            .then(response => {
                setTimeout(() => {
                    if (response.data.err_code === "00") {
                        this.setState({
                            ...this.state,
                            loadTbl: false,
                            dtRes: response.data.data,
                            totalData: response.data.total_data,
                            productName: response.data.product_name,
                        });
                    }

                    if (response.data.err_code === "04") {
                        this.setState({
                            ...this.state,
                            loadTbl: false,
                            dtRes: [],
                            productName: response.data.product_name,
                            totalData: response.data.total_data
                        });
                    }
                    this.setState({ ...this.state, appsLoading: false, loadTbl: false });
                }, 200);
            })
            .catch(e => {
                console.log(e);
                this.setState({ ...this.state, appsLoading: false, loadTbl: false });
            });
    }

    handleChangeStartDate(date) {
        if (date) {
            const selectedDate = new Date(date);
            const _date = moment(selectedDate).format('YYYY-MM-DD HH:mm');
            this.setState({
                isLoading: false,
                start_date: _date
            })
        } else {
            this.setState({ start_date: '' })
        }

        if (!this.state.id_operator) this.setState({ selected: { ...this.state.selected, id_operator: this.props.user.id_operator } });
    }

    handleChangeEndDate(date) {
        if (date) {
            const selectedDate = new Date(date);
            const _date = moment(selectedDate).format('YYYY-MM-DD HH:mm');
            this.setState({
                isLoading: false,
                end_date: _date
            })
        } else {
            this.setState({ end_date: '' })
        }
        if (!this.state.id_operator) this.setState({ selected: { ...this.state.selected, id_operator: this.props.user.id_operator } });
    }

    discardChanges = () => {
        this.setState({
            ...this.state,
            show: true,
            isLoading: false,
            start_date: '',
            end_date: '',
            errMsg: {},
            selected: this.initSelected,
        });
        this.props.clearErrProps();
    }

    editRecord = (record) => {
        this.setState({
            ...this.state,
            start_date: record.start_date,
            end_date: record.end_date,
            show: true,
            isLoading: false,
            errMsg: {},
            selected: { ...record }
        });
    }

    closeSwal() {
        this.getData();
        this.setState({
            ...this.state,
            show: false,
            isLoading: false,
            start_date: '',
            end_date: '',
            errMsg: {},
            selected: this.initSelected,
        });
        this.props.closeSwal();
    }

    handleChange(evt) {
        const { name, value } = evt.target;
        this.setState({
            isLoading: false,
            selected: {
                ...this.state.selected,
                [name]: value,
                id_operator: this.props.user.id_operator,
            },
            errMsg: {
                ...this.state.errMsg,
                [name]: ''
            }
        });
    }

    handleSubmit() {
        var errors = this.state.errMsg;
        this.setState({
            ...this.state,
            isLoading: true,
        });
        errors.start_date = !this.state.start_date ? "Start date required" : '';
        errors.end_date = !this.state.end_date ? "End date required" : '';
        errors.harga_member = !this.state.selected.harga_member ? "Required" : '';
        errors.harga_konsumen = !this.state.selected.harga_konsumen ? "Required" : '';
        if (!this.state.selected.id_operator) this.setState({ selected: { ...this.state.selected, id_operator: this.props.user.id_operator } });
        this.setState({ errors })
        let param = {};
        if (this.validateForm(errors)) {
            param = this.state.selected;
            param['id_product'] = this.state.id_product;
            param['start_date'] = this.state.start_date;
            param['end_date'] = this.state.end_date;
            this.props.onAdd(param);
        }
    }

    validateForm(errors) {
        let valid = true;
        Object.values(errors).forEach(
            (val) => val.length > 0 && (valid = false)
        );
        return valid;
    }

    handleClose = () => {
        this.setState({
            show: false,
            start_date: '',
            end_date: '',
            deleteForm: false,
            selected: this.initSelected,
        });
        this.props.showConfirmDel(false);
    };

    deleteRecord = (record) => {
        this.setState({
            selected: { ...record, id_operator: this.props.user.id_operator }
        });
        this.props.showConfirmDel(true);
    }

    handleDelete() {
        this.props.onDelete(this.state.selected);
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
            this.handleChangeEndDate('');
        }
        if (name === "start_date") {
            this.handleChangeStartDate('');
        }
    }

    render() {
        const { errMsg, selected } = this.state;
        const contentDelete = <div dangerouslySetInnerHTML={{ __html: '<div id="caption" style=padding-bottom:20px;">Apakah anda yakin <br/>akan menghapus data ini ?</div>' }} />;
        const columns = [
            {
                key: "no",
                text: "No.",
                width: 20,
                align: "center",
                sortable: false,
                cell: (row, index) => <div style={{ textAlign: "center" }}>{((this.state.page_number - 1) * this.state.per_page) + index + 1 + '.'}</div>,
                row: 0
            },
            {
                key: "start_date",
                text: "Periode",
                align: "center",
                width: 150,
                sortable: true,
                cell: record => {
                    return (
                        <Fragment>
                            {
                                moment(new Date(record.start_date)).format('DD-MM-YYYY HH:mm') + ' sd '
                                + moment(new Date(record.end_date)).format('DD-MM-YYYY HH:mm')
                            }

                        </Fragment>
                    )
                }
            },
            {
                key: "harga_member",
                text: "Harga Member",
                align: "center",
                sortable: true,
                cell: record => {
                    return (<Fragment>
                        <div style={{ textAlign: "right" }}>
                            <NumberFormat
                                value={record.harga_member}
                                thousandSeparator={true}
                                decimalScale={2}
                                displayType={'text'}
                            /></div>
                        Non PPN : <NumberFormat
                            value={record.hm_non_ppn}
                            thousandSeparator={true}
                            decimalScale={2}
                            displayType={'text'}
                        /><br />
                        PPN : <NumberFormat
                            value={record.ppn_hm}
                            thousandSeparator={true}
                            decimalScale={2}
                            displayType={'text'}
                        />
                    </Fragment>)
                }
            },
            {
                key: "harga_konsumen",
                text: "Harga Konsumen",
                align: "center",
                sortable: true,
                cell: record => {
                    return (<Fragment>
                        <div style={{ textAlign: "right" }}>
                            <NumberFormat
                                value={record.harga_konsumen}
                                thousandSeparator={true}
                                decimalScale={2}
                                displayType={'text'}
                            /></div>
                        Non PPN : <NumberFormat
                            value={record.hk_non_ppn}
                            thousandSeparator={true}
                            decimalScale={2}
                            displayType={'text'}
                        /><br />
                        PPN : <NumberFormat
                            value={record.ppn_hk}
                            thousandSeparator={true}
                            decimalScale={2}
                            displayType={'text'}
                        />
                    </Fragment>)
                }
            },
            {
                key: "pv",
                text: "PV",
                align: "center",
                width: 150,
                sortable: true,
                cell: record => {
                    return (<Fragment>
                        <div style={{ textAlign: "right" }}>
                            <NumberFormat
                                value={record.pv}
                                thousandSeparator={true}
                                decimalScale={2}
                                displayType={'text'}
                            /></div>

                    </Fragment>)
                }
            },
            {
                key: "rv",
                text: "RV",
                align: "center",
                width: 150,
                sortable: true,
                cell: record => {
                    return (<Fragment>
                        <div style={{ textAlign: "right" }}>
                            <NumberFormat
                                value={record.rv}
                                thousandSeparator={true}
                                decimalScale={2}
                                displayType={'text'}
                            /></div>

                    </Fragment>)
                }
            },
            {
                key: "action",
                text: "Action",
                width: 75,
                sortable: false,
                align: "center",
                cell: record => {
                    return (
                        <div style={{ textAlign: "center" }}>
                            <Fragment>
                                <button
                                    className="btn btn-xs btn-success"
                                    onClick={() => this.editRecord(record)}
                                    style={{ marginBottom: '5px', width: '58px' }}>
                                    <i className="fa fa-edit"></i> Edit
                                </button>
                                <button
                                    className="btn btn-danger btn-xs"
                                    onClick={() => this.deleteRecord(record)}>
                                    <i className="fa fa-trash"></i> Delete
                                </button>

                            </Fragment>
                        </div>
                    );
                }
            }
        ];
        const config = {
            key_column: 'id_pricelist',
            page_size: 10,
            length_menu: [10, 20, 50],
            show_filter: false,
            show_pagination: true,
            pagination: 'advance',
            button: {
                excel: false,
                print: false
            },
            language: {
                loading_text: "Please be patient while data loads..."
            }
        }

        return (
            <div>

                <div className="content-wrapper">
                    <div className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1 className="m-0">Pricelist</h1>
                                </div>

                            </div>
                        </div>
                    </div>

                    <section className="content">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="card shadow-lg">
                                        <div className="card-header card-header-custom">
                                            <h1 className="card-title card-title-custom">{this.state.productName}</h1>
                                            <div className="tools">
                                                {!this.state.show ? (
                                                    <AppButton
                                                        className="float-right btn-sm"
                                                        onClick={this.discardChanges}
                                                        icon="add"
                                                        theme="info"
                                                    >Add
                                                    </AppButton>
                                                ) : ''}

                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <Collapse in={this.state.show}
                                                style={{
                                                    marginBottom: "15px",
                                                    borderBottom: "1px solid #d2d2d2", paddingBottom: "5px"
                                                }}>
                                                <div id="example-collapse-text">
                                                    {this.props.errorPriority ? (
                                                        <Alert variant="danger" show={true}>Error : {this.props.errorPriority}</Alert>
                                                    ) : ''}

                                                    <Form>
                                                        <Form.Row>
                                                            <Form.Group as={Col} controlId="start_date">
                                                                <Form.Label>Start Date</Form.Label>
                                                                {errMsg.start_date ? (<span className="float-right text-error badge badge-danger">{errMsg.start_date}</span>) : ''}
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
                                                            <Form.Group as={Col} controlId="pv">
                                                                <Form.Label>PV</Form.Label>
                                                                <NumberFormat
                                                                    name="pv"
                                                                    onChange={this.handleChange}
                                                                    className="form-control form-control-sm"
                                                                    value={selected.pv ? selected.pv : ''}
                                                                    thousandSeparator={true}
                                                                    decimalScale={2}
                                                                    inputMode="numeric"
                                                                    required
                                                                    autoComplete="off"
                                                                    placeholder="PV" />

                                                            </Form.Group>

                                                            <Form.Group as={Col} controlId="harga_member">
                                                                <Form.Label>Harga Member</Form.Label>
                                                                {errMsg.harga_member ? (<span className="float-right text-error badge badge-danger">{errMsg.harga_member}</span>) : ''}
                                                                <NumberFormat
                                                                    onChange={this.handleChange}
                                                                    name="harga_member"
                                                                    className="form-control form-control-sm"
                                                                    value={selected.harga_member ? selected.harga_member : ''}
                                                                    thousandSeparator={true}
                                                                    decimalScale={2}
                                                                    inputMode="numeric"
                                                                    autoComplete="off"
                                                                    placeholder="Harga Member" />
                                                            </Form.Group>
                                                            <Form.Group as={Col} controlId="hm_non_ppn">
                                                                <Form.Label>Hrg. Member Non PPN</Form.Label>
                                                                <NumberFormat
                                                                    onChange={this.handleChange}
                                                                    name="hm_non_ppn"
                                                                    className="form-control form-control-sm"
                                                                    value={selected.hm_non_ppn ? selected.hm_non_ppn : ''}
                                                                    thousandSeparator={true}
                                                                    decimalScale={2}
                                                                    inputMode="numeric"
                                                                    autoComplete="off"
                                                                    placeholder="Harga Member Non PPN" />

                                                            </Form.Group>
                                                            <Form.Group as={Col} controlId="ppn_hm">
                                                                <Form.Label>PPN Harga Member</Form.Label>
                                                                <NumberFormat
                                                                    onChange={this.handleChange}
                                                                    name="ppn_hm"
                                                                    className="form-control form-control-sm"
                                                                    value={selected.ppn_hm ? selected.ppn_hm : ''}
                                                                    thousandSeparator={true}
                                                                    decimalScale={2}
                                                                    inputMode="numeric"
                                                                    autoComplete="off"
                                                                    placeholder="PPN Harga Member" />

                                                            </Form.Group>
                                                        </Form.Row>
                                                        <Form.Row>
                                                            <Form.Group as={Col} controlId="start_date">
                                                                <Form.Label>End Date</Form.Label>
                                                                {errMsg.end_date ? (<span className="float-right text-error badge badge-danger">{errMsg.end_date}</span>) : ''}
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
                                                            <Form.Group as={Col} controlId="rv">
                                                                <Form.Label>RV</Form.Label>
                                                                <NumberFormat
                                                                    name="rv"
                                                                    onChange={this.handleChange}
                                                                    className="form-control form-control-sm"
                                                                    value={selected.rv ? selected.rv : ''}
                                                                    thousandSeparator={true}
                                                                    decimalScale={2}
                                                                    inputMode="numeric"
                                                                    required
                                                                    autoComplete="off"
                                                                    placeholder="RV" />

                                                            </Form.Group>

                                                            <Form.Group as={Col} controlId="harga_konsumen">
                                                                <Form.Label>Harga Konsumen</Form.Label>
                                                                {errMsg.harga_konsumen ? (<span className="float-right text-error badge badge-danger">{errMsg.harga_konsumen}</span>) : ''}
                                                                <NumberFormat
                                                                    onChange={this.handleChange}
                                                                    name="harga_konsumen"
                                                                    className="form-control form-control-sm"
                                                                    value={selected.harga_konsumen ? selected.harga_konsumen : ''}
                                                                    thousandSeparator={true}
                                                                    decimalScale={2}
                                                                    inputMode="numeric"
                                                                    autoComplete="off"
                                                                    placeholder="Harga Konsumen" />
                                                            </Form.Group>
                                                            <Form.Group as={Col} controlId="hk_non_ppn">
                                                                <Form.Label>Hrg. Konsumen Non PPN</Form.Label>
                                                                <NumberFormat
                                                                    onChange={this.handleChange}
                                                                    name="hk_non_ppn"
                                                                    className="form-control form-control-sm"
                                                                    value={selected.hk_non_ppn ? selected.hk_non_ppn : ''}
                                                                    thousandSeparator={true}
                                                                    decimalScale={2}
                                                                    inputMode="numeric"
                                                                    autoComplete="off"
                                                                    placeholder="Harga Konsumen Non PPN" />

                                                            </Form.Group>
                                                            <Form.Group as={Col} controlId="ppn_hk">
                                                                <Form.Label>PPN Harga Konsumen</Form.Label>
                                                                <NumberFormat
                                                                    onChange={this.handleChange}
                                                                    name="ppn_hk"
                                                                    className="form-control form-control-sm"
                                                                    value={selected.ppn_hk ? selected.ppn_hk : ''}
                                                                    thousandSeparator={true}
                                                                    decimalScale={2}
                                                                    inputMode="numeric"
                                                                    autoComplete="off"
                                                                    placeholder="PPN Harga Konsumen" />

                                                            </Form.Group>
                                                        </Form.Row>
                                                    </Form>
                                                    <Button
                                                        onClick={this.handleClose.bind(this)}
                                                        style={{ marginRight: 5 }}
                                                        variant="danger">Close</Button>
                                                    <AppButton
                                                        onClick={this.handleSubmit.bind(this)}
                                                        isLoading={this.state.isLoading}
                                                        type="submit"
                                                        theme="success">
                                                        Simpan
                                                </AppButton>
                                                </div>

                                            </Collapse>
                                            {this.state.dtRes ? (<ReactDatatable
                                                config={config}
                                                records={this.state.dtRes}
                                                columns={columns}
                                                dynamic={true}
                                                onChange={this.tableChangeHandler}
                                                total_record={this.state.totalData}
                                                loading={this.state.loadTbl}
                                            />) : (<p>Loading...</p>)}
                                        </div>

                                    </div>
                                </div>


                            </div>
                        </div>
                    </section>
                    <AppModal
                        show={false}
                        size="sm"
                        form=""
                        handleClose={this.handleClose.bind(this)}
                        backdrop="static"
                        keyboard={false}
                        title="Add/Edit"
                        titleButton="Save change"
                        themeButton="success"
                        isLoading={this.state.isLoading}
                        formSubmit={this.handleSubmit}
                    ></AppModal>

                    {this.props.showFormSuccess ? (<AppSwalSuccess
                        show={this.props.showFormSuccess}
                        title={this.props.contentMsg}
                        type="success"
                        handleClose={this.closeSwal.bind(this)} />) : ''}

                    <AppModal
                        show={this.props.showFormDelete}
                        size="sm"
                        form={contentDelete}
                        handleClose={this.handleClose.bind(this)}
                        backdrop="static"
                        keyboard={false}
                        title="Delete"
                        titleButton="Delete"
                        themeButton="danger"
                        isLoading={this.isLoading}
                        formSubmit={this.handleDelete.bind(this)}
                    ></AppModal>

                </div>
                <div>

                </div>

            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    user: state.auth.currentUser,
    showFormSuccess: state.pricelist.showFormSuccess,
    showFormDelete: state.pricelist.showFormDelete,
    errorPriority: state.pricelist.errorPriority || null,
    contentMsg: state.pricelist.contentMsg
});

const mapDispatchToPros = (dispatch) => {
    return {
        onAdd: (data) => {
            dispatch(addData(data));
        },
        onDelete: (data) => {
            dispatch(deleteData(data));
        },
        showForm: (data) => {
            dispatch(addForm(data));
        },
        showConfirmDel: (data) => {
            dispatch(showConfirmDel(data));
        },
        closeSwal: () => {
            const _data = {};
            _data['showFormSuccess'] = false;
            _data['contentMsg'] = null;
            dispatch(addDataSuccess(_data));
        },
        clearErrProps: () => {
            dispatch(clearAddDataError());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToPros)(PriceList)
