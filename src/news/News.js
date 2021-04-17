import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import { fetchData, addData, addForm, addDataSuccess, showConfirmDel, deleteData, clearAddDataError } from './newsService';
import { Button, Form, Figure, Col, Row } from 'react-bootstrap';
import AppModal from '../components/modal/MyModal';
import { AppSwalSuccess } from '../components/modal/SwalSuccess';
import ReactDatatable from '@ashvin27/react-datatable';


class News extends Component {
    constructor(props) {
        super(props);
        this.initSelected = {
            id_news: '',
            title: '',
            filename: '',
            path_file: '',
            id_operator: '',
            img: '',
            imgUpload: ''
        }
        this.state = {
            sort_order: "ASC",
            sort_column: "title",
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
            selected: { ...record, imgUpload: record.img }
        });
        this.props.showForm(true);
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
        if (event.target.name === "path_file") {
            val = event.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(val);
            reader.onloadend = () => {
                this.setState({ loadingForm: false, selected: { ...this.state.selected, path_file: val } });
            };
        }
        if (event.target.name === "img") {
            val = event.target.files[0];
            this.setState({ selected: { ...this.state.selected, imgUpload: "", img: "" } });
            if (!val) return;
            if (!val.name.match(/\.(jpg|jpeg|png)$/)) {
                this.setState({ loadingForm: true, errMsg: { ...this.state.errMsg, img: "Please select valid image(.jpg .jpeg .png)" } });

                //setLoading(true);
                return;
            }
            if (val.size > 2099200) {
                this.setState({ loadingForm: true, errMsg: { ...this.state.errMsg, img: "File size over 2MB" } });

                //setLoading(true);
                return;
            }
            let reader = new FileReader();
            reader.readAsDataURL(val);
            reader.onloadend = () => {
                this.setState({ loadingForm: false, selected: { ...this.state.selected, imgUpload: reader.result, img: val } });
            };
        }

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
        errors.title = !this.state.selected.title ? "Title required" : '';
        errors.path_file = !this.state.selected.path_file ? "File required" : '';
        errors.img = this.state.selected.img.size > 2099200 ? "File size over 2MB" : '';

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
        const { data } = this.props;
        const { selected, errMsg } = this.state;
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
                key: "path_file",
                text: "File",
                align: "center",
                sortable: false,
                cell: record => {
                    return (
                        <Fragment>
                            <a href={record.path_file} title={record.filename} target="_blank" rel="noopener noreferrer">{record.filename}</a>
                        </Fragment>
                    )
                }
            },
            {
                key: "img",
                text: "Image",
                align: "center",
                width: 200,
                sortable: false,
                cell: record => {
                    return (
                        <div style={{ textAlign: "center" }}>
                            <Figure>
                                <Figure.Image
                                    thumbnail
                                    width={150}
                                    height={120}
                                    alt={record.title}
                                    src={record.img}
                                />
                                <Figure.Caption>
                                    {record.title}
                                </Figure.Caption>
                            </Figure></div>
                    )
                }
            },
            {
                key: "action",
                text: "Action",
                width: 130,
                align: "center",
                sortable: false,
                cell: record => {
                    return (
                        <div style={{ textAlign: "center" }}>
                            <Fragment>
                                <button
                                    className="btn btn-xs btn-success"
                                    onClick={e => this.editRecord(record)}
                                    style={{ marginRight: '5px' }}>
                                    <i className="fa fa-edit"></i> Edit
                                </button>
                                <button
                                    className="btn btn-danger btn-xs"
                                    onClick={() => this.deleteRecord(record)}>
                                    <i className="fa fa-trash"></i> Delete
                            </button>
                            </Fragment>
                        </div>
                    );
                }
            }
        ];
        const config = {
            key_column: 'id_news',
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
                <Form.Label>Title</Form.Label>

                {errMsg.title ?
                    (<span className="float-right text-error badge badge-danger">{errMsg.title}
                    </span>) : ''}
                <Form.Control
                    size="sm"
                    autoComplete="off"
                    name="title"
                    type="text"
                    onInput={this.handleChange.bind(this)}
                    value={selected.title}
                    onChange={this.handleChange.bind(this)}
                    placeholder="Title" />
            </Form.Group>
            <Row>
                <Col xs={6}>
                    <Form.Group controlId="img">
                        <Form.Label>Image</Form.Label>{errMsg.img ?
                            (<span className="float-right text-error badge badge-danger">{errMsg.img}</span>) : null}
                        <Form.File size="sm" name="img" setfieldvalue={selected.img} onChange={this.handleChange.bind(this)} />
                    </Form.Group>
                    {selected.imgUpload ? (<Form.Group controlId="imagePreview">
                        <Figure>
                            <Figure.Image
                                thumbnail
                                width={130}
                                height={100}
                                alt=""
                                src={selected.imgUpload}
                            />
                        </Figure>
                    </Form.Group>) : ''}
                </Col>
                <Col xs={6}>
                    <Form.Group controlId="path_file">
                        <Form.Label>File</Form.Label>{errMsg.path_file ?
                            (<span className="float-right text-error badge badge-danger">{errMsg.path_file}</span>) : null}
                        <Form.File size="sm" name="path_file" setfieldvalue={selected.path_file} onChange={this.handleChange.bind(this)} />
                        {selected.filename ? (
                            <Fragment>
                                <Form.Label style={{ paddingTop: 10, marginBottom: 0 }}>Current File:
                    </Form.Label>{selected.filename}
                            </Fragment>
                        ) : null}
                    </Form.Group>
                </Col>

            </Row>
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
                                    <h1 className="m-0">News</h1>
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
                                            <Button variant="success" onClick={this.discardChanges}><i className="fa fa-plus"></i> Add</Button>

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
                        form={frmUser}
                        backdrop="static"
                        keyboard={false}
                        title="Add/Edit News"
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
                        title="Delete News"
                        titleButton="Delete News"
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
        data: state.news.data || [],
        isLoading: state.news.isLoading,
        isAddLoading: state.news.isAddLoading,
        error: state.news.error || null,
        errorPriority: state.news.errorPriority || null,
        totalData: state.news.totalData || 0,
        showFormAdd: state.news.showFormAdd,
        contentMsg: state.news.contentMsg,
        showFormSuccess: state.news.showFormSuccess,
        showFormDelete: state.news.showFormDelete,
        tipeSWAL: state.news.tipeSWAL,
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
                sort_column: "title",
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

export default connect(mapStateToProps, mapDispatchToPros)(News);