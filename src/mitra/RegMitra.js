import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import { fetchData } from './mitraService';
import ReactDatatable from '@ashvin27/react-datatable';
import moment from 'moment';
import "moment/locale/id";
import NumberFormat from 'react-number-format';

class RegMitra extends Component {
    constructor(props) {
        super(props);
        this.initSelected = {
            id_level: '',
            level_name: '',
            id_operator: '',
        }
        this.state = {
            sort_order: "DESC",
            sort_column: "nama",
            keyword: '',
            page_number: 1,
            is_cms: 1,
            per_page: 10,
            selected: this.initSelected,
            errMsg: this.initSelected,
            loadingForm: false,
        }
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.props.onLoad(this.state);
    }

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





    render() {
        const { data } = this.props;
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
                key: "created_at",
                text: "Tgl. Daftar",
                align: "center",
                sortable: true,
                width: 130,
                cell: record => {
                    return (moment(new Date(record.created_at)).format('DD-MM-YYYY HH:mm'))
                }
            },
            {
                key: "cni_id",
                text: "No.Anggota",
                align: "center",
                sortable: true,
                cell: record => {
                    return (record.cni_id)
                }
            },
            {
                key: "nama",
                text: "Nama Anggota",
                align: "center",
                sortable: true,
                cell: record => {
                    return (record.nama)
                }
            },
            {
                key: "type",
                text: "Rank",
                align: "center",
                sortable: true,
                cell: record => {
                    return (
                        record.type === 1 ? 'Member' : 'Reseller'
                    )
                }
            },
            {
                key: "upline_id",
                text: "Upline",
                align: "center",
                sortable: true,
                cell: record => {
                    return (
                        <Fragment>
                            {record.upline_id} - {record.nama_upline}
                        </Fragment>
                    )
                }
            },
            {
                key: "total_belanja",
                text: "Total Belanja",
                align: "center",
                width: 130,
                sortable: true,
                cell: record => {
                    return (
                        <Fragment>
                            <NumberFormat
                                value={record.total_belanja}
                                thousandSeparator={true}
                                decimalScale={2}
                                displayType={'text'}
                            />
                        </Fragment>
                    )
                }
            },
            {
                key: "status",
                text: "Status",
                align: "center",
                sortable: true,
                cell: record => {
                    return (
                        record.status === 3 ? 'Verify' : 'Waiting verify'
                    )
                }
            },
            {
                key: "sponsor_id",
                text: "Sponsor",
                align: "center",
                sortable: true,
                cell: record => {
                    return (
                        <Fragment>
                            {record.sponsor_id} - {record.nama_sponsor}
                        </Fragment>
                    )
                }
            },
        ];
        const config = {
            key_column: 'id_reg_mitra',
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
                                    <h1 className="m-0">Registrasi Mitra</h1>
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


                </div>
                <div>

                </div>

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.mitra.data || [],
        totalData: state.mitra.totalData,
        isLoading: state.mitra.isLoading,
        user: state.auth.currentUser
    }
}

const mapDispatchToPros = (dispatch) => {
    return {
        onLoad: (queryString) => {
            dispatch(fetchData(queryString));
        }

    }
}

export default connect(mapStateToProps, mapDispatchToPros)(RegMitra);