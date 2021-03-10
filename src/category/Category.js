import React, { useState, Fragment, useEffect } from 'react'
import ReactDatatable from '@ashvin27/react-datatable';
import CategoryService from './CategoryService';
import { Button, Form, Figure } from 'react-bootstrap';
import AppModal from '../components/modal/MyModal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { AppSwalSuccess } from '../components/modal/SwalSuccess';
import NoImg from '../assets/no_photo.jpg'

const Category = (auth) => {

    const initData = { id_category: '', category_name: '', img: '' };
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
    const [errMsg, setErrMsg] = useState('');
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
            sortable: true
        },
        {
            key: "img",
            text: "Image",
            sortable: false,
            width: 250,
            cell: record => {
                return (
                    <div style={{ textAlign: "center" }}>
                        <Figure>
                            <Figure.Image
                                width={171}
                                height={180}
                                alt={record.product_name}
                                src={record.img}
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
            sortable: false,
            cell: record => {
                return (
                    <Fragment>
                        <button disabled
                            className="btn btn-xs btn-success"
                            onClick={e => editRecord(record)}
                            style={{ marginRight: '5px' }}>
                            <i className="fa fa-edit"></i> Edit
                        </button>
                        <button disabled
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
        console.log(record);
        setSelected(record)
        setShow(true);
        setActionForm("EDIT_DATA")
    }

    const deleteRecord = (record) => {
        setSelected(record)
        setdeleteForm(true);
        setActionForm("DELETE_DATA")
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
    const getData = (queryString) => {
        setLoadTbl(true);
        CategoryService.postData(queryString)
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
        setErrMsg(null);
        if (actionForm === "ADD_DATA") {
            userPost.created_by = auth.user.id_operator;
            contentSwal = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong>Success</strong>, Data berhasil ditambahkan</div>' }} />;
        }
        if (actionForm === "EDIT_DATA") {
            userPost.updated_by = auth.user.id_operator;
            contentSwal = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong style="font-size:24px;">Success</strong>, Data berhasil diubah</div>' }} />;
        }
        if (actionForm === "DELETE_DATA") {
            userPost = {};
            userPost = {
                id_category: selected.id_category,
                deleted_by: auth.user.id_operator
            }
            contentSwal = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong>Success</strong>, Data berhasil dihapus</div>' }} />;
        }
        await CategoryService.postData(userPost, actionForm).then((res) => {
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
        setSelected(initData);        
        setShow(true);
    }

    const frmUser = <Form id="myForm">
        
        <Form.Group controlId="id_category">
            <Form.Control type="hidden"/>
        </Form.Group>
        <Form.Group controlId="category_name">
            <Form.Label>Category</Form.Label>
           
            <Form.Control size="sm" type="text" placeholder="Category" />
        </Form.Group>
        <Form.Group controlId="username">
            <Form.Label>Image</Form.Label>

            <Form.File size="sm" />
        </Form.Group>
        <Form.Group controlId="username">
            <Figure>
                <Figure.Image
                    width={160}
                    height={100}
                    alt=""
                    src={NoImg}
                />


            </Figure>
        </Form.Group>

    </Form>;

    const contentDelete = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:18px; text-align:center;">Apakah anda yakin <br/>menghapus data ini ?</div>' }} />;

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
                                        <Button disabled variant="success" onClick={discardChanges}><i className="fa fa-plus"></i> Add</Button>
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
                    
                ></AppModal>

                <AppSwalSuccess
                    show={showSwalSuccess}
                    title={errMsg}
                    type="success"
                    handleClose={closeSwal}
                >
                </AppSwalSuccess>

                <AppModal
                    show={deleteForm}
                    size="sm"
                    form={contentDelete}
                    handleClose={handleClose}
                    backdrop="static"
                    keyboard={false}
                    title="Delete User"
                    titleButton="Delete User"
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
export default connect(mapStateToProps, '')(Category);

