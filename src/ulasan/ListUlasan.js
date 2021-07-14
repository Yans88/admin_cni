import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import ReactDatatable from '@ashvin27/react-datatable';
import TransService from './TransService';
import moment from 'moment';
import "moment/locale/id";
import { Figure, OverlayTrigger, Tooltip } from 'react-bootstrap';
import NoImg from '../assets/noPhoto.jpg'
import { FaTimes } from "react-icons/fa"
import { Link } from 'react-router-dom';
import AppModal from '../components/modal/MyModal';
import { AppSwalSuccess } from '../components/modal/SwalSuccess';

class ListUlasan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dtRes: [],
            totalData: 0,
            show: false,
            isLoading: false,
            showReject: false,
            loadTbl: true,
            id_transaksi: 0,
            id_product: 0,
            id_operator: 0,
            status: 1,
            errMsg: '',
            showSwalSuccess: false,
            queryString: {
                page_number: 1,
                per_page: 10,
                sort_order: "DESC",
                sort_column: "tgl_ulasan",
                keyword: "",
                status: 1,
            },

        }
    }

    componentDidMount() {
        sessionStorage.removeItem('idTransCNIUlasan');
        this.getData();
    }


    getData = () => {
        this.setState({ loadTbl: true, id_operator: this.props.user.id_operator });
        TransService.postData(this.state.queryString, "GET_DATA")
            .then(response => {
                setTimeout(() => {
                    if (response.data.err_code === "00") {
                        this.setState({
                            ...this.state,
                            dtRes: response.data.data,
                            totalData: response.data.total_data
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

    redirect_ulasan = async (record) => {
        if (record) await sessionStorage.setItem('idTransCNIUlasan', record.id_trans);
        this.props.history.push("/detail_ulasan");
    }

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
                    errMsg: <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong>Success</strong>, Data berhasil diupdate</div>' }} />,
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
        const contentProgress = <div dangerouslySetInnerHTML={{ __html: '<div id="caption" style=padding-bottom:20px;">Apakah anda yakin <br/>memproses ulasan ini ?</div>' }} />;

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
                key: "tgl_ulasan",
                text: "Tgl. Ulasan",
                align: "center",
                width: 100,
                sortable: true,
                cell: record => {
                    return (moment(new Date(record.tgl_ulasan)).format('DD-MM-YYYY HH:mm'))
                }
            },
            {
                key: "id_trans",
                text: "Order ID",
                align: "center",
                width: 100,
                sortable: true,
                cell: record => {
                    return (<Fragment>
                        <OverlayTrigger
                            placement="right"
                            overlay={
                                <Tooltip id="tooltip-right">
                                    Detail Ulasan
                            </Tooltip>
                            }
                        >
                            <Link to='/waiting_approve' onClick={() => this.redirect_ulasan(record)}>
                                {record.id_trans}
                            </Link>
                        </OverlayTrigger>
                    </Fragment>)
                }
            },
            {
                key: "ulasan",
                text: "Ulasan",
                align: "center",
                width: 200,
                sortable: false,
            },
            {
                key: "rating",
                text: "Rating",
                align: "center",
                width: 60,
                sortable: true,
                cell: record => {
                    return (<div style={{ textAlign: "center" }}>{record.rating}</div>)
                }
            },
            {
                key: "product_name",
                text: "Photo",
                align: "center",
                sortable: true,
                width: 155,
                cell: record => {
                    return (
                        <div style={{ textAlign: "center" }}>
                            <Figure>
                                <Figure.Image
                                    thumbnail
                                    width={150}
                                    height={120}
                                    alt={record.product_name}
                                    src={record.img_ulasan ? record.img_ulasan : NoImg}
                                />
                                <Figure.Caption>
                                    {record.product_name}
                                </Figure.Caption>
                            </Figure></div>
                    )
                }
            },
            {
                key: "action",
                text: "Action",
                align: "center",
                width: 70,
                sortable: false,
                cell: record => {
                    return (
                        <div style={{ textAlign: "center" }}>
                            {this.props.user.ulasan_upd_status ? (
                                <Fragment>
                                    <button
                                        onClick={e => this.showFormApprove(record)}
                                        className="btn btn-xs btn-success"
                                        style={{ marginBottom: '3px' }}>
                                        <i className="fa fa-check"></i> Approve
                                    </button>
                                    <button
                                        onClick={() => this.showFormReject(record)}
                                        style={{ marginBottom: '3px', width: 70 }}
                                        className="btn btn-danger btn-xs">
                                        <FaTimes /> Reject
                                    </button>
                                </Fragment>) : (
                                <Fragment>
                                    <button
                                        disabled
                                        className="btn btn-xs btn-success"
                                        style={{ marginBottom: '3px' }}>
                                        <i className="fa fa-check"></i> Approve
                                    </button>
                                    <button
                                        disabled
                                        style={{ marginBottom: '3px', width: 70 }}
                                        className="btn btn-danger btn-xs">
                                        <FaTimes /> Reject
                                    </button>
                                </Fragment>
                            )}
                        </div>
                    );
                }
            }
        ];
        const config = {
            key_column: 'unique_key',
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
        return (

            <div>
                <div className="content-wrapper">
                    {/* Content Header (Page header) */}
                    <div className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1 className="m-0">Ulasan</h1>
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
                                            <h1 className="card-title card-title-custom">Waiting Approval</h1>
                                        </div>

                                        <div className="card-body">
                                            {this.state.dtRes ? (<ReactDatatable
                                                className="table table-striped table-bordered"
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


                </div>
                <div>
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

            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.auth.currentUser
});
export default connect(mapStateToProps, '')(ListUlasan);
