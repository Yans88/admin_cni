import React, {Component} from 'react'

export default class Home extends Component {
    render() {
        return (

            <div>
                <div className="content-wrapper">
                    {/* Content Header (Page header) */}
                    <div className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1 className="m-0">Home</h1>
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
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    {/* card start */}
                                    <div className="card shadow-lg" style={{"height": "450px", textAlign: "center"}}>
                                        <div className="card-body my-card-body">
                                            <br/><br/><br/><br/><br/><br/>
                                            <h1>Selamat Datang</h1>
                                            <h3>Di Halaman Admin <strong>CNI</strong></h3>
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
