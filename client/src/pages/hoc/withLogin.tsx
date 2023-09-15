import React from 'react';
import {connect} from 'react-redux';
import { login, logout } from '../../constants/actionCreators';
import { verifyToken } from '../../constants/lookup/auth';

interface P {
    login: any,
    logout: any,
    [x: string]: any // accepts any prop passed to the component this is wraping
}

interface S {
    loggedIn: boolean
}

const mapStateToProps = (state: any) => {
    return {

    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        login: () => dispatch(login()),
        logout: () => dispatch(logout())
    }
}

const withLogin = (Component: any) => {
    class HOC extends React.Component<P,S>{
        constructor(props: P){
            super(props);
            this.state = {
                loggedIn: false
            }
        }

        componentDidMount(){
            verifyToken()
                .then((res: any) => {
                    const {success, payload} = res;
                    if(success){
                        this.props.login()
                    }
                    
                })
        }

        login = () => {
            this.props.login();
        }

        logout = () => {
            this.props.logout();
        }

        render(){
            return <Component 
                {...this.props}
                login={this.login} 
                logout={this.logout} 
                loggedIn={this.props.loggedIn}/>
        }
    }

    return connect(mapStateToProps, mapDispatchToProps)(HOC)
}

export default withLogin;
