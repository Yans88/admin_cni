import React, { Component, useState } from 'react'
import { Button, Col, Figure, Form, Row } from 'react-bootstrap'
import { SelectCategory } from '../components/modal/MySelect';
import noImg from '../assets/noPhoto.jpg'
import { connect } from 'react-redux';
import moment from 'moment';
import "moment/locale/id"
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
//https://www.npmjs.com/package/react-datetime

var yesterday = moment().subtract(1, 'day');
var valid_startDate = function (current) {
    return current.isAfter(yesterday);
};

class ProductForm extends Component {
    constructor(props) {
        super(props);
        this.state = { validSd: valid_startDate };
    }

    render() {

        //console.log(this.props.user);
        return (

            <div>
                <div className="content-wrapper">
                    {/* Content Header (Page header) */}
                    <div className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1 className="m-0">Add Product</h1>
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
                                    <div className="card shadow-lg">

                                        <div className="card-body my-card-body">
                                            <Form>
                                                <Form.Row>
                                                    <Form.Group controlId="id_banner">

                                                    </Form.Group>

                                                    <Form.Group as={Col} controlId="product_name">
                                                        <Form.Label>Product Name</Form.Label>
                                                        <Form.Control
                                                            hasValidation
                                                            required isInvalid
                                                            size="sm"
                                                            name="product_name"
                                                            type="text"
                                                            placeholder="Product Name" />
                                                        <Form.Control.Feedback type="invalid">
                                                            Please enter product name
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                    <Form.Group as={Col} xs={2} controlId="berat">
                                                        <Form.Label>Weight(Gram)</Form.Label>
                                                        <Form.Control
                                                            size="sm"
                                                            name="berat"
                                                            type="text"
                                                            placeholder="Weight(Gram)" />
                                                        <Form.Text className="text-muted float-right">
                                                            *)Required
                                                        </Form.Text>
                                                    </Form.Group>

                                                    <Form.Group as={Col} xs={2} controlId="harga">
                                                        <Form.Label>Price</Form.Label>
                                                        <Form.Control
                                                            size="sm"
                                                            name="harga"
                                                            type="text"
                                                            placeholder="Price" />
                                                        <Form.Text className="text-muted float-right">
                                                            *)Required
                                                        </Form.Text>
                                                    </Form.Group>
                                                    <Form.Group as={Col} xs={2} controlId="diskon_member">
                                                        <Form.Label>Discount Member</Form.Label>
                                                        <Form.Control
                                                            size="sm"
                                                            name="diskon_member"
                                                            type="text"
                                                            placeholder="Discount Member" />
                                                    </Form.Group>
                                                </Form.Row>

                                                <Form.Row>
                                                    <Form.Group as={Col} xs={3} controlId="category">
                                                        <Form.Label>Category</Form.Label>
                                                        <SelectCategory />

                                                    </Form.Group>
                                                    <Form.Group as={Col} xs={3} controlId="kondisi">
                                                        <Form.Label>Kondisi</Form.Label>
                                                        <Form.Control
                                                            size="sm"
                                                            name="kondisi"
                                                            type="text"
                                                            placeholder="Kondisi" />
                                                    </Form.Group>
                                                    <Form.Group as={Col} xs={2} controlId="start_date">
                                                        <Form.Label>Start Date</Form.Label>
                                                        <Datetime
                                                            inputProps={{ placeholder: 'Start Date', name: 'start_date', className: 'form-control form-control-sm' }}
                                                            locale="id" isValidDate={this.state.validSd}
                                                        />

                                                    </Form.Group>

                                                    <Form.Group as={Col} xs={2} controlId="end_date">
                                                        <Form.Label>End Date</Form.Label>
                                                        <Datetime
                                                            inputProps={{ placeholder: 'End Date', name: 'end_date', className: 'form-control form-control-sm' }}
                                                            locale="id" isValidDate={this.state.validSd}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} xs={2} controlId="qty">
                                                        <Form.Label>Quantity</Form.Label>
                                                        <Form.Control
                                                            size="sm"
                                                            name="qty"
                                                            type="text"
                                                            placeholder="Quantity" />

                                                    </Form.Group>

                                                </Form.Row>

                                                <Form.Row>
                                                    <Form.Group as={Col} controlId="video_url">
                                                        <Form.Label>URL Video</Form.Label>
                                                        <Form.Control
                                                            size="sm"
                                                            name="video_url"
                                                            type="text"
                                                            placeholder="URL Video" />

                                                    </Form.Group>

                                                    <Form.Group as={Col} xs={2} controlId="min_pembelian">
                                                        <Form.Label>Min. Pembelian</Form.Label>
                                                        <Form.Control
                                                            size="sm"
                                                            name="min_pembelian"
                                                            type="text"
                                                            placeholder="Min. Pembelian" />

                                                    </Form.Group>
                                                    <Form.Group as={Col} xs={2} controlId="special_promo">
                                                        <Form.Label>Special Promo</Form.Label>
                                                        <Row>
                                                            <Col xs={{ span: 1, offset: 3 }}>
                                                                <Form.Check
                                                                    label="No"
                                                                    type="switch"
                                                                    name="special_promo"
                                                                    custom
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </Form.Group>

                                                </Form.Row>

                                                <Form.Row>
                                                    <Form.Group as={Col} controlId="decription">
                                                        <Form.Label>Description</Form.Label>
                                                        <Form.Control size="sm" name="decription" as="textarea" rows={7} placeholder="Description" />
                                                    </Form.Group>
                                                    <Form.Group as={Col} xs={2} controlId="img">
                                                        <Form.Label>Image</Form.Label>
                                                        <Form.File size="sm" name="img" title="" style={{ "color": "rgba(0, 0, 0, 0)" }} />
                                                        <Form.Text className="text-muted">
                                                            - Extension .jpg, .jpeg, .png <br />- Maks. Size 2MB
                                                        </Form.Text>
                                                    </Form.Group>

                                                    <Form.Group as={Col} xs={2} controlId="imagePreview">
                                                        <Form.Label style={{ "color": "rgba(0, 0, 0, 0)" }}>-----</Form.Label>
                                                        <Figure>
                                                            <Figure.Image
                                                                width={130}
                                                                height={100}
                                                                alt=""
                                                                src={noImg}
                                                            />
                                                        </Figure>
                                                    </Form.Group>
                                                </Form.Row>

                                            </Form>
                                        </div>
                                        <div className="card-footer">

                                            <Button variant="danger">Cancel</Button>{' '}
                                            <Button variant="success">Simpan</Button>
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
}
const mapStateToProps = (state) => ({ user: state.auth.currentUser });

export default connect(mapStateToProps, '')(ProductForm);
