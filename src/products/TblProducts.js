import React, { Fragment } from 'react'
import ReactDatatable from '@ashvin27/react-datatable';

export const TblProducts = props => {
   
    const columns = [
        {
            key: "no",
            text: "No.",
            width: 20,
            align: "center",
            sortable: false,
            cell: (row, index) => <div style={{ textAlign: "center" }}>
                {((props.pageNumb - 1) * props.pageSize) + index + 1 + '.'}
            </div>,
            row: 0
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
            key: "harga",
            text: "Harga",
            align: "center",
            sortable: true,
            cell: record => { return (<Fragment> {record.harga} <br /><b>Diskon Member</b> : {record.diskon_member}</Fragment>) }
        },
        {
            key: "qty",
            text: "Stok",
            align: "center",
            sortable: true
        },
        {
            key: "action",
            text: "Action",
            width: 122,
            sortable: false,
            align: "center",
            cell: record => {
                return (
                    <div style={{ textAlign: "center" }}>
                        <Fragment>
                            <button disabled
                                className="btn btn-xs btn-success"
                                onClick={e => props.editRecord(record)}
                                style={{ marginRight: '5px' }}>
                                <i className="fa fa-edit"></i> Edit
                        </button>
                            <button disabled
                                className="btn btn-danger btn-xs"
                                onClick={() => props.deleteRecord(record)}>
                                <i className="fa fa-trash"></i> Delete
                        </button>
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
            loading={props.loadTbl}
        />
    )

}