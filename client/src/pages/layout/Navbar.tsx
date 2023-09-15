import React from 'react';
import logo from '../../images/logo.jpg';
import {Icon} from 'semantic-ui-react';
import {StyleSheet, css} from 'aphrodite';
import { Link } from 'react-router-dom';
import * as paths from '../../constants/paths';

const isMobileDevice = () => {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

interface P {
    toggleMenu: any
}

export default (props : P) => {
    const {toggleMenu} = props;
    return(
        <div className="navbar">

            <div className="nav-item-container">
                <div className="menu-trigger" onClick={toggleMenu}>
                    <Icon name="bars"/>
                </div>
                <Link to={paths.HOME_PATH} className="logo-link">
                    <img src={logo} className="nav-logo" alt="logo"/>
                </Link>
            </div>
            <div className="nav-item-container">
                {/* <Link className={css(styles.navItem)} to={paths.HOME_PATH}>
                    Home
                </Link> */}
                <Link className={css(styles.navItem)} to={paths.SHOPS_PATH}>
                    Restaurants
                </Link>
            </div>
        </div>
    )
}

const styles = StyleSheet.create({
    navItem: {
        padding: '16px 10px',
        cursor: 'pointer',
        color: 'var(--primary)',
        ':hover': {
            background: 'var(--inverted-bg-hover-color)',
            color: 'var(--inverted-text-hover-color)'
        }
    },
})