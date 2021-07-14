import React, { useState, Fragment, useEffect } from 'react'
import ReactDatatable from '@ashvin27/react-datatable';
import { connect } from 'react-redux';
import MemberService from './MemberService';

const Members = (auth) => {
    const [memberList, setMemberList] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [pageNumb, setPageNumb] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortOrder, setSortOrder] = useState("ASC");
    const [sortColumn, setSortColumn] = useState("nama");
    const [filterValue, setFilterValue] = useState("");
    const [loadTbl, setLoadTbl] = useState(true);

    const getData = (queryString) => {
        setLoadTbl(true);
        MemberService.postData(queryString)
            .then(response => {
                setTimeout(() => {
                    if (response.data.err_code === "00") {
                        setMemberList(response.data.data);
                        setTotalData(response.data.total_data);
                    }
                    if (response.data.err_code === "04") {
                        setMemberList([]);
                        setTotalData(0);
                    }
                    setLoadTbl(false);
                }, 400);
            })
            .catch(e => {
                console.log(e);
            });
    };

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
            key: "nama",
            text: "Fullname",
            align: "center",
            sortable: true,
            cell: record => {
                return (<Fragment> {record.nama} <br />
                    {record.status === 1 ? (<span className="badge badge-success">Verified</span>) : ''}
                </Fragment>)
            }
        },
        {
            key: "email",
            text: "Email",
            align: "center",
            sortable: true,
            //cell: record => { return (<Fragment> {record.email} <br /><b>Phone</b> : {record.phone}</Fragment>) }
        },
        {
            key: "phone",
            text: "Phone",
            align: "center",
            sortable: true
        }
    ];
    const config = {
        key_column: 'id_member',
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

    useEffect(() => {
        const param = {
            sort_order: sortOrder,
            sort_column: sortColumn,
            keyword: filterValue,
            page_number: pageNumb,
            per_page: pageSize,
            type: 2
        }
        getData(param);
    }, [pageNumb, pageSize, sortOrder, sortColumn, filterValue]);

   

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
    return (
        <div>
            <div className="content-wrapper">
                {/* Content Header (Page header) */}
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Konsumen</h1>
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

                                    <div className="card-body">
                                        {memberList ? (<ReactDatatable
                                            config={config}
                                            records={memberList}
                                            columns={columns}
                                            dynamic={true}
                                            onChange={tableChangeHandler}
                                            total_record={totalData}
                                            loading={loadTbl}
                                        />) : (<p>Loading...</p>)}
                                    </div>

                                </div>


                                {/* /.card */}
                            </div>
                        </div>
                    </div>
                </section>



            </div>
            <div>

            </div>

        </div>
    )
}
const mapStateToProps = (state) => ({
    user: state.auth.currentUser,
});
export default connect(mapStateToProps, '')(Members);