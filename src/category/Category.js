import React, { useState, Fragment, useEffect } from 'react'
import ReactDatatable from '@ashvin27/react-datatable';
import CategoryService from './CategoryService';
import { Button, Form, Figure } from 'react-bootstrap';
import AppModal from '../components/modal/MyModal';
import { connect } from 'react-redux';
import { AppSwalSuccess } from '../components/modal/SwalSuccess';
import NoImg from '../assets/noPhoto.jpg'

const Category = (auth) => {
    const initData = { id_category: "", category_name: "", img: "", imgUpload: "" };
    const errorValidate = { img: '', category_name: '' };
    const [selected, setSelected] = useState(initData);
    const [categoryList, setCategoryList] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [pageNumb, setPageNumb] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortOrder, setSortOrder] = useState("ASC");
    const [sortColumn, setSortColumn] = useState("category_name");
    const [filterValue, setFilterValue] = useState("");
    const [loadTbl, setLoadTbl] = useState(true);
    const [show, setShow] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [deleteForm, setdeleteForm] = useState(false);
    const [errMsg, setErrMsg] = useState(errorValidate);
    const [actionForm, setActionForm] = useState(null);
    const [showSwalSuccess, setshowSwalSuccess] = useState(false);

    const handleClose = () => {
        setShow(false);
        setdeleteForm(false);
    };

    const closeSwal = () => {
        setshowSwalSuccess(false);
        const param = {
            sort_order: sortOrder,
            sort_column: sortColumn,
            keyword: filterValue,
            page_number: pageNumb,
            per_page: pageSize
        }
        getData(param);
    }

    const columns = [
        {
            key: "no",
            text: "No.",
            width: 20,
            align: "center",
            sortable: false,
            cell: (row, index) => <div style={{ textAlign: "center" }}>{((pageNumb - 1) * pageSize) + index + 1 + '.'}</div>,
            row: 0
        },
        {
            key: "category_name",
            text: "Category",
            align: "center",
            sortable: true
        },
        {
            key: "img",
            text: "Image",
            align: "center",
            sortable: false,
            width: 250,
            cell: record => {
                return (
                    <div style={{ textAlign: "center" }}>
                        <Figure>
                            <Figure.Image
                                thumbnail
                                width={150}
                                height={120}
                                alt={record.product_name}
                                src={record.img ? (record.img) : (NoImg)}
                            />

                            <Figure.Caption>
                                {record.product_name}
                            </Figure.Caption>
                        </Figure></div>)
            }
        },
        {
            key: "action",
            text: "Action",
            width: 122,
            align: "center",
            sortable: false,
            cell: record => {
                return (
                    <Fragment>
                        <button
                            className="btn btn-xs btn-success"
                            onClick={e => editRecord(record)}
                            style={{ marginRight: '5px' }}>
                            <i className="fa fa-edit"></i> Edit
                        </button>
                        <button
                            className="btn btn-danger btn-xs"
                            onClick={() => deleteRecord(record)}>
                            <i className="fa fa-trash"></i> Delete
                        </button>
                    </Fragment>
                );
            }
        }
    ];
    const config = {
        key_column: 'id_category',
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

    const editRecord = (record) => {
        setActionForm("EDIT_DATA")
        setSelected({ ...record, imgUpload: record.img })
        setErrMsg(errorValidate);
        setShow(true);
    }

    const deleteRecord = (record) => {
        setErrMsg(errorValidate);
        setSelected(record)
        setActionForm("DELETE_DATA")
        setdeleteForm(true);
    }

    const tableChangeHandler = (data) => {
        Object.keys(data).map((key) => {
            if (key === "sort_order" && data[key]) {
                setSortOrder(data[key].order)
                setSortColumn(data[key].column)
            }
            if (key === "page_number") {
                setPageNumb(data[key])
            }
            if (key === "page_size") {
                setPageSize(data[key])
            }
            if (key === "filter_value") {
                setFilterValue(data[key])
            }
            return true;
        });
    }
    const getData = async (queryString) => {
        setLoadTbl(true);
        await CategoryService.postData(queryString)
            .then(response => {
                setTimeout(() => {
                    if (response.data.err_code === "00") {
                        setCategoryList(response.data.data);
                        setTotalData(response.data.total_data);
                    }
                    if (response.data.err_code === "04") {
                        setCategoryList([]);
                        setTotalData(0);
                    }
                    setLoadTbl(false);
                }, 400);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const handleSave = async (userPost) => {
        let err_code = '';
        let contentSwal = '-';
        setLoading(true);
        setErrMsg(errorValidate);
        let _data = new FormData();
        _data.append('id_category', userPost.id_category);
        if (actionForm === "ADD_DATA") {
            _data.append('img', userPost.img);
            _data.append('created_by', auth.user.id_operator);
            _data.append('category_name', userPost.category_name);
            contentSwal = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong>Success</strong>, Data berhasil ditambahkan</div>' }} />;
        }
        if (actionForm === "EDIT_DATA") {
            _data.append('img', userPost.img);
            _data.append('updated_by', auth.user.id_operator);
            _data.append('category_name', userPost.category_name);
            contentSwal = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong style="font-size:24px;">Success</strong>, Data berhasil diubah</div>' }} />;
        }
        if (actionForm === "DELETE_DATA") {
            _data = {};
            _data = {
                id_category: selected.id_category,
                deleted_by: auth.user.id_operator
            }
            contentSwal = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong>Success</strong>, Data berhasil dihapus</div>' }} />;
        }

        await CategoryService.postData(_data, actionForm).then((res) => {
            err_code = res.data.err_code;
            setLoading(false);
            if (err_code !== '00') {
                setErrMsg(res.data.err_msg);
                return;
            } else {
                setShow(false);
                setdeleteForm(false);
                setErrMsg(contentSwal);
                setshowSwalSuccess(true);
            }
        }).catch((error) => {
            setLoading(false);
            setErrMsg(error)
        });
    };

    const handleSubmit = () => {
        var fileSize = selected.img.size;
        var error = null;
        if (selected.category_name === null || selected.category_name === "") {
            error = { ...error, category_name: "Please enter categoty name" };
        }
        if (selected.img) {
            if (fileSize > 2099200) { // satuan bytes 2099200 => 2MB
                error = { ...error, img: "File size over 2MB" };
            }
        }
        setErrMsg(error);
        if (!error) handleSave(selected);
    }

    useEffect(() => {
        const param = {
            sort_order: sortOrder,
            sort_column: sortColumn,
            keyword: filterValue,
            page_number: pageNumb,
            per_page: pageSize
        }
        getData(param);
    }, [pageNumb, pageSize, sortOrder, sortColumn, filterValue]);

    const discardChanges = () => {
        setActionForm("ADD_DATA")
        setSelected(initData);
        setLoading(false);
        setShow(true);
        setErrMsg(errorValidate);
    }

    const handleChange = event => {
        const { name, value } = event.target
        var val = value;
        setErrMsg(errorValidate);
        if (event.target.name === "img") {
            val = event.target.files[0];
            setSelected({ ...selected, imgUpload: "", img: "" })
            if (!val) return;
            if (!val.name.match(/\.(jpg|jpeg|png)$/)) {
                setErrMsg({ img: "Please select valid image(.jpg .jpeg .png)" });
                setLoading(true);
                return;
            }
            if (val.size > 2099200) {
                setErrMsg({ img: "File size over 2MB" });
                setLoading(true);
                return;
            }
            let reader = new FileReader();
            reader.readAsDataURL(val);
            reader.onloadend = () => {
                setSelected({ ...selected, imgUpload: reader.result, img: val })
            };
        }
        setSelected({
            ...selected,
            [name]: val
        })
    }

    const frmUser = <Form id="myForm">
        <Form.Group controlId="id_category">
            <Form.Control type="hidden" defaultValue={selected.id_category} />
        </Form.Group>
        <Form.Group controlId="category_name">
            <Form.Label>Category</Form.Label>{errMsg.category_name ?
                (<span className="float-right text-error badge badge-danger">{errMsg.category_name}</span>) : ''}
            <Form.Control size="sm" name="category_name" type="text" value={selected.category_name} onChange={handleChange} placeholder="Category" />
        </Form.Group>
        <Form.Group controlId="image">
            <Form.Label>Image</Form.Label>{errMsg.img ?
                (<span className="float-right text-error badge badge-danger">{errMsg.img}</span>) : ''}
            <Form.File size="sm" name="img" setfieldvalue={selected.img} onChange={handleChange} />
        </Form.Group>
        {selected.imgUpload ? (<Form.Group controlId="imagePreview">
            <Figure>
                <Figure.Image
                    width={130}
                    height={100}
                    alt=""
                    src={selected.imgUpload}
                />
            </Figure>
        </Form.Group>) : ''}


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
                                <h1 className="m-0">Category</h1>
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
                                <div className="card card-success shadow-lg">
                                    <div className="card-header">
                                        <Button variant="success" onClick={discardChanges}><i className="fa fa-plus"></i> Add</Button>
                                        {/* <ToastProvider
                                            placement="bottom-right" autoDismiss
                                            autoDismissTimeout={2000}
                                            TransitionState="exiting"
                                        >
                                            <ToastDemo content="Data Berhasil disimpan" />
                                        </ToastProvider> */}
                                    </div>

                                    <div className="card-body">
                                        {categoryList ? (<ReactDatatable
                                            config={config}
                                            records={categoryList}
                                            columns={columns}
                                            dynamic={true}
                                            onChange={tableChangeHandler}
                                            total_record={totalData}
                                            loading={loadTbl}
                                        />) : (<p>No Data...</p>)}
                                    </div>

                                </div>


                                {/* /.card */}
                            </div>
                        </div>
                    </div>
                </section>

                <AppModal
                    show={show}
                    form={frmUser}
                    handleClose={handleClose}
                    backdrop="static"
                    keyboard={false}
                    title="Add/Edit Category"
                    titleButton="Save change"
                    themeButton="success"
                    isLoading={isLoading}
                    formSubmit={handleSubmit}
                ></AppModal>

                {showSwalSuccess ? (<AppSwalSuccess
                    show={showSwalSuccess}
                    title={errMsg}
                    type="success"
                    handleClose={closeSwal}
                >
                </AppSwalSuccess>) : ''}

                <AppModal
                    show={deleteForm}
                    size="sm"
                    form={contentDelete}
                    handleClose={handleClose}
                    backdrop="static"
                    keyboard={false}
                    title="Delete Category"
                    titleButton="Delete Category"
                    themeButton="danger"
                    isLoading={isLoading}
                    formSubmit={handleSave}
                ></AppModal>
            </div>
            <div>

            </div>

        </div>
    )
}
const mapStateToProps = (state) => ({
    user: state.auth.currentUser
});
export default connect(mapStateToProps, "")(Category);