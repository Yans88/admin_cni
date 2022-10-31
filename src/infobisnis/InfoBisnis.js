import React, { Component, Fragment } from "react";
import { Alert, Col, Form } from "react-bootstrap";
import { connect } from "react-redux";
import AppButton from "../components/button/Button";
import Loading from "../components/loading/MyLoading";
import Dropzone from "react-dropzone";
import { AppSwalSuccess } from "../components/modal/SwalSuccess";
import ProductService from '../products/ProductService';
import {
  fetchData,
  fetchData2,
  addData,
  chgProps,
  addDataSuccess,
} from "../settings/settingService";

class InfoBisnis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errMsg: { email: "" },
      id_operator: "",
      fileNames: "",
	  isUploadingRancangan : false,
	  isUploadingPanduan : false,
	  isUploadingKatalog : false,
	  isUploadingInfo : false,
    };
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDropPanduan = this.handleDropPanduan.bind(this);
    this.handleDropKatalog = this.handleDropKatalog.bind(this);
    this.handleDropInfo = this.handleDropInfo.bind(this);
  }

  componentDidMount() {
    this.props.onLoad();
  }

  handleDrop(acceptedFiles, fileRejections) {
    this.setState({ isUploadingRancangan: true });
    let fd = new FormData();
    
    
    acceptedFiles.map((file) => {
    fd.append("rancangan_bisnis", file);
    return true;
    });
    // fd.append("id_operator", this.state.id_operator);

    ProductService.postData(fd, 'INFO_BISNIS').then((res) => {
	
    const err_code = res.data.err_code;
    if (err_code === '00') {
    this.props.onLoad2();
	this.setState({isUploadingRancangan:false});
    } else {
		this.setState({isUploadingRancangan:false});
    console.log(res.data);
    }
    }).catch((error) => {
		this.setState({isUploadingRancangan:false});
    console.log(error);
    });
    const fileReject = fileRejections.map((file) => {
      let errFile = [];
      file.errors.map((err) => {
        if (err.code === "file-too-large") {
          errFile.push("File is larger than 2MB");
        } else {
          errFile.push(err.message);
        }
        return 1;
      });
      var dt = {
        fileName: file.file.name,
        errors: errFile.join(" and "),
      };
	  this.setState({isUploadingRancangan:false});
      return dt;
    });
    this.setState({ fileNames: fileReject });
  }
  
   handleDropPanduan(acceptedFiles, fileRejections) {
    this.setState({ isUploadingPanduan: true });
    let fd = new FormData();
    
    
    acceptedFiles.map((file) => {
    fd.append("panduan_bisnis", file);
    return true;
    });
    // fd.append("id_operator", this.state.id_operator);

    ProductService.postData(fd, 'INFO_BISNIS').then((res) => {

    const err_code = res.data.err_code;
    if (err_code === '00') {
    this.props.onLoad2();
	this.setState({ isUploadingPanduan: false });
    } else {
    console.log(res.data);
    }
    }).catch((error) => {
    console.log(error);
	this.setState({ isUploadingPanduan: false });
    });
    const fileReject = fileRejections.map((file) => {
      let errFile = [];
      file.errors.map((err) => {
        if (err.code === "file-too-large") {
          errFile.push("File is larger than 2MB");
        } else {
          errFile.push(err.message);
        }
        return 1;
      });
      var dt = {
        fileName: file.file.name,
        errors: errFile.join(" and "),
      };
	  this.setState({isUploadingPanduan:false});
      return dt;
    });
    this.setState({ fileNames: fileReject });
  }
  
  handleDropKatalog(acceptedFiles, fileRejections) {
    this.setState({ isUploadingKatalog: true });
    let fd = new FormData();
   
    
    acceptedFiles.map((file) => {
    fd.append("katalog_produk", file);
    return true;
    });
    // fd.append("id_operator", this.state.id_operator);

    ProductService.postData(fd, 'INFO_BISNIS').then((res) => {

    const err_code = res.data.err_code;
    if (err_code === '00') {
    this.props.onLoad2();
	this.setState({ isUploadingKatalog: false });
    } else {
    console.log(res.data);
	this.setState({ isUploadingKatalog: false });
    }
    }).catch((error) => {
    console.log(error);
    });
    const fileReject = fileRejections.map((file) => {
      let errFile = [];
      file.errors.map((err) => {
        if (err.code === "file-too-large") {
          errFile.push("File is larger than 2MB");
        } else {
          errFile.push(err.message);
        }
        return 1;
      });
	  
      var dt = {
        fileName: file.file.name,
        errors: errFile.join(" and "),
      };
	  this.setState({ isUploadingKatalog: true });
      return dt;
    });
    this.setState({ fileNames: fileReject });
  }
  
  handleDropInfo(acceptedFiles, fileRejections) {
    this.setState({ isUploadingInfo: true });
    let fd = new FormData();
   
    
    acceptedFiles.map((file) => {
    fd.append("info_belanja", file);
    return true;
    });
    // fd.append("id_operator", this.state.id_operator);

    ProductService.postData(fd, 'INFO_BISNIS').then((res) => {

    const err_code = res.data.err_code;
    if (err_code === '00') {
    this.props.onLoad2();
	this.setState({ isUploadingInfo: false });
    } else {
		this.setState({ isUploadingInfo: false });
    console.log(res.data);
    }
    }).catch((error) => {
    console.log(error);
    });
    const fileReject = fileRejections.map((file) => {
      let errFile = [];
      file.errors.map((err) => {
        if (err.code === "file-too-large") {
          errFile.push("File is larger than 2MB");
        } else {
          errFile.push(err.message);
        }
        return 1;
      });
      var dt = {
        fileName: file.file.name,
        errors: errFile.join(" and "),
      };
	  this.setState({ isUploadingInfo: false });
      return dt;
    });
    this.setState({ fileNames: fileReject });
  }

  render() {
    const { data, user } = this.props;
    const { errMsg } = this.state;
    const rancangan_bisnis =
      data.rancangan_bisnis && data.rancangan_bisnis.split("/").pop();
    const panduan_bisnis =
      data.rancangan_bisnis && data.panduan_bisnis.split("/").pop();
    const katalog_produk =
      data.rancangan_bisnis && data.katalog_produk.split("/").pop();
    const info_belanja =
      data.info_belanja && data.info_belanja.split("/").pop();
	 
    return (
      <div>
        <div className="content-wrapper">
          {/* Content Header (Page header) */}
          <div className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1 className="m-0">Info Bisnis</h1>
                </div>
              </div>
            </div>
          </div>

          <section className="content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  {this.props.isLoading ? (
                    <Loading />
                  ) : (
                    <Fragment>
                      <Form>
                        <Form.Row>
                          <Form.Group
                            as={Col}
                            xs={6}
                            controlId="rancangan_bisnis"
                          >
                            <div className="card shadow-lg" style={{ "height": "290px" }}>
                              <div className="card-header">
                                <h4 className="m-0">Rancangan Bisnis</h4>
                              </div>
                              <div className="card-body my-card-body">
							  
							  {this.state.isUploadingRancangan ? (<div><div id="loader"></div>
								Uploading ...</div>
                              ) : (
							  <div>
								<Dropzone
                                  onDrop={this.handleDrop}
                                  accept="application/pdf"
                                  maxSize={16242880}
                                  multiple={false}
								  disabled = {user.info_bisnis_edit ? false : true}
                                >
                                  {({
                                    isDragActive,
                                    isDragReject,
                                    getRootProps,
                                    getInputProps,
                                  }) => (
                                    <div
                                      {...getRootProps({
                                        className: "dropzone",
                                      })}
                                    >
                                      <input {...getInputProps()} />

                                      {!isDragActive && user.info_bisnis_edit && (
                                        <p style={{ fontWeight: "600" }}>
                                          Drag & drop files, or click to select
                                          files
                                        </p>
                                      )}
									  {!user.info_bisnis_edit && (									 
										<p style={{ fontWeight: "600" , color: "red", marginTop:40}}>
                                          Change File Access Denied(403)
                                        </p>
									  )}
                                      {isDragReject && (
                                        <p
                                          style={{
                                            color: "red",
                                            fontWeight: "800",
                                          }}
                                        >
                                          File not accepted, sorry!
                                        </p>
                                      )}
                                      {isDragActive && !isDragReject && (
                                        <p
                                          style={{
                                            color: "lightgreen",
                                            fontWeight: "800",
                                          }}
                                        >
                                          Drop it like it's hot!
                                        </p>
                                      )}
									  {user.info_bisnis_edit &&(
                                      <em>(Only *.pdf will be accepted)</em>)}
                                    </div>
                                  )}
                                </Dropzone>

                                <h5 className="m-0">
                                  Filename :{" "}
                                  <a
                                    href={data.rancangan_bisnis}
                                    title="Rancangan Bisnis"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {rancangan_bisnis}
                                  </a>
                                </h5>
                                <br />
								</div>
							  )}
							  </div>
                            </div>
                          </Form.Group>

                          <Form.Group
                            as={Col}
                            xs={6}
                            controlId="panduan_bisnis"
                          >
                            <div className="card shadow-lg" style={{ "height": "290px" }}>
                              <div className="card-header">
                                <h4 className="m-0">Panduan Bisnis</h4>
                              </div>
							  
                              <div className="card-body my-card-body">
							  {this.state.isUploadingPanduan ? (<div><div id="loader"></div>
								Uploading ...</div>
                              ) : (
							  <div>
                                <Dropzone
                                  onDrop={this.handleDropPanduan}
                                  accept="application/pdf"
                                  maxSize={16242880}
                                  multiple={false}
								  disabled = {user.info_bisnis_edit ? false : true}
                                >
                                  {({
                                    isDragActive,
                                    isDragReject,
                                    getRootProps,
                                    getInputProps,
                                  }) => (
                                    <div
                                      {...getRootProps({
                                        className: "dropzone",
                                      })}
                                    >
                                      <input {...getInputProps()} />

                                      {!isDragActive && user.info_bisnis_edit && (
                                        <p style={{ fontWeight: "600" }}>
                                          Drag & drop files, or click to select
                                          files
                                        </p>
                                      )}
									  {!user.info_bisnis_edit && (									 
										<p style={{ fontWeight: "600" , color: "red", marginTop:40}}>
                                          Change File Access Denied(403)
                                        </p>
									  )}
                                      {isDragReject && (
                                        <p
                                          style={{
                                            color: "red",
                                            fontWeight: "800",
                                          }}
                                        >
                                          File not accepted, sorry!
                                        </p>
                                      )}
                                      {isDragActive && !isDragReject && (
                                        <p
                                          style={{
                                            color: "lightgreen",
                                            fontWeight: "800",
                                          }}
                                        >
                                          Drop it like it's hot!
                                        </p>
                                      )}
                                       {user.info_bisnis_edit &&(
                                      <em>(Only *.pdf will be accepted)</em>)}
                                    </div>
                                  )}
                                </Dropzone>

                                <h5 className="m-0">
                                  Filename :{" "}
                                  <a
                                    href={data.panduan_bisnis}
                                    title="Panduan Bisnis"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {panduan_bisnis}
                                  </a>
                                </h5>
                                <br />
							  </div>)}
                              </div>
                            </div>
                          </Form.Group>
                        </Form.Row>

                        <Form.Row>
                          <Form.Group
                            as={Col}
                            xs={6}
                            controlId="katalog_produk"
                          >
                            <div className="card shadow-lg" style={{ "height": "290px" }}>
                              <div className="card-header">
                                <h4 className="m-0">Katalog Produk</h4>
                              </div>
                              <div className="card-body my-card-body">
							  {this.state.isUploadingKatalog ? (<div><div id="loader"></div>
								Uploading ...</div>
                              ) : (
							  <div>
                                <Dropzone
                                  onDrop={this.handleDropKatalog}
                                  accept="application/pdf"
                                  maxSize={16242880}
                                  multiple={false}
								  disabled = {user.info_bisnis_edit ? false : true}
                                >
                                  {({
                                    isDragActive,
                                    isDragReject,
                                    getRootProps,
                                    getInputProps,
                                  }) => (
                                    <div
                                      {...getRootProps({
                                        className: "dropzone",
                                      })}
                                    >
                                      <input {...getInputProps()} />

                                      {!isDragActive && user.info_bisnis_edit && (
                                        <p style={{ fontWeight: "600" }}>
                                          Drag & drop files, or click to select
                                          files
                                        </p>
                                      )}
									  {!user.info_bisnis_edit && (									 
										<p style={{ fontWeight: "600" , color: "red", marginTop:40}}>
                                          Change File Access Denied(403)
                                        </p>
									  )}
                                      {isDragReject && (
                                        <p
                                          style={{
                                            color: "red",
                                            fontWeight: "800",
                                          }}
                                        >
                                          File not accepted, sorry!
                                        </p>
                                      )}
                                      {isDragActive && !isDragReject && (
                                        <p
                                          style={{
                                            color: "lightgreen",
                                            fontWeight: "800",
                                          }}
                                        >
                                          Drop it like it's hot!
                                        </p>
                                      )}
                                       {user.info_bisnis_edit &&(
                                      <em>(Only *.pdf will be accepted)</em>)}
                                    </div>
                                  )}
                                </Dropzone>

                                <h5 className="m-0">
                                  Filename :{" "}
                                  <a
                                    href={data.katalog_produk}
                                    title="Katalog Produk"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {katalog_produk}
                                  </a>
                                </h5>
                                <br />
							  </div>)}
                              </div>
                            </div>
                          </Form.Group>

                          <Form.Group
                            as={Col}
                            xs={6}
                            controlId="info_belanja"
                          >
                            <div className="card shadow-lg" style={{ "height": "290px" }}>
                              <div className="card-header">
                                <h4 className="m-0">Info Belanja</h4>
                              </div>
                              <div className="card-body my-card-body">
							  {this.state.isUploadingInfo ? (<div><div id="loader"></div>
								Uploading ...</div>
                              ) : (
							  <div>
                                <Dropzone
                                  onDrop={this.handleDropInfo}
                                  accept="application/pdf"
                                  maxSize={16242880}
                                  multiple={false}
								  disabled = {user.info_bisnis_edit ? false : true}
                                >
                                  {({
                                    isDragActive,
                                    isDragReject,
                                    getRootProps,
                                    getInputProps,
                                  }) => (
                                    <div
                                      {...getRootProps({
                                        className: "dropzone",
                                      })}
                                    >
                                      <input {...getInputProps()} />

                                      {!isDragActive && user.info_bisnis_edit && (
                                        <p style={{ fontWeight: "600" }}>
                                          Drag & drop files, or click to select
                                          files
                                        </p>
                                      )}
									  {!user.info_bisnis_edit && (									 
										<p style={{ fontWeight: "600" , color: "red", marginTop:40}}>
                                          Change File Access Denied(403)
                                        </p>
									  )}
                                      {isDragReject && (
                                        <p
                                          style={{
                                            color: "red",
                                            fontWeight: "800",
                                          }}
                                        >
                                          File not accepted, sorry!
                                        </p>
                                      )}
                                      {isDragActive && !isDragReject && (
                                        <p
                                          style={{
                                            color: "lightgreen",
                                            fontWeight: "800",
                                          }}
                                        >
                                          Drop it like it's hot!
                                        </p>
                                      )}
                                       {user.info_bisnis_edit &&(
                                      <em>(Only *.pdf will be accepted)</em>)}
                                    </div>
                                  )}
                                </Dropzone>

                                <h5 className="m-0">
                                  Filename :{" "}
                                  <a
                                    href={data.info_belanja}
                                    title="Katalog Produk"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {info_belanja}
                                  </a>
                                </h5>
                                <br />
							  </div>)}
                              </div>
                            </div>
                          </Form.Group>
                        </Form.Row>
                      </Form>
                    </Fragment>
                  )}
                </div>
              </div>
            </div>
          </section>

          {this.props.showFormSuccess ? (
            <AppSwalSuccess
              show={this.props.showFormSuccess}
              title={this.props.contentMsg}
              type={this.props.tipeSWAL}
              handleClose={this.closeSwal.bind(this)}
            ></AppSwalSuccess>
          ) : (
            ""
          )}
        </div>
        <div></div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.setting.data || {},
    isLoading: state.setting.isLoading,
    isAddLoading: state.setting.isAddLoading,
    error: state.setting.error || null,
    contentMsg: state.setting.contentMsg,
    showFormSuccess: state.setting.showFormSuccess,
    tipeSWAL: state.setting.tipeSWAL,
    user: state.auth.currentUser,
  };
};

const mapDispatchToPros = (dispatch) => {
  return {
    onLoad: () => {
      dispatch(fetchData());
    },
	 onLoad2: () => {
      dispatch(fetchData2());
    },
    changeProps: (data) => {
      dispatch(chgProps(data));
    },
    onAdd: (data) => {
      dispatch(addData(data));
    },
    closeSwal: () => {
      const _data = {};
      _data["showFormSuccess"] = false;
      _data["isAddLoading"] = false;
      _data["contentMsg"] = null;
      dispatch(addDataSuccess(_data));
      dispatch(fetchData());
    },
  };
};
export default connect(mapStateToProps, mapDispatchToPros)(InfoBisnis);
