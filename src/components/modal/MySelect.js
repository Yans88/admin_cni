import React, { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";

const wait = () => {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve();
        }, 200);
    });
};

const customStyles = {
    valueContainer: (styles) => ({
        ...styles, padding: '0px 8px'
    }),
    indicatorsContainer: (styles) => ({
        ...styles, padding: '4px'
    }),
    indicatorSeparator: (styles) => ({
        ...styles, marginBottom: '4px', marginTop: '4px'
    }),
    dropdownIndicator: (styles) => ({
        ...styles, padding: '1px'
    }),
    clearIndicator: (styles) => ({
        ...styles, padding: '1px'
    }),
    control: (styles) => ({
        // none of react-select's styles are passed to <Control />
        ...styles, minHeight: 24, height: 30
    }),
    option: (styles) => ({
        ...styles,
        borderBottom: '1px dotted pink',
        paddingTop: 5, paddingBottom: 5
    }),
    noOptionsMessage: (styles) => ({
        ...styles,
        padding: 5,
    }),
}

// const customStyless = {
//     option: (style) => ({
//         ...style,
//         borderBottom: '1px dotted pink',
//         paddingTop: 5, paddingBottom: 5
//     }),
//     control: (style) => ({
//         // none of react-select's styles are passed to <Control />
//         ...style,
//         height: 32,
//         minHeight: 24
//     }),
//     singleValue: (style) => ({
//         ...style,
//         paddingTop: 0
//     }),
//     dropdownIndicator: (style) => ({
//         ...style,
//         padding: 0,
//         paddingLeft: 4, paddingRight: 4
//     }),
//     indicatorsContainer: (style) => ({
//         ...style,
//         padding: 0,
//         paddingLeft: 4
//     }),
//     indicatorSeparator: (style) => ({
//         ...style,
//         marginTop: 4, marginBottom: 4
//     })
// }

export const SelectProducts = props => {
    const [loading, setLoading] = useState(true);
    
    const getAsyncData = (param) => {
        const url = process.env.REACT_APP_URL_API + "/product/?per_page=" + param.per_page + "&page_number=" + param.page_number + "&keyword=" + param.keyword
        return wait().then(() => {
            const urlFetch = fetch(url).then(res => res.json()).then(dt => dt);
            return urlFetch;
        });
    };

    const getData = (search, loadedOptions, { page }) => {
        let param = {
            per_page: 25,
            page_number: page,
            keyword: search
        }
        return getAsyncData(param).then(result => {
            setLoading(false);           
            if (result.err_code === '00') {
                const ttlDataShow = param.page_number * param.per_page;
                return {
                    options: result.data,
                    hasMore: ttlDataShow < result.total_data ? true : false,
                    additional: {
                        page: page + 1
                    }
                }
            } else {
                
                return {
                    options: [{ value: 0, label: "No Option" }],
                    hasMore: false,
                    additional: {
                        page: page + 1
                    }
                }
            }

        });
    };

    return (
        <AsyncPaginate
            name="id_product"
            isDisabled={loading}           
            loadOptions={getData} // function that executes HTTP request and returns array of options
            defaultOptions
            value={props.myVal || ''}
            onChange={props.onChange}
            placeholder={loading ? "Loading..." : "Select...."}
            styles={customStyles}
            additional={{
                page: 1
            }}
        // isDisabled={loading} // uncomment this to disable dropdown until options loaded
        />
    );
}

export const SelectCategory = props => {
    const [loading, setLoading] = useState(true);
    
    const getAsyncData = (param) => {
        const url = process.env.REACT_APP_URL_API + "/category/?per_page=" + param.per_page + "&page_number=" + param.page_number + "&keyword=" + param.keyword
        return wait().then(() => {
            const urlFetch = fetch(url).then(res => res.json()).then(dt => dt);
            return urlFetch;
        });
    };

    const getData = (search, loadedOptions, { page }) => {
        let param = {
            per_page: 25,
            page_number: page,
            keyword: search
        }
        return getAsyncData(param).then(result => {
            setLoading(false);           
            if (result.err_code === '00') {
                const ttlDataShow = param.page_number * param.per_page;
                return {
                    options: result.data,
                    hasMore: ttlDataShow < result.total_data ? true : false,
                    additional: {
                        page: page + 1
                    }
                }
            } else {
                
                return {
                    options: [{ value: 0, label: "No Option" }],
                    hasMore: false,
                    additional: {
                        page: page + 1
                    }
                }
            }

        });
    };

    return (
        <AsyncPaginate
            name="id_product"
            isDisabled={loading}           
            loadOptions={getData} // function that executes HTTP request and returns array of options
            defaultOptions
            value={props.myVal || ''}
            onChange={props.onChange}
            placeholder={loading ? "Loading..." : "Select...."}
            styles={customStyles}
            additional={{
                page: 1
            }}
        // isDisabled={loading} // uncomment this to disable dropdown until options loaded
        />
    );
}
