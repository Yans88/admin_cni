import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Loading from '../components/loading/MyLoading';
import { AppSwalSuccess } from '../components/modal/SwalSuccess';
import { SelectProducts, SelectProvMulti } from '../components/modal/MySelect';
import { Button, Col, Form } from 'react-bootstrap'
import AppButton from '../components/button/Button';
import axios from 'axios';
import { addData, addDataSuccess } from './blastService';
import { ExcelRenderer } from 'react-excel-renderer';
import AppModal from '../components/modal/MyModal';

class BlastForm extends Component {
    constructor(props) {
        super(props);
        this.initValue = {
            tujuan: '',
            member: '',
            id_product: '',
            content: '',
            file_import: '',
        }
        this.state = {
            isLoading: false,
            appsLoading: false,
            loadArea: true,
            isLoadingSelected: true,
            id_operator: null,
            id_product: null,
            product_name: null,
            errMsg: this.initValue,
            tujuan: '',
            multiValue: [],
            selectOptions: [],
            showConfirm: false,
            uploadedFileName: null
        };
    }

    onchangeSelect(evt) {
        this.setState({ id_product: evt.value, product_name: evt.label, errMsg: { ...this.state.errMsg, id_product: '' } })
        if (!this.state.id_operator) this.setState({ ...this.state, id_operator: this.props.user.id_operator });
    };

    handleChange(evt) {
        const name = evt.target.name;
        var value = evt.target.value;
        if (name === 'tujuan' && value === 'Pengguna tertentu') {
            this.setState({ loadArea: true, multiValue: [] });
            this.getOptions();
        }
        if (name === 'tujuan' && value === 'Semua pengguna') {
            this.setState({
                multiValue: [],
                loadArea: true,
                errMsg: { ...this.state.errMsg, member: '' }
            })
        }

        if (name === 'tujuan' && value === 'Import pengguna') {
            this.setState({
                showConfirm: true,
                uploadedFileName: ""
            })
        }

        this.setState({
            [name]: value,
            errMsg: {
                ...this.state.errMsg,
                [name]: ''
            }
        })
        if (!this.state.id_operator) this.setState({ id_operator: this.props.user.id_operator });
    }

    async getOptions() {
        this.setState({ isLoadingSelected: true })
        const param = { is_wh: 1 }
        const url = process.env.REACT_APP_URL_API + "/members"
        const res = await axios.post(url, param)
        const err_code = res.data.err_code
        if (err_code === '00') {
            const data = res.data.data
            const options = data.map(d => ({
                "value": d.id_member,
                "label": d.nama
            }))
            setTimeout(() => {
                this.setState({
                    ...this.state,
                    selectOptions: options,
                    isLoadingSelected: false,
                    loadArea: false,

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

    handleMultiChange(option) {
        this.setState({
            errMsg: {
                ...this.state.errMsg,
                member: ''
            }
        })
        this.setState(state => {
            return {
                multiValue: option
            };
        });
    }

    handleSubmit() {
        var errors = this.state.errMsg;
        this.setState({
            ...this.state,
            isLoading: true,
        });
        errors.tujuan = !this.state.tujuan ? "Tujuan required" : '';
        errors.id_product = !this.state.id_product ? "Produk required" : '';
        errors.content = !this.state.content ? "Pesan required" : '';
        errors.member = this.state.tujuan === 'Pengguna tertentu' && this.state.multiValue.length === 0 ? "Member required" : '';
        
        this.setState({ errors });
        
        if (this.validateForm(this.state.errMsg)) {
            this.handleSave();
        } else {
            this.setState({
                ...this.state,
                isLoading: false,
            });
            console.error('Invalid Form')
        }
        if (!this.state.id_operator) this.setState({ ...this.state, id_operator: this.props.user.id_operator });

    }

    handleSave() {
        let id_member = [];
        Object.values(this.state.multiValue).forEach(
            (val) => id_member.push(val.value)
        );
        const param = {
            id_operator: this.state.id_operator,
            id_product: this.state.id_product,
            tujuan: this.state.tujuan,
            content: this.state.content,
            id_member: id_member
        }
        this.props.onAdd(param);
    }

    validateForm(errors) {
        let valid = true;
        Object.values(errors).forEach(
            (val) => val.length > 0 && (valid = false)
        );
        return valid;
    }

    closeSwal() {
        this.props.closeSwall();
        this.props.history.push('/blast');
    }

    handleClose = () => {
        this.setState({
            ...this.state,
            showConfirm: false,
            errMsg: this.initValue,
            tujuan: ""
        });
    };

    fileHandler = (event) => {
        if (event.target.files.length) {
            let fileObj = event.target.files[0];
            let fileName = fileObj.name;
            var errors = this.state.errMsg;
            errors.file_import = "";
            //check for file extension and pass only if it is .xlsx and display error message otherwise
            if (fileName.slice(fileName.lastIndexOf('.') + 1) === "xlsx") {
                this.renderFile(fileObj)
                this.setState({
                    uploadedFileName: fileName,
                    showConfirm: false
                });
            }
            else {
                errors.file_import = "Extension invalid";
                this.setState({
                    uploadedFileName: ""
                })
            }
        }
    }

    renderFile = (fileObj) => {
        //just pass the fileObj as parameter
        let opt = [];
        ExcelRenderer(fileObj, (err, resp) => {
            if (err) {
                console.log(err);
            }
            else {
                resp.rows.map((dt, i) => {
                    if (i > 0) {
                        opt[i] = {
                            "value": dt[0],
                            "label": dt[1]
                        }
                    }
                    return opt;
                })
                this.setState({
                    ...this.state,
                    multiValue: opt
                })
            }
        });

    }

    render() {

        const { errMsg } = this.state;
        const frmUser2 = <Form id="myForm">
            <Form.Group controlId="import_pengguna">
                <Form.Label>File(.xlsx)</Form.Label>
                {this.state.errMsg.file_import ? (<span className="float-right text-error badge badge-danger">{this.state.errMsg.file_import}</span>) : ''}
                <Form.File
                    setfieldvalue={this.state.uploadedFileName}
                    onChange={this.fileHandler.bind(this)}
                    size="sm"
                    name="import_pengguna"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    style={{ "color": "rgba(0, 0, 0, 0)" }} />
                <em>File : {this.state.uploadedFileName ? this.state.uploadedFileName : "-"}</em>
            </Form.Group>

        </Form>;
        return (
            <div>
                <div className="content-wrapper">
                    {/* Content Header (Page header) */}
                    <div className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1 className="m-0">Add Blast Notification</h1>
                                </div>

                            </div>
                        </div>
                    </div>

                    <section className="content">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    {/* card start */}
                                    {this.state.appsLoading ? (
                                        <Loading />
                                    ) : (
                                        <div className="card shadow-lg">
                                            <Form>
                                                <div className="card-body my-card-body">
                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="tujuan">
                                                            <Form.Label>Tujuan</Form.Label>
                                                            {errMsg.tujuan ?
                                                                (<span className="float-right text-error badge badge-danger">{errMsg.tujuan}
                                                                </span>) : ''}
                                                            <Form.Control
                                                                name="tujuan"
                                                                size="sm"
                                                                as="select"
                                                                value={this.state.tujuan}
                                                                onChange={this.handleChange.bind(this)}>
                                                                <option value="">Select ...</option>
                                                                <option value="Semua pengguna">Semua pengguna</option>
                                                                <option value="Pengguna tertentu">Pengguna tertentu</option>
                                                                <option value="Import pengguna">Import Pengguna</option>
                                                            </Form.Control>

                                                        </Form.Group>
                                                        <Form.Group as={Col} controlId="id_product">
                                                            <Form.Label>Produk</Form.Label>
                                                            {errMsg.id_product ?
                                                                (<span className="float-right text-error badge badge-danger">{errMsg.id_product}
                                                                </span>) : ''}
                                                            <SelectProducts
                                                                myVal={this.state.id_product ? ({ value: this.state.id_product, label: this.state.product_name }) : ''}
                                                                onChange={this.onchangeSelect.bind(this)} />
                                                        </Form.Group>

                                                    </Form.Row>

                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="members">
                                                            <Form.Label>Members</Form.Label>
                                                            {errMsg.member && this.state.tujuan === 'Pengguna tertentu' ?
                                                                (<span className="float-right text-error badge badge-danger">{errMsg.member}
                                                                </span>) : ''}
                                                            <SelectProvMulti
                                                                myVal={this.state.multiValue && this.state.multiValue}
                                                                getData={this.state.selectOptions}
                                                                isLoading={this.state.loadArea}
                                                                onChange={this.handleMultiChange.bind(this)}
                                                            />
                                                        </Form.Group>
                                                        <Form.Group as={Col} controlId="content">
                                                            <Form.Label>Pesan</Form.Label>
                                                            {errMsg.content ?
                                                                (<span className="float-right text-error badge badge-danger">{errMsg.content}
                                                                </span>) : ''}
                                                            <Form.Control as="textarea" rows={5}
                                                                name="content"
                                                                value={this.state.content}
                                                                onChange={this.handleChange.bind(this)} />
                                                        </Form.Group>
                                                    </Form.Row>

                                                </div>

                                                <div className="card-footer">
                                                    <Link to="/blast">
                                                        <Button style={{ marginRight: 5 }} variant="danger">Cancel</Button>
                                                    </Link>
                                                    <AppButton
                                                        isLoading={this.state.isLoading}
                                                        onClick={this.handleSubmit.bind(this)}
                                                        theme="success">
                                                        Simpan
                                                    </AppButton>
                                                </div>
                                            </Form>
                                        </div>

                                    )}
                                    {/* /.card */}
                                </div>
                            </div>
                        </div>
                    </section>

                    <AppModal
                        show={this.state.showConfirm}
                        size="sm"
                        form={frmUser2}
                        handleClose={this.handleClose.bind(this)}
                        backdrop="static"
                        keyboard={false}
                        title="Import"
                        hideBtn={1}
                    ></AppModal>

                    {this.props.showFormSuccess ? (<AppSwalSuccess
                        show={this.props.showFormSuccess}
                        title={this.props.contentMsg}
                        type={this.props.tipeSWAL}
                        handleClose={this.closeSwal.bind(this)}>
                    </AppSwalSuccess>) : ''}

                </div>

            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    showFormSuccess: state.blast.showFormSuccess,
    contentMsg: state.blast.contentMsg,
    tipeSWAL: state.blast.tipeSWAL,
    user: state.auth.currentUser
});
const mapDispatchToPros = (dispatch) => {
    return {
        onAdd: (data) => {
            dispatch(addData(data));
        },
        closeSwall: () => {
            const _data = {};
            _data['showFormSuccess'] = false;
            _data['contentMsg'] = null;
            dispatch(addDataSuccess(_data));
            //this.props.history.push('/news');
        }
    }
}
export default connect(mapStateToProps, mapDispatchToPros)(BlastForm);