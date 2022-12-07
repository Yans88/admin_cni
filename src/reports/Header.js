import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux';
import {fetchDataHeader, fetchExportHeader} from './reportService';
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

class Header extends Component {
    constructor(props) {
        super(props);
        this.initSelected = {
            status: '-1',
            end_date: '',
            start_date: '',
            id_operator: '',
            per_page: 10,
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
            selected: this.initSelected,
            errMsg: this.initSelected,
            loadingForm: false,
            status: "-1",
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
        this.setState({end_date: '', page_number: 1})
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
        this.setState({start_date: '', page_number: 1})
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
        this.setState({
            ...this.state,
            start_date: '',
            end_date: '',
            status: '-1',
        })
        this.handleChangeEndDate('');
        this.handleChangeStartDate('');
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
                        title: "No-Order", width: {wpx: 100},
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
                        title: "akunid", width: {wpx: 100},
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
                    },//char width 
                    {
                        title: "Tgl Transaksi", width: {wpx: 90},
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
                        title: "No Cashbill", width: {wpx: 100},
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
                        title: "cb date", width: {wpx: 100},
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
                        title: "Tipe Payment", width: {wpx: 150},
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
                        title: "Nomor N / Ref", width: {wpx: 150},
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
                        title: "Nama", width: {wpx: 150},
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
                        title: "asf", width: {wpx: 90},
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
                        title: "nsf", width: {wpx: 100},
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
                        title: "Nama Konsumen", width: {wpx: 150},
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
                        title: "Status Payment", width: {wpx: 100},
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
                        title: "Kode WH", width: {wpx: 150},
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
                        title: "Status Member", width: {wpx: 100},
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
                        title: "Membership", width: {wpx: 100},
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
                        title: "Ekspedisi", width: {wpx: 100},
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
                        title: "jpv", width: {wpx: 100},
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
                        title: "jrv", width: {wpx: 80},
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
                        title: "jdp", width: {wpx: 80},
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
                        title: "jpp", width: {wpx: 80},
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
                        title: "Total CB", width: {wpx: 100},
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
                        title: "pot promo", width: {wpx: 100},
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
                        title: "potecash", width: {wpx: 80},
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
                        title: "potwallet", width: {wpx: 100},
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
                        title: "potevoucher", width: {wpx: 100},
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
                        title: "total ongkir", width: {wpx: 100},
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
                        title: "jpayment", width: {wpx: 100},
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
                        title: "fgsource", width: {wpx: 90},
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
                        title: "payment_date", width: {wpx: 100},
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
                        title: "NO_VA", width: {wpx: 150},
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
                ySteps: 1,
                data: data_report.map((data) => [

                    {value: ""},
                    {value: data.id_transaksi},
                    {value: ""},
                    {value: data.created_at},
                    {value: ""},
                    {value: ""},
                    {value: data.payment_name},
                    {value: data.type_member === 1 && data.cni_id ? data.cni_id : data.cni_id_ref},
                    {value: data.type_member === 1 && data.nama_member ? data.nama_member : ""},
                    {value: ""},
                    {value: ""},
                    {value: data.type_member === 2 && data.nama_member ? data.nama_member : "-"},
                    {value: data.status_name},
                    {value: data.wh_name !== null ? data.wh_name : data.iddc},
                    {value: data.type_member === 1 ? "Yes" : "No"},
                    {value: "No"},
                    {value: data.logistic_name ? data.logistic_name : "-"},
                    {value: data.ttl_pv ? data.ttl_pv : "-", style: {alignment: {readingOrder: "2"}, numFmt: "0.00"}},
                    {
                        value: data.ttl_rv ? data.ttl_rv : "-",
                        style: {alignment: {readingOrder: "2"}, numFmt: "0,000.00"}
                    },
                    {value: data.jdp ? data.jdp : "-", style: {alignment: {readingOrder: "2"}, numFmt: "0,000.00"}},
                    {
                        value: data.ttl_jpp ? data.ttl_jpp : "-",
                        style: {alignment: {readingOrder: "2"}, numFmt: "0,000.00"}
                    },
                    {
                        value: data.ttl_cb ? data.ttl_cb : "-",
                        style: {alignment: {readingOrder: "2"}, numFmt: "0,000.00"}
                    },
                    {value: "-"},
                    {value: "-"},
                    {
                        value: data.ewallet ? data.ewallet : "-",
                        style: {alignment: {readingOrder: "2"}, numFmt: "0,000.00"}
                    },
                    {
                        value: data.pot_voucher ? data.pot_voucher : "-",
                        style: {alignment: {readingOrder: "2"}, numFmt: "0,000.00"}
                    },
                    {
                        value: data.ongkir ? data.ongkir : "-",
                        style: {alignment: {readingOrder: "2"}, numFmt: "0,000.00"}
                    },
                    {
                        value: data.jpayment ? data.jpayment : "-",
                        style: {alignment: {readingOrder: "2"}, numFmt: "0,000.00"}
                    },
                    {value: ""},
                    {value: data.payment_date ? data.payment_date : ""},
                    {
                        value: data.key_payment ? data.key_payment : "-",
                        style: {alignment: {readingOrder: "2"}, numFmt: "0"}
                    },
                ])

            }
        ];

