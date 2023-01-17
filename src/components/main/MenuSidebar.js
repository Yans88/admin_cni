import React, { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from 'react-router-dom';

import {
    ProSidebar,
    Menu,
    MenuItem,
    SidebarHeader,
    SidebarContent,
    SubMenu,
} from "react-pro-sidebar";

import { FaList, FaGripHorizontal } from "react-icons/fa";
import 'react-pro-sidebar/dist/css/styles.css';
import { BsGraphUp,BsGraphDown,BsLayoutTextWindowReverse,BsLightningFill, BsFillExclamationCircleFill, BsChatSquareDots, BsAwardFill, BsCursorFill, BsNewspaper, BsClipboardData, BsCardText, BsCardList, BsCardChecklist, BsFillPersonLinesFill, BsFillPeopleFill, BsFillBookmarksFill, BsFillImageFill, BsFillPersonCheckFill, BsGearFill, BsFillPersonDashFill } from "react-icons/bs";
import { ImLocation2, ImHome } from "react-icons/im";
import { MdAccountBalance, MdRemoveShoppingCart } from "react-icons/md";
import { FiRefreshCw } from "react-icons/fi";
import { BiMessageError, BiMessageAltCheck, BiMessageAltX, BiRecycle } from "react-icons/bi";
import { connect } from "react-redux";

const MenuSidebar = ({ menuCollapse, user }) => {
    const menuMasterData = ["banners", "users", "setting", "provinsi", "city", "kecamatan", "warehouse", "level", "permission"];
    const menuProducts = ["products", "add_product", "edit_product", "list_img", "pricelist", "limit_beli"];
    const menuBlast = ["blast", "add_blast", "blast_detail"];
    const dataPelanggan = ["members", "konsumen"];
    const menuvouchers = ["vouchers", "free_ongkir"];
    const menuArea = ["provinsi", "city", "kecamatan"];
    const menuLevel = ["level", "permission"];
    const dataTrans = ["waiting_payment", "payment", "completed", "trans_detail", "onprocess", "dikirim", "expired", "hold","cancel_customer"];
    const dataSimp = ["waiting_simpatik", "diterima", "approved_simpatik", "rejected_simpatik", "completed_simpatik","simpatik_detail"];
    const dataUlasan = ["waiting_approve", "approved", "rejected", "detail_ulasan"];
    const dataReport = ["report_header", "report_detail","report_logistik"];
    const location = useLocation();
    const lastPathName = location.pathname.replace("/", "");
    const [isActiveMenu, setIssActiveMenu] = useState({});
    const [isOpenMasterData, setIsOpenMasterData] = useState(false);
    const [isOpenDataPelanggan, setIsOpenDataPelanggan] = useState(false);
    const [isOpenDataTrans, setIsOpenDataTrans] = useState(false);
    const [isOpenDataUlasan, setIsOpenDataUlasan] = useState(false);
    const [isOpenDataHeader, setIsOpenDataHeader] = useState(false);
	const [isOpenDataSimp, setIsOpenDataSimp] = useState(false);
    let menuActive = menuProducts.includes(lastPathName) ? menuProducts[0] : lastPathName;
    menuActive = menuArea.includes(lastPathName) ? menuArea[0] : menuActive;
    menuActive = menuLevel.includes(lastPathName) ? menuLevel[0] : menuActive;
    menuActive = menuvouchers.includes(lastPathName) ? menuvouchers[0] : menuActive;
    menuActive = menuBlast.includes(lastPathName) ? menuBlast[0] : menuActive;

    let subMenuOpen = menuMasterData.includes(lastPathName) ? "masterData" : '';
    subMenuOpen = dataPelanggan.includes(lastPathName) ? "dataPelanggan" : subMenuOpen;
    subMenuOpen = dataTrans.includes(lastPathName) ? "dataTrans" : subMenuOpen;
    subMenuOpen = dataUlasan.includes(lastPathName) ? "dataUlasan" : subMenuOpen;
    subMenuOpen = dataReport.includes(lastPathName) ? "dataReport" : subMenuOpen;
    subMenuOpen = dataSimp.includes(lastPathName) ? "dataSimp" : subMenuOpen;

    useEffect(() => {
        setIsOpenMasterData(e => {
            return subMenuOpen === "masterData" ? true : false;
        })
        setIsOpenDataPelanggan(e => {
            return subMenuOpen === "dataPelanggan" ? true : false;
        })
        setIsOpenDataTrans(e => {
            return subMenuOpen === "dataTrans" ? true : false;
        })
        setIsOpenDataUlasan(e => {
            return subMenuOpen === "dataUlasan" ? true : false;
        })
        setIsOpenDataHeader(e => {
            return subMenuOpen === "dataReport" ? true : false;
        })
		setIsOpenDataSimp(e => {
            return subMenuOpen === "dataSimp" ? true : false;
        })
        setIssActiveMenu({ [menuActive]: true });
    }, [menuActive, subMenuOpen]);



    const handleClickSubmenu = name => () => {
        setIsOpenMasterData(prevState => {
            const isOpen = prevState;
            return name === "masterData" ? !isOpen : isOpen;
        })
        setIsOpenDataPelanggan(prevState => {
            const isOpen = prevState;
            return name === "dataPelanggan" ? !isOpen : isOpen;
        })
        setIsOpenDataTrans(prevState => {
            const isOpen = prevState;
            return name === "dataTrans" ? !isOpen : isOpen;
        })
        setIsOpenDataUlasan(prevState => {
            const isOpen = prevState;
            return name === "dataUlasan" ? !isOpen : isOpen;
        })
        setIsOpenDataHeader(prevState => {
            const isOpen = prevState;
            return name === "dataReport" ? !isOpen : isOpen;
        })
		setIsOpenDataSimp(prevState => {
            const isOpen = prevState;
            return name === "dataSimp" ? !isOpen : isOpen;
        })
        //return name;
    };

    return (
        <>

            <div id="header" className="main-sidebar">

                {/* collapsed props to change menu size using menucollapse state */}
                <ProSidebar collapsed={menuCollapse}>
                    <SidebarHeader>
                        <Link to='/' className="brand-link">
                            <div
                                style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                <strong>{menuCollapse ? "CNI" : "Admin CNI"}</strong>
                            </div>

                        </Link>
                    </SidebarHeader>

                    <SidebarContent>
                        <Menu iconShape="circle">
                            <MenuItem active={lastPathName === '' ? true : false} icon={<ImHome />}>
                                <NavLink to='/' />Beranda
                            </MenuItem>
                            {user.members_view || user.konsumen_view ? (
                                <SubMenu title="Data Pelanggan" onClick={handleClickSubmenu("dataPelanggan")} open={isOpenDataPelanggan} icon={<BsFillPeopleFill />}>

                                    {user.members_view ? (
                                        <MenuItem active={isActiveMenu.members} style={{ "paddingLeft": "27px" }} icon={<BsFillPersonCheckFill />}>
                                            <NavLink to='/members' /> Members
                                        </MenuItem>
                                    ) : ''}
                                    {user.konsumen_view ? (
                                        <MenuItem active={isActiveMenu.konsumen} style={{ "paddingLeft": "27px" }} icon={<BsFillPersonDashFill />}>
                                            <NavLink to='/konsumen' />
                                            Konsumen
                                        </MenuItem>
                                    ) : ''}

                                </SubMenu>) : ''}
                            {user.category_view ? (
                                <MenuItem active={isActiveMenu.category} icon={<FaList />}>
                                    <NavLink to='/category' />Category
                                </MenuItem>) : ''}
                            {user.product_view ? (
                                <MenuItem active={isActiveMenu.products} icon={<BsFillBookmarksFill />}>
                                    <NavLink to='/products' />Products
                                </MenuItem>) : ''}
                            {user.transaksi_view ? (
                                <SubMenu title="Transaksi" onClick={handleClickSubmenu("dataTrans")} open={isOpenDataTrans} icon={<BsClipboardData />}>
                                    <MenuItem active={isActiveMenu.waiting_payment} style={{ "paddingLeft": "27px" }} icon={<BsCardText />}>
                                        <NavLink to='/waiting_payment' /> Waiting Payment
                                    </MenuItem>
                                    <MenuItem active={isActiveMenu.payment} style={{ "paddingLeft": "27px" }} icon={<BsCardList />}>
                                        <NavLink to='/payment' />
                                        Payment Complete
                                    </MenuItem>
                                    <MenuItem active={isActiveMenu.onprocess} style={{ "paddingLeft": "27px" }} icon={<FiRefreshCw />}>
                                        <NavLink to='/onprocess' />
                                        On Process
                                    </MenuItem>

                                    <MenuItem active={isActiveMenu.hold} style={{ "paddingLeft": "27px" }} icon={<BsFillExclamationCircleFill />}>
                                        <NavLink to='/hold' />
                                        Hold
                                    </MenuItem>

                                    <MenuItem active={isActiveMenu.dikirim} style={{ "paddingLeft": "27px" }} icon={<BsCursorFill />}>
                                        <NavLink to='/dikirim' />
                                        Dikirim
                                    </MenuItem>
                                    <MenuItem active={isActiveMenu.completed} style={{ "paddingLeft": "27px" }} icon={<BsCardChecklist />}>
                                        <NavLink to='/completed' />
                                        Completed
                                    </MenuItem>
                                    <MenuItem active={isActiveMenu.expired} style={{ "paddingLeft": "27px" }} icon={<MdRemoveShoppingCart />}>
                                        <NavLink to='/expired' />
                                        Expired
                                    </MenuItem>
                                    <MenuItem active={isActiveMenu.cancel_customer} style={{ "paddingLeft": "27px" }} icon={<BiRecycle />}>
                                        <NavLink to='/cancel_customer' />
                                        Cancel by <br/>Customer
                                    </MenuItem>
                                </SubMenu>) : ''}
                            {user.ulasan_view ? (
                                <SubMenu title="Ulasan" onClick={handleClickSubmenu("dataUlasan")} open={isOpenDataUlasan} icon={<BsChatSquareDots />}>
                                    <MenuItem active={isActiveMenu.waiting_approve} style={{ "paddingLeft": "27px" }} icon={<BiMessageError />}>
                                        <NavLink to='/waiting_approve' /> Waiting Approve
                                    </MenuItem>
                                    <MenuItem active={isActiveMenu.approved} style={{ "paddingLeft": "27px" }} icon={<BiMessageAltCheck />}>
                                        <NavLink to='/approved' />
                                        Approved
                                    </MenuItem>
                                    <MenuItem active={isActiveMenu.rejected} style={{ "paddingLeft": "27px" }} icon={<BiMessageAltX />}>
                                        <NavLink to='/rejected' />
                                        Rejected
                                    </MenuItem>

                                </SubMenu>) : ''}

                            <SubMenu title="Report" onClick={handleClickSubmenu("dataReport")} open={isOpenDataHeader} icon={<BsLayoutTextWindowReverse />}>
                                <MenuItem active={isActiveMenu.report_header} style={{ "paddingLeft": "27px" }} icon={<BsGraphUp />}>
                                    <NavLink to='/report_header' /> Header
                                </MenuItem>
                                <MenuItem active={isActiveMenu.report_detail} style={{ "paddingLeft": "27px" }} icon={<BsGraphDown />}>
                                    <NavLink to='/report_detail' />
                                    Detail
                                </MenuItem>
                                <MenuItem active={isActiveMenu.report_logistik} style={{ "paddingLeft": "27px" }} icon={<BsGraphDown />}>
                                    <NavLink to='/report_logistik' />
                                    Logistik
                                </MenuItem>

                            </SubMenu>

                            <MenuItem active={isActiveMenu.reg_mitra} icon={<FaList />}>
                                    <NavLink to='/reg_mitra' />Registrasi Mitra
                                </MenuItem>
							
							{user.info_bisnis_view && (<MenuItem active={isActiveMenu.info_bisnis} icon={<FaList />}>
                                    <NavLink to='/info_bisnis' />Info Bisnis
							</MenuItem>)}
								
							 <SubMenu title="Simpatik" onClick={handleClickSubmenu("dataSimp")} open={isOpenDataSimp} icon={<BsClipboardData />}>
                                    <MenuItem active={isActiveMenu.waiting_simpatik} style={{ "paddingLeft": "27px" }} icon={<BsCardText />}>
                                        <NavLink to='/waiting_simpatik' /> Waiting ...
                                    </MenuItem>
                                    <MenuItem active={isActiveMenu.diterima} style={{ "paddingLeft": "27px" }} icon={<BsCardList />}>
                                        <NavLink to='/diterima' />
                                        Diterima
                                    </MenuItem>
                                    <MenuItem active={isActiveMenu.approved_simpatik} style={{ "paddingLeft": "27px" }} icon={<FiRefreshCw />}>
                                        <NavLink to='/approved_simpatik' />
                                        Approved
                                    </MenuItem>

                                    <MenuItem active={isActiveMenu.rejected_simpatik} style={{ "paddingLeft": "27px" }} icon={<BsFillExclamationCircleFill />}>
                                        <NavLink to='/rejected_simpatik' />
                                        Rejected
                                    </MenuItem>

                                    
                                    <MenuItem active={isActiveMenu.completed_simpatik} style={{ "paddingLeft": "27px" }} icon={<BsCardChecklist />}>
                                        <NavLink to='/completed_simpatik' />
                                        Completed
                                    </MenuItem>
                                   
                                </SubMenu>

                            {user.vouchers_view ? (
                                <MenuItem active={isActiveMenu.vouchers} icon={<BsAwardFill />}>
                                    <NavLink to='/vouchers' />Vouchers
                                </MenuItem>) : ''}
								
							


                            {user.news_view ? (
                                <MenuItem active={isActiveMenu.news} icon={<BsNewspaper />}>
                                    <NavLink to='/news' />News
                                </MenuItem>) : ''}
                            <MenuItem active={isActiveMenu.blast} icon={<BsLightningFill />}>
                                <NavLink to='/blast' />Blast Notification
                            </MenuItem>
                            <SubMenu title="Master Data" onClick={handleClickSubmenu("masterData")} open={isOpenMasterData} icon={<FaGripHorizontal />}>
                                {user.banners_view ? (
                                    <MenuItem style={{ "paddingLeft": "27px" }} icon={<BsFillImageFill />} active={isActiveMenu.banners}>
                                        <NavLink to='/banners' /> Banners
                                    </MenuItem>) : ''}
                                {user.provinsi_view ? (
                                    <MenuItem style={{ "paddingLeft": "27px" }} active={isActiveMenu.provinsi} icon={<ImLocation2 />}>
                                        <NavLink to='/provinsi' /> Area
                                    </MenuItem>
                                ) : ''}
                                {user.warehouse_view ? (
                                    <MenuItem style={{ "paddingLeft": "27px" }} active={isActiveMenu.warehouse} icon={<MdAccountBalance />}>
                                        <NavLink to='/warehouse' /> Warehouse
                                    </MenuItem>
                                ) : ''}

                                {user.level_view ? (
                                    <MenuItem style={{ "paddingLeft": "27px" }} active={isActiveMenu.level} icon={<BsFillPersonLinesFill />}>
                                        <NavLink to='/level' />
                                        Level
                                    </MenuItem>
                                ) : ''}
                                {user.users_view ? (
                                    <MenuItem style={{ "paddingLeft": "27px" }} active={isActiveMenu.users} icon={<BsFillPersonLinesFill />}>
                                        <NavLink to='/users' />
                                        Users
                                    </MenuItem>
                                ) : ''}
                                {user.setting_view ? (
                                    <MenuItem style={{ "paddingLeft": "27px" }} active={isActiveMenu.setting} icon={<BsGearFill />}>
                                        <NavLink to='/setting' />
                                        Setting
                                    </MenuItem>
                                ) : ''}


                            </SubMenu>
                        </Menu>
                    </SidebarContent>

                </ProSidebar>
            </div>
        </>
    );
};

const mapStateToProps = (state) => ({
    user: state.auth.currentUser
});
export default connect(mapStateToProps, '')(MenuSidebar);
