import React, { useState, Fragment, useEffect } from 'react'
import ReactDatatable from '@ashvin27/react-datatable';
import BannerService from './BannerService';
import { Button, Form, Figure, Col } from 'react-bootstrap';
import AppModal from '../components/modal/MyModal';
import { connect } from 'react-redux';
import { AppSwalSuccess } from '../components/modal/SwalSuccess';
import { SelectProducts } from '../components/modal/MySelect';

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

    const initData = { id_banner: '', id_product: '', img: '', type: '', url: '', priority_number: '', imgUpload: '' };
    const errorValidate = { img: '', priority_number: '', type: '' };
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
            key: "priority_number",
            text: "Priorty",
            align: "center",
            sortable: true
        },
        {
            key: "img",
            text: "Image",
            align: "center",
            sortable: false,
            cell: record => {
                return (
                    <div style={{ textAlign: "center" }}>
                        <Figure>
                            <Figure.Image
                                width={130}
                                height={100}
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
            align: "center",
            sortable: false,
            cell: record => {
                return (
                    <div style={{ textAlign: "center" }}>
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
        setSelected({ ...record, imgUpload: record.img })
        setShow(true);
        setActionForm("EDIT_DATA")
        setErrMsg(errorValidate);
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
        setErrMsg(errorValidate);
        let _data = new FormData();
        _data.append('id_banner', userPost.id_banner);
        _data.append('type', userPost.type);
        _data.append('priority_number', userPost.priority_number);
        userPost.type === 1 ? _data.append('id_product', userPost.id_product) : _data.append('id_product', '');
        userPost.type === 2 ? _data.append('url', userPost.url) : _data.append('url', '');
        if (actionForm === "ADD_DATA") {
            _data.append('img', userPost.img);
            _data.append('id_operator', auth.user.id_operator);
            contentSwal = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong>Success</strong>, Data berhasil ditambahkan</div>' }} />;
        }
        if (actionForm === "EDIT_DATA") {
            _data.append('img', userPost.img);
            _data.append('id_operator', auth.user.id_operator);
            contentSwal = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong style="font-size:24px;">Success</strong>, Data berhasil diubah</div>' }} />;
        }
        if (actionForm === "DELETE_DATA") {
            _data = {};
            _data = {
                id_banner: selected.id_banner,
                id_operator: auth.user.id_operator
            }
            contentSwal = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong>Success</strong>, Data berhasil dihapus</div>' }} />;
        }

        await BannerService.postData(_data, actionForm).then((res) => {
            err_code = res.data.err_code;
            setLoading(false);
            if (err_code === '06') {
                setErrMsg({ priority_number: "Number already exist" });
            }
            if (err_code === '00') {
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

    const onchangeSelect = (item) => {
        setSelected({ ...selected, id_product: item.value, product_name: item.label })
    };

    const handleChangeNumberOnly = evt => {
        const number = (evt.target.validity.valid) ? evt.target.value : selected.priority_number;
        setSelected({ ...selected, priority_number: number })
    }

    const handleSubmit = () => {
        var fileSize = selected.img.size;
        var error = null;
        if (selected.type === null || selected.type === "") {
            error = { ...error, type: "Please select type" };
        }
        if (selected.img) {
            if (fileSize > 2099200) { // satuan bytes 2099200 => 2MB
                error = { ...error, img: "File size over 2MB" };
            }
        }
        setErrMsg(error);
        if (!error) handleSave(selected);
    }

    const discardChanges = () => {
        setActionForm("ADD_DATA")
        setSelected(initData);
        setLoading(false);
        setShow(true);
        setErrMsg(errorValidate);
    }

    const frmUser = <Form id="myForm">
        <Form.Row>
            <Form.Group controlId="id_banner">
                <Form.Control type="hidden" defaultValue={selected.id_banner} />
            </Form.Group>
            <Form.Group as={Col} controlId="type">
                <Form.Label>Type</Form.Label>{errMsg.type ?
                    (<span className="float-right text-error badge badge-danger">{errMsg.type}</span>) : ''}
                <Form.Control
                    name="type"
                    size="sm"
                    as="select"
                    value={selected.type}
                    onChange={handleChange}>
                    <option value="">- Type -</option>
                    <option value="1">Product Detail</option>
                    <option value="2">Website</option>
                </Form.Control>
            </Form.Group>
            <Form.Group as={Col} controlId="priority_number">
                <Form.Label>Priority Number</Form.Label>{errMsg.priority_number ?
                    (<span className="float-right text-error badge badge-danger">{errMsg.priority_number}</span>) : ''}
                <Form.Control
                    size="sm"
                    name="priority_number"
                    type="text" pattern="[0-9]*"
                    onInput={handleChangeNumberOnly}
                    value={selected.priority_number}
                    onChange={handleChangeNumberOnly}
                    placeholder="Priority Number" />
            </Form.Group>
        </Form.Row>
        {selected.type === 2 || selected.type === "2" ? (<Form.Group controlId="url">
            <Form.Label>URL</Form.Label>
            <Form.Control
                size="sm"
                type="text"
                name="url"
                value={selected.url}
                onChange={handleChange}
                placeholder="URL" />
        </Form.Group>) : ''}

        {selected.type === 1 || selected.type === "1" ? (<Form.Group controlId="id_product">
            <Form.Label>Product</Form.Label>
            <SelectProducts
                myVal={selected.id_product ? ({ value: selected.id_product, label: selected.product_name }) : ''}
                onChange={onchangeSelect} />
        </Form.Group>) : ''}

        <Form.Group controlId="image">
            <Form.Label>Image</Form.Label>{errMsg.img ?
                (<span className="float-right text-error badge badge-danger">{errMsg.img}</span>) : null}
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

                    form={frmUser}
                    handleClose={handleClose}
                    backdrop="static"
                    keyboard={false}
                    title="Add/Edit Banner"
                    titleButton="Save change"
                    themeButton="success"
                    isLoading={isLoading}
                    formSubmit={handleSubmit}
                ></AppModal>

                {showSwalSuccess ? (<AppSwalSuccess
                    show={showSwalSuccess}
                    title={errMsg}
                    type="success"
                    handleClose={closeSwal}                >
                </AppSwalSuccess>) : ''}

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

