import React, {useRef}from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import 'react-pro-sidebar/dist/css/styles.css';

const MenuSidebar = () => {
    const location = useLocation();
    

    return (
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
            {/* Brand Logo */}
            <NavLink to='/' className="brand-link text-center">
                <span className="brand-text"><strong>Admin CNI</strong></span>
            </NavLink>

            {/* Sidebar */}
            <div className="sidebar">

                <nav className="mt-2" style={{ marginTop: '1rem!important' }}>
                    <ul className="nav nav-pills nav-sidebar flex-column text-sm" data-widget="treeview" role="menu" data-accordion="false">
                        <li className="nav-item has-treeview" >
                            <a href="#" className="nav-link">
                                <i className="nav-icon fas fa-copy" />
                                <p>Data Pelanggan  <i className="right fas fa-angle-left" /></p>
                            </a>

                            <ul className="nav nav-treeview">
                                <li className="nav-item">
                                    <NavLink
                                        to='/members'
                                        className="nav-link">
                                        <i className="nav-icon fa fa-folder-open" />
                                        <p>Members</p>
                                    </NavLink>

                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        to='/konsumen'
                                        className="nav-link">
                                        <i className="nav-icon fa fa-folder-open" />
                                        <p>Konsumen</p>
                                    </NavLink>

                                </li>

                            </ul>
                        </li>


                        <li className="nav-item">
                            <NavLink
                                to='/category'
                                className="nav-link">
                                <i className="nav-icon fa fa-bookmark" />
                                <p>Category</p>
                            </NavLink>

                        </li>
                        <li className="nav-item">

                            <NavLink
                                to='/products'
                                className="nav-link">
                                <i className="nav-icon fa fa-bookmark" />
                                <p>Products</p>
                            </NavLink>

                        </li>
                        <li className="nav-item has-treeview">
                            <a href="#" className="nav-link">
                                <i className="nav-icon fas fa-copy"></i>
                                <p>
                                    Master Data
                                        <i className="fas fa-angle-left right"></i>
                                </p>
                            </a>
                            <ul className="nav nav-treeview">
                                <li className="nav-item">
                                    <NavLink
                                        to='/banners'
                                        className="nav-link js-scroll-trigger">
                                        <i className="nav-icon fa fa-folder-open" />
                                        <p>Banners</p>
                                    </NavLink>

                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        to='/users'
                                        className="nav-link js-scroll-trigger">
                                        <i className="nav-icon fa fa-folder-open" />
                                        <p>Users</p>
                                    </NavLink>

                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        to='/setting'
                                        className="nav-link">
                                        <i className="nav-icon fa fa-folder-open" />
                                        <p>Setting</p>
                                    </NavLink>

                                </li>

                            </ul>
                        </li>
                    </ul>
                </nav>

            </div>
        </aside>




    )
}



export default MenuSidebar;
