import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {Menu, Icon} from 'semantic-ui-react'
import { setMenuVisibility } from '../../constants/actionCreators';

interface P {
    to: string,
    name: string,
    iconName: any,
    setMenuVisibility?: any,
    stateProps?: any
}

interface S {

}

const mapDispatchToProps = (dispatch: any) => {
    return {
        setMenuVisibility: (visible: boolean) => dispatch(setMenuVisibility(visible))
    }
}
class SidebarLink extends React.Component<P,S> {

    render(){
        const {
            to,
            name,
            iconName,
            setMenuVisibility,
            stateProps
        } = this.props;
        
        return (
            <div className="sidebar-item-container">
                <Link className="sidebar-link" to={{
                    pathname: to,
                    state:{
                        stateProps
                    }
                }} onClick={() => setMenuVisibility(false)}>
                    <Menu.Item>
                        <Icon className="sidebar-icon" name={iconName}/>
                        {name}
                    </Menu.Item>
                </Link>
            </div>
        )
    }
}

export default connect(null, mapDispatchToProps)(SidebarLink);