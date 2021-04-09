import React, { useEffect, useState, useRef } from "react";
import { NavLink, Link, useLocation, useHistory } from 'react-router-dom';

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
import { BsClipboardData, BsCardText, BsCardList, BsCardChecklist, BsFillPersonLinesFill, BsFillPeopleFill, BsFillBookmarksFill, BsFillImageFill, BsFillPersonCheckFill, BsGearFill, BsFillPersonDashFill } from "react-icons/bs";
import { ImLocation2, ImHome } from "react-icons/im";
import { MdAccountBalance } from "react-icons/md";

const MenuSidebar = ({ menuCollapse }) => {
    const menuMasterData = ["banners", "users", "setting", "provinsi", "city", "kecamatan", "warehouse"];
    const menuProducts = ["products", "add_product", "edit_product", "list_img"];
    const dataPelanggan = ["members", "konsumen"];
    const menuArea = ["provinsi", "city", "kecamatan"];
    const dataTrans = ["waiting_payment", "payment", "completed", "trans_detail"];
    const location = useLocation();
    const lastPathName = location.pathname.replace("/", "");
    const [isActiveMenu, setIssActiveMenu] = useState({});
    const [isOpenMasterData, setIsOpenMasterData] = useState(false);
    const [isOpenDataPelanggan, setIsOpenDataPelanggan] = useState(false);
    const [isOpenDataTrans, setIsOpenDataTrans] = useState(false);
    let menuActive = menuProducts.includes(lastPathName) ? menuProducts[0] : lastPathName;
    menuActive = menuArea.includes(lastPathName) ? menuArea[0] : menuActive;
    //menuActive = dataTrans.includes(lastPathName) ? dataTrans[0] : menuActive;
    let subMenuOpen = menuMasterData.includes(lastPathName) ? "masterData" : '';
    subMenuOpen = dataPelanggan.includes(lastPathName) ? "dataPelanggan" : subMenuOpen;
    subMenuOpen = dataTrans.includes(lastPathName) ? "dataTrans" : subMenuOpen;

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
    };
    return (
        <>

            <div id="header" className="main-sidebar">

                {/* collapsed props to change menu size using menucollapse state */}
                <ProSidebar breakPoint="xl" collapsed={menuCollapse}>
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
                            <MenuItem icon={<ImHome />}>
                                <NavLink to='/home' />Beranda
                            </MenuItem>
                            <SubMenu title="Data Pelanggan" onClick={handleClickSubmenu("dataPelanggan")} open={isOpenDataPelanggan} icon={<BsFillPeopleFill />}>
                                <MenuItem active={isActiveMenu.members} style={{ "paddingLeft": "27px" }} icon={<BsFillPersonCheckFill />}>
                                    <NavLink to='/members' /> Members
                                </MenuItem>
                                <MenuItem active={isActiveMenu.konsumen} style={{ "paddingLeft": "27px" }} icon={<BsFillPersonDashFill />}>
                                    <NavLink to='/konsumen' />
                                    Konsumen
                                </MenuItem>
                            </SubMenu>
                            <MenuItem active={isActiveMenu.category} icon={<FaList />}>
                                <NavLink to='/category' />Category
                            </MenuItem>
                            <MenuItem active={isActiveMenu.products} icon={<BsFillBookmarksFill />}>
                                <NavLink to='/products' />Products
                            </MenuItem>
                            <SubMenu title="Transaksi" onClick={handleClickSubmenu("dataTrans")} open={isOpenDataTrans} icon={<BsClipboardData />}>
                                <MenuItem active={isActiveMenu.waiting_payment} style={{ "paddingLeft": "27px" }} icon={<BsCardText />}>
                                    <NavLink to='/waiting_payment' /> Waiting Payment
                                </MenuItem>
                                <MenuItem active={isActiveMenu.payment} style={{ "paddingLeft": "27px" }} icon={<BsCardList />}>
                                    <NavLink to='/payment' />
                                    Payment Complete
                                </MenuItem>
                                <MenuItem active={isActiveMenu.completed} style={{ "paddingLeft": "27px" }} icon={<BsCardChecklist />}>
                                    <NavLink to='/completed' />
                                    Completed
                                </MenuItem>
                            </SubMenu>
                            <SubMenu title="Master Data" onClick={handleClickSubmenu("masterData")} open={isOpenMasterData} icon={<FaGripHorizontal />}>
                                <MenuItem style={{ "paddingLeft": "27px" }} icon={<BsFillImageFill />} active={isActiveMenu.banners}>
                                    <NavLink to='/banners' /> Banners
                                </MenuItem>
                                <MenuItem style={{ "paddingLeft": "27px" }} active={isActiveMenu.provinsi} icon={<ImLocation2 />}>
                                    <NavLink to='/provinsi' /> Area
                                </MenuItem>
                                <MenuItem style={{ "paddingLeft": "27px" }} active={isActiveMenu.warehouse} icon={<MdAccountBalance />}>
                                    <NavLink to='/warehouse' /> Warehouse
                                </MenuItem>
                                <MenuItem style={{ "paddingLeft": "27px" }} active={isActiveMenu.users} icon={<BsFillPersonLinesFill />}>
                                    <NavLink to='/users' />
                                        Users
                                </MenuItem>
                                <MenuItem style={{ "paddingLeft": "27px" }} active={isActiveMenu.setting} icon={<BsGearFill />}>
                                    <NavLink to='/setting' />
                                    Setting
                                </MenuItem>
                            </SubMenu>
                        </Menu>
                    </SidebarContent>

                </ProSidebar>
            </div>
        </>
    );
};

export default MenuSidebar;