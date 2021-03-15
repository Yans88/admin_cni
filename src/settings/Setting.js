import React, { useState, Fragment, useEffect } from 'react'
import ReactDatatable from '@ashvin27/react-datatable';

import { Button, Form, Figure, Col } from 'react-bootstrap';
import AppModal from '../components/modal/MyModal';
import { connect } from 'react-redux';
import { AppSwalSuccess } from '../components/modal/SwalSuccess';
import Select from 'react-select';
import { SelectProducts } from '../components/modal/MySelect';



const Setting = (auth) => {

    const initData = { id_banner: '', id_product: '', img: '', type: '', url: '', priority_number: '', imgUpload: '' };

    const [selected, setSelected] = useState(initData);
    const [pageNumb, setPageNumb] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortOrder, setSortOrder] = useState("ASC");
    const [sortColumn, setSortColumn] = useState("priority_number");
    const [filterValue, setFilterValue] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const getData = (queryString) => {

    };




    const handleSave = async (userPost) => {

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


        setSelected({
            ...selected,
            [name]: val
        })
    }

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
    
    const frmUser = <Form id="myForm">
        <Form.Row>
            <Form.Group as={Col} controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    size="sm"
                    name="email"
                    type="text" pattern="[0-9]*"
                    onInput={handleChangeNumberOnly}
                    value={selected.priority_number}
                    onChange={handleChangeNumberOnly}
                    placeholder="Email" />
            </Form.Group>
            <Form.Group as={Col} controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    size="sm"
                    name="password"
                    type="text" pattern="[0-9]*"
                    onInput={handleChangeNumberOnly}
                    value={selected.priority_number}
                    onChange={handleChangeNumberOnly}
                    placeholder="Password" />
            </Form.Group>
        </Form.Row>
        <Form.Row>
            <Form.Group as={Col} controlId="call_center">
                <Form.Label>Call Center Number</Form.Label>
                <Form.Control
                    size="sm"
                    name="call_center"
                    type="text" pattern="[0-9]*"
                    onInput={handleChangeNumberOnly}
                    value={selected.priority_number}
                    onChange={handleChangeNumberOnly}
                    placeholder="Call Center Number" />
            </Form.Group>
            <Form.Group as={Col} controlId="contact_sms">
                <Form.Label>Contact SMS</Form.Label>
                <Form.Control
                    size="sm"
                    name="contact_sms"
                    type="text" pattern="[0-9]*"
                    onInput={handleChangeNumberOnly}
                    value={selected.priority_number}
                    onChange={handleChangeNumberOnly}
                    placeholder="Contact SMS" />
            </Form.Group>
        </Form.Row>

        <Form.Row>
            <Form.Group as={Col} controlId="contact_email">
                <Form.Label>Contact Email</Form.Label>
                <Form.Control
                    size="sm"
                    name="contact_email"
                    type="text" pattern="[0-9]*"
                    onInput={handleChangeNumberOnly}
                    value={selected.priority_number}
                    onChange={handleChangeNumberOnly}
                    placeholder="Contact Email" />
            </Form.Group>
            <Form.Group as={Col} controlId="contact_wa">
                <Form.Label>Contact WA</Form.Label>
                <Form.Control
                    size="sm"
                    name="contact_wa"
                    type="text" pattern="[0-9]*"
                    onInput={handleChangeNumberOnly}
                    value={selected.priority_number}
                    onChange={handleChangeNumberOnly}
                    placeholder="Contact WA" />
            </Form.Group>

        </Form.Row>

    </Form>;


    return (
        <div>
            <div className="content-wrapper">
                {/* Content Header (Page header) */}
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Setting</h1>
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

                                    </div>

                                    <div className="card-body">
                                        {frmUser}
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
    user: state.auth.currentUser
});
export default connect(mapStateToProps, '')(Setting);

