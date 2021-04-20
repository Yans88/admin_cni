import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import Header from './Header'
import MenuSidebar from './MenuSidebar'

import { connect } from 'react-redux';
import { getProfileAdmin } from '../login/LoginService';

import PageLoading from './PageLoading';
import UserList from '../../users/UserList';
import Members from '../../members/Members';
import Konsumen from '../../members/Konsumen';
import Category from '../../category/Category';
import Banner from '../../banners/Banner';
import Product from '../../products/Product';
import ProductForm from '../../products/ProductForm';
import ProductsImg from '../../products/ProductsImg';
import Setting from '../../settings/Setting';
import Provinsi from '../../area/Provinsi';
import Warehouse from '../../area/Warehouse';
import ListTrans from '../../transaksi/ListTrans';
import TransDetail from '../../transaksi/TransDetail';
import ListTransPayment from '../../transaksi/ListTransPayment';
import ListTransCompleted from '../../transaksi/ListTransCompleted';
import PriceList from '../../products/PriceList'
import News from '../../news/News';
import ListTransProcess from '../../transaksi/ListTransProcess';
import ListTransDikirim from '../../transaksi/ListTransDikirim';
import ListTransExpired from '../../transaksi/ListTransExpired';

const City = React.lazy(() => import('../../area/City'));
const Kecamatan = React.lazy(() => import('../../area/Kecamatan'));

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
    document.getElementById('root').classList.add('bg-sidebar');
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

        template = (
            <>
                <Header toggleMenuSidebar={toggleMenuSidebar} />
                <MenuSidebar toggleMenuSidebar={toggleMenuSidebar} menuCollapse={menuCollapse} />
                <PageLoading />
            </>
        );
    } else {
        template = (
            <>
                <React.Suspense fallback={<PageLoading />}>

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
                        <Route path="/warehouse" component={Warehouse} />
                        <Route path="/waiting_payment" component={ListTrans} />
                        <Route path="/payment" component={ListTransPayment} />
                        <Route path="/completed" component={ListTransCompleted} />
                        <Route path="/onprocess" component={ListTransProcess} />
                        <Route path="/dikirim" component={ListTransDikirim} />
                        <Route path="/expired" component={ListTransExpired} />
                        <Route path="/trans_detail" component={TransDetail} />
                        <Route path='/pricelist' component={PriceList}/>
                        <Route path='/setting' component={Setting}/>
                        <Route path='/news' component={News}/>
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
