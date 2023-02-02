import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux';
import {addData, fetchData, postData} from './levelService';
import {Card, Form} from 'react-bootstrap';
import CardColumns from 'react-bootstrap/CardColumns';
import Loading from '../components/loading/MyLoading';

class LevelFrm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: {},
            errMsg: {},
            konsumen_all: '',
            appsLoading: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeAll = this.handleChangeAll.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    getData = async () => {
        const selectedId = sessionStorage.getItem('idLevelCNI');
        this.setState({
            ...this.state,
            appsLoading: true,
            id_level: selectedId,
            selected: {...this.state.selected, id_level: selectedId}
        });
        let param = {};
        param['id_level'] = selectedId;
        postData(param, 'VIEW_HAK_AKSES')
            .then(response => {
                setTimeout(() => {
                    if (response.data.err_code === "00") {
                        this.setState({
                            ...this.state,
                            selected: response.data.data
                        });
                    }
                    this.setState({...this.state, appsLoading: false, loadTbl: false});
                }, 200);
            })
            .catch(e => {
                console.log(e);
                this.setState({...this.state, appsLoading: false, loadTbl: false});
            });
    }

    async handleChangeAll(evt) {
        const {name} = evt.target;
        var val = this.state[name] > 0 ? 0 : 1;
        await this.setState({...this.state, [name]: val});
        if (name === "konsumen_all") {
            await this.setState({
                selected: {
                    ...this.state.selected,
                    konsumen_view: val,
                    members_view: val
                }
            });
        }
        if (name === "category_all") {
            await this.setState({
                selected: {
                    ...this.state.selected,
                    category_view: val,
                    category_add: val,
                    category_edit: val,
                    category_del: val
                }
            });
        }
        if (!this.state.selected.id_operator) await this.setState({
            selected: {
                ...this.state.selected,
                id_operator: this.props.user.id_operator
            }
        });
        this.props.onAdd(this.state.selected);
    }

    async handleChange(event) {
        const {name} = event.target;
        var val = this.state.selected[name] > 0 ? 0 : 1;
        await this.setState({
            selected: {
                ...this.state.selected,
                [name]: val,
                showFormSuccess: true
            }
        });
        if (!this.state.selected.id_operator) await this.setState({
            selected: {
                ...this.state.selected,
                id_operator: this.props.user.id_operator
            }
        });
        this.props.onAdd(this.state.selected);
    }

    render() {

        const {selected} = this.state;
        //console.log(selected.konsumen_view);
        return (
            <div>
                <div className="content-wrapper">
                    {/* Content Header (Page header) */}
                    <div className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1 className="m-0">Hak Akses {selected.level_name}</h1>
                                </div>
                                {/* /.col */}

                            </div>
                            {/* /.row */}
                        </div>
                        {/* /.container-fluid */}
                    </div>
                    {/* /.content-header */}
                    {/* Main content */}

                    <section className="content">
                        <div className="col-12">
                            {this.state.appsLoading ? (
                                <Loading/>
                            ) : (
                                <Fragment>
                                    <CardColumns>
                                        <Card className="mb-2">
                                            <Card.Body>
                                                <Card.Title><h5 className="widget-user-desc">
                                                    Data Pelanggan

                                                </h5></Card.Title>
                                                <Form.Group controlId="konsumen_all" className="hide float-right">
                                                    <Form.Check
                                                        onChange={this.handleChangeAll}
                                                        checked={selected.konsumen_view && selected.members_view ? ("checked") : ""}
                                                        name="konsumen_all"
                                                        custom
                                                    />
                                                </Form.Group>
                                                <div className="row card-text">
                                                    <div className="col-sm-6 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="konsumen_view">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.konsumen_view > 0 ? ("checked") : ""}

                                                                    label="Konsumen"
                                                                    name="konsumen_view"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    {/* /.col */}
                                                    <div className="col-sm-6">
                                                        <Form.Group controlId="members_view">
                                                            <div className="description-block">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.members_view > 0 ? "checked" : ""}
                                                                    label="Member"
                                                                    name="members_view"
                                                                    custom
                                                                />
                                                            </div>
                                                        </Form.Group>
                                                    </div>


                                                </div>
                                            </Card.Body>

                                        </Card>

                                        <Card className="mb-2">
                                            <Card.Body>
                                                <Card.Title><h5 className="widget-user-desc">Category</h5></Card.Title>
                                                <Form.Group controlId="category_all" className="hide float-right">
                                                    <Form.Check
                                                        onChange={this.handleChangeAll}
                                                        checked={selected.category_view && selected.category_add && selected.category_edit && selected.category_del ? ("checked") : ""}
                                                        name="category_all"
                                                        custom
                                                    />
                                                </Form.Group>
                                                <div className="row card-text">
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="category_view">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.category_view > 0 ? ("checked") : ""}
                                                                    label="View"
                                                                    name="category_view"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="category_add">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.category_add > 0 ? ("checked") : ""}
                                                                    label="Add"
                                                                    name="category_add"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="category_edit">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.category_edit > 0 ? ("checked") : ""}
                                                                    label="Edit"
                                                                    name="category_edit"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    {/* /.col */}
                                                    <div className="col-sm-3">
                                                        <Form.Group controlId="category_del">
                                                            <div className="description-block">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.category_del > 0 ? "checked" : ""}
                                                                    label="Delete"
                                                                    name="category_del"
                                                                    custom
                                                                />
                                                            </div>
                                                        </Form.Group>
                                                    </div>
                                                </div>
                                            </Card.Body>

                                        </Card>
                                        <Card className="mb-2">
                                            <Card.Body>
                                                <Card.Title><h5 className="widget-user-desc">Products</h5></Card.Title>
                                                <div className="row card-text">
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="product_view">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.product_view > 0 ? ("checked") : ""}
                                                                    label="View"
                                                                    name="product_view"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="product_add">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.product_add > 0 ? ("checked") : ""}
                                                                    label="Add"
                                                                    name="product_add"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="product_edit">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.product_edit > 0 ? ("checked") : ""}
                                                                    label="Edit"
                                                                    name="product_edit"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    {/* /.col */}
                                                    <div className="col-sm-3">
                                                        <Form.Group controlId="product_del">
                                                            <div className="description-block">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.product_del > 0 ? "checked" : ""}
                                                                    label="Delete"
                                                                    name="product_del"
                                                                    custom
                                                                />
                                                            </div>
                                                        </Form.Group>
                                                    </div>
                                                </div>
                                            </Card.Body>

                                        </Card>
                                    </CardColumns>

                                    <CardColumns>
                                        <Card className="mb-2">
                                            <Card.Body>
                                                <Card.Title><h5 className="widget-user-desc">Pricelist</h5></Card.Title>
                                                <div className="row card-text">
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="pricelist_view">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.pricelist_view > 0 ? ("checked") : ""}

                                                                    label="View"
                                                                    name="pricelist_view"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="pricelist_add">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.pricelist_add > 0 ? ("checked") : ""}

                                                                    label="Add"
                                                                    name="pricelist_add"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="pricelist_edit">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.pricelist_edit > 0 ? ("checked") : ""}

                                                                    label="Edit"
                                                                    name="pricelist_edit"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    {/* /.col */}
                                                    <div className="col-sm-3">
                                                        <Form.Group controlId="pricelist_del">
                                                            <div className="description-block">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.pricelist_del > 0 ? "checked" : ""}
                                                                    label="Delete"
                                                                    name="pricelist_del"
                                                                    custom
                                                                />
                                                            </div>
                                                        </Form.Group>
                                                    </div>


                                                </div>
                                            </Card.Body>

                                        </Card>

                                        <Card className="mb-2">
                                            <Card.Body>
                                                <Card.Title><h5 className="widget-user-desc">Transaksi</h5></Card.Title>
                                                <div className="row card-text">
                                                    <div className="col-sm-4 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="transaksi_view">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.transaksi_view > 0 ? ("checked") : ""}
                                                                    label="View"
                                                                    name="transaksi_view"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>

                                                    <div className="col-sm-4 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="transaksi_setkirimpaket">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.transaksi_setkirimpaket > 0 ? ("checked") : ""}
                                                                    label="Kirim Paket"
                                                                    name="transaksi_setkirimpaket"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>

                                                    {/* /.col */}
                                                    <div className="col-sm-4">
                                                        <Form.Group controlId="transaksi_setprocess">
                                                            <div className="description-block">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.transaksi_setprocess > 0 ? "checked" : ""}
                                                                    label="Set Onprocess"
                                                                    name="transaksi_setprocess"
                                                                    custom
                                                                />
                                                            </div>
                                                        </Form.Group>
                                                    </div>
                                                </div>
                                            </Card.Body>

                                        </Card>
                                        <Card className="mb-2">
                                            <Card.Body>
                                                <Card.Title><h5 className="widget-user-desc">News</h5></Card.Title>
                                                <div className="row card-text">
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="news_view">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.news_view > 0 ? ("checked") : ""}
                                                                    label="View"
                                                                    name="news_view"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="news_add">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.news_add > 0 ? ("checked") : ""}
                                                                    label="Add"
                                                                    name="news_add"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="news_edit">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.news_edit > 0 ? ("checked") : ""}
                                                                    label="Edit"
                                                                    name="news_edit"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    {/* /.col */}
                                                    <div className="col-sm-3">
                                                        <Form.Group controlId="news_del">
                                                            <div className="description-block">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.news_del > 0 ? "checked" : ""}
                                                                    label="Delete"
                                                                    name="news_del"
                                                                    custom
                                                                />
                                                            </div>
                                                        </Form.Group>
                                                    </div>
                                                </div>
                                            </Card.Body>

                                        </Card>
                                    </CardColumns>

                                    <CardColumns>
                                        <Card className="mb-2">
                                            <Card.Body>
                                                <Card.Title><h5 className="widget-user-desc">Voucher</h5></Card.Title>
                                                <div className="row card-text">
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="vouchers_view">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.vouchers_view > 0 ? ("checked") : ""}

                                                                    label="View"
                                                                    name="vouchers_view"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="vouchers_add">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.vouchers_add > 0 ? ("checked") : ""}

                                                                    label="Add"
                                                                    name="vouchers_add"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="vouchers_edit">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.vouchers_edit > 0 ? ("checked") : ""}

                                                                    label="Edit"
                                                                    name="vouchers_edit"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    {/* /.col */}
                                                    <div className="col-sm-3">
                                                        <Form.Group controlId="vouchers_del">
                                                            <div className="description-block">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.vouchers_del > 0 ? "checked" : ""}
                                                                    label="Delete"
                                                                    name="vouchers_del"
                                                                    custom
                                                                />
                                                            </div>
                                                        </Form.Group>
                                                    </div>


                                                </div>
                                            </Card.Body>

                                        </Card>
                                        <Card className="mb-2">
                                            <Card.Body>
                                                <Card.Title><h5 className="widget-user-desc">Banners</h5></Card.Title>
                                                <div className="row card-text">
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="banners_view">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.banners_view > 0 ? ("checked") : ""}

                                                                    label="View"
                                                                    name="banners_view"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="banners_add">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.banners_add > 0 ? ("checked") : ""}

                                                                    label="Add"
                                                                    name="banners_add"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="banners_edit">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.banners_edit > 0 ? ("checked") : ""}

                                                                    label="Edit"
                                                                    name="banners_edit"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    {/* /.col */}
                                                    <div className="col-sm-3">
                                                        <Form.Group controlId="banners_del">
                                                            <div className="description-block">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.banners_del > 0 ? "checked" : ""}
                                                                    label="Delete"
                                                                    name="banners_del"
                                                                    custom
                                                                />
                                                            </div>
                                                        </Form.Group>
                                                    </div>


                                                </div>
                                            </Card.Body>

                                        </Card>

                                        <Card className="mb-2">
                                            <Card.Body>
                                                <Card.Title><h5 className="widget-user-desc">Provinsi</h5></Card.Title>
                                                <div className="row card-text">
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="provinsi_view">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.provinsi_view > 0 ? ("checked") : ""}
                                                                    label="View"
                                                                    name="provinsi_view"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="provinsi_add">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.provinsi_add > 0 ? ("checked") : ""}
                                                                    label="Add"
                                                                    name="provinsi_add"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="provinsi_edit">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.provinsi_edit > 0 ? ("checked") : ""}
                                                                    label="Edit"
                                                                    name="provinsi_edit"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    {/* /.col */}
                                                    <div className="col-sm-3">
                                                        <Form.Group controlId="provinsi_del">
                                                            <div className="description-block">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.provinsi_del > 0 ? "checked" : ""}
                                                                    label="Delete"
                                                                    name="provinsi_del"
                                                                    custom
                                                                />
                                                            </div>
                                                        </Form.Group>
                                                    </div>


                                                </div>
                                            </Card.Body>

                                        </Card>
                                    </CardColumns>

                                    <CardColumns>
                                        <Card className="mb-2">
                                            <Card.Body>
                                                <Card.Title><h5 className="widget-user-desc">City</h5></Card.Title>
                                                <div className="row card-text">
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="city_view">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.city_view > 0 ? ("checked") : ""}
                                                                    label="View"
                                                                    name="city_view"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="city_add">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.city_add > 0 ? ("checked") : ""}
                                                                    label="Add"
                                                                    name="city_add"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="city_edit">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.city_edit > 0 ? ("checked") : ""}
                                                                    label="Edit"
                                                                    name="city_edit"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    {/* /.col */}
                                                    <div className="col-sm-3">
                                                        <Form.Group controlId="city_del">
                                                            <div className="description-block">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.city_del > 0 ? "checked" : ""}
                                                                    label="Delete"
                                                                    name="city_del"
                                                                    custom
                                                                />
                                                            </div>
                                                        </Form.Group>
                                                    </div>
                                                </div>
                                            </Card.Body>

                                        </Card>
                                        <Card className="mb-2">
                                            <Card.Body>
                                                <Card.Title><h5 className="widget-user-desc">Kecamatan</h5></Card.Title>
                                                <div className="row card-text">
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="kec_view">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.kec_view > 0 ? ("checked") : ""}
                                                                    label="View"
                                                                    name="kec_view"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="kec_add">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.kec_add > 0 ? ("checked") : ""}
                                                                    label="Add"
                                                                    name="kec_add"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="kec_edit">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.kec_edit > 0 ? ("checked") : ""}
                                                                    label="Edit"
                                                                    name="kec_edit"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    {/* /.col */}
                                                    <div className="col-sm-3">
                                                        <Form.Group controlId="kec_del">
                                                            <div className="description-block">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.kec_del > 0 ? "checked" : ""}
                                                                    label="Delete"
                                                                    name="kec_del"
                                                                    custom
                                                                />
                                                            </div>
                                                        </Form.Group>
                                                    </div>


                                                </div>
                                            </Card.Body>

                                        </Card>
                                        <Card className="mb-2">
                                            <Card.Body>
                                                <Card.Title><h5 className="widget-user-desc">Warehouse</h5></Card.Title>
                                                <div className="row card-text">
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="warehouse_view">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.warehouse_view > 0 ? ("checked") : ""}
                                                                    label="View"
                                                                    name="warehouse_view"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="warehouse_add">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.warehouse_add > 0 ? ("checked") : ""}
                                                                    label="Add"
                                                                    name="warehouse_add"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="warehouse_edit">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.warehouse_edit > 0 ? ("checked") : ""}
                                                                    label="Edit"
                                                                    name="warehouse_edit"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    {/* /.col */}
                                                    <div className="col-sm-3">
                                                        <Form.Group controlId="warehouse_del">
                                                            <div className="description-block">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.warehouse_del > 0 ? "checked" : ""}
                                                                    label="Delete"
                                                                    name="warehouse_del"
                                                                    custom
                                                                />
                                                            </div>
                                                        </Form.Group>
                                                    </div>


                                                </div>
                                            </Card.Body>

                                        </Card>
                                    </CardColumns>

                                    <CardColumns>
                                        <Card className="mb-2">
                                            <Card.Body>
                                                <Card.Title><h5 className="widget-user-desc">Coverage Area</h5>
                                                </Card.Title>
                                                <div className="row card-text">
                                                    <div className="col-sm-4 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="coverage_area_view">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.coverage_area_view > 0 ? ("checked") : ""}
                                                                    label="View"
                                                                    name="coverage_area_view"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    <div className="col-sm-4 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="coverage_area_add">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.coverage_area_add > 0 ? ("checked") : ""}
                                                                    label="Add"
                                                                    name="coverage_area_add"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <div className="description-block">
                                                            <Form.Group controlId="coverage_area_del">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.coverage_area_del > 0 ? ("checked") : ""}
                                                                    label="Delete"
                                                                    name="coverage_area_del"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>

                                                </div>
                                            </Card.Body>

                                        </Card>
                                        <Card className="mb-2">
                                            <Card.Body>
                                                <Card.Title><h5 className="widget-user-desc">Level</h5></Card.Title>
                                                <div className="row card-text">
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="level_view">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.level_view > 0 ? ("checked") : ""}
                                                                    label="View"
                                                                    name="level_view"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="level_add">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.level_add > 0 ? ("checked") : ""}
                                                                    label="Add"
                                                                    name="level_add"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="level_edit">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.level_edit > 0 ? ("checked") : ""}
                                                                    label="Edit"
                                                                    name="level_edit"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    {/* /.col */}
                                                    <div className="col-sm-3">
                                                        <Form.Group controlId="level_del">
                                                            <div className="description-block">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.level_del > 0 ? "checked" : ""}
                                                                    label="Delete"
                                                                    name="level_del"
                                                                    custom
                                                                />
                                                            </div>
                                                        </Form.Group>
                                                    </div>


                                                </div>
                                            </Card.Body>

                                        </Card>
                                        <Card className="mb-2">
                                            <Card.Body>
                                                <Card.Title><h5 className="widget-user-desc">Users</h5></Card.Title>
                                                <div className="row card-text">
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="users_view">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.users_view > 0 ? ("checked") : ""}
                                                                    label="View"
                                                                    name="users_view"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="users_add">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.users_add > 0 ? ("checked") : ""}
                                                                    label="Add"
                                                                    name="users_add"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="users_edit">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.users_edit > 0 ? ("checked") : ""}
                                                                    label="Edit"
                                                                    name="users_edit"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>
                                                    {/* /.col */}
                                                    <div className="col-sm-3">
                                                        <Form.Group controlId="users_del">
                                                            <div className="description-block">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.users_del > 0 ? "checked" : ""}
                                                                    label="Delete"
                                                                    name="users_del"
                                                                    custom
                                                                />
                                                            </div>
                                                        </Form.Group>
                                                    </div>


                                                </div>
                                            </Card.Body>

                                        </Card>
                                    </CardColumns>

                                    <CardColumns>
                                        <Card className="mb-2">
                                            <Card.Body>
                                                <Card.Title><h5 className="widget-user-desc">Ulasan</h5></Card.Title>
                                                <div className="row card-text">
                                                    <div className="col-sm-6 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="ulasan_view">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.ulasan_view > 0 ? ("checked") : ""}
                                                                    label="View"
                                                                    name="ulasan_view"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>

                                                    <div className="col-sm-6">
                                                        <div className="description-block">
                                                            <Form.Group controlId="ulasan_upd_status">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.ulasan_upd_status > 0 ? ("checked") : ""}
                                                                    label="Approve/Reject"
                                                                    name="ulasan_upd_status"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>

                                                </div>
                                            </Card.Body>

                                        </Card>
                                        <Card className="mb-2">
                                            <Card.Body>
                                                <Card.Title><h5 className="widget-user-desc">Setting</h5></Card.Title>
                                                <div className="row card-text">
                                                    <div className="col-sm-6 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="setting_view">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.setting_view > 0 ? ("checked") : ""}
                                                                    label="View"
                                                                    name="setting_view"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>

                                                    <div className="col-sm-6">
                                                        <div className="description-block">
                                                            <Form.Group controlId="setting_update">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.setting_update > 0 ? ("checked") : ""}
                                                                    label="Edit"
                                                                    name="setting_update"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>

                                                </div>
                                            </Card.Body>

                                        </Card>

                                        <Card className="mb-2">
                                            <Card.Body>
                                                <Card.Title><h5 className="widget-user-desc">Info Bisnis</h5>
                                                </Card.Title>
                                                <div className="row card-text">
                                                    <div className="col-sm-6 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="info_bisnis_view">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.info_bisnis_view > 0 ? ("checked") : ""}
                                                                    label="View"
                                                                    name="info_bisnis_view"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>

                                                    <div className="col-sm-6">
                                                        <div className="description-block">
                                                            <Form.Group controlId="info_bisnis_edit">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.info_bisnis_edit > 0 ? ("checked") : ""}
                                                                    label="Change File"
                                                                    name="info_bisnis_edit"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>

                                                </div>
                                            </Card.Body>

                                        </Card>


                                    </CardColumns>


                                    <CardColumns>
                                        <Card className="mb-2">
                                            <Card.Body>
                                                <Card.Title><h5 className="widget-user-desc">Report</h5></Card.Title>
                                                <div className="row card-text">
                                                    <div className="col-sm-4 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="report_header_view">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.report_header_view > 0 ? ("checked") : ""}
                                                                    label="Report Header"
                                                                    name="report_header_view"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>

                                                    <div className="col-sm-4 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="report_detail_view">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.report_detail_view > 0 ? ("checked") : ""}
                                                                    label="Report Detail"
                                                                    name="report_detail_view"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>

                                                    <div className="col-sm-4">
                                                        <div className="description-block">
                                                            <Form.Group controlId="report_logistik_view">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.report_logistik_view > 0 ? ("checked") : ""}
                                                                    label="Report Logistik"
                                                                    name="report_logistik_view"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>

                                                </div>
                                            </Card.Body>

                                        </Card>
                                        <Card className="mb-2">
                                            <Card.Body>
                                                <Card.Title><h5 className="widget-user-desc">Registrasi Mitra</h5>
                                                </Card.Title>
                                                <div className="row card-text">
                                                    <div className="col-sm-12">
                                                        <div className="description-block">
                                                            <Form.Group controlId="registrasi_mitra_view">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.registrasi_mitra_view > 0 ? ("checked") : ""}
                                                                    label="View"
                                                                    name="registrasi_mitra_view"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>


                                                </div>
                                            </Card.Body>

                                        </Card>

                                        <Card className="mb-2">
                                            <Card.Body>
                                                <Card.Title><h5 className="widget-user-desc">Simpatik</h5>
                                                </Card.Title>
                                                <div className="row card-text">
                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="simpatik_view">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.simpatik_view > 0 ? ("checked") : ""}
                                                                    label="View"
                                                                    name="simpatik_view"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>

                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="simpatik_diterima">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.simpatik_diterima > 0 ? ("checked") : ""}
                                                                    label="Set Diterima"
                                                                    name="simpatik_diterima"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>

                                                    <div className="col-sm-3 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="simpatik_upd_status">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.simpatik_upd_status > 0 ? ("checked") : ""}
                                                                    label="Approve/Reject"
                                                                    name="simpatik_upd_status"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>

                                                    <div className="col-sm-3">
                                                        <div className="description-block">
                                                            <Form.Group controlId="simpatik_set_bukti_transfer">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.simpatik_set_bukti_transfer > 0 ? ("checked") : ""}
                                                                    label="Set Transfer"
                                                                    name="simpatik_set_bukti_transfer"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>

                                                </div>
                                            </Card.Body>

                                        </Card>


                                    </CardColumns>

                                    <CardColumns>
                                        <Card className="mb-2">
                                            <Card.Body>
                                                <Card.Title><h5 className="widget-user-desc">Blast Notification</h5>
                                                </Card.Title>
                                                <div className="row card-text">
                                                    <div className="col-sm-6 border-right">
                                                        <div className="description-block">
                                                            <Form.Group controlId="blast_notification_view">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.blast_notification_view > 0 ? ("checked") : ""}
                                                                    label="View"
                                                                    name="blast_notification_view"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>

                                                    <div className="col-sm-6">
                                                        <div className="description-block">
                                                            <Form.Group controlId="blast_notification_add">
                                                                <Form.Check
                                                                    onChange={this.handleChange}
                                                                    checked={selected.blast_notification_add > 0 ? ("checked") : ""}
                                                                    label="Add"
                                                                    name="blast_notification_add"
                                                                    custom
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        {/* /.description-block */}
                                                    </div>


                                                </div>
                                            </Card.Body>

                                        </Card>


                                    </CardColumns>
                                </Fragment>
                            )}


                        </div>

                    </section>


                </div>
                <div>

                </div>

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
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
        }

    }
}

export default connect(mapStateToProps, mapDispatchToPros)(LevelFrm);