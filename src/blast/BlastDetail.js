import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { postData } from './blastService';
import Loading from '../components/loading/MyLoading';
import { Button, Col, Form } from 'react-bootstrap'
import moment from 'moment';
import "moment/locale/id";

class BlastDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dtRes: {},
            errMsg: {},
            list_members: [],
            appsLoading: false,
        }

    }
    componentDidMount() {
        this.getData();
    }
    getData = async () => {
        const selectedId = sessionStorage.getItem('idBlastCNI');
        this.setState({
            ...this.state,
            appsLoading: true,
            id_blast: selectedId,
            selected: { ...this.state.selected, id_blast: selectedId }
        });
        let param = {};
        param['id_blast'] = selectedId;
        postData(param, 'VIEW_DETAIL')
            .then(response => {
                setTimeout(() => {
                    if (response.data.err_code === "00") {
                        this.setState({
                            ...this.state,
                            dtRes: response.data.data,
                            list_members: response.data.list_members
                        });
                    }
                    this.setState({ ...this.state, appsLoading: false });
                }, 200);
            })
            .catch(e => {
                console.log(e);
                this.setState({ ...this.state, appsLoading: false });
            });
    }
    render() {
        console.log(this.state);
        return (
            <div>
                <div className="content-wrapper">
                    {/* Content Header (Page header) */}
                    <div className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1 className="m-0">Blast Notification Detail</h1>
                                </div>

                            </div>
                        </div>
                    </div>

                    <section className="content">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    {/* card start */}
                                    {this.state.appsLoading ? (
                                        <Loading />
                                    ) : (
                                        <div className="card shadow-lg" style={{ "height": "680px" }}>

                                            <div className="card-body my-card-body">
                                                <table className="table table-condensed">

                                                    <tbody>
                                                        <tr>
                                                            <td style={{ "backgroundColor": "rgba(0,0,0,.1)", "fontWeight": "bold", "fontSize": "16px" }} colSpan="9" align="center">
                                                                Information </td>
                                                        </tr>
                                                        <tr>
                                                            <td width="8%"><strong>Tanggal</strong></td>
                                                            <td width="1%"><strong>:</strong></td>
                                                            <td width="23%">
                                                                {moment(new Date(this.state.dtRes.created_at)).format('DD MMMM YYYY HH:mm')}
                                                            </td>
                                                            <td width="8%"><strong>Produk</strong></td>
                                                            <td width="1%"><strong>:</strong></td>
                                                            <td width="28%">{this.state.dtRes.product_name}</td>

                                                            <td width="12%"><strong>Tujuan</strong></td>
                                                            <td width="1%"><strong>:</strong></td>

                                                            <td width="17%">{this.state.dtRes.tujuan}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Pesan</strong></td>
                                                            <td><strong>:</strong></td>
                                                            <td colSpan="7">{this.state.dtRes.content ? this.state.dtRes.content : '-'}</td>
                                                        </tr>

                                                        <tr>
                                                            <td style={{ "backgroundColor": "rgba(0,0,0,.08)", "fontWeight": "bold", "fontSize": "16px" }} colSpan="9" align="center">List Members</td>
                                                        </tr>

                                                    </tbody>
                                                </table>


                                                <div className="row inbox_chat" style={{ paddingTop: 15 }}>

                                                    {this.state.list_members.map((dt, i) => (
                                                        <div key={i} className="col-md-4 col-sm-6 col-12">
                                                            <div className="info-box">

                                                                <div className="info-box-content">
                                                                    <span className="info-box-text">Nama : {dt.nama}</span>
                                                                    <span className="info-box-text">Email : {dt.email}</span>
                                                                    <span className="info-box-text">Phone : {dt.phone}</span>
                                                                    <span className="info-box-number" style={{ marginTop: 0 }}>CNI ID : {dt.cni_id ? dt.cni_id : '-'}</span>
                                                                </div>
                                                                {/* /.info-box-content */}
                                                            </div>
                                                            {/* /.info-box */}
                                                        </div>
                                                    ))}



                                                </div>

                                            </div>

                                            <div className="card-footer">
                                                <Link to="/blast">
                                                    <Button style={{ marginRight: 5 }} variant="danger">Cancel</Button>
                                                </Link>

                                            </div>

                                        </div>

                                    )}
                                    {/* /.card */}
                                </div>
                            </div>
                        </div>
                    </section>

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



export default connect(mapStateToProps, '')(BlastDetail);