        const columns = [
            {
                key: "id_transaksi",
                text: "No. Order",
                width: 50,
                align: "center",
                sortable: true,
            },
            {
                key: "created_at",
                text: "Date",
                align: "center",
                width: 100,
                sortable: false,
                cell: record => {
                    return (moment(new Date(record.created_at)).format('DD-MM-YYYY'))
                }
            },
            {
                key: "",
                text: "No. Cashbill",
                width: 120,
                align: "center",
                sortable: false,
            },
            {
                key: "payment_name",
                text: "Tipe Payment",
                width: 130,
                align: "center",
                sortable: false,

            },
            {
                key: "cni_id",
                text: "No.Anggota/ Referensi",
                width: 130,
                align: "center",
                sortable: false,
                cell: record => {
                    return record.type_member === 1 ? record.cni_id : record.cni_id_ref
                }
            },
            {
                key: "nama_ref",
                text: "Nama Member",
                width: 150,
                align: "center",
                sortable: false,
                cell: record => {
                    return record.type_member === 1 ? record.nama_member : record.nama_ref
                }
            },
            {
                key: "nama_member",
                text: "Nama Konsumen",
                width: 150,
                align: "center",
                sortable: false,
                cell: record => {
                    return record.type_member === 2 ? record.nama_member : ''
                }
            },
            {
                key: "",
                text: "Upline ID.",
                width: 120,
                align: "center",
                sortable: false,
            },
            {
                key: "",
                text: "Nama Upline",
                width: 150,
                align: "center",
                sortable: false,
            },
            {
                key: "wh_name",
                text: "Kode Pengiriman DC/WH",
                width: 150,
                align: "center",
                sortable: false,
                cell: record => {
                    return record.wh_name ? record.wh_name : record.iddc
                }
            },
            {
                key: "type_member",
                text: "Status Member",
                width: 80,
                align: "center",
                sortable: false,
                cell: record => {
                    return record.type_member === 1 ? 'Yes' : 'No'
                }
            },
            {
                key: "",
                text: "Free Membership",
                width: 80,
                align: "center",
                sortable: false,
                cell: record => {
                    return record.type_member === 1 ? 'No' : 'No'
                }
            },
            {
                key: "ttl_pv",
                text: "Total PV",
                width: 80,
                align: "center",
                sortable: false,
                cell: record => {
                    return (<div style={{textAlign: "right"}}><Fragment>
                        <NumberFormat
                            value={record.ttl_pv}
                            thousandSeparator={true}
                            decimalScale={2}
                            displayType={'text'}
                        />
                    </Fragment></div>)
                }
            },
            {
                key: "ttl_rv",
                text: "Total RV",
                width: 80,
                align: "center",
                sortable: false,
                cell: record => {
                    return (<div style={{textAlign: "right"}}><Fragment>
                        <NumberFormat
                            value={record.ttl_rv}
                            thousandSeparator={true}
                            decimalScale={2}
                            displayType={'text'}
                        />
                    </Fragment></div>)
                }
            },
            {
                key: "ttl_disc",
                text: "Total DP",
                width: 80,
                align: "center",
                sortable: false,
                cell: record => {
                    return (<div style={{textAlign: "right"}}><Fragment>
                        <NumberFormat
                            value={record.ttl_disc}
                            thousandSeparator={true}
                            decimalScale={2}
                            displayType={'text'}
                        />
                    </Fragment></div>)
                }
            }
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
                                    <h1 className="m-0">Report Header</h1>
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

                                                <Form.Row>
                                                    <Form.Group as={Col} xs={4} controlId="status">
                                                        <Form.Label>Status</Form.Label>
                                                        <Form.Control
                                                            name="status"
                                                            size="sm"
                                                            as="select"
                                                            value={this.state.status}
                                                            onChange={this.handleChange}>
                                                            <option value="-1">All</option>
                                                            <option value="0">Waiting Payment</option>
                                                            <option value="1">Payment Complete</option>
                                                            <option value="3">On Process</option>
                                                            <option value="4">Dikirim</option>
                                                            <option value="5">Completed</option>
                                                            <option value="2">Expired Payment</option>
                                                        </Form.Control>
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


                                            <ExcelFile filename="Report Header" element={
                                                <AppButton
                                                    isLoading={this.props.isLoading}
                                                    type="button"
                                                    style={{marginRight: 5}}
                                                    theme="info">
                                                    Export
                                                </AppButton>}>
                                                <ExcelSheet dataSet={multiDataSet} name="Report Header"/>
                                            </ExcelFile>


                                            <hr/>
                                            <br/>
                                            {data ? (
                                                <Fragment>
                                                    <div style={{overflowX: 'auto', paddingBlockEnd: 10}}>
                                                        <ReactDatatable
                                                            className="table table-bordered table-striped tbl_report"
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
        data: state.reports.data || [],
        data_report: state.reports.data_report || [],
        isLoading: state.reports.isLoading,
        error: state.reports.error || null,
        totalData: state.reports.totalData || 0,
        user: state.auth.currentUser
    }
}

const mapDispatchToPros = (dispatch) => {
    return {
        onLoad: (queryString) => {
            dispatch(fetchDataHeader(queryString));
        },
        onDownload: (queryString) => {
            dispatch(fetchExportHeader(queryString))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToPros)(Header);