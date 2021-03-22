import React, { useEffect, useState,useRef } from "react";
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
import { FiHome } from "react-icons/fi";
import 'react-pro-sidebar/dist/css/styles.css';
import { BsFillPersonLinesFill, BsFillPeopleFill, BsFillBookmarksFill, BsFillImageFill, BsFillPersonCheckFill, BsGearFill, BsFillPersonDashFill } from "react-icons/bs";
import { ImLocation2 } from "react-icons/im";

const MenuSidebar = ({ menuCollapse }) => {
    const menuMasterData = ["banners", "users", "setting", "provinsi","city","kecamatan"];
    const menuProducts = ["products", "add_product", "edit_product", "list_img"];
    const dataPelanggan = ["members", "konsumen"];
    const menuArea = ["provinsi","city","kecamatan"];
    const location = useLocation();
    const lastPathName = location.pathname.replace("/", "");
    const [isActiveMenu, setIssActiveMenu] = useState({});
    const [isOpenMasterData, setIsOpenMasterData] = useState(false);
    const [isOpenDataPelanggan, setIsOpenDataPelanggan] = useState(false);   
    let menuActive = menuProducts.includes(lastPathName) ? menuProducts[0] : lastPathName;
    menuActive = menuArea.includes(lastPathName) ? menuArea[0] : lastPathName;
    let subMenuOpen = menuMasterData.includes(lastPathName) ? "masterData" : '';
    subMenuOpen = dataPelanggan.includes(lastPathName) ? "dataPelanggan" : subMenuOpen;   

    useEffect(() => {
        setIsOpenMasterData(e => {
            return subMenuOpen === "masterData" ? true : false;
        })
        setIsOpenDataPelanggan(e => {
            return subMenuOpen === "dataPelanggan" ? true : false;
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
                            <MenuItem icon={<FiHome />}>
                                <NavLink to='/home' />Beranda
                            </MenuItem>
                            <SubMenu title="Data Pelanggan" onClick={handleClickSubmenu("dataPelanggan")} open={isOpenDataPelanggan} icon={<BsFillPeopleFill />}>
                                <MenuItem active={isActiveMenu.members} style={{ "paddingLeft": "30px" }} icon={<BsFillPersonCheckFill />}>
                                    <NavLink to='/members' /> Members
                                </MenuItem>
                                <MenuItem active={isActiveMenu.konsumen} style={{ "paddingLeft": "30px" }} icon={<BsFillPersonDashFill />}>
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
                            <SubMenu title="Master Data" onClick={handleClickSubmenu("masterData")} open={isOpenMasterData} icon={<FaGripHorizontal />}>
                                <MenuItem style={{ "paddingLeft": "30px" }} icon={<BsFillImageFill />} active={isActiveMenu.banners}>
                                    <NavLink to='/banners' /> Banners
                                </MenuItem>
                                <MenuItem style={{ "paddingLeft": "30px" }} active={isActiveMenu.provinsi} icon={<ImLocation2 />}>
                                    <NavLink to='/provinsi' /> Area
                                </MenuItem>
                                <MenuItem style={{ "paddingLeft": "30px" }} active={isActiveMenu.users} icon={<BsFillPersonLinesFill />}>
                                    <NavLink to='/users' />
                                        Users
                                </MenuItem>
                                <MenuItem style={{ "paddingLeft": "30px" }} active={isActiveMenu.setting} icon={<BsGearFill />}>
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