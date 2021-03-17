import React, { useState, useEffect } from 'react'
import Cookies from 'universal-cookie';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import ProductService from './ProductService';
import { TblProducts } from './TblProducts';
import AppModal from '../components/modal/MyModal';
import { AppSwalSuccess } from '../components/modal/SwalSuccess';

const Product = (auth) => {
    const [productList, setProductList] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [selected, setSelected] = useState({ id_product: '' });
    const [pageNumb, setPageNumb] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortOrder, setSortOrder] = useState("ASC");
    const [sortColumn, setSortColumn] = useState("product_name");
    const [filterValue, setFilterValue] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [deleteForm, setdeleteForm] = useState(false);
    const [loadTbl, setLoadTbl] = useState(true);
    const [showSwalSuccess, setshowSwalSuccess] = useState(false);
    const [errMsg, setErrMsg] = useState(null);
    const history = useHistory();
    const cookie = new Cookies();

    const handleClose = () => {
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
    const getData = async (queryString) => {
        cookie.remove('selectedIdCNI');
        setLoadTbl(true);
        await ProductService.postData(queryString)
            .then(response => {
                setTimeout(() => {
                    if (response.data.err_code === "00") {
                        setProductList(response.data.data);
                        setTotalData(response.data.total_data);
                    }
                    if (response.data.err_code === "04") {
                        setProductList([]);
                        setTotalData(0);
                    }
                    setLoadTbl(false);
                }, 300);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const handleSave = async () => {
        let err_code = '';
        let contentSwal = '-';
        setLoading(true);

        let _data = {
            id_product: selected.id_product,
            id_operator: auth.user.id_operator
        }
        contentSwal = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong>Success</strong>, Data berhasil dihapus</div>' }} />;

        await ProductService.postData(_data, "DELETE_DATA").then((res) => {
            err_code = res.data.err_code;
            setLoading(false);
            if (err_code === '00') {
                setErrMsg(contentSwal);
                setdeleteForm(false);
                setshowSwalSuccess(true);
            }
        }).catch((error) => {
            setLoading(false);
            //setErrMsg(error);
            console.log(error);
        });
    };

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

    useEffect(() => {
        const param = {
            sort_order: sortOrder,
            sort_column: sortColumn,
            keyword: filterValue,
            page_number: pageNumb,
            per_page: pageSize,
            type: 1
        }
        getData(param);

    }, [pageNumb, pageSize, sortOrder, sortColumn, filterValue]);

    const EditRecord = async (record) => {
        await cookie.set('selectedIdCNI', record.id_product);
        history.push('/edit_product');
    }

    const deleteRecord = (record) => {
        setSelected(record)
        setdeleteForm(true);
    }
    const contentDelete = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:18px; text-align:center;">Apakah anda yakin <br/>menghapus data ini ?</div>' }} />;

    return (
        <div>
            <div className="content-wrapper">
                {/* Content Header (Page header) */}
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Products</h1>
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
                                        <Link to="/add_product"><Button variant="success"><i className="fa fa-plus"></i> Add</Button>
                                        </Link>
                                    </div>
                                    <div className="card-body">
                                        {productList ? (<TblProducts
                                            records={productList}
                                            onChange={tableChangeHandler}
                                            total_record={totalData}
                                            pageNumb={pageNumb}
                                            pageSize={pageSize}
                                            loading={loadTbl}
                                            editRecord={EditRecord}
                                            deleteRecord={deleteRecord}
                                        />) : (<p>Loading...</p>)}
                                    </div>

                                </div>
                                {/* /.card */}
                            </div>
                        </div>
                    </div>
                </section>

                <AppModal
                    show={deleteForm}
                    size="sm"
                    form={contentDelete}
                    handleClose={handleClose}
                    backdrop="static"
                    keyboard={false}
                    title="Delete Product"
                    titleButton="Delete Product"
                    themeButton="danger"
                    isLoading={isLoading}
                    formSubmit={handleSave}
                ></AppModal>

                {showSwalSuccess ? (<AppSwalSuccess
                    show={showSwalSuccess}
                    title={errMsg}
                    type="success"
                    handleClose={closeSwal}                >
                </AppSwalSuccess>) : ''}

            </div>
            <div>

            </div>

        </div>
    )
}
const mapStateToProps = (state) => ({
    user: state.auth.currentUser,
});
export default connect(mapStateToProps, '')(Product);