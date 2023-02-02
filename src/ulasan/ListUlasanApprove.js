import React, {Component} from 'react';
import {connect} from 'react-redux';
import ReactDatatable from '@ashvin27/react-datatable';
import TransService from './TransService';
import moment from 'moment';
import "moment/locale/id";
import {Figure} from 'react-bootstrap';
import NoImg from '../assets/noPhoto.jpg'


class ListUlasanApprove extends Component {
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
                sort_order: "DESC",
                sort_column: "tgl_ulasan",
                keyword: "",
                status: 2,
            },

        }
    }

    componentDidMount() {
        sessionStorage.removeItem('idTransCNIUlasan');
        this.getData();
    }


    getData = () => {
        this.setState({loadTbl: true});
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

    redirect_ulasan = async (record) => {
        if (record) await sessionStorage.setItem('idTransCNIUlasan', record.id_trans);
        this.props.history.push("/detail_ulasan");
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
                    return (<div style={{textAlign: "center"}}>{record.rating}</div>)
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
                        <div style={{textAlign: "center"}}>
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
                        <div style={{textAlign: "center"}}>
                            <button
                                className="btn btn-xs btn-success"
                                onClick={() => this.redirect_ulasan(record)}
                                style={{marginBottom: '3px', width: 80}}>
                                Approved {moment(new Date(record.tgl_status_ulasan)).format('DD-MM-YYYY')}
                                <br/> {moment(new Date(record.tgl_status_ulasan)).format('HH:mm')}
                            </button>
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
                                            <h1 className="card-title card-title-custom">Approved</h1>
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

                </div>

            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.auth.currentUser
});
export default connect(mapStateToProps, '')(ListUlasanApprove);
