import React, { Component } from 'react'
import { connect } from 'react-redux';
import { fetchData } from './blastService';
import { Button } from 'react-bootstrap';
import ReactDatatable from '@ashvin27/react-datatable';
import moment from 'moment';
import "moment/locale/id";
import { Link } from 'react-router-dom';

class BlastNotif extends Component {
    constructor(props) {
        super(props);
        this.initSelected = {
            id_level: '',
            level_name: '',
            id_operator: '',
        }
        this.state = {
            sort_order: "DESC",
            sort_column: "id_blast",
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

    discardChanges = () => {
        this.setState({ errMsg: {}, selected: this.initSelected, loadingForm: false });
        if (!this.state.selected.id_operator) this.setState({ selected: { ...this.state.selected, id_operator: this.props.user.id_operator } });
        this.props.showForm(true);
    }

    rowClickedHandler = async (event, data, rowIndex) => {
        await sessionStorage.setItem('idBlastCNI', data.id_blast);
        this.props.history.push("/blast_detail");
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
                text: "Date",
                align: "center",
                sortable: true,
                width: 130,
                cell: record => {
                    return (moment(new Date(record.created_at)).format('DD-MM-YYYY HH:mm'))
                }
            },
            {
                key: "kode_produk",
                text: "Product",
                align: "center",
                sortable: true,
                width: 250,
                cell: record => {
                    return (record.product_name)
                }
            },
            {
                key: "content",
                text: "Content",
                align: "center",
                sortable: false,
            },
            {
                key: "tujuan",
                text: "Tujuan",
                align: "center",
                width: 130,
                sortable: true,
            }

        ];
        const config = {
            key_column: 'id_blast',
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
                                    <h1 className="m-0">Blast Notification</h1>
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
                                            <Link to="/add_blast"><Button variant="success"><i className="fa fa-plus"></i> Add</Button>
                                            </Link>
                                        </div>

                                        <div className="card-body">
                                            {data ? (
                                                <ReactDatatable
                                                    className="table table-striped table-hover table-bordered"
                                                    config={config}
                                                    records={data}
                                                    columns={columns}
                                                    dynamic={true}
                                                    onChange={this.tableChangeHandler}
                                                    loading={this.props.isLoading}
                                                    total_record={this.props.totalData}
                                                    onRowClicked={this.rowClickedHandler}
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
        data: state.blast.data || [],
        isLoading: state.blast.isLoading,
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

export default connect(mapStateToProps, mapDispatchToPros)(BlastNotif);