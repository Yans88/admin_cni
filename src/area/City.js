import React, { Component, Fragment } from 'react'
import { Breadcrumb, Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import AreaService from './AreaService';
import ReactDatatable from '@ashvin27/react-datatable';
import AppModal from '../components/modal/MyModal';
import { AppSwalSuccess } from '../components/modal/SwalSuccess';

class City extends Component {
    constructor(props) {
        super(props);
        this.iniSelected = {
            id_city: "",
            city_name: "",
            kode_jne: "",
            kode_lp: "",
            id_operator: "",
            id_provinsi: sessionStorage.getItem('idProvCNI'),
        }
        this.state = {
            dtRes: [],
            totalData: 0,
            show: false,
            isLoading: false,
            queryString: {
                page_number: 1,
                per_page: 10,
                sort_order: "ASC",
                sort_column: "city_name",
                keyword: "",
                id_provinsi: sessionStorage.getItem('idProvCNI'),
            },
            selected: this.iniSelected,
            errMsg: this.iniSelected,
            provinsi_name: "",
            actionForm: "",
            showSwalSuccess: false,
            successMsg: "",
            loadTbl: true,
            deleteForm: false,
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSave = this.handleSave.bind(this);

    }
    componentDidMount() {
        sessionStorage.removeItem('idCityCNI');
        this.getData();
        this.setState({ id_operator: this.props.user.id_operator });
    }
    getData = () => {
        this.setState({ loadTbl: true });
        AreaService.postData(this.state.queryString, "GET_CITY")
            .then(response => {
                setTimeout(() => {
                    if (response.data.err_code === "00") {
                        this.setState({
                            ...this.state,
                            dtRes: response.data.data,
                            totalData: response.data.total_data,
                            provinsi_name: response.data.provinsi
                        });
                    }
                    if (response.data.err_code === "04") {
                        this.setState({
                            ...this.state,
                            dtRes: [],
                            totalData: 0
                        });
                    }
                    this.setState({ loadTbl: false });
                }, 400);
            })
            .catch(e => {
                console.log(e);
            });
    };

    handleClose = () => {
        this.setState({ show: false, deleteForm: false });
    };

    closeSwal = () => {
        this.setState({
            ...this.state,
            deleteForm: false,
            showSwalSuccess: false,
            successMsg: ""
        });
        this.getData();
    }

    discardChanges = () => {
        this.setState({
            ...this.state,
            show: true,
            isLoading: false,
            errMsg: {},
            selected: this.iniSelected,
            actionForm: "ADD_CITY"
        });
    }
    editRecord = (record) => {
        this.setState({
            ...this.state,
            show: true,
            isLoading: false,
            errMsg: {},
            actionForm: "ADD_CITY",
            selected: { ...record }
        });
    }

    handleChange(evt) {
        const { name, value } = evt.target;
        this.setState({
            selected: {
                ...this.state.selected,
                [name]: value,
                id_operator: this.props.user.id_operator,
                id_provinsi: sessionStorage.getItem('idProvCNI')
            }
        });
    }

    handleSubmit() {
        var errors = this.state.errMsg;
        this.setState({
            ...this.state,
            isLoading: true,
        });
        errors.city_name = !this.state.selected.city_name ? "Kab/Kota required" : '';
        errors.kode_jne = !this.state.selected.kode_jne ? "Kode JNE required" : '';
        errors.kode_lp = !this.state.selected.kode_lp ? "Kode Lion Parcel required" : '';
        if (!this.state.selected.id_operator) this.setState({ selected: { ...this.state.selected, id_operator: this.props.user.id_operator } });
        this.setState({ errors, isLoading: false })
        this.handleSave();
    }

    validateForm(errors) {
        let valid = true;
        Object.values(errors).forEach(
            (val) => val.length > 0 && (valid = false)
        );
        return valid;
    }

    async handleSave() {
        if (this.validateForm(this.state.errMsg)) {
            let contentSwal = '';
            let err_code = '';

            if (this.state.actionForm === "ADD_CITY") {
                contentSwal = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong style="font-size:24px;">Success</strong>, Data berhasil disimpan</div>' }} />;
            }
            if (this.state.actionForm === "DEL_CITY") {
                contentSwal = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong>Success</strong>, Data berhasil dihapus</div>' }} />;
            }
            console.log(this.state.selected);
            await AreaService.postData(this.state.selected, this.state.actionForm).then((res) => {
                err_code = res.data.err_code;
                this.setState({
                    ...this.state,
                    isLoading: false,
                });
                if (err_code === '00') {
                    this.setState({
                        ...this.state,
                        show: false,
                        deleteForm: false,
                        showSwalSuccess: true,
                        successMsg: contentSwal
                    });
                }
            }).catch((error) => {
                this.setState({
                    ...this.state,
                    deleteForm: false,
                    showSwalSuccess: true,
                    successMsg: error
                });
            });
        } else {
            console.error('Invalid Form')
        }
    }

    tableChangeHandler = (data) => {
        let queryString = this.state.queryString;
        Object.keys(data).map((key) => {
            if (key === "sort_order" && data[key]) {
                queryString.sort_order = data[key].order;
                queryString.sort_column = data[key].column;
            }
            if (key === "page_number") {
                queryString.page_number = data[key];
            }
            if (key === "page_size") {
                queryString.per_page = data[key];
            }
            if (key === "filter_value") {
                queryString.keyword = data[key];
            }
            return true;
        });
        this.getData();
    }

    deleteRecord = (record) => {
        this.setState({
            ...this.state,
            deleteForm: true,
            errMsg: { id_city: '' },
            actionForm: "DEL_CITY",
            selected: { ...record, id_operator: this.props.user.id_operator }
        });
    }
    ListKec = async (record) => {
        await sessionStorage.setItem('idCityCNI', record.id_city);
        this.props.history.push("/kecamatan");
    }

    render() {
        const columns = [
            {
                key: "no",
                text: "No.",
                width: 20,
                align: "center",
                sortable: false,
                cell: (row, index) => <div style={{ textAlign: "center" }}>
                    {((this.state.queryString.page_number - 1) * this.state.queryString.per_page) + index + 1 + '.'}
                </div>,
                row: 0
            },
            {
                key: "city_name",
                text: "Kab/Kota",
                align: "center",
                sortable: true,
            },
            {
                key: "kode_jne",
                text: "Kode JNE",
                align: "center",
                sortable: true,
            },
            {
                key: "kode_lp",
                text: "Kode Lion Parcel",
                align: "center",
                sortable: true,
            },
            {
                key: "action",
                text: "Action",
                width: 240,
                sortable: false,
                align: "center",
                cell: record => {
                    return (
                        <div style={{ textAlign: "center" }}>
                            <Fragment>
                                <button
                                    className="btn btn-info btn-xs"
                                    onClick={(e) => this.ListKec(record)}
                                    style={{ marginRight: '5px' }}>
                                    <i className="fa fa-list"></i> List Kecamatan
                                </button>
                                <button
                                    className="btn btn-xs btn-success"
                                    onClick={() => this.editRecord(record)}
                                    style={{ marginRight: '5px' }}>
                                    <i className="fa fa-edit"></i> Edit
                                </button>
                                <button
                                    onClick={() => this.deleteRecord(record)}
                                    className="btn btn-danger btn-xs">
                                    <i className="fa fa-trash"></i> Delete
                                </button>

                            </Fragment>
                        </div>
                    );
                }
            }
        ];
        const config = {
            key_column: 'id_city',
            page_size: 10,
            length_menu: [10, 20, 50],
            show_filter: true,
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

        const frmUser = <Form id="myForm">
            <Form.Group controlId="city_name">
                <Form.Label>Kab/Kota</Form.Label>
                {this.state.errMsg.city_name ?
                    (<span className="float-right text-error badge badge-danger">{this.state.errMsg.city_name}</span>) : null}
                <Form.Control
                    value={this.state.selected.city_name}
                    name="city_name"
                    size="sm"
                    type="text"
                    placeholder="Kota/Kab"
                    onChange={this.handleChange}
                    autoComplete="off" />
            </Form.Group>
            <Form.Group controlId="kode_jne">
                <Form.Label>Kode JNE</Form.Label>
                {this.state.errMsg.kode_jne ?
                    (<span className="float-right text-error badge badge-danger">{this.state.errMsg.kode_jne}</span>) : null}
                <Form.Control
                    value={this.state.selected.kode_jne}
                    name="kode_jne"
                    size="sm" type="text"
                    placeholder="Kode JNE"
                    onChange={this.handleChange}
                    autoComplete="off" />
            </Form.Group>
            <Form.Group controlId="kode_lp">
                <Form.Label>Kode Lion Parcel</Form.Label>
                {this.state.errMsg.kode_lp ?
                    (<span className="float-right text-error badge badge-danger">{this.state.errMsg.kode_lp}</span>) : null}
                <Form.Control
                    name="kode_lp"
                    value={this.state.selected.kode_lp}
                    size="sm"
                    type="text"
                    placeholder="Kode Lion Parcel"
                    onChange={this.handleChange}
                    autoComplete="off" />
            </Form.Group>
        </Form>;
        const contentDelete = <div dangerouslySetInnerHTML={{ __html: '<div id="caption" style=padding-bottom:20px;">Apakah anda yakin <br/>akan menghapus data ini ?</div>' }} />;

        return (

            <div>
                <div className="content-wrapper">
                    {/* Content Header (Page header) */}
                    <div className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1 className="m-0">Kab/Kota</h1>
                                </div>
                                <div className="col-sm-6">

                                    <Breadcrumb className="float-right">
                                        <Breadcrumb.Item href="/provinsi">Provinsi</Breadcrumb.Item>

                                        <Breadcrumb.Item active>{this.state.provinsi_name}</Breadcrumb.Item>
                                    </Breadcrumb>
                                </div>
                            </div>
                        </div>
                    </div>

                    <section className="content">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    <div className="card shadow-lg">
                                        <div className="card-header">
                                            <Button onClick={this.discardChanges} variant="success"><i className="fa fa-plus"></i> Add</Button>

                                        </div>

                                        <div className="card-body">
                                            {this.state.dtRes ? (<ReactDatatable
                                                config={config}
                                                records={this.state.dtRes}
                                                columns={columns}
                                                dynamic={true}
                                                onChange={this.tableChangeHandler}
                                                total_record={this.state.totalData}
                                                loading={this.state.loadTbl}
                                            />) : (<p>No Data...</p>)}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <AppModal
                        show={this.state.show}
                        size="sm"
                        form={frmUser}
                        handleClose={this.handleClose}
                        backdrop="static"
                        keyboard={false}
                        title="Add/Edit City"
                        titleButton="Save change"
                        themeButton="success"
                        isLoading={this.state.isLoading}
                        formSubmit={this.handleSubmit}
                    ></AppModal>

                    {this.state.showSwalSuccess ? (<AppSwalSuccess
                        show={this.state.showSwalSucces}
                        title={this.state.successMsg}
                        type="success"
                        handleClose={this.closeSwal} />) : ''}
                    <AppModal
                        show={this.state.deleteForm}
                        size="sm"
                        form={contentDelete}
                        handleClose={this.handleClose}
                        backdrop="static"
                        keyboard={false}
                        title="Delete City"
                        titleButton="Delete City"
                        themeButton="danger"
                        isLoading={this.isLoading}
                        formSubmit={this.handleSave}
                    ></AppModal>

                </div>
                <div>

                </div>

            </div>
        )
    }
}
const mapStateToProps = (state) => ({ user: state.auth.currentUser });

export default connect(mapStateToProps, '')(City)