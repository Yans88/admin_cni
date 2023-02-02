import React, {Component, Fragment} from 'react'
import {Badge, Form, Image, OverlayTrigger, Spinner, Tooltip} from 'react-bootstrap'
import noImg from '../assets/noPhoto.jpg'
import {connect} from 'react-redux';
import NumberFormat from 'react-number-format';
import AppButton from '../components/button/Button';
import {addData, addDataSuccess, postData} from './voucherService';
import {AppSwalSuccess} from '../components/modal/SwalSuccess';
import Loading from '../components/loading/MyLoading';
import {BiCheck, BiX} from "react-icons/bi";
import {BsFillTrashFill} from "react-icons/bs";
import {SelectProvMulti} from '../components/modal/MySelect';
import axios from 'axios';

class VoucherFODetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appsLoading: false,
            isLoadingSelectedProduk: false,
            isLoadingSelectedMember: false,
            selectOptionsProduk: '',
            selectOptionsMember: '',
            ttlProduct: 0,
            ttlMembers: 0,
            isLoading: false,
            loadDataProduk: false,
            loadDataMember: false,
            multiValueProduk: [],
            multiValueMember: []
        }
    }

    componentDidMount() {
        const selectedId = sessionStorage.getItem('idVoucherCNI');
        if (selectedId > 0) {
            this.getData();
        }
        this.setState({id_operator: this.props.user.id_operator});
    }

    getData = async () => {
        this.setState({appsLoading: true, isLoading: true})
        const selectedIdCNI = sessionStorage.getItem('idVoucherCNI');
        const param = {id_voucher: selectedIdCNI}
        postData(param, 'VIEW_DETAIL')
            .then(response => {
                if (response.data.err_code === "00") {
                    const dtRes = response.data.data;
                    const produk_tertentu = dtRes.produk_tertentu;
                    const user_tertentu = dtRes.user_tertentu;
                    const konsumen = dtRes.konsumen;
                    const member = dtRes.member;
                    const is_publish = dtRes.is_publish;
                    Object.keys(dtRes).map((key) => {
                        this.setState({[key]: dtRes[key]});
                        this.setState({isLoading: false, appsLoading: false});
                        return 1;
                    });
                    if (produk_tertentu > 0) {
                        this.getDataProduk();
                        if (!is_publish) this.getOptionProduk();
                    }
                    if (user_tertentu > 0) {
                        this.getDataMember();
                        if (!is_publish) this.getOptionMember(member, konsumen);

                    }
                }
                if (response.data.err_code === "04") {
                    this.setState({isLoading: false});
                }
            })
            .catch(e => {
                console.log(e);
                this.setState({isLoading: false});
            });
    };

    getDataProduk = async () => {
        this.setState({
            ...this.state,
            loadDataProduk: true,
            product: [],
            removeProduk: null
        })
        const selectedIdCNI = sessionStorage.getItem('idVoucherCNI');
        const param = {id_voucher: selectedIdCNI}
        postData(param, 'GET_LIST_PRODUK')
            .then(response => {
                if (response.data.err_code === "00") {
                    const dtRes = response.data.data;
                    this.setState({
                        ...this.state,
                        product: dtRes,
                        ttlProduct: response.data.total_data,
                        loadDataProduk: false
                    })
                }
                if (response.data.err_code === "04") {
                    this.setState({
                        ...this.state,
                        loadDataProduk: false,
                        product: [],
                        ttlProduct: 0
                    });
                }
            })
            .catch(e => {
                console.log(e);
                this.setState({isLoading: false, ttlProduct: 0});
            });
    };

    getDataMember = async () => {
        this.setState({...this.state, loadDataMember: true, members: [], removeMember: null})
        const selectedIdCNI = sessionStorage.getItem('idVoucherCNI');
        const param = {id_voucher: selectedIdCNI}
        postData(param, 'GET_LIST_MEMBER')
            .then(response => {
                if (response.data.err_code === "00") {
                    const dtRes = response.data.data;
                    this.setState({
                        ...this.state,
                        loadDataMember: false,
                        members: dtRes,
                        ttlMembers: response.data.total_data,
                        removeMember: null
                    })
                }
                if (response.data.err_code === "04") {
                    this.setState({loadDataMember: false, ttlMembers: 0});
                }
            })
            .catch(e => {
                console.log(e);
                this.setState({isLoading: false, ttlMembers: 0});
            });
    };

    async removeProduk(evt, id) {
        await this.setState({removeProduk: evt.id_product});
        this.handleSaveProduk("REMOVE_PRODUK");
    }

    async removeMember(evt, id) {
        await this.setState({removeMember: evt.id_member});
        this.handleSaveMember("REMOVE_MEMBER");
    }

    async getOptionProduk() {
        this.setState({isLoadingSelectedProduk: true});
        if (!this.state.id_operator) this.setState({id_operator: this.props.user.id_operator});
        const selectedIdCNI = sessionStorage.getItem('idVoucherCNI');
        const param = {id_voucher: selectedIdCNI}
        const url = process.env.REACT_APP_URL_API + "/list_produk_available"
        const res = await axios.post(url, param)
        const err_code = res.data.err_code
        if (err_code === '00') {
            const data = res.data.data
            const options = data.map(d => ({
                "value": d.id_product,
                "label": d.product_name
            }))
            setTimeout(() => {
                this.setState({
                    ...this.state,
                    selectOptionsProduk: options,
                    isLoadingSelectedProduk: false
                })
            }, 400);
        } else {
            setTimeout(() => {
                this.setState({
                    ...this.state,
                    selectOptionsProduk: null,
                    isLoadingSelectedProduk: true
                })
            }, 400);

        }
    }

    async getOptionMember(member, konsumen) {
        this.setState({isLoadingSelectedProduk: true});
        if (!this.state.id_operator) this.setState({id_operator: this.props.user.id_operator});
        const selectedIdCNI = sessionStorage.getItem('idVoucherCNI');
        const param = {id_voucher: selectedIdCNI, member: member, konsumen: konsumen}
        const url = process.env.REACT_APP_URL_API + "/list_member_available"
        const res = await axios.post(url, param)
        const err_code = res.data.err_code
        if (err_code === '00') {
            const data = res.data.data
            const options = data.map(d => ({
                "value": d.id_member,
                "label": d.nama
            }))
            setTimeout(() => {
                this.setState({
                    ...this.state,
                    selectOptionsMember: options,
                    isLoadingSelectedMember: false
                })
            }, 400);
        } else {
            setTimeout(() => {
                this.setState({
                    ...this.state,
                    selectOptionsMember: null,
                    isLoadingSelectedMember: true
                })
            }, 400);
        }
    }

    handleMultiChange(option) {
        this.setState(state => {
            return {
                multiValueProduk: option
            };
        });
    }

    handleMultiChangeMember(option) {
        this.setState(state => {
            return {
                multiValueMember: option
            };
        });
    }

    async handleSaveProduk(action) {
        this.setState({
            ...this.state,
            loadDataProduk: true,
        });
        let id_prod = [];
        Object.values(this.state.multiValueProduk).forEach(
            (val) => id_prod.push(val.value)
        );
        const param = {
            id_operator: this.state.id_operator,
            id_voucher: this.state.id_voucher,
            id_prod: this.state.removeProduk ? this.state.removeProduk : id_prod
        }
        postData(param, action)
            .then(response => {
                if (response.data.err_code === "00") {
                    this.getDataProduk();
                    this.getOptionProduk();
                    this.setState({multiValueProduk: [], loadDataProduk: false})
                }

            })
            .catch(e => {
                console.log(e);
                this.setState({loadDataProduk: false});
            });
    }

    async handleSaveMember(action) {
        this.setState({
            ...this.state,
            loadDataMember: true,
        });
        let id_members = [];
        Object.values(this.state.multiValueMember).forEach(
            (val) => id_members.push(val.value)
        );
        const param = {
            id_operator: this.state.id_operator,
            id_voucher: this.state.id_voucher,
            id_member: this.state.removeMember ? this.state.removeMember : id_members
        }
        postData(param, action)
            .then(response => {
                if (response.data.err_code === "00") {
                    this.getDataMember();
                    this.getOptionMember(this.state.member, this.state.konsumen);
                    this.setState({multiValueMember: [], loadDataMember: false})
                }
            })
            .catch(e => {
                console.log(e);
                this.setState({loadDataMember: false});
            });
    }

    render() {
        const {product, members} = this.state;
        return (
            <div>
                <div className="content-wrapper">
                    {/* Content Header (Page header) */}
                    <div className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1 className="m-0">Voucher Detail</h1>
                                </div>

                            </div>
                        </div>
                    </div>

                    <section className="content">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-3">
                                    {/* card start */}
                                    {this.state.appsLoading ? (
                                        <Loading/>
                                    ) : (
                                        <div className="card shadow-lg">
                                            <div className="card-body box-profile">
                                                <div className="text-center">
                                                    <Image className="img-fluid" src={this.state.img}
                                                           alt="Voucher picture"/>

                                                </div>
                                                <h3 className="profile-username text-center">{this.state.title}</h3>
                                                <p className="text-muted text-center">{this.state.kode_voucher}</p>
                                                <ul className="list-group list-group-unbordered mb-3">
                                                    <li className="list-group-item">
                                                        <b>Min.Pembelian</b>
                                                        <div className="float-right">
                                                            <NumberFormat
                                                                value={this.state.min_pembelian}
                                                                thousandSeparator={true}
                                                                decimalScale={2}
                                                                displayType={'text'}
                                                            />
                                                        </div>
                                                    </li>
                                                    <li className="list-group-item">
                                                        <b>Potongan</b>
                                                        <div className="float-right">
                                                            {this.state.potongan > 0 ? (
                                                                <NumberFormat
                                                                    value={this.state.potongan}
                                                                    thousandSeparator={true}
                                                                    decimalScale={2}
                                                                    displayType={'text'}
                                                                />
                                                            ) : 0}

                                                            {this.state.satuan_potongan === 2 ? ('%') : ''}
                                                        </div>
                                                    </li>
                                                    <li className="list-group-item">
                                                        <b>Maks. Potongan</b>
                                                        <div className="float-right">
                                                            <NumberFormat
                                                                value={this.state.max_potongan}
                                                                thousandSeparator={true}
                                                                decimalScale={2}
                                                                displayType={'text'}
                                                            />

                                                        </div>
                                                    </li>
                                                    <li className="list-group-item">
                                                        <b>Kuota</b>
                                                        <div className="float-right">
                                                            {this.state.is_limited > 0 ? (
                                                                <NumberFormat
                                                                    value={this.state.kuota}
                                                                    thousandSeparator={true}
                                                                    decimalScale={2}
                                                                    displayType={'text'}
                                                                />
                                                            ) : ('~')}
                                                        </div>
                                                    </li>
                                                    <li className="list-group-item">
                                                        <b>User Tertentu</b>
                                                        <div className="float-right">
                                                            {this.state.user_tertentu ? (
                                                                <BiCheck style={{color: "#2E997B", fontSize: 20}}/>) : (
                                                                <BiX style={{color: "red", fontSize: 20}}/>)}
                                                        </div>
                                                    </li>
                                                    <li className="list-group-item">
                                                        <b>Produk Tertentu</b>
                                                        <div className="float-right">
                                                            {this.state.produk_tertentu ? (
                                                                <BiCheck style={{color: "#2E997B", fontSize: 20}}/>) : (
                                                                <BiX style={{color: "red", fontSize: 20}}/>)}
                                                        </div>
                                                    </li>
                                                    <li className="list-group-item">
                                                        <b>Member</b>
                                                        <div className="float-right">
                                                            {this.state.member ? (
                                                                <BiCheck style={{color: "#2E997B", fontSize: 20}}/>) : (
                                                                <BiX style={{color: "red", fontSize: 20}}/>)}
                                                        </div>
                                                    </li>
                                                    <li className="list-group-item">
                                                        <b>Konsumen</b>
                                                        <div className="float-right">
                                                            {this.state.konsumen ? (
                                                                <BiCheck style={{color: "#2E997B", fontSize: 20}}/>) : (
                                                                <BiX style={{color: "red", fontSize: 20}}/>)}
                                                        </div>
                                                    </li>
                                                    <li className="list-group-item">
                                                        <b>Mobile</b>
                                                        <div className="float-right">
                                                            {this.state.mobile ? (
                                                                <BiCheck style={{color: "#2E997B", fontSize: 20}}/>) : (
                                                                <BiX style={{color: "red", fontSize: 20}}/>)}
                                                        </div>
                                                    </li>
                                                    <li className="list-group-item">
                                                        <b>Website</b>
                                                        <div className="float-right">
                                                            {this.state.website ? (
                                                                <BiCheck style={{color: "#2E997B", fontSize: 20}}/>) : (
                                                                <BiX style={{color: "red", fontSize: 20}}/>)}
                                                        </div>
                                                    </li>
                                                    <li className="list-group-item">
                                                        <b>Is Show</b>
                                                        <div className="float-right">
                                                            {this.state.is_show ? (
                                                                <BiCheck style={{color: "#2E997B", fontSize: 20}}/>) : (
                                                                <BiX style={{color: "red", fontSize: 20}}/>)}
                                                        </div>
                                                    </li>
                                                </ul>

                                            </div>
                                        </div>

                                    )}
                                    {/* /.card */}
                                </div>
                                <div className="col-md-9">
                                    {this.state.appsLoading ? (
                                        <Loading/>
                                    ) : (
                                        <div className="card shadow-lg" style={{minHeight: 820, maxHeight: 820}}>
                                            <div className="card-header p-2">
                                                <ul className="nav nav-pills">
                                                    <li className="nav-item"><a className="nav-link active"
                                                                                href="#activity"
                                                                                data-toggle="tab">Main</a></li>
                                                    {this.state.produk_tertentu ? (
                                                        <li className="nav-item"><a className="nav-link" href="#produk"
                                                                                    data-toggle="tab">
                                                            <Badge variant="primary"
                                                                   style={{marginRight: 5, fontSize: "90%"}}>
                                                                <NumberFormat
                                                                    value={this.state.ttlProduct}
                                                                    thousandSeparator={true}
                                                                    decimalScale={0}
                                                                    displayType={'text'}
                                                                />
                                                            </Badge>
                                                            Produk
                                                        </a></li>) : ''}
                                                    {this.state.user_tertentu ? (
                                                        <li className="nav-item"><a className="nav-link" href="#member"
                                                                                    data-toggle="tab">
                                                            <Badge variant="primary"
                                                                   style={{marginRight: 5, fontSize: "90%"}}>
                                                                <NumberFormat
                                                                    value={this.state.ttlMembers}
                                                                    thousandSeparator={true}
                                                                    decimalScale={0}
                                                                    displayType={'text'}
                                                                />
                                                            </Badge>
                                                            Members
                                                        </a></li>) : ''}
                                                </ul>
                                            </div>
                                            <div className="card-body tab_voucher">
                                                <div className="tab-content">
                                                    <div className="tab-pane active" id="activity">

                                                        <dl>
                                                            {this.state.tipe === 3 ? (
                                                                <Fragment>
                                                                    <dt>Produk Utama</dt>
                                                                    <dd>{this.state.produk_utama_name}</dd>
                                                                    <hr/>
                                                                    <dt>Produk Bonus</dt>
                                                                    <dd>{this.state.produk_bonus_name}</dd>
                                                                    <hr/>
                                                                </Fragment>
                                                            ) : ''}

                                                            <dt>Short Deskripsi</dt>
                                                            <dd>
                                                                <div
                                                                    dangerouslySetInnerHTML={{__html: this.state.short_description}}/>
                                                            </dd>
                                                            <hr/>
                                                            <dt>Deskripsi</dt>
                                                            <dd>
                                                                <div
                                                                    dangerouslySetInnerHTML={{__html: this.state.deskripsi}}/>
                                                            </dd>
                                                        </dl>
                                                    </div>
                                                    <div className="tab-pane" id="produk">
                                                        {!this.state.is_publish ? (
                                                            <Fragment>
                                                                <Form.Label>Produk Available</Form.Label>
                                                                <SelectProvMulti
                                                                    myVal={this.state.multiValueProduk}
                                                                    getData={this.state.selectOptionsProduk}
                                                                    isLoading={this.state.isLoadingSelectedProduk}
                                                                    onChange={this.handleMultiChange.bind(this)}
                                                                />
                                                                <AppButton
                                                                    style={{"marginTop": "3px", "marginBottom": "15px"}}
                                                                    className="float-right btn-sm"
                                                                    onClick={this.handleSaveProduk.bind(this, 'SAVE_PRODUK')}
                                                                    theme="warning"
                                                                    disabled={this.state.multiValueProduk.length > 0 ? false : true}
                                                                    isLoading={this.state.loadDataProduk}>Assign Product
                                                                </AppButton>
                                                                <br/><br/><br/>
                                                            </Fragment>
                                                        ) : ''}

                                                        {this.state.loadDataProduk ? (
                                                            <div className="loadings text-center">
                                                                <Spinner animation="border" variant="secondary"/>
                                                                <br/>
                                                                Loading ...
                                                            </div>
                                                        ) : (
                                                            <ul className="products-list product-list-in-card pl-2 pr-2 todo-list ui-sortable"
                                                                data-widget="todo-list">
                                                                {product ? (
                                                                    product.map((dt, i) => (
                                                                        <li key={i} className="item"
                                                                            style={{borderLeft: "none"}}>
                                                                            <div className="product-img">
                                                                                <Image src={dt.img ? dt.img : noImg}
                                                                                       alt="Product Image"
                                                                                       className="img-size-50"/>
                                                                            </div>
                                                                            <div className="product-info">
                                                                                <span className="text"
                                                                                      style={{marginLeft: 0}}>{dt.product_name}</span>
                                                                                {!this.state.is_publish ? (
                                                                                    <div className="tools float-right">
                                                                                        <OverlayTrigger
                                                                                            placement="top"
                                                                                            // id={`tooltip-${placement}`}
                                                                                            overlay={
                                                                                                <Tooltip
                                                                                                    id="tooltip-top">
                                                                                                    Remove Produk
                                                                                                </Tooltip>
                                                                                            }
                                                                                        >
                                                                                            <i className="fas">{
                                                                                                <BsFillTrashFill
                                                                                                    onClick={this.removeProduk.bind(this, dt)}/>}</i>
                                                                                        </OverlayTrigger>
                                                                                    </div>
                                                                                ) : ''}

                                                                                <span className="product-description">
                                                                                    {dt.short_description}
                                                                                </span>

                                                                            </div>
                                                                        </li>
                                                                    ))
                                                                ) : ''}
                                                            </ul>
                                                        )}

                                                    </div>
                                                    <div className="tab-pane" id="member">
                                                        {!this.state.is_publish ? (
                                                            <Fragment>
                                                                <Form.Label>Member Available</Form.Label>
                                                                <SelectProvMulti
                                                                    myVal={this.state.multiValueMember}
                                                                    getData={this.state.selectOptionsMember}
                                                                    isLoading={this.state.isLoadingSelectedMember}
                                                                    onChange={this.handleMultiChangeMember.bind(this)}
                                                                />
                                                                <AppButton
                                                                    style={{"marginTop": "3px", "marginBottom": "15px"}}
                                                                    className="float-right btn-sm"
                                                                    onClick={this.handleSaveMember.bind(this, 'SAVE_MEMBER')}
                                                                    theme="warning"
                                                                    disabled={this.state.multiValueMember.length > 0 ? false : true}
                                                                    isLoading={this.state.loadDataMember}>Assign Member
                                                                </AppButton>
                                                                <br/><br/><br/>
                                                            </Fragment>
                                                        ) : ''}

                                                        {this.state.loadDataMember ? (
                                                            <div className="loadings text-center">
                                                                <Spinner animation="border" variant="secondary"/>
                                                                <br/>
                                                                Loading ...
                                                            </div>
                                                        ) : (
                                                            <ul className="products-list product-list-in-card pl-2 pr-2 todo-list ui-sortable"
                                                                data-widget="todo-list">
                                                                {members ? (
                                                                    members.map((dt, i) => (
                                                                        <li key={i} className="item"
                                                                            style={{borderLeft: "none"}}>
                                                                            <div className="product-img">
                                                                                <Image src={dt.img ? dt.img : noImg}
                                                                                       alt="Product Image"
                                                                                       className="img-size-50"/>
                                                                            </div>
                                                                            <div className="product-info">
                                                                                <span className="text"
                                                                                      style={{marginLeft: 0}}>{dt.nama}</span>
                                                                                {!this.state.is_publish ? (
                                                                                    <div className="tools float-right">
                                                                                        <OverlayTrigger
                                                                                            placement="top"
                                                                                            // id={`tooltip-${placement}`}
                                                                                            overlay={
                                                                                                <Tooltip
                                                                                                    id="tooltip-top">
                                                                                                    Remove Member
                                                                                                </Tooltip>
                                                                                            }
                                                                                        >
                                                                                            <i className="fas">{
                                                                                                <BsFillTrashFill
                                                                                                    onClick={this.removeMember.bind(this, dt)}/>}</i>
                                                                                        </OverlayTrigger>
                                                                                    </div>
                                                                                ) : ''}

                                                                                <span className="product-description">
                                                                                    {dt.cni_id ? 'CNI ID : ' + dt.cni_id :
                                                                                        <Badge style={{marginLeft: 0}}
                                                                                               variant="warning">Konsumen</Badge>}
                                                                                </span>

                                                                            </div>
                                                                        </li>
                                                                    ))
                                                                ) : ''}
                                                            </ul>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                        </div>)}
                                </div>
                            </div>
                        </div>
                    </section>

                    {this.props.showFormSuccess ? (<AppSwalSuccess
                        show={this.props.showFormSuccess}
                        title={this.props.contentMsg}
                        type={this.props.tipeSWAL}
                        handleClose={this.handleClose.bind(this)}
                    >
                    </AppSwalSuccess>) : ''}


                </div>
                <div>

                </div>

            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        user: state.auth.currentUser,
        contentMsg: state.voucher.contentMsg,
        showFormSuccess: state.voucher.showFormSuccess,
        tipeSWAL: state.voucher.tipeSWAL,
    }
}

const mapDispatchToPros = (dispatch) => {
    return {
        onAdd: (data) => {
            //console.log(data);
            dispatch(addData(data));
        },
        closeSwal: () => {
            const _data = {};
            _data['showFormSuccess'] = false;
            _data['contentMsg'] = null;
            dispatch(addDataSuccess(_data));

        }
    }
}
export default connect(mapStateToProps, mapDispatchToPros)(VoucherFODetail);