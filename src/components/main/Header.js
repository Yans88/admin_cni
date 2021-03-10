import React, { useState, useEffect, useRef } from 'react'
import { useHistory, Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

const Header = ({ toggleMenuSidebar, user, onUserLogout }) => {

    const [dropdownState, updateDropdownState] = useState({
        isDropdownOpen: false
    });
    const dropdownRef = useRef(null);
    const history = useHistory();
    const toggleDropdown = () => {
        updateDropdownState({ isDropdownOpen: !dropdownState.isDropdownOpen });
    };

    const handleClickOutside = (event) => {
        if (
            dropdownRef &&
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
        ) {
            updateDropdownState({ isDropdownOpen: false });
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside, false);
        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutside,
                false
            );
        };
    });

    // let className = 'dropdown-menu dropdown-menu-lg dropdown-menu-right';

    // if (dropdownState.isDropdownOpen) {
    //     className += ' show';
    // }

    const logOut = (event) => {
        toggleDropdown();
        event.preventDefault();
        onUserLogout();
        history.push('/login');
    };
    return (
        <nav className="main-header navbar navbar-expand navbar-dark navbar-info text-sm border-bottom-0">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <NavLink to="#" className="nav-link" data-widget="pushmenu" role="button">
                        <i className="fas fa-bars" />

                    </NavLink>

                </li>
            </ul>
            <ul className="navbar-nav ml-auto">
                <li className="nav-item dropdown">
                    <NavLink
                        to="#"
                        onClick={toggleDropdown}
                        type="button"
                        className="nav-link dropdown-toggle"
                        data-toggle="dropdown">
                        <i className="far fa-user" /> {user.name ? (user.name) : ("Logout")}
                    </NavLink>

                    <div className="dropdown-menu">
                        <Link
                            to="/"
                            onClick={logOut}
                            className="dropdown-item">
                            <i className="fa fa-sign-out-alt"></i> Logout
                    </Link>

                    </div>
                </li>
            </ul>
        </nav>
    )
}
const mapStateToProps = (state) => ({
    user: state.auth.currentUser
});

const mapDispatchToProps = (dispatch) => ({
    onUserLogout: () => dispatch({ type: "LOGOUT_USER" })
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);