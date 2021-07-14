import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import { fetchData, addData, addForm, addDataSuccess, showConfirmDel, deleteData, clearAddDataError } from './levelService';
import { Button, Form } from 'react-bootstrap';
import AppModal from '../components/modal/MyModal';
import { AppSwalSuccess } from '../components/modal/SwalSuccess';
import ReactDatatable from '@ashvin27/react-datatable';
import { BsGearWideConnected } from "react-icons/bs";


class Level extends Component {
    constructor(props) {
        super(props);
        this.initSelected = {
            id_level: '',
            level_name: '',            
            id_operator: '',           
        }
        this.state = {
            sort_order: "ASC",
            sort_column: "level_name",
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

    editRecord = (record) => {
        this.setState({
            loadingForm: false,
            errMsg: this.initSelected,
            selected: { ...record}
        });
        this.props.showForm(true);
    }

    HakAkses = async (record) => {
        await sessionStorage.setItem('idLevelCNI', record.id_level);
        this.props.history.push("/permission");
    }

    deleteRecord = (record) => {
        this.setState({
            selected: { ...record, id_operator: this.props.user.id_operator }
        });
        this.props.showConfirmDel(true);
    }

    handleClose = () => {
        this.setState({
            errMsg: {},
            selected: this.initSelected,
            loadingForm: false
        });
        this.props.showForm(false);
        this.props.showConfirmDel(false);
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
        errors.level_name = !this.state.selected.level_name ? "Level name required" : '';
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

    render() {
        const { data, user } = this.props;
        const { selected, errMsg } = this.state;
        console.log(this.props);
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
                key: "level_name",
                text: "Level Name",
                align: "center",
                sortable: false,

            },
            {
                key: "action",
                text: "Action",
                width: 230,
                align: "center",
                sortable: false,
                cell: record => {
                    return (
                        <div style={{ textAlign: "center" }}>
                            <Fragment>
                                <button
                                    className="btn btn-xs btn-info"
                                    onClick={e => this.HakAkses(record)}
                                    style={{ marginRight: '5px' }}>
                                    <BsGearWideConnected /> Hak Akses
                                </button>
                                {user.level_edit ? (<button
                                    className="btn btn-xs btn-success"
                                    onClick={e => this.editRecord(record)}
                                    style={{ marginRight: '5px' }}>
                                    <i className="fa fa-edit"></i> Edit
                                </button>) : (<button
                                    className="btn btn-xs btn-success"
                                    disabled
                                    style={{ marginRight: '5px' }}>
                                    <i className="fa fa-edit"></i> Edit
                                </button>)}
                                {user.level_del && record.id_level !== 1 ? (
                                    <button
                                        className="btn btn-danger btn-xs"
                                        onClick={() => this.deleteRecord(record)}>
                                        <i className="fa fa-trash"></i> Delete
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-danger btn-xs"
                                        disabled>
                                        <i className="fa fa-trash"></i> Delete
                                    </button>
                                )}
                                
                            </Fragment>
                        </div>
                    );
                }
            }
        ];
        const config = {
            key_column: 'id_level',
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
        const frmUser = <Form id="myForm">
            <Form.Group controlId="priority_number">
                <Form.Label>Level Name</Form.Label>

                {errMsg.level_name ?
                    (<span className="float-right text-error badge badge-danger">{errMsg.level_name}
                    </span>) : ''}
                <Form.Control
                    size="sm"
                    autoComplete="off"
                    name="level_name"
                    type="text"
                    onInput={this.handleChange.bind(this)}
                    value={selected.level_name}
                    onChange={this.handleChange.bind(this)}
                    placeholder="Level Name" />
            </Form.Group>
            
        </Form>;

        const contentDelete = <div dangerouslySetInnerHTML={{ __html: '<div id="caption" style=padding-bottom:20px;">Apakah anda yakin <br/>akan menghapus data ini ?</div>' }} />;
        return (
            <div>
                
                <div className="content-wrapper">
                    {/* Content Header (Page header) */}
                    <div className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1 className="m-0">Level</h1>
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
                                        {user.level_add ? (<Button variant="success" onClick={this.discardChanges}><i className="fa fa-plus"></i> Add</Button>
                                            ) : (<Button variant="success" disabled><i className="fa fa-plus"></i> Add</Button>
                                            )}
                                            
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
                    <AppModal
                        show={this.props.showFormAdd}
                        size="sm"
                        form={frmUser}
                        backdrop="static"
                        keyboard={false}
                        title="Add/Edit Level"
                        titleButton="Save change"
                        themeButton="success"
                        handleClose={this.handleClose}
                        isLoading={this.props.isAddLoading ? this.props.isAddLoading : this.state.loadingForm}
                        formSubmit={this.handleSubmit.bind(this)}
                    ></AppModal>
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
                        title="Delete Level"
                        titleButton="Delete Level"
                        themeButton="danger"
                        isLoading={this.props.isAddLoading}
                        formSubmit={this.handleDelete.bind(this)}
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
        data: state.level.data || [],
        isLoading: state.level.isLoading,
        isAddLoading: state.level.isAddLoading,
        error: state.level.error || null,
        errorPriority: state.level.errorPriority || null,
        totalData: state.level.totalData || 0,
        showFormAdd: state.level.showFormAdd,
        contentMsg: state.level.contentMsg,
        showFormSuccess: state.level.showFormSuccess,
        showFormDelete: state.level.showFormDelete,
        tipeSWAL: state.level.tipeSWAL,
        user: state.auth.currentUser
    }
}

const mapDispatchToPros = (dispatch) => {
    return {
        onLoad: (queryString) => {
            dispatch(fetchData(queryString));
        },
        onAdd: (data) => {
            dispatch(addData(data));
        },
        onDelete: (data) => {
            dispatch(deleteData(data));
        },
        showForm: (data) => {
            dispatch(addForm(data));
        },
        showConfirmDel: (data) => {
            dispatch(showConfirmDel(data));
        },
        closeSwal: () => {
            const _data = {};
            _data['showFormSuccess'] = false;
            _data['contentMsg'] = null;
            dispatch(addDataSuccess(_data));
            const queryString = {
                sort_order: "ASC",
                sort_column: "level_name",
                per_page: 10,
                is_cms: 1
            }
            dispatch(fetchData(queryString));
        },
        clearErrProps: () => {
            dispatch(clearAddDataError());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToPros)(Level);