import React, {Fragment} from 'react'
import ReactDatatable from '@ashvin27/react-datatable';
import NumberFormat from 'react-number-format';
import {Link} from 'react-router-dom';
import {Badge, Form, OverlayTrigger, Tooltip} from 'react-bootstrap';


export const TblProducts = props => {

    const columns = [
        {
            key: "no",
            text: "No.",
            width: 20,
            align: "center",
            sortable: false,
            cell: (row, index) => <div style={{textAlign: "center"}}>
                {((props.pageNumb - 1) * props.pageSize) + index + 1 + '.'}
            </div>,
            row: 0
        },
        {
            key: "kode_produk",
            text: "Kode Produk",
            align: "center",
            sortable: true,
        },
        {
            key: "product_name",
            text: "Product",
            align: "center",
            sortable: true,
        },
        {
            key: "category_name",
            text: "Category",
            align: "center",
            sortable: true
        },
        {
            key: "harga_member",
            text: "Hrg. Member",
            align: "center",
            sortable: true,
            width: 120,
            cell: record => {
                return (<div style={{textAlign: "right"}}>
                    <Fragment>
                        {props.hakAkses.pricelist_view ? (
                            <OverlayTrigger
                                placement="left"
                                overlay={
                                    <Tooltip id="tooltip-left">
                                        Pricelist
                                    </Tooltip>
                                }
                            >
                                <Link to='/pricelist' onClick={() => props.PriceList(record)}>
                                    <NumberFormat
                                        value={record.harga_member}
                                        thousandSeparator={true}
                                        decimalScale={2}
                                        displayType={'text'}
                                    />
                                </Link>
                            </OverlayTrigger>
                        ) : (
                            <NumberFormat
                                value={record.harga_member}
                                thousandSeparator={true}
                                decimalScale={2}
                                displayType={'text'}
                            />
                        )}
                    </Fragment>
                </div>)
            }

        },
        {
            key: "harga_konsumen",
            text: "Hrg. Konsumen",
            align: "center",
            sortable: true,
            width: 120,
            cell: record => {
                return (<div style={{textAlign: "right"}}>
                    <Fragment>
                        {props.hakAkses.pricelist_view ? (
                            <OverlayTrigger
                                placement="left"
                                overlay={
                                    <Tooltip id="tooltip-left">
                                        Pricelist
                                    </Tooltip>
                                }
                            >
                                <Link to='/pricelist' onClick={() => props.PriceList(record)}>
                                    <NumberFormat
                                        value={record.harga_konsumen}
                                        thousandSeparator={true}
                                        decimalScale={2}
                                        displayType={'text'}
                                    />
                                </Link>
                            </OverlayTrigger>
                        ) : (
                            <NumberFormat
                                value={record.harga_konsumen}
                                thousandSeparator={true}
                                decimalScale={2}
                                displayType={'text'}
                            />
                        )}

                    </Fragment>
                </div>)
            }
        },

        {
            key: "qty",
            text: "Stok",
            align: "center",
            width: 40,
            sortable: true,
            cell: record => {
                return (
                    <Fragment>
                        {record.id_product > 1 ? (
                            <OverlayTrigger
                                placement="left"
                                delay={{hide: 50}}
                                overlay={
                                    <Tooltip id="tooltip-left">
                                        Set is sold out ?
                                    </Tooltip>
                                }
                            >
                                <Link to='#' onClick={() => props.SoldOut(record)}>
                                    {record.is_sold_out === 1 ? (
                                        <Badge variant="danger"><NumberFormat
                                            value={record.qty}
                                            thousandSeparator={true}
                                            decimalScale={2}
                                            displayType={'text'}
                                        /> - Sold out</Badge>) : (
                                        <NumberFormat
                                            value={record.qty}
                                            thousandSeparator={true}
                                            decimalScale={2}
                                            displayType={'text'}
                                        />
                                    )}
                                </Link>
                            </OverlayTrigger>
                        ) : (<NumberFormat
                            value={record.qty}
                            thousandSeparator={true}
                            decimalScale={2}
                            displayType={'text'}
                        />)}

                    </Fragment>
                )
            }
        },
        {
            key: "is_active",
            text: "Active",
            width: 40,
            sortable: false,
            align: "center",
            cell: record => {
                return (
                    <div style={{textAlign: "center"}}>
                        <Fragment>
                            <Form.Check
                                disabled={record.id_product === 1 || record.id_product === 65 || record.id_product === 64 || record.id_product === 66 ? true : false}
                                id={record.id_product}
                                checked={record.is_active > 0 ? ("checked") : ""}
                                type="switch"
                                className="chk_isactive"
                                custom
                                onChange={() => props.onSetActive(record)}
                            />
                        </Fragment>
                    </div>
                );
            }
        },
        {
            key: "action",
            text: "Action",
            width: 210,
            sortable: false,
            align: "center",
            cell: record => {
                return (
                    <div style={{textAlign: "center"}}>
                        <Fragment>
                            <button
                                className="btn btn-info btn-xs"
                                onClick={() => props.listImg(record)}
                                style={{marginRight: '5px'}}>
                                <i className="fa fa-list"></i> Image
                            </button>
                            <button
                                disabled={!props.hakAkses.product_edit}
                                className="btn btn-xs btn-success"
                                onClick={() => props.editRecord(record)}
                                style={{marginRight: '5px'}}>
                                <i className="fa fa-edit"></i> Edit
                            </button>
                            <button
                                className="btn btn-xs btn-danger"
                                onClick={() => props.LimitBeli(record)}>
                                <i className="fa fa-edit"></i> Limit Beli
                            </button>
                            {/*  <button
                                disabled={!props.hakAkses.product_del}
                                className="btn btn-danger btn-xs"
                                onClick={() => props.deleteRecord(record)}>
                                <i className="fa fa-trash"></i> Delete
                            </button> */}

                        </Fragment>
                    </div>
                );
            }
        }
    ];
    const config = {
        key_column: 'id_product',
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
    return (
        <ReactDatatable
            config={config}
            records={props.records}
            columns={columns}
            dynamic={true}
            onChange={props.onChange}
            total_record={props.total_record}
            loading={props.loading}
        />
    )

}