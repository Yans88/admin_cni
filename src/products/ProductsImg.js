import { connect } from 'react-redux';
import React, { Component } from 'react'
import { Alert, Button, Figure, Image, ListGroup } from 'react-bootstrap'
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';
import Dropzone from "react-dropzone";
import ProductService from './ProductService';
import AppModal from '../components/modal/MyModal';
import { AppSwalSuccess } from '../components/modal/SwalSuccess';
import MyLoading from '../components/loading/MyLoading';

const cookie = new Cookies();

class ProductsImg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //loadingPage: true,
            appsLoading: false,
            isLoading:false,
            deleteForm:false,
            showSwalSuccess:false,
            contentSwal : '',
            id:'',
            selectedImg:'',
            id_product: '',
            id_operator: '',
            product_name: '',
            dtImg: [],
            fileNames: []
        }
        this.handleDrop = this.handleDrop.bind(this);
        this.deleteImg = this.deleteImg.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.closeSwal = this.closeSwal.bind(this);
    }
    componentDidMount() {
        this.setState({appsLoading:true})
        setTimeout(() => {
            this.getDataProduct();
            this.getData();
        }, 300);
    }

    getData = async () => {        
        const selectedIdCNI = cookie.get('imageIdCNI');
        const queryString = { id_product: selectedIdCNI };
        this.setState(queryString);
        await ProductService.postData(queryString, 'GET_IMAGE')
            .then(response => {
                if (response.data.err_code === "00") {
                    const dtRes = response.data.data;
                    this.setState({ dtImg: dtRes, appsLoading:false });
                }
                if (response.data.err_code === "04") {
                    this.setState({ isLoading: false,dtImg:[] });
                }
            })
            .catch(e => {
                console.log(e);
                this.setState({ isLoading: false,dtImg:[] });
            });
            //this.setState({loadingPage:false})
    };

    getDataProduct = async () => {
        const selectedIdCNI = cookie.get('imageIdCNI');
        const queryString = { id_product: selectedIdCNI };
        await ProductService.postData(queryString, 'VIEW_DETAIL')
            .then(response => {
                if (response.data.err_code === "00") {
                    const dtRes = response.data.data;
                    this.setState({ product_name: dtRes.product_name });
                }
                if (response.data.err_code === "04") {
                    console.log(response.data.data);
                }
            })
            .catch(e => {
                console.log(e);
            });
    };

    deleteImg(dtFileName) {
        this.setState({
            ...this.state,
            selectedImg:dtFileName.img, 
            id_operator: this.props.user.id_operator,
            id:dtFileName.id,
            isLoading:false,
            deleteForm:true
        });
    }

    handleDelete(){
        this.setState({...this.state,isLoading:true})
        ProductService.postData(this.state, 'DEL_IMAGE').then((res) => {
            let err_code = res.data.err_code;
            if (err_code === '00') {
                const contentSwal = <div dangerouslySetInnerHTML={{ __html: '<div style="font-size:20px; text-align:center;"><strong>Success</strong>, Data berhasil dihapus</div>' }} />;
                this.setState({ 
                    ...this.state,
                    showSwalSuccess: true,
                    deleteForm:false,
                    isLoading:false,
                    contentSwal:contentSwal 
                })
               
            } else {
                console.log(res.data);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    handleClose(){
        this.setState({isLoading:false,deleteForm:false});
    }

    closeSwal(){
        this.setState({showSwalSuccess:false,contentSwal:''});
        setTimeout(() => {
            this.getData();
        }, 300);
    }

    handleDrop(acceptedFiles, fileRejections) {
        this.setState({ id_operator: this.props.user.id_operator });
        let fd = new FormData();
        //this.setState({ fileNames: acceptedFiles.map(file => file.name) });
        acceptedFiles.map(file=>{
            fd.append('img[]',file);
            return true;
        })
        fd.append('id_operator',this.state.id_operator);
        fd.append('id_product',this.state.id_product);
        ProductService.postData(fd, 'UPLOAD_IMAGE').then((res) => {
            //this.setState({loadingPage:true})
            const err_code = res.data.err_code;
            if (err_code === '00') {
                this.getData();
            } else {
                console.log(res.data);
            }
        }).catch((error) => {
            console.log(error);
        });
        const fileReject = fileRejections.map(file => {
            let errFile = [];
            file.errors.map(err => {
                if (err.code === "file-too-large") {
                    errFile.push("File is larger than 2MB")
                } else {
                    errFile.push(err.message)
                }
                return 1;
            })
            var dt = {
                fileName: file.file.name,
                errors: errFile.join(" and ")
            }
            return dt;
        })
        this.setState({ fileNames: fileReject })
    }

    render() {
        const deleteContent =  
        <Figure>
        <Figure.Image thumbnail
        className="modal-img"
          width={171}
          height={180}
          alt=""
          style={{"maxHeight":"180px"}}
          src={this.state.selectedImg}
        />
        <Figure.Caption id="caption">
        Apakah anda yakin <br/>akan menghapus data ini ?
        </Figure.Caption>
      </Figure>
        
        return (
            
            <div>
                <div className="content-wrapper">
                    {/* Content Header (Page header) */}
                    <div className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1 className="m-0">List Image</h1>
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
                                {this.state.appsLoading ? (
                                        <MyLoading/>
                                    ) : (
                                    
                                    <div className="card shadow-lg">
                                        <div className="card-header">
                                            <h4 className="m-0">{this.state.product_name}</h4>
                                        </div>
                                        <div className="card-body my-card-body">
                                            
                                            <Dropzone onDrop={this.handleDrop}
                                                accept="image/jpeg, image/png, image/jpg"
                                                maxSize={5242880}
                                            >
                                                {({ isDragActive, isDragReject, getRootProps, getInputProps }) => (
                                                    <div {...getRootProps({ className: "dropzone" })}>
                                                        <input {...getInputProps()} />
                                                        <br />
                                                        {!isDragActive && (<p style={{"fontWeight":"600"}}>Drag & drop files, or click to select files</p>)}
                                                        {isDragReject && (<p style={{"color":"red", "fontWeight":"800"}}>File not accepted, sorry!</p>)}
                                                        {isDragActive && !isDragReject && (<p style={{"color":"lightgreen", "fontWeight":"800"}}>Drop it like it's hot!</p>)}
                                                        <em>(Only *.jpg, *.jpeg, *.png Images and Maks. size 2MB will be accepted)</em>
                                                    </div>
                                                )}
                                            </Dropzone>
                                            {this.state.fileNames.length > 0 ? (
                                                <Alert variant="danger" onClose={() => this.setState({ fileNames: [] })} dismissible>
                                                    <Alert.Heading>You got an error!</Alert.Heading>
                                                    <ListGroup variant="flush">
                                                        {this.state.fileNames.map(fileName => (
                                                            <ListGroup.Item
                                                                key={fileName.fileName}
                                                                style={{ "backgroundColor": "transparent", "paddingBottom": "4px", "paddingTop": "4px" }}>
                                                                - {fileName.fileName + " : " + fileName.errors}</ListGroup.Item>
                                                        ))}
                                                    </ListGroup>
                                                </Alert>) : ''}



                                            {this.state.dtImg.map(dtFileName => (
                                                <Figure key={dtFileName.id} className="img-product-pic" style={{ "marginRight": "10px", "marginLeft": "5px" }}>
                                                    <Image src={dtFileName.img} thumbnail width={170}
                                                        height={180} style={{"maxHeight":"180px"}} />
                                                    <span onClick={() => this.deleteImg(dtFileName)} className="remove-image">x</span>
                                                </Figure>

                                            ))}
                                            
                                        </div>

                                        <div className="card-footer">
                                            <Link to="/products">
                                                <Button variant="danger">Cancel</Button>
                                            </Link>

                                        </div>

                                    </div>

                                    )}
                                    
                                </div>
                                
                            </div>
                        </div>
                    </section>
                    <AppModal
                    show={this.state.deleteForm}
                    size="sm"
                    form={deleteContent}
                    handleClose={this.handleClose}
                    backdrop="static"
                    keyboard={false}
                    title="Delete Image"
                    titleButton="Delete Image"
                    themeButton="danger"
                    isLoading={this.state.isLoading}
                    formSubmit={this.handleDelete}
                ></AppModal>

                {this.state.showSwalSuccess ? (<AppSwalSuccess
                    show={this.state.showSwalSuccess}
                    title={this.state.contentSwal}
                    type="success"
                    handleClose={this.closeSwal}/>) : ''}

                </div>
                <div>

                </div>

            </div>
        )
    }
}
const mapStateToProps = (state) => ({ user: state.auth.currentUser });

export default connect(mapStateToProps, '')(ProductsImg);