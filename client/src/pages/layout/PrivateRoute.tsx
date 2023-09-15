import React from 'react';
import {withRouter, Route, Redirect, RouteComponentProps} from 'react-router-dom';
import { verifyToken } from '../../constants/lookup/auth';
import * as paths from '../../constants/paths';

interface PathParamProps{

}

interface P extends RouteComponentProps<PathParamProps>{
    history: any,
    allowedRoleIDs: number[],
    component?: any,
    path: string,
    exact?: boolean
}

interface S {
    isVerified?: boolean,
    errMsg: string
}

class PrivateRoute extends React.Component<P, S>{
    constructor(props: P){
        super(props);
        this.state = {
            isVerified: undefined,
            errMsg: ""
        }
    }
    componentDidMount(){
        this.verify()
    }

    verify = () => {
        verifyToken()
            .then((res: any) => {
                const {success, payload: user} = res;
                if(success){
                    var allowedRoleIDs = this.props.allowedRoleIDs;
                    if(allowedRoleIDs){
                        var isVerified = false;
                        for(var roleID of allowedRoleIDs){
                            if(user.roleID == roleID){
                                isVerified = true;
                                break;
                            } else {
                                isVerified = false;
                            }
                        }
                        if(isVerified){
                            this.setState({isVerified})
                        } else {
                            this.props.history.push({
                                pathname: paths.HOME_PATH,
                                state: {
                                    errMsg: "Unauthorized access"
                                }
                            })
                        }
                    } else {
                        this.setState({
                            isVerified: true
                        })
                    }
                } else {
                    this.setState({isVerified: false, errMsg: res.errMsg});
                    if(res.err){
                        switch(res.err.name){
                            case "TokenExpiredError":
                                this.props.history.push({
                                    pathname: paths.LOGIN_PATH,
                                    state: {
                                        errMsg: "Your session expired. Please login again"
                                    }
                                })
                                break;
                            default:
                                console.error(res.err)
                        }
                    } else {
                        this.props.history.push({
                            pathname: paths.LOGIN_PATH,
                            state: {
                                errMsg: "You need to be logged in"
                            }
                        })
                    }
                    
                }
            })
    }

    render(){
        const {
            component: Component,
            ...rest
        } = this.props
        const {
            isVerified,
        } = this.state
        
        return(
            <Route {...rest} render={(props) => {
                if(isVerified != undefined){
                    if(isVerified){
                        return <Component {...props}/>
                    } else {
                        return <Redirect to={{
                            pathname: paths.HOME_PATH,
                        }}/>
                    }
                } else {
                    return null;
                }
            }}/>
        )
    }
}

export default withRouter(PrivateRoute)