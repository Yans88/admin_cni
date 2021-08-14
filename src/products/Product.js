import React, { useState, useEffect } from 'react'
import Cookies from 'universal-cookie';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import ProductService from './ProductService';
import { TblProducts } from './TblProducts';
import AppModal from '../components/modal/MyModal';
import { AppSwalSuccess } from '../components/modal/SwalSuccess';
import { array } from 'yup/lib/locale';

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
        cookie.remove('imageIdCNI');
        cookie.remove('pricelistIdCNI');
        setLoadTbl(true);
        queryString.is_cms = 1;
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
        const queryString = {
            sort_order: sortOrder,
            sort_column: sortColumn,
            keyword: filterValue,
            page_number: pageNumb,
            per_page: pageSize,
            type: 1
        }
        const getData = async (queryString) => {
            setLoadTbl(true);
            queryString.is_cms = 1;
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
        getData(queryString);
        const cookie = new Cookies();
        cookie.remove('selectedIdCNI');
        cookie.remove('imageIdCNI');
        cookie.remove('pricelistIdCNI');
    }, [pageNumb, pageSize, sortOrder, sortColumn, filterValue]);

    const EditRecord = async (record) => {
        await cookie.set('selectedIdCNI', record.id_product);
        history.push('/edit_product');
    }

    const setActive = async (record) => {
        const isActive = record.is_active === 1 ? 0 : 1;
        const dt = productList;
        let _dt = array;
        let dtt = [];
        dt.map((x, key) => {
            if (x.id_product === record.id_product) {
                _dt = { ...x, is_active: isActive }
            } else {
                _dt = { ...x };
            }
            dtt[key] = _dt;
        });
        let _data = {
            id_product: record.id_product,
            status: isActive,
            id_operator: auth.user.id_operator
        }
        setProductList(dtt);

        await ProductService.postData(_data, "ACTIVE_DATA").then((res) => {

        }).catch((error) => {
            console.log(error);
            setProductList(dt);
        });
    }

    const listIMG = async (record) => {
        await cookie.set('imageIdCNI', record.id_product);
        history.push('/list_img');
    }

    const PriceList = async (record) => {
        await cookie.set('pricelistIdCNI', record.id_product);
        history.push('/pricelist');
    }

    const deleteRecord = (record) => {
        setSelected(record)
        setdeleteForm(true);
    }
    const contentDelete = <div dangerouslySetInnerHTML={{ __html: '<div id="caption" style=padding-bottom:20px;">Apakah anda yakin <br/>akan menghapus data ini ?</div>' }} />;

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
                                        {auth.user.product_add ? (
                                            <Link to="/add_product"><Button variant="success"><i className="fa fa-plus"></i> Add</Button>
                                            </Link>
                                        ) : <Button variant="success" disabled><i className="fa fa-plus"></i> Add</Button>}

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
                                            listImg={listIMG}
                                            PriceList={PriceList}
                                            deleteRecord={deleteRecord}
                                            onSetActive={setActive}
                                            hakAkses={auth.user}
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
                    handleClose={closeSwal}>
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