import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux';
import {fetchDataLogistik, fetchExportLogistik} from './reportService';
import {Button, Col, Form} from 'react-bootstrap';
import ReactDatatable from '@ashvin27/react-datatable';
import moment from 'moment';
import "moment/locale/id";
import NumberFormat from 'react-number-format';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import AppButton from '../components/button/Button';
import ReactExport from 'react-data-export';

var yesterday = moment();
var valid_startDate = function (current) {
    return current.isBefore(yesterday);
};

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

class Logistik extends Component {
    constructor(props) {
        super(props);
        this.initSelected = {
            end_date: '',
            start_date: '',
            per_page: 10,
            id_operator: '',
            id_transaksi: '',
            cnote_no: '',
            status: -1,
        }
        this.state = {
            validSd: valid_startDate,
            validEd: valid_startDate,
            sort_order: "ASC",
            sort_column: "id_transaksi",
            keyword: '',
            page_number: 1,
            is_cms: 1,
            per_page: 10,
            status: -1,
            id_transaksi: '',
            cnote: '',
            selected: this.initSelected,
            errMsg: this.initSelected,
            loadingForm: false,

            end_date: '',
            start_date: '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
        this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
    }

    componentDidMount() {
        this.props.onLoad(this.state);
        this.props.onDownload(this.state);
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
        const {name, value} = event.target
        var val = value;
        this.setState({
            loadingForm: false,
            ...this.state,
            [name]: val,
            errMsg: {
                ...this.state.errMsg,
                [name]: ''
            }
        });
        if (!this.state.selected.id_operator) this.setState({
            selected: {
                ...this.state.selected,
                id_operator: this.props.user.id_operator
            }
        });
    }

    handleChangeEndDate(date) {
        this.setState({page_number: 1})
        if (date) {
            const selectedDate = new Date(date);
            const _date = moment(selectedDate).format('YYYY-MM-DD');
            this.setState({end_date: _date})
        } else {
            this.setState({end_date: ''})
        }
        if (!this.state.id_operator) this.setState({id_operator: this.props.user.id_operator});
    }

    handleChangeStartDate(date) {
        this.setState({page_number: 1})
        if (date) {
            const selectedDate = new Date(date);
            const _date = moment(selectedDate).format('YYYY-MM-DD');
            this.setState({start_date: _date})
        } else {
            this.setState({start_date: ''})
        }
        if (!this.state.id_operator) this.setState({id_operator: this.props.user.id_operator});
    }

    handleSubmit() {
        this.props.onLoad(this.state);
        this.props.onDownload(this.state);
    }

    handleReset() {
        this.handleChangeEndDate('');
        this.handleChangeStartDate('');
        this.setState({id_transaksi: '', cnote: ''})
        this.props.onLoad(this.initSelected);
        this.props.onDownload(this.initSelected);
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
        const {data, data_report} = this.props;

        const multiDataSet = [
            {
                columns: [
                    {
                        title: "", width: {wpx: 20}
                    },

                    {
                        title: "No. Order", width: {wpx: 100},
                        style: {
                            border: {
                                top: {style: "thin", color: "FFFFAA00"},
                                bottom: {style: "thin", color: "FFFFAA00"},
                                left: {style: "thin", color: "FFFFAA00"},
                                right: {style: "thin", color: "FFFFAA00"}
                            },
                            fill: {patternType: "solid", fgColor: {rgb: "FFFFFF00"}},
                            font: {bold: true}
                        }

                    },

                    {
                        title: "Tgl. Order", width: {wpx: 100},
                        style: {
                            border: {
                                top: {style: "thin", color: "FFFFAA00"},
                                bottom: {style: "thin", color: "FFFFAA00"},
                                left: {style: "thin", color: "FFFFAA00"},
                                right: {style: "thin", color: "FFFFAA00"}
                            },
                            fill: {patternType: "solid", fgColor: {rgb: "FFFFFF00"}},
                            font: {bold: true}
                        }
                    },
                    {
                        title: "Tipe User", width: {wpx: 120},
                        style: {
                            border: {
                                top: {style: "thin", color: "FFFFAA00"},
                                bottom: {style: "thin", color: "FFFFAA00"},
                                left: {style: "thin", color: "FFFFAA00"},
                                right: {style: "thin", color: "FFFFAA00"}
                            },
                            fill: {patternType: "solid", fgColor: {rgb: "FFFFFF00"}},
                            font: {bold: true}
                        }
                    },
                    {
                        title: "Nama Pembeli", width: {wpx: 150},
                        style: {
                            border: {
                                top: {style: "thin", color: "FFFFAA00"},
                                bottom: {style: "thin", color: "FFFFAA00"},
                                left: {style: "thin", color: "FFFFAA00"},
                                right: {style: "thin", color: "FFFFAA00"}
                            },
                            fill: {patternType: "solid", fgColor: {rgb: "FFFFFF00"}},
                            font: {bold: true}
                        }
                    },
                    {
                        title: "Status Order", width: {wpx: 150},
                        style: {
                            border: {
                                top: {style: "thin", color: "FFFFAA00"},
                                bottom: {style: "thin", color: "FFFFAA00"},
                                left: {style: "thin", color: "FFFFAA00"},
                                right: {style: "thin", color: "FFFFAA00"}
                            },
                            fill: {patternType: "solid", fgColor: {rgb: "FFFFFF00"}},
                            font: {bold: true}
                        }
                    },
                    {
                        title: "Total Order", width: {wpx: 120},
                        style: {
                            border: {
                                top: {style: "thin", color: "FFFFAA00"},
                                bottom: {style: "thin", color: "FFFFAA00"},
                                left: {style: "thin", color: "FFFFAA00"},
                                right: {style: "thin", color: "FFFFAA00"}
                            },
                            fill: {patternType: "solid", fgColor: {rgb: "FFFFFF00"}},
                            font: {bold: true}
                        }
                    },
                    {
                        title: "Total Ongkir", width: {wpx: 100},
                        style: {
                            border: {
                                top: {style: "thin", color: "FFFFAA00"},
                                bottom: {style: "thin", color: "FFFFAA00"},
                                left: {style: "thin", color: "FFFFAA00"},
                                right: {style: "thin", color: "FFFFAA00"}
                            },
                            fill: {patternType: "solid", fgColor: {rgb: "FFFFFF00"}},
                            font: {bold: true}
                        }
                    },
                    {
                        title: "Ekspedisi", width: {wpx: 80},
                        style: {
                            border: {
                                top: {style: "thin", color: "FFFFAA00"},
                                bottom: {style: "thin", color: "FFFFAA00"},
                                left: {style: "thin", color: "FFFFAA00"},
                                right: {style: "thin", color: "FFFFAA00"}
                            },
                            fill: {patternType: "solid", fgColor: {rgb: "FFFFFF00"}},
                            font: {bold: true}
                        }
                    },
                    {
                        title: "Tracking Code", width: {wpx: 160},
                        style: {
                            border: {
                                top: {style: "thin", color: "FFFFAA00"},
                                bottom: {style: "thin", color: "FFFFAA00"},
                                left: {style: "thin", color: "FFFFAA00"},
                                right: {style: "thin", color: "FFFFAA00"}
                            },
                            fill: {patternType: "solid", fgColor: {rgb: "FFFFFF00"}},
                            font: {bold: true}
                        }
                    },
                    {
                        title: "Kode Warehouse", width: {wpx: 150},
                        style: {
                            border: {
                                top: {style: "thin", color: "FFFFAA00"},
                                bottom: {style: "thin", color: "FFFFAA00"},
                                left: {style: "thin", color: "FFFFAA00"},
                                right: {style: "thin", color: "FFFFAA00"}
                            },
                            fill: {patternType: "solid", fgColor: {rgb: "FFFFFF00"}},
                            font: {bold: true}
                        }
                    },
                    {
                        title: "Status Pack", width: {wpx: 100},
                        style: {
                            border: {
                                top: {style: "thin", color: "FFFFAA00"},
                                bottom: {style: "thin", color: "FFFFAA00"},
                                left: {style: "thin", color: "FFFFAA00"},
                                right: {style: "thin", color: "FFFFAA00"}
                            },
                            fill: {patternType: "solid", fgColor: {rgb: "FFFFFF00"}},
                            font: {bold: true}
                        }
                    },
                    {
                        title: "Finish Pack", width: {wpx: 100},
                        style: {
                            border: {
                                top: {style: "thin", color: "FFFFAA00"},
                                bottom: {style: "thin", color: "FFFFAA00"},
                                left: {style: "thin", color: "FFFFAA00"},
                                right: {style: "thin", color: "FFFFAA00"}
                            },
                            fill: {patternType: "solid", fgColor: {rgb: "FFFFFF00"}},
                            font: {bold: true}
                        }
                    },
                    {
                        title: "Pack By", width: {wpx: 120},
                        style: {
                            border: {
                                top: {style: "thin", color: "FFFFAA00"},
                                bottom: {style: "thin", color: "FFFFAA00"},
                                left: {style: "thin", color: "FFFFAA00"},
                                right: {style: "thin", color: "FFFFAA00"}
                            },
                            fill: {patternType: "solid", fgColor: {rgb: "FFFFFF00"}},
                            font: {bold: true}
                        }
                    },

                ],
                ySteps: 2,
                data: data_report.map((data) => [
                    {value: ""},

                    {value: data.id_transaksi},
                    {value: data.created_at},
                    {value: data.type_member},
                    {value: data.nama_member},
                    {value: data.status_name},
                    {
                        value: data.sub_ttl ? data.sub_ttl : "-",
                        style: {alignment: {readingOrder: "2"}, numFmt: "0,000.00"}
                    },
                    {
                        value: data.ongkir ? data.ongkir : "-",
                        style: {alignment: {readingOrder: "2"}, numFmt: "0,000.00"}
                    },
                    {value: data.logistic_name ? data.logistic_name : ''},
                    {value: data.cnote_no ? data.cnote_no : ''},
                    {value: data.wh_name ? data.wh_name : ''},
                    {value: data.status_pack ? data.status_pack : ''},
                    {value: data.delivery_date ? data.delivery_date : ''},
                    {value: data.name ? data.name : ''},

                ])
            }
        ];

        const columns = [
            {
                key: "id_transaksi",
                text: "No. Order",
                width: 100,
                align: "center",
                sortable: false,
                cell: record => {
                    return record.id_transaksi
                }
            },
            {
                key: "created_at",
                text: "Date",
                align: "center",
                width: 100,
                sortable: true,
                cell: record => {
                    return (moment(new Date(record.created_at)).format('DD-MM-YYYY'))
                }
            },

            {
                key: "type_member",
                text: "Tipe User",
                align: "center",
                sortable: false,
            },
            {
                key: "nama_member",
                text: "Nama Pembeli",
                align: "center",
                sortable: false
            },
            {
                key: "status_name",
                text: "Status Order",
                width: 150,
                align: "center",
                sortable: false,
            },
            {
                key: "sub_ttl",
                text: "Total Order",
                width: 100,
                align: "center",
                sortable: false,
                cell: record => {
                    return (<div style={{textAlign: "right"}}><Fragment>
                        <NumberFormat
                            value={record.sub_ttl}
                            thousandSeparator={true}
                            decimalScale={2}
                            displayType={'text'}
                        />
                    </Fragment></div>)
                }
            },
            {
                key: "ongkir",
                text: "Total Ongkir",
                width: 100,
                align: "center",
                sortable: false,
                cell: record => {
                    return (<div style={{textAlign: "right"}}><Fragment>
                        <NumberFormat
                            value={record.ongkir}
                            thousandSeparator={true}
                            decimalScale={2}
                            displayType={'text'}
                        />
                    </Fragment></div>)
                }
            },
            {
                key: "logistic_name",
                text: "Ekspedisi",
                align: "center",
                sortable: false
            },
            {
                key: "cnote_no",
                text: "Tracking Code",
                align: "center",
                sortable: false
            },
            {
                key: "wh_name",
                text: "Kode Warehouse",
                align: "center",
                sortable: false,
                cell: record => {
                    return record.wh_name
                }
            },
            {
                key: "status_pack",
                text: "Status Pack",
                align: "center",
                sortable: false
            },
            {
                key: "delivery_date",
                text: "Finish Pack",
                align: "center",
                sortable: false,
                cell: record => {
                    return (record.delivery_date ? moment(new Date(record.delivery_date)).format('DD-MM-YYYY') : '')
                }
            },
            {
                key: "name",
                text: "Pack By",
                align: "center",
                sortable: false
            },
        ];
        const config = {
            key_column: 'id_transaksi',
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
                    {/* Content Header (Page header) */}
                    <div className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1 className="m-0">Report Logistik</h1>
                                </div>
                                {/* /.col */}

                            </div>
                            {/* /.row */}
                        </div>
                        {/* /.container-fluid */}
                    </div>
                    {/* /.content-header */}
                    {/* Main content */}
                    <section className="content">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    {/* card start */}
                                    <div className="card card-success shadow-lg" style={{"minHeight": "470px"}}>

                                        <div className="card-body">
                                            <Form>
                                                <Form.Row>
                                                    <Form.Group as={Col} xs={2} controlId="start_date">
                                                        <Form.Label>No.Order</Form.Label>
                                                        <Form.Control
                                                            size="sm"
                                                            autoComplete="off"
                                                            name="id_transaksi"
                                                            type="text"
                                                            onInput={this.handleChange.bind(this)}
                                                            value={this.state.id_transaksi ? this.state.id_transaksi : ''}
                                                            onChange={this.handleChange.bind(this)}
                                                            placeholder="No.Order"/>
                                                    </Form.Group>
                                                    <Form.Group as={Col} xs={2} controlId="start_date">
                                                        <Form.Label>Tracking Code</Form.Label>
                                                        <Form.Control
                                                            size="sm"
                                                            autoComplete="off"
                                                            name="cnote"
                                                            type="text"
                                                            onInput={this.handleChange.bind(this)}
                                                            value={this.state.cnote ? this.state.cnote : ''}
                                                            onChange={this.handleChange.bind(this)}
                                                            placeholder="Tracking Code"/>
                                                    </Form.Group>
                                                </Form.Row>
                                                <Form.Row>
                                                    <Form.Group as={Col} xs={2} controlId="start_date">
                                                        <Form.Label>Start Date</Form.Label>
                                                        <Datetime
                                                            setViewDate={this.state.start_date ? (new Date(this.state.start_date)) : ''}
                                                            onChange={this.handleChangeStartDate}
                                                            timeFormat={false}
                                                            closeOnSelect={true}
                                                            inputProps={{
                                                                value: this.state.start_date ? (moment(new Date(this.state.start_date)).format('DD/MM/YYYY')) : '',
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
                                                    <Form.Group as={Col} xs={2} controlId="start_date">
                                                        <Form.Label>End Date</Form.Label>
                                                        <Datetime
                                                            closeOnSelect={true}
                                                            setViewDate={this.state.end_date ? (new Date(this.state.end_date)) : new Date()}
                                                            onChange={this.handleChangeEndDate}
                                                            timeFormat={false}
                                                            inputProps={{
                                                                value: this.state.end_date ? (moment(new Date(this.state.end_date)).format('DD/MM/YYYY')) : '',
                                                                readOnly: true,
                                                                placeholder: 'End Date',
                                                                autoComplete: "off",
                                                                name: 'end_date',
                                                                className: 'form-control form-control-sm'
                                                            }}
                                                            renderView={(mode, renderDefault) =>
                                                                this.renderView(mode, renderDefault, 'end_date')
                                                            }
                                                            locale="id" isValidDate={this.state.validEd}
                                                        />
                                                    </Form.Group>
                                                </Form.Row>
                                            </Form>
                                            <AppButton
                                                onClick={this.handleSubmit.bind(this)}
                                                isLoading={this.props.isLoading}
                                                type="button"
                                                style={{marginRight: 5}}
                                                theme="success">
                                                Search
                                            </AppButton>
                                            <AppButton
                                                onClick={this.handleReset.bind(this)}
                                                isLoading={this.props.isLoading}
                                                type="button"
                                                style={{marginRight: 5}}
                                                theme="warning">
                                                Reset
                                            </AppButton>
                                            <ExcelFile filename="Report Logistik" element={
                                                <AppButton
                                                    isLoading={this.props.isLoading}
                                                    type="button"
                                                    style={{marginRight: 5}}
                                                    theme="info">
                                                    Export
                                                </AppButton>}>
                                                <ExcelSheet dataSet={multiDataSet} name="Report Logistik"/>
                                            </ExcelFile>

                                            <hr/>
                                            <br/>
                                            {data ? (
                                                <Fragment>
                                                    <div style={{overflowX: 'auto', paddingBlockEnd: 10}}>
                                                        <ReactDatatable
                                                            className="table table-bordered table-striped"
                                                            config={config}
                                                            records={data}
                                                            columns={columns}
                                                            dynamic={true}
                                                            onChange={this.tableChangeHandler}
                                                            loading={this.props.isLoading}
                                                            total_record={this.props.totalData}
                                                        />
                                                    </div>


                                                </Fragment>


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
        data: state.reports.data_logistik || [],
        data_report: state.reports.data_report_logistik || [],
        isLoading: state.reports.isLoading,
        error: state.reports.error || null,
        totalData: state.reports.totalData || 0,
        user: state.auth.currentUser
    }
}

const mapDispatchToPros = (dispatch) => {
    return {
        onLoad: (queryString) => {
            dispatch(fetchDataLogistik(queryString));
        },
        onDownload: (queryString) => {
            dispatch(fetchExportLogistik(queryString))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToPros)(Logistik);