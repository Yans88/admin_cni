import React, { useState, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Header from './Header'
import MenuSidebar from './MenuSidebar'

import { connect } from 'react-redux';
import UserList from '../../users/UserList';
import { getProfileAdmin } from '../login/LoginService';
import Members from '../../members/Members';
import Konsumen from '../../members/Konsumen';
import Category from '../../category/Category';
import Banner from '../../banners/Banner';
import Provinsi from '../../area/Provinsi';
import City from '../../area/City';
import Kecamatan from '../../area/Kecamatan';
const Product = React.lazy(() => import('../../products/Product'));
const Setting = React.lazy(() => import('../../settings/Setting'));
const ProductForm = React.lazy(() => import('../../products/ProductForm'));
const ProductsImg = React.lazy(() => import('../../products/ProductsImg'));


const Main = ({ onUserLoad }) => {

    const [appLoadingState, updateAppLoading] = useState(false);
    const [menuCollapse, setMenuCollapse] = useState(false)
    const [menusidebarState, updateMenusidebarState] = useState({
        isMenuSidebarCollapsed: false
    });

    const toggleMenuSidebar = () => {
        updateMenusidebarState({
            isMenuSidebarCollapsed: !menusidebarState.isMenuSidebarCollapsed
        });
        menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
    };

    useEffect(() => {
        updateAppLoading(true);
        const fetchProfile = async () => {
            try {
                const response = await getProfileAdmin();
                onUserLoad({ ...response });
                updateAppLoading(false);
            } catch (error) {
                updateAppLoading(false);
            }
        };
        fetchProfile();
        updateAppLoading(false);
        return () => { };
    }, [onUserLoad]);

    document.getElementById('root').classList.remove('login-page');
    document.getElementById('root').classList.remove('hold-transition');

    document.getElementById('root').className += ' sidebar-mini';

    if (menusidebarState.isMenuSidebarCollapsed) {
        document.getElementById('root').classList.add('sidebar-collapse');
        document.getElementById('root').classList.remove('sidebar-open');
        document.getElementById('root').classList.add('active');
    } else {
        document.getElementById('root').classList.remove('active');
        document.getElementById('root').classList.add('sidebar-open');
        document.getElementById('root').classList.remove('sidebar-collapse');
    }

    let template;
    const getBasename = path => path.substr(0, path.lastIndexOf('/'));
    if (appLoadingState) {
        template = 'Running ....';
    } else {
        template = (
            <>
                <React.Suspense fallback="waiting">
                    <Header toggleMenuSidebar={toggleMenuSidebar} />

                    <MenuSidebar toggleMenuSidebar={toggleMenuSidebar} menuCollapse={menuCollapse} />

                    <Switch basename={getBasename(window.location.pathname)}>

                        <Route path="/users" component={UserList} />
                        <Route path="/konsumen" component={Konsumen} />
                        <Route path="/category" component={Category} />
                        <Route path="/products" component={Product} />
                        <Route path="/banners" component={Banner} />
                        <Route exact path="/" component={Banner} />
                        <Route path="/members" component={Members} />
                        <Route path="/setting" component={Setting} />
                        <Route path="/add_product" component={ProductForm} />
                        <Route path="/edit_product" component={ProductForm} />
                        <Route path="/list_img" component={ProductsImg} />
                        <Route path="/provinsi" component={Provinsi} />
                        <Route path="/city" component={City} />
                        <Route path="/kecamatan" component={Kecamatan} />
                    </Switch>
                </React.Suspense>
                
            </>
        );
    }

    return template;
};


const mapDispatchToProps = (dispatch) => ({
    onUserLoad: (user) =>
        dispatch({ type: "LOAD_USER", currentUser: user })
});

export default connect('', mapDispatchToProps)(Main);
