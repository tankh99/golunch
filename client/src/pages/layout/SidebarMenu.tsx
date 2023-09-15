import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Sidebar, Segment, Button, Header } from 'semantic-ui-react';
import { verifyToken } from '../../constants/lookup/auth';
import { connect } from 'react-redux';
import SidebarLink from './SidebarLink';
import User from '../../models/User';
import { clearUser, setUser, stopTracking, setMenuVisibility } from '../../constants/actionCreators';
import * as paths from '../../constants/paths';
import { getShops } from '../../constants/lookup/shops';
import { StyleSheet, css } from 'aphrodite';
import { isMobileDevice } from '../../constants/global';
import withLogin from '../hoc/withLogin';
import ResponseMsg from '../../models/ResponseMsg';

interface PathParamProps {

}

interface P extends RouteComponentProps<PathParamProps> {
    visible: boolean,
    user?: any,
    setUser: any,
    clearUser: any,
    className: string,
    animation: any,
    stopTracking: any,
    isTracking: boolean,
    setMenuVisibility: any,
}

interface S {
    user?: any
}

const mapStateToProps = (state: any) => {
    return {
        user: state.users.user,
        isTracking: state.tracker.isTracking
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        setUser: (user: User) => dispatch(setUser(user)),
        clearUser: () => dispatch(clearUser()),
        stopTracking: (coords: any) => dispatch(stopTracking(coords)),
        setMenuVisibility: (visible: boolean) => dispatch(setMenuVisibility(visible))
    }
}

class SidebarMenu extends React.Component<P, S> {
    constructor(props: P) {
        super(props);
        this.state = {
            user: undefined
        }
    }

    componentDidMount() {
        this.checkUser();
    }

    componentDidUpdate(prevProps: P) {
        const { location } = prevProps
        if (location !== this.props.location) {
            this.checkUser()
        }
    }

    checkUser = () => {
        verifyToken()
            .then((res: ResponseMsg) => {
                const { success } = res;
                if (success) {
                    // this.props.setUser(res.user)
                    this.setState({
                        user: res.payload
                    })

                }
            })
    }

    logout = () => {
        if (this.props.isTracking) { // user tries to log out while tracking
            alert("You cannot log out while tracking. Please stop tracking first");
        } else {
            localStorage.removeItem("userToken");
            this.setState({
                user: null
            })
            this.props.setMenuVisibility(false);
            this.props.history.push(paths.LOGIN_PATH);
            // localStorage.removeItem("trackingInfoList");
        }
    }

    render() {
        const { visible, animation } = this.props;
        const { user } = this.state
        return (
            <Sidebar as={Segment}
                className={`${css(styles.sidebar)} ${isMobileDevice() ? "mobile-drawer" : ""}`}
                animation={animation}
                icon="labeled"
                visible={visible}>

                <div className={css()}>
                {/* User is not logged in */}
                {!user && 
                    <React.Fragment>
                        <SidebarLink
                            to={paths.LOGIN_PATH}
                            name="Login"
                            iconName="user"/>
                        <SidebarLink
                            to={paths.REGISTER_PATH}
                            name="Register"
                            iconName="user"/>
                    </React.Fragment>    
                }
                {/* Normal public user */}
                { user && [1, 2].includes(user.roleID) &&
                    <React.Fragment>
                        <SidebarLink
                            to={paths.HOME_PATH}
                            name="Home"
                            iconName="home"/>
                        <SidebarLink
                            to={paths.SHOPS_PATH}
                            name="Restaurants"
                            iconName="food"/>
                        <SidebarLink
                            to={`${paths.REWARDS_PATH}/${user.id}`}
                            name="Rewards"
                            iconName="gift"/>
                        <SidebarLink
                            to={paths.ACCOUNT_PATH}
                            name="Profile"
                            iconName="user"/>
                    </React.Fragment>
                }
                {/* if user has admin status */}
                { user && [2].includes(user.roleID) &&
                    <React.Fragment>
                        <SidebarLink
                            to={paths.MANAGE_SHOPS_PATH}
                            name="Manage Shop"
                            iconName="add"/>
                    </React.Fragment>
                }
                </div>
                {/* If user is logged in, show username and logout button, 
                if not, show login and register nav links */}
                <div className={css(styles.accountDetailsContainer)}>
                    {user &&
                        <div className={css(styles.accountDetailsContent)}>

                            <Header as="h5" className={css(styles.welcomeMsg)}>
                                Welcome: {user.firstName}
                            </Header>
                            <Button
                                type="button"
                                onClick={this.logout}>
                                Log out
                            </Button>
                        </div>
                    }
                </div>
            </Sidebar>
        )
    }
}

const styles = StyleSheet.create({
    sidebar: {
        padding: 0,
        zIndex: 99,
        position: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: "var(--primary)",
        // top: "var(--navbar-height)",
        // height: "calc(100% - var(--navbar-height))"
    },
    linksContainer: {

    },
    accountDetailsContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        position: 'relative',
    },
    accountDetailsContent: {
        position: 'absolute',
        bottom: '15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    welcomeMsg: {
        width: '100%',
        textAlign: 'center',
        color: 'var(--inverted-text-color)'
    }

})

// export default SidebarMenu;
export default connect(mapStateToProps, mapDispatchToProps)(withLogin(withRouter(SidebarMenu)));
