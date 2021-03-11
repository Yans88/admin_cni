import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import Header from './Header'
import MenuSidebar from './MenuSidebar'
import { connect } from 'react-redux';
import UserList from '../../users/UserList';
import { getProfileAdmin } from '../login/LoginService';
import Members from '../../members/Members';
import Konsumen from '../../members/Konsumen';
import Category from '../../category/Category';
import Banner from '../../banners/Banner';

const Main = ({ onUserLoad }) => {

    const [appLoadingState, updateAppLoading] = useState(false);
    const [menusidebarState, updateMenusidebarState] = useState({
        isMenuSidebarCollapsed: false
    });

    const toggleMenuSidebar = () => {
        updateMenusidebarState({
            isMenuSidebarCollapsed: !menusidebarState.isMenuSidebarCollapsed
        });
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
                <Header toggleMenuSidebar={toggleMenuSidebar} />

                <MenuSidebar />
            
                <Switch basename={getBasename(window.location.pathname)}>
                    <Route path="/users" component={UserList} />
                    <Route exact path="/konsumen" component={Konsumen} />
                    <Route path="/category" component={Category} />
                    <Route path="/banners" component={Banner} />
                    <Route path="/members" component={Members} />
                </Switch>
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
