import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import { fetchData, showConfirmDel, deleteData, addDataSuccess, showConfirmPublish, publishData } from './voucherService';
import { Figure, Dropdown, Badge } from 'react-bootstrap';
import AppModal from '../components/modal/MyModal';
import { AppSwalSuccess } from '../components/modal/SwalSuccess';
import ReactDatatable from '@ashvin27/react-datatable';
import moment from 'moment';
import "moment/locale/id";
import NumberFormat from 'react-number-format';
import { BsCapslockFill } from "react-icons/bs"
import { ImSpellCheck } from "react-icons/im";

class Voucher extends Component {
    constructor(props) {
        super(props);
        this.initSelected = {
            id_news: '',
            title: '',
            filename: '',
            path_file: '',
            id_operator: '',
            img: '',
            imgUpload: ''
        }
        this.state = {
            sort_order: "ASC",
            sort_column: "title",
            keyword: '',
            page_number: 1,
            is_cms: 1,
            per_page: 10,
            errMsg: this.initSelected,
            loadingForm: false,
        }
        this.handleChange = this.handleChange.bind(this);
    }


    componentDidMount() {
        sessionStorage.removeItem('idVoucherCNI');
        this.props.onLoad(this.state);
    }

    deleteRecord = (record) => {
        this.setState({
            selected: { ...record, id_operator: this.props.user.id_operator }
        });
        this.props.showConfirmDel(true);
    }

    publishRecord = (record) => {
        this.setState({
            selected: { ...record, id_operator: this.props.user.id_operator }
        });
        this.props.showConfirmPublish(true);
    }

    handleClose = () => {
        this.setState({
            errMsg: {},
            loadingForm: false
        });

        this.props.showConfirmDel(false);
        this.props.showConfirmPublish(false);
    };

    tableChangeHandler = (data) => {
        let queryString = this.state;
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
        this.props.onLoad(this.state);
    }

    handleChange(event) {
        const { name, value } = event.target
        var val = value;
        this.props.clearErrProps();
        if (event.target.name === "path_file") {
            val = event.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(val);
            reader.onloadend = () => {
                this.setState({ loadingForm: false, selected: { ...this.state.selected, path_file: val } });
            };
        }
        if (event.target.name === "img") {
            val = event.target.files[0];
            this.setState({ selected: { ...this.state.selected, imgUpload: "", img: "" } });
            if (!val) return;
            if (!val.name.match(/\.(jpg|jpeg|png)$/)) {
                this.setState({ loadingForm: true, errMsg: { ...this.state.errMsg, img: "Please select valid image(.jpg .jpeg .png)" } });

                //setLoading(true);
                return;
            }
            if (val.size > 2099200) {
                this.setState({ loadingForm: true, errMsg: { ...this.state.errMsg, img: "File size over 2MB" } });

                //setLoading(true);
                return;
            }
            let reader = new FileReader();
            reader.readAsDataURL(val);
            reader.onloadend = () => {
                this.setState({ loadingForm: false, selected: { ...this.state.selected, imgUpload: reader.result, img: val } });
            };
        }

        this.setState({
            loadingForm: false,
            selected: {
                ...this.state.selected,
                [name]: val
            },
            errMsg: {
                ...this.state.errMsg,
                [name]: ''
            }
        });
        if (!this.state.selected.id_operator) this.setState({ selected: { ...this.state.selected, id_operator: this.props.user.id_operator } });
    }

    discardChanges = () => {
        this.setState({ errMsg: {}, selected: this.initSelected, loadingForm: false });
        if (!this.state.selected.id_operator) this.setState({ selected: { ...this.state.selected, id_operator: this.props.user.id_operator } });
        this.props.showForm(true);
    }

