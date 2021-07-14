import React, { Component } from 'react'
import AreaService from './AreaService';
import { Form, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { connect } from 'react-redux';
import { BsFillTrashFill } from "react-icons/bs";
import { FaEdit } from 'react-icons/fa';
import AppButton from '../components/button/Button';
import AppModal from '../components/modal/MyModal';
import { SelectProv, SelectProvMulti } from '../components/modal/MySelect';
import axios from 'axios';
import { AppSwalSuccess } from '../components/modal/SwalSuccess';

class Warehouse extends Component {
    constructor(props) {
        super(props);
        this.iniSelected = {
            id_wh: "",
            wh_name: "",
            kode_jne: "",
            kode_lp: "",
            id_operator: "",
            id_prov: "",
            provinsi_name: ""
        }
        this.state = {
            show: false,
            deleteForm: false,
            li_active: '',
            removeIdProv: '',
            dtRes: [],
            dtArea: [],
            loadWH: false,
            selected: this.iniSelected,
            isLoadingSelected: true,
            isLoadingArea: false,
            selectOptions: [],
            multiValue: [],
            errMsg: this.iniSelected,
            showSwalSuccess: false,
            loadArea: false,
            showFormAreaa: false,
            notFound: "Silahkan pilih warehouse untuk melihat area"
        }
        this.handleChange = this.handleChange.bind(this);
        this.onchangeSelect = this.onchangeSelect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        this.setState({ loadWH: true });
        AreaService.postData(this.state.queryString, "GET_WH")
            .then(response => {
                setTimeout(() => {
                    if (response.data.err_code === "00") {
                        this.setState({
                            ...this.state,
                            dtRes: response.data.data,
                            totalData: response.data.total_data,
                        });
                    }
                    if (response.data.err_code === "04") {
                        this.setState({
                            ...this.state,
                            dtRes: [],
                            totalData: 0,

                        });
                    }
                    this.setState({ loadWH: false });
                }, 400);
            })
            .catch(e => {
                console.log(e);
            });
    };

    getDataArea = (evt) => {
        this.setState({ loadDataArea: true, removeIdProv: '', multiValue: [] });
        AreaService.postData(evt, "GET_AREA")
            .then(response => {
                setTimeout(() => {
                    if (response.data.err_code === "00") {
                        this.setState({
                            ...this.state,
                            dtArea: response.data.data,
                            totalDataArea: response.data.total_data,
                        });
                    }
                    if (response.data.err_code === "04") {
                        this.setState({
                            ...this.state,
                            dtArea: [],
                            totalDataArea: 0,
                            notFound: "Data not found"
                        });
                    }
                    this.setState({ loadDataArea: false });
                }, 400);
            })
            .catch(e => {
                console.log(e);
            });
    };

    closeSwal = () => {
        this.setState({
            ...this.state,
            deleteForm: false,
            showSwalSuccess: false,
            selected: this.iniSelected,
            notFound: "Silahkan pilih warehouse untuk melihat area",
            successMsg: ""
        });
        this.getData();
    }

    discardChanges = () => {
        this.getOptions();
        this.setState({
            ...this.state,
            show: true,
            isLoading: false,
            errMsg: {},
            selected: this.iniSelected,
            actionForm: "ADD_WH"
        });
    }

    editRecord = (record) => {
        this.setState({
            ...this.state,
            show: true,
            isLoading: false,
            errMsg: {},
            actionForm: "ADD_WH",
            selected: { ...record }
        });
        this.getOptions();
    }

    handleClose2(evt, id) {
        this.setState({ showFormAreaa: false })
        Object.keys(this.iniSelected).map((key) => {
            this.setState({ selected: { ...evt, [key]: evt[key], id_operator: this.props.user.id_operator } })
            return 1;
        })
        this.getDataArea(evt);
        //evt.classList.remove('li_active');
        //evt.target.classList.add('li_active');S
    };
    handleChange(evt) {
        const { name, value } = evt.target;
        this.setState({
            selected: {
                ...this.state.selected,
                [name]: value,
                id_operator: this.props.user.id_operator,
            }
        });
    }

    handleSubmit() {
        var errors = this.state.errMsg;
        this.setState({
            ...this.state,
            isLoading: true,
        });
        errors.wh_name = !this.state.selected.wh_name ? "Warehouse name required" : '';
        errors.id_prov = !this.state.selected.id_prov ? "Origin required" : '';
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

    async removeArea(evt, id) {
        await this.setState({ actionForm: 'REMOVE_AREA', removeIdProv: evt.id_provinsi })
        this.handleSaveArea();
    }

    async handleSaveArea() {
        this.setState({
            ...this.state,
            loadDataArea: false,
        });
        let id_prov = [];
        Object.values(this.state.multiValue).forEach(
            (val) => id_prov.push(val.value)
        );
        const param = {
            id_operator: this.state.selected['id_operator'],
            id_wh: this.state.selected['id_wh'],
            id_prov: this.state.removeIdProv ? this.state.removeIdProv : id_prov
        }
        let err_code = '';
        //console.log(this.state.actionForm);        
        await AreaService.postData(param, this.state.actionForm).then((res) => {
            err_code = res.data.err_code;
            if (err_code === '00') {
                this.setState({
                    ...this.state,
                    actionForm: "ADD_AREA"
                });
                this.getDataArea(param);
                this.getOptions();
            }
        }).catch((error) => {
            this.setState({
                ...this.state,
                actionForm: "ADD_AREA",
                loadDataArea: false,
            });
        });
    }

    async handleSave() {
        if (this.validateForm(this.state.errMsg)) {
            let contentSwal = '';
            let err_code = '';
            let param = this.state.selected;
            if (this.state.actionForm === "ADD_WH") {
                contentSwal = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong style="font-size:24px;">Success</strong>, Data berhasil disimpan</div>' }} />;
            }
            if (this.state.actionForm === "DEL_WH") {
                contentSwal = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong>Success</strong>, Data berhasil dihapus</div>' }} />;
            }

            await AreaService.postData(param, this.state.actionForm).then((res) => {
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

    handleClose = () => {
        this.setState({
            show: false,
            deleteForm: false,
            isLoadingSelected: true,
            //selected: this.iniSelected,
        });
    };

    async getOptions() {
        this.setState({ isLoadingSelected: true })
        const param = { is_wh: 1 }
        const url = process.env.REACT_APP_URL_API + "/provinsi"
        const res = await axios.post(url, param)
        const err_code = res.data.err_code
        if (err_code === '00') {
            const data = res.data.data
            const options = data.map(d => ({
                "value": d.id_provinsi,
                "label": d.provinsi_name
            }))
            setTimeout(() => {
                this.setState({
                    ...this.state,
                    selectOptions: options,
                    isLoadingSelected: false,
                    loadArea: false
                })
            }, 400);
        } else {
            setTimeout(() => {
                this.setState({
                    ...this.state,
                    selectOptions: null,
                    isLoadingSelected: true,
                    loadArea: true,
                })
            }, 400);

        }
    }

    onchangeSelect(evt) {
        this.setState({
            selected: {
                ...this.state.selected,
                id_prov: evt.value,
                provinsi_name: evt.label,
                id_operator: this.props.user.id_operator
            }
        })
    };

    handleMultiChange(option) {
        this.setState(state => {
            return {
                multiValue: option
            };
        });
    }

    deleteRecord = (record) => {
        this.setState({
            ...this.state,
            deleteForm: true,
            errMsg: { id_prov: '' },
            actionForm: "DEL_WH",
            selected: { ...record, id_operator: this.props.user.id_operator }
        });
    }


    showFormArea() {
        this.setState({
            ...this.state,
            loadArea: true,
            showFormAreaa: !this.state.showFormAreaa ? true : false,
            selected: { ...this.state.selected, id_operator: this.props.user.id_operator },
            errMsg: { id_prov: '' },
            actionForm: "ADD_AREA"
        });
        this.getOptions();
    }

    render() {
        const contentDelete = <div dangerouslySetInnerHTML={{ __html: '<div id="caption" style=padding-bottom:20px;">Apakah anda yakin <br/>akan menghapus data ini ?</div>' }} />;
        const frmUser = <Form id="myForm">
            <Form.Group controlId="wh_name">
                <Form.Label>Warehouse Name</Form.Label>
                {this.state.errMsg.wh_name ?
                    (<span className="float-right text-error badge badge-danger">{this.state.errMsg.wh_name}</span>) : null}
                <Form.Control
                    value={this.state.selected['wh_name']}
                    name="wh_name"
                    size="sm"
                    type="text"
                    placeholder="Warehouse Name"
                    onChange={this.handleChange}
                    autoComplete="off" />
            </Form.Group>
            <Form.Group controlId="origin">
                <Form.Label>Origin</Form.Label>
                {this.state.errMsg.id_prov ?
                    (<span className="float-right text-error badge badge-danger">{this.state.errMsg.id_prov}</span>) : null}
                <SelectProv
                    myVal={this.state.selected['id_prov'] ? ({ value: this.state.selected['id_prov'], label: this.state.selected['provinsi_name'] }) : ''}
                    getData={this.state.selectOptions}
                    isLoading={this.state.isLoadingSelected}
                    onChange={this.onchangeSelect}
                />
            </Form.Group>
        </Form>;

        return (
            <div>

                <div className="content-wrapper">
                    <div className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1 className="m-0">Warehouse</h1>
                                </div>

                            </div>
                        </div>
                    </div>

                    <section className="content">
                        <div className="container-fluid">
                            <div className="row">
                                <div className={this.props.user.coverage_area_view ? "col-lg-6" : "col-lg-12"}>
                                    <div className="card shadow-lg">
                                        <div className="card-header card-header-custom">
                                            <h1 className="card-title card-title-custom">List Warehouse</h1>
                                            <div className="tools">
                                                {this.props.user.warehouse_add ? (
                                                    <AppButton
                                                        className="float-right btn-sm"
                                                        onClick={this.discardChanges}
                                                        icon="add"
                                                        theme="info"
                                                        isLoading={this.state.loadWH}>Add Warehouse
                                                    </AppButton>
                                                ) : ''}
                                            </div>
                                        </div>

                                        <div className="card-body inbox_chat">
                                            {this.state.loadWH ? (
                                                <div className="loadings text-center">
                                                    <Spinner animation="border" variant="secondary" />
                                                    <br />
                                            Loading ...
                                                </div>) : (<ul className="todo-list ui-sortable" data-widget="todo-list">
                                                    {this.state.dtRes.length > 0 ? (
                                                        this.state.dtRes.map((dt, i) => (
                                                            <li key={dt.id_wh} className={this.state.selected['id_wh'] === dt.id_wh ? 'li_wh li_active' : 'li_wh'} onClick={this.handleClose2.bind(this, dt)}>
                                                                <span className="text">{dt.wh_name}</span><br />
                                                                <span className="text-second-li">Origin : {dt.provinsi_name}({dt.kode_jne + '/' + dt.kode_lp})</span>
                                                                <div className="tools">
                                                                    {this.props.user.warehouse_edit ? (
                                                                        <OverlayTrigger
                                                                            placement="left"
                                                                            // id={`tooltip-${placement}`}
                                                                            overlay={
                                                                                <Tooltip id="tooltip-left">
                                                                                    Edit
                                                                        </Tooltip>
                                                                            }
                                                                        >
                                                                            <i className="fas">{<FaEdit onClick={this.editRecord.bind(this, dt)} />}</i>
                                                                        </OverlayTrigger>
                                                                    ) : ''}
                                                                    {this.props.user.warehouse_del ? (
                                                                        <OverlayTrigger
                                                                            placement="right"
                                                                            // id={`tooltip-${placement}`}
                                                                            overlay={
                                                                                <Tooltip id="tooltip-right">
                                                                                    Delete
                                                                        </Tooltip>
                                                                            }
                                                                        >
                                                                            <i className="fas">{<BsFillTrashFill onClick={this.deleteRecord.bind(this, dt)} />}</i>
                                                                        </OverlayTrigger>
                                                                    ) : ''}

                                                                </div>
                                                            </li>
                                                        ))

                                                    ) : (<li className="li_wh_nodata" key="no_data">
                                                        <span className="text">Data not found</span>
                                                    </li>)}
                                                </ul>)}
                                        </div>

                                    </div>
                                </div>
                                {this.props.user.coverage_area_view ? (
                                    <div className="col-lg-6">
                                        <div className="card shadow-lg">
                                            <div className="card-header card-header-custom">
                                                <h1 className="card-title card-title-custom">Coverage Area
                                            <span className="area" style={{ "fontWeight": "600", "color": "green" }}> {this.state.selected['wh_name']}</span></h1>
                                                {this.state.selected['id_wh'] && this.props.user.coverage_area_add ? (
                                                    <div className="tools">
                                                        <AppButton
                                                            className="float-right btn-sm"
                                                            onClick={this.showFormArea.bind(this)}
                                                            icon={this.state.showFormAreaa ? "times" : "add"}
                                                            theme={this.state.showFormAreaa ? "danger" : "warning"}
                                                            isLoading={this.state.loadDataArea}>{this.state.showFormAreaa ? "Close" : "Add Area"}
                                                        </AppButton>
                                                    </div>
                                                ) : ''}

                                            </div>

                                            <div className="card-body inbox_chat">
                                                {this.state.showFormAreaa ?
                                                    <React.Fragment>
                                                        <SelectProvMulti
                                                            myVal={this.state.multiValue && this.state.multiValue}
                                                            getData={this.state.selectOptions}
                                                            isLoading={this.state.loadArea}
                                                            onChange={this.handleMultiChange.bind(this)}
                                                        />

                                                        <AppButton
                                                            style={{ "marginTop": "3px", "marginBottom": "15px" }}
                                                            className="btn-block btn-sm"
                                                            onClick={this.handleSaveArea.bind(this)}
                                                            theme="warning"
                                                            disabled={this.state.multiValue.length > 0 ? false : true}
                                                            isLoading={this.state.loadDataArea}>Save
                                                        </AppButton>
                                                    </React.Fragment> : ''}

                                                {this.state.loadDataArea ? (
                                                    <div className="loadings text-center">
                                                        <Spinner animation="border" variant="secondary" />
                                                        <br />
                                             Loading ...
                                                    </div>
                                                ) : (<ul className="todo-list ui-sortable" data-widget="todo-list">
                                                    {this.state.dtArea.length > 0 ? (
                                                        this.state.dtArea.map((dt, i) => (
                                                            <li key={dt.id_provinsi} className={dt.origin_utama ? "li_wh_origin" : "li_wh_area"} >
                                                                <span className="text">{dt.provinsi_name}</span>
                                                                {dt.origin_utama === 0 && this.props.user.coverage_area_del ? (
                                                                    <div className="tools">
                                                                        <OverlayTrigger
                                                                            placement="top"
                                                                            // id={`tooltip-${placement}`}
                                                                            overlay={
                                                                                <Tooltip id="tooltip-top">
                                                                                    Remove Area
                                                                    </Tooltip>
                                                                            }
                                                                        >
                                                                            <i className="fas">{<BsFillTrashFill onClick={this.removeArea.bind(this, dt)} />}</i>
                                                                        </OverlayTrigger>
                                                                    </div>
                                                                ) : ''}
                                                            </li>
                                                        ))

                                                    ) : (<li className="li_wh_nodata" key="no_data">
                                                        <span className="text">{this.state.notFound}</span>
                                                    </li>)}
                                                </ul>)}

                                            </div>


                                        </div>
                                    </div>
                                ) : ''}
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
                        title="Add/Edit"
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
                        title="Delete"
                        titleButton="Delete"
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

export default connect(mapStateToProps, '')(Warehouse)
