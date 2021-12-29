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
import LimitBeli from '../../products/LimitBeli'
import News from '../../news/News';
import ListTransProcess from '../../transaksi/ListTransProcess';
import ListTransDikirim from '../../transaksi/ListTransDikirim';
import ListTransExpired from '../../transaksi/ListTransExpired';
import ListTransHold from '../../transaksi/ListTransHold';
import Level from '../../level/Level';
import LevelFrm from '../../level/LevelFrm';
import Home from './Home';
import Forbidden from './Forbidden';
import VoucherFO from '../../vouchers/VoucherFO';
import Voucher from '../../vouchers/Voucher';
import VoucherDP from '../../vouchers/VoucherDP';
import VoucherBP from '../../vouchers/VoucherBP';
import VoucherFODetail from '../../vouchers/VoucherFODetail';
import ListUlasan from '../../ulasan/ListUlasan';
import ListUlasanApprove from '../../ulasan/ListUlasanApprove';
import ListUlasanRejected from '../../ulasan/ListUlasanRejected';
import UlasanDetail from '../../ulasan/UlasanDetail';
import BlastNotif from '../../blast/BlastNotif';
import BlastForm from '../../blast/BlastForm';
import BlastDetail from '../../blast/BlastDetail';
import ReportHeader from '../../reports/Header';
import ReportDetail from '../../reports/Detail';
import Mitra from '../../mitra/RegMitra';
import ListSimpatik from '../../simpatik/ListSimpatik';
import SimpatikDetail from '../../simpatik/SimpatikDetail';
import ListSimpatikDiterima from '../../simpatik/ListSimpatikDiterima';
import ListSimpatikApproved from '../../simpatik/ListSimpatikApproved';
import ListSimpatikRejected from '../../simpatik/ListSimpatikRejected';
import ListSimpatikCompleted from '../../simpatik/ListSimpatikCompleted';

const City = React.lazy(() => import('../../area/City'));
const Kecamatan = React.lazy(() => import('../../area/Kecamatan'));

const Main = ({ onUserLoad, user }) => {

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

                        <Route path="/users" component={user.users_view ? UserList : Forbidden} />
                        <Route path="/konsumen" component={user.konsumen_view ? Konsumen : Forbidden} />
                        <Route path="/category" component={user.category_view ? Category : Forbidden} />
                        <Route path="/products" component={user.product_view ? Product : Forbidden} />
                        <Route path="/banners" component={user.banners_view ? Banner : Forbidden} />
                        <Route exact path="/" component={Home} />
                        <Route path="/members" component={user.members_view ? Members : Forbidden} />
                        <Route path="/setting" component={user.setting_view ? Setting : Forbidden} />
                        <Route path="/add_product" component={user.product_add ? ProductForm : Forbidden} />
                        <Route path="/edit_product" component={user.product_edit ? ProductForm : Forbidden} />
                        <Route path="/list_img" component={ProductsImg} />
                        <Route path="/provinsi" component={user.provinsi_view ? Provinsi : Forbidden} />
                        <Route path="/city" component={user.city_view ? City : Forbidden} />
                        <Route path="/kecamatan" component={user.kec_view ? Kecamatan : Forbidden} />
                        <Route path="/warehouse" component={user.warehouse_view ? Warehouse : Forbidden} />
                        <Route path="/waiting_payment" component={user.transaksi_view ? ListTrans : Forbidden} />
                        <Route path="/payment" component={user.transaksi_view ? ListTransPayment : Forbidden} />
                        <Route path="/completed" component={user.transaksi_view ? ListTransCompleted : Forbidden} />
                        <Route path="/onprocess" component={user.transaksi_view ? ListTransProcess : Forbidden} />
                        <Route path="/dikirim" component={user.transaksi_view ? ListTransDikirim : Forbidden} />
                        <Route path="/expired" component={user.transaksi_view ? ListTransExpired : Forbidden} />
                        <Route path="/hold" component={user.transaksi_view ? ListTransHold : Forbidden} />
                        <Route path="/trans_detail" component={user.transaksi_view ? TransDetail : Forbidden} />
                        <Route path='/pricelist' component={user.pricelist_view ? PriceList : Forbidden} />
                        <Route path='/limit_beli' component={user.pricelist_view ? LimitBeli : Forbidden} />
                        <Route path='/setting' component={user.setting_view ? Setting : Forbidden} />
                        <Route path='/news' component={user.news_view ? News : Forbidden} />
                        <Route path='/level' component={user.level_view ? Level : Forbidden} />
                        <Route path='/permission' component={user.level_view ? LevelFrm : Forbidden} />
                        <Route path='/vouchers' component={user.vouchers_view ? Voucher : Forbidden} />
                        <Route path='/free_ongkir' component={user.news_view ? VoucherFO : Forbidden} />
                        <Route path='/diskon_harga' component={user.news_view ? VoucherDP : Forbidden} />
                        <Route path='/bonus_produk' component={user.news_view ? VoucherBP : Forbidden} />
                        <Route path='/detail_fo' component={user.news_view ? VoucherFODetail : Forbidden} />
                        <Route path='/waiting_approve' component={user.ulasan_view ? ListUlasan : Forbidden} />
                        <Route path='/approved' component={user.ulasan_view ? ListUlasanApprove : Forbidden} />
                        <Route path='/rejected' component={user.ulasan_view ? ListUlasanRejected : Forbidden} />
                        <Route path='/detail_ulasan' component={user.ulasan_view ? UlasanDetail : Forbidden} />
                        <Route path='/blast' component={BlastNotif} />
                        <Route path='/add_blast' component={BlastForm} />
                        <Route path='/blast_detail' component={BlastDetail} />
                        <Route path='/report_header' component={ReportHeader} />
                        <Route path='/report_detail' component={ReportDetail} />
                        <Route path='/reg_mitra' component={Mitra} />
                        <Route path='/waiting_simpatik' component={ListSimpatik} />
                        <Route path='/simpatik_detail' component={SimpatikDetail} />
                        <Route path='/diterima' component={ListSimpatikDiterima} />
                        <Route path='/approved_simpatik' component={ListSimpatikApproved} />
                        <Route path='/rejected_simpatik' component={ListSimpatikRejected} />
                        <Route path='/completed_simpatik' component={ListSimpatikCompleted} />
                    </Switch>
                </React.Suspense>

            </>
        );
    }

    return template;
};

const mapStateToProps = (state) => ({
    user: state.auth.currentUser
});
const mapDispatchToProps = (dispatch) => ({
    onUserLoad: (user) =>
        dispatch({ type: "LOAD_USER", currentUser: user })
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
