import React from 'react';
import { Icon } from 'semantic-ui-react';
import logo from '../../images/logo.jpg';
import { Link } from 'react-router-dom';
import {StyleSheet, css} from 'aphrodite';
import * as paths from '../../constants/paths';

interface P {
    toggleMenu: any,
    setMenuVisibility: any
}

interface S {

}

export default class MobileNavBar extends React.Component<P,S>{
    render(){
        const {toggleMenu, setMenuVisibility} = this.props
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
                    <Link className={css(styles.navItem)} to={paths.HOME_PATH}>
                        Home
                    </Link>
                    <Link className={css(styles.navItem)} to={paths.SHOPS_PATH}>
                        Restaurants
                    </Link>
                </div>
            </div>
        )
    }
}


const styles = StyleSheet.create({
    navItem: {
        padding: '16px 10px',
        cursor: 'pointer',
        color: 'white',
        ':hover': {
            background: 'var(--text-hover-color)'
        }
    },
})