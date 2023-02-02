import React, {Component} from 'react';
import {connect} from 'react-redux';
import ReactDatatable from '@ashvin27/react-datatable';
import SimpatikService from './SimpatikService';
import moment from 'moment';
import "moment/locale/id";

class ListSimpatikDiterima extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dtRes: [],
            totalData: 0,
            show: false,
            isLoading: false,
            loadTbl: true,
            queryString: {
                page_number: 1,
                per_page: 10,
                sort_order: "ASC",
                sort_column: "id",
                keyword: "",
                status: 2,
                id_operator: 0,
            },

        }
    }

    componentDidMount() {
        sessionStorage.removeItem('idSimpatikCNI');
        this.getData();
    }

    getData = () => {
        this.setState({loadTbl: true});
        const {queryString} = this.state;
        queryString.id_operator = this.props.user.id_operator;
        SimpatikService.postData(queryString, "GET_DATA")
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
                    this.setState({loadTbl: false});
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

    rowClickedHandler = async (event, data, rowIndex) => {
        await sessionStorage.setItem('idSimpatikCNI', data.id);
        this.props.history.push("/simpatik_detail");
    }

    render() {
        const columns = [
            {
                key: "no",
                text: "No.",
                width: 20,
                align: "center",
                sortable: false,
                cell: (row, index) => <div style={{textAlign: "center"}}>
                    {((this.state.queryString.page_number - 1) * this.state.queryString.per_page) + index + 1 + '.'}
                </div>,
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
                key: "nama",
                text: "Nama",
                align: "center",
                width: 130,
                sortable: true,

            },
            {
                key: "cni_id",
                text: "CNI ID",
                align: "center",
                sortable: true,
            },
            {
                key: "nama_kota_kecelakaan",
                text: "Kota",
                align: "center",
                sortable: true,
            },
            {
                key: "phone",
                text: "Phone",
                align: "center",
                width: 130,
                sortable: true,
            }
        ];
        const config = {
            key_column: 'id',
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
                                    <h1 className="m-0">Simpatik</h1>
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
                                            <h1 className="card-title card-title-custom">Diterima</h1>
                                        </div>

                                        <div className="card-body">
                                            {this.state.dtRes ? (<ReactDatatable
                                                className="table table-striped table-hover table-bordered"
                                                config={config}
                                                records={this.state.dtRes}
                                                columns={columns}
                                                dynamic={true}
                                                onChange={this.tableChangeHandler}
                                                total_record={this.state.totalData}
                                                loading={this.state.loadTbl}
                                                onRowClicked={this.rowClickedHandler}
                                            />) : (<p>No Data...</p>)}
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

const mapStateToProps = (state) => ({
    user: state.auth.currentUser
});
export default connect(mapStateToProps, '')(ListSimpatikDiterima);
