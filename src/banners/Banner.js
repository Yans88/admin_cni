import React, { useState, Fragment, useEffect } from 'react'
import ReactDatatable from '@ashvin27/react-datatable';
import BannerService from './BannerService';
import { Button, Form, Figure } from 'react-bootstrap';
import AppModal from '../components/modal/MyModal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { AppSwalSuccess } from '../components/modal/SwalSuccess';


// export const ToastDemo = ({ content }) => {
//     const { addToast } = useToasts()
//     return (
//         <Button onClick={() => addToast(content, {
//             appearance: 'success',
//             autoDismiss: true,
//         })}>
//             Add Toast
//         </Button>
//     )
// }

const Banner = (auth) => {

    const initData = { id_banner: '', id_product: '', img: '', type: '', url: '', priority_number: '' };
    const [selected, setSelected] = useState(initData);
    const [bannerList, setBannerList] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [pageNumb, setPageNumb] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortOrder, setSortOrder] = useState("ASC");
    const [sortColumn, setSortColumn] = useState("priority_number");
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
            key: "priority_number",
            text: "Priorty",
            sortable: true
        },
        {
            key: "img",
            text: "Image",
            sortable: false,
            cell: record => {
                return (
                    <div style={{ textAlign: "center" }}>
                        <Figure>
                            <Figure.Image
                                width={171}
                                height={180}
                                alt={record.type === 1 ? record.product_name : <a href={record.url} target="_blank">{record.url}</a>}
                                src={record.img}
                            />
                            <Figure.Caption>
                                {record.type === 1 ? record.product_name : <a href={record.url} target="_blank">{record.url}</a>}
                            </Figure.Caption>
                        </Figure></div>
                )
            }
        },
        {
            key: "action",
            text: "Action",
            width: 170,
            sortable: false,
            cell: record => {
                return (
                    <div style={{ textAlign: "center" }}>
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
                    </div>
                );
            }
        }
    ];
    const config = {
        key_column: 'id_banner',
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
        BannerService.postData(queryString)
            .then(response => {
                setTimeout(() => {
                    if (response.data.err_code === "00") {
                        setBannerList(response.data.data);
                        setTotalData(response.data.total_data);
                    }
                    if (response.data.err_code === "04") {
                        setBannerList([]);
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
                id_banner: selected.id_banner,
                deleted_by: auth.user.id_operator
            }
            contentSwal = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong>Success</strong>, Data berhasil dihapus</div>' }} />;
        }
        await BannerService.postData(userPost, actionForm).then((res) => {
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

    const formik = useFormik({
        initialValues: selected,
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Please enter fullname'),
            username: Yup.string()
                .required('Please enter username'),
            pass: Yup.string()
                .required('Please provide a password')
        }),
        onSubmit: (values, { setSubmitting, resetForm }) => {
            setActionForm("ADD_DATA");
            handleSave(values);
            resetForm({});
            setSubmitting(false);
        },
        onReset: (values, { setSubmitting, resetForm }) => {
            setSubmitting(false);
        }
    });

    const discardChanges = () => {
        setSelected(initData);
        formik.resetForm();
        setShow(true);
    }

    const frmUser = <Form id="myForm">
        {/* <div className="alert alert-danger alert-sm">
            <button type="button" className="close" data-dismiss="alert" aria-hidden="true">×</button>
            <span className="fw-semi-bold">Error:</span> Login failed.
        </div> */}
        <Form.Group controlId="id_admin">
            <Form.Control type="hidden" {...formik.getFieldProps('id_admin')} />
        </Form.Group>
        <Form.Group controlId="fullname">
            <Form.Label>Type</Form.Label>
            {formik.touched.name && formik.errors.name ?
                (<span className="float-right text-error badge badge-danger">{formik.errors.name}</span>) : null}
            <Form.Control name="name" size="sm" value="test val" type="text" placeholder="Fullname" {...formik.getFieldProps('name')} />
        </Form.Group>
        <Form.Group controlId="username">
            <Form.Label>Web URL</Form.Label>
            {formik.touched.username && formik.errors.username ?
                (<span className="float-right text-error badge badge-danger">{formik.errors.username}</span>) : null}
            <Form.Control size="sm" type="text" placeholder="Username" {...formik.getFieldProps('username')} />
        </Form.Group>
        <Form.Group controlId="password">
            <Form.Label>Product</Form.Label>
            {formik.touched.pass && formik.errors.pass ?
                (<span className="float-right text-error badge badge-danger">{formik.errors.pass}</span>) : null}
            <Form.Control size="sm" type="text" placeholder="Password" {...formik.getFieldProps('pass')} />
        </Form.Group>
        <Form.Group controlId="password">
            <Form.Label>Image</Form.Label>
            {formik.touched.pass && formik.errors.pass ?
                (<span className="float-right text-error badge badge-danger">{formik.errors.pass}</span>) : null}
            <Form.Control size="sm" type="text" placeholder="Password" {...formik.getFieldProps('pass')} />
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
                                <h1 className="m-0">Banner</h1>
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
                                        {bannerList ? (<ReactDatatable
                                            config={config}
                                            records={bannerList}
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
                    size="sm"
                    form={frmUser}
                    handleClose={handleClose}
                    backdrop="static"
                    keyboard={false}
                    title="Add/Edit User"
                    titleButton="Save change"
                    themeButton="success"
                    isLoading={isLoading}
                    formSubmit={formik.handleSubmit}
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
export default connect(mapStateToProps, '')(Banner);