    handleSubmit() {
        var errors = this.state.errMsg;
        this.setState({
            ...this.state,
            loadingForm: true,
        });
        errors.title = !this.state.selected.title ? "Title required" : '';
        errors.path_file = !this.state.selected.path_file ? "File required" : '';
        errors.img = this.state.selected.img.size > 2099200 ? "File size over 2MB" : '';

        if (!this.state.selected.id_operator) this.setState({ selected: { ...this.state.selected, id_operator: this.props.user.id_operator } });
        this.setState({ errors });
        if (this.validateForm(this.state.errMsg)) {
            this.props.onAdd(this.state.selected);
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

    handleDelete() {
        this.props.onDelete(this.state.selected)
    }

    handlePublish() {
        this.props.onPublish(this.state.selected)
    }

    redirect_voucher = async (tipe, record) => {
        let url = '';
        if (record) await sessionStorage.setItem('idVoucherCNI', record.id_voucher);
        if (tipe === 1) url = 'free_ongkir';
        if (tipe === 2) url = 'diskon_harga';
        if (tipe === 3) url = 'bonus_produk';
        if (tipe === 4) url = 'detail_fo';
        console.log(url);
        //if (tipe === 1) url = 'free_ongkir';
        this.props.history.push("/" + url);
    }

    render() {
        const { data, user } = this.props;
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
                key: "title",
                text: "Title",
                align: "center",
                sortable: true,
                cell: record => {
                    return (
                        <Fragment>
                            {record.title}<br />
                            {record.tipe !== 3 ? ('Minimal Pembelian :') : ''}
                            {record.tipe !== 3 ? (<NumberFormat
                                value={record.min_pembelian}
                                thousandSeparator={true}
                                decimalScale={2}
                                displayType={'text'}
                            />) : ''}
                            {record.tipe === 3 ? ('Produk Utama : ') : ''}
                            {record.tipe === 3 ? (record.produk_utama_name) : ''}
							<br/>
							{record.new_konsumen === 1 && (<Badge variant="primary">New Konsumen</Badge>)}
                        </Fragment>
                    )
                }
            },
            {
                key: "start_date",
                text: "Periode",
                align: "center",
                sortable: false,
                width: 120,
                cell: record => {
                    return (<Fragment>
                        {moment(new Date(record.start_date)).format('DD-MM-YYYY')} -<br /> {moment(new Date(record.end_date)).format('DD-MM-YYYY')}
                    </Fragment>)
                }
            },
            {
                key: "potongan",
                text: "Info Voucher",
                align: "center",
                sortable: true,
                width: 130,
                cell: record => {
                    return (<Fragment>
                        {record.tipe === 1 || record.tipe === 2 ? (<NumberFormat
                            value={record.potongan}
                            thousandSeparator={true}
                            decimalScale={2}
                            displayType={'text'}
                        />) : ''}
                        {record.satuan_potongan === 2 ? ('%') : ''}
                        {record.tipe === 2 && record.max_potongan > 0 ? (' - ') : ''}
                        {record.tipe === 2 && record.max_potongan > 0 ? (
                            <NumberFormat
                                value={record.max_potongan}
                                thousandSeparator={true}
                                decimalScale={2}
                                displayType={'text'}
                            />) : ''}
                        {record.tipe === 3 ? (record.produk_bonus_name) : ''}
                        <br />

                        {record.tipe === 1 && <Badge variant="success">Free Ongkir</Badge>}
                        {record.tipe === 2 && <Badge variant="info">Potongan/Diskon</Badge>}
                        {record.tipe === 3 && <Badge variant="warning">Bonus Produk</Badge>}
                        
                    </Fragment>)
                }
            },
            {
                key: "kuota",
                text: "Kuota",
                align: "center",
                sortable: true,
                width: 90,
                cell: record => {
                    return (<Fragment>
                        {record.is_limited > 0 ? (
                            <NumberFormat
                                value={record.kuota}
                                thousandSeparator={true}
                                decimalScale={2}
                                displayType={'text'}
                            />
                        ) : ('~')}
                    </Fragment>)
                }
            },
            {
                key: "img",
                text: "Image",
                align: "center",
                width: 180,
                sortable: false,
                cell: record => {
                    return (
                        <div style={{ textAlign: "center" }}>
                            <Figure>
                                <Figure.Image
                                    thumbnail
                                    width={150}
                                    height={120}
                                    alt={record.title}
                                    src={record.img}
                                />
                                <Figure.Caption>
                                    {record.kode_voucher}
                                </Figure.Caption>
                            </Figure></div>
                    )
                }
            },
            {
                key: "action",
                text: "Action",
                width: 90,
                align: "center",
                sortable: false,
                cell: record => {
                    return (
                        <div style={{ textAlign: "center" }}>

                            {!record.is_publish ? (
                                <Fragment>
                                    {record.produk_tertentu || record.user_tertentu ? (
                                        <button
                                            className="btn btn-xs btn-primary"
                                            onClick={() => this.redirect_voucher(4, record)}
                                            style={{ marginBottom: '3px', width: 80 }}>
                                            <ImSpellCheck /> Assign
                                        </button>) : ''}

                                    <button
                                        className="btn btn-xs btn-info"
                                        onClick={() => this.publishRecord(record)}
                                        style={{ marginBottom: '3px', width: 80 }}>
                                        <BsCapslockFill /> Publish
                                    </button>
                                    {this.props.user.vouchers_edit ? (<button
                                        className="btn btn-xs btn-success"
                                        onClick={() => this.redirect_voucher(record.tipe, record)}
                                        style={{ marginBottom: '3px', width: 80 }}>
                                        <i className="fa fa-edit"></i> Edit
                                    </button>) : (<button
                                        className="btn btn-xs btn-success"
                                        disabled
                                        style={{ marginBottom: '3px', width: 80 }}>
                                        <i className="fa fa-edit"></i> Edit
                                    </button>) }
                                    <br />
                                    {this.props.user.vouchers_del ? (<button
                                        style={{ width: 80 }}
                                        className="btn btn-danger btn-xs"
                                        onClick={() => this.deleteRecord(record)}>
                                        <i className="fa fa-trash"></i> Delete
                                    </button>) : (<button
                                        style={{ width: 80 }}
                                        className="btn btn-danger btn-xs"
                                        disabled>
                                        <i className="fa fa-trash"></i> Delete
                                    </button>)}
                                    
                                </Fragment>
                            ) : (
                                <Fragment>
                                <button
                                    className="btn btn-xs btn-primary"
                                    onClick={() => this.redirect_voucher(4, record)}
                                    style={{ marginBottom: '3px', width: 80 }}>
                                    Published {moment(new Date(record.publish_date)).format('DD-MM-YYYY')} <br /> {moment(new Date(record.publish_date)).format('HH:mm')}
                                </button>
                                <br />
                                    {this.props.user.vouchers_del ? (<button
                                        style={{ width: 80 }}
                                        className="btn btn-danger btn-xs"
                                        onClick={() => this.deleteRecord(record)}>
                                        <i className="fa fa-trash"></i> Delete
                                    </button>) : (<button
                                        style={{ width: 80 }}
                                        className="btn btn-danger btn-xs"
                                        disabled>
                                        <i className="fa fa-trash"></i> Delete
                                    </button>)}
                                </Fragment>
                            )}


                        </div>
                    );
                }
            }
        ];
        const config = {
            key_column: 'id_voucher',
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


        const contentDelete = <div dangerouslySetInnerHTML={{ __html: '<div id="caption" style=padding-bottom:20px;">Apakah anda yakin <br/>akan menghapus data ini ?</div>' }} />;
        const contentPublish = <div dangerouslySetInnerHTML={{ __html: '<div id="caption" style=padding-bottom:20px;">Apakah anda akan <br/>mempublish voucher ini ?</div>' }} />;

        return (

            <div>
                <div className="content-wrapper">
                    {/* Content Header (Page header) */}
                    <div className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1 className="m-0">Vouchers</h1>
                                </div>{/* /.col */}

                            </div>{/* /.row */}
                        </div>{/* /.container-fluid */}
                    </div>
                    {/* /.content-header */}
                    {/* Main content */}
                    <section className="content">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    {/* card start */}
                                    <div className="card card-success shadow-lg" style={{ "minHeight": "470px" }}>
                                        <div className="card-header">
                                            <Dropdown>
                                                {user.vouchers_add ? (
                                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                                        Add Voucher
                                                    </Dropdown.Toggle>
                                                ) : (<Dropdown.Toggle variant="success" id="dropdown-basic" disabled>
                                                    Add Voucher
                                                </Dropdown.Toggle>)}

                                                <Dropdown.Menu className="my-dropdown-menu">
                                                    <Dropdown.Item as="button" onClick={() => this.redirect_voucher(1, null)}>Free Ongkir</Dropdown.Item>
                                                    <Dropdown.Item as="button" onClick={() => this.redirect_voucher(2, null)}>Potongan/Diskon Harga</Dropdown.Item>
                                                    <Dropdown.Item as="button" onClick={() => this.redirect_voucher(3, null)}>Bonus Produk</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>

                                        <div className="card-body">
                                            {data ? (
                                                <ReactDatatable
                                                    config={config}
                                                    records={data}
                                                    columns={columns}
                                                    dynamic={true}
                                                    onChange={this.tableChangeHandler}
                                                    loading={this.props.isLoading}
                                                    total_record={this.props.totalData}
                                                />
                                            ) : (<p>No Data ...</p>)}

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {this.props.showFormSuccess ? (<AppSwalSuccess
                        show={this.props.showFormSuccess}
                        title={this.props.contentMsg}
                        type={this.props.tipeSWAL}
                        handleClose={this.props.closeSwal}
                    >
                    </AppSwalSuccess>) : ''}
                    <AppModal
                        show={this.props.showFormDelete}
                        size="sm"
                        form={contentDelete}
                        handleClose={this.handleClose}
                        backdrop="static"
                        keyboard={false}
                        title="Delete Voucher"
                        titleButton="Delete Voucher"
                        themeButton="danger"
                        isLoading={this.props.isAddLoading}
                        formSubmit={this.handleDelete.bind(this)}
                    ></AppModal>

                    <AppModal
                        show={this.props.showFormPublish}
                        size="sm"
                        form={contentPublish}
                        handleClose={this.handleClose}
                        backdrop="static"
                        keyboard={false}
                        title="Publish Voucher"
                        titleButton="Publish"
                        themeButton="success"
                        isLoading={this.props.isAddLoading}
                        formSubmit={this.handlePublish.bind(this)}
                    ></AppModal>

                </div>
                <div>

                </div>

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.voucher.data || [],
        isLoading: state.voucher.isLoading,
        error: state.voucher.error || null,
        totalData: state.voucher.totalData || 0,
        contentMsg: state.voucher.contentMsg,
        showFormSuccess: state.voucher.showFormSuccess,
        showFormDelete: state.voucher.showFormDelete,
        showFormPublish: state.voucher.showFormPublish,
        tipeSWAL: state.voucher.tipeSWAL,
        user: state.auth.currentUser
    }
}

const mapDispatchToPros = (dispatch) => {
    return {
        onLoad: (queryString) => {
            dispatch(fetchData(queryString));
        },

        onDelete: (data) => {
            dispatch(deleteData(data));
        },
        onPublish: (data) => {
            dispatch(publishData(data));
        },
        showConfirmDel: (data) => {
            dispatch(showConfirmDel(data));
        },
        showConfirmPublish: (data) => {
            dispatch(showConfirmPublish(data));
        },
        closeSwal: () => {
            const _data = {};
            _data['showFormSuccess'] = false;
            _data['contentMsg'] = null;
            dispatch(addDataSuccess(_data));
            const queryString = {
                sort_order: "ASC",
                sort_column: "title",
                per_page: 10,
                is_cms: 1
            }
            dispatch(fetchData(queryString));
        }

    }
}

export default connect(mapStateToProps, mapDispatchToPros)(Voucher);