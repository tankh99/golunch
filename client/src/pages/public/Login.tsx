import React from 'react';
import {withRouter, Link, RouteComponentProps} from 'react-router-dom';
import {Form, Button, Header, Icon, Message} from 'semantic-ui-react'
import {withFormik, Formik, FormikProps, FormikValues} from 'formik'
import axios from 'axios';
import {API_ROOT} from '../../constants/global';
import * as Yup from 'yup';
import User from '../../models/User';
import {InputLabelField} from '../../components/form';
import {connect} from 'react-redux';
import { setUser, toggleTrackingBtn, resetMsg } from '../../constants/actionCreators';
import { verifyToken } from '../../constants/lookup/auth';
import withLogin from '../hoc/withLogin';
import * as paths from '../../constants/paths';
import ResponseMsg from '../../models/ResponseMsg';
import MessageBox from './components/MessageBox';

interface FormValues{
    email: string,
    password: string
}

interface PathParamProps {
    errMsg: string
}

interface P extends RouteComponentProps<PathParamProps>, FormikProps<FormValues> {
    initialValues: any,
    history: any,
    location: any,
    // functions
    setUser: any,
}

interface S {
    hideErr: boolean,
    errHeader: string,
    errBody?: string
}

const mapStateToProps = (state: any) => {
    return {
        loggedIn: state.auth.loggedIn
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        setUser: (user: User) => dispatch(setUser(user)),
    }
}

const initialValues = {
    email: "",
    password: "",
}

const validationSchema = Yup.object().shape({
    email: Yup.string(),
    password: Yup.string().required("password required"),
    
})

class Login extends React.Component<P, S> {
    constructor(props: P){
        super(props);
        this.state = {
            hideErr: true,
            errHeader: "",
            errBody: ""
        }
    }
    // catch token expired error message from SidebarMenu.js
    componentDidMount(){
        if(this.props.location.state){
            var {errMsg} = this.props.location.state;
            if(errMsg){
                this.setState({
                    hideErr: false,
                    errHeader: errMsg
                })
            }
        }
    }

    handleSubmit = (values : any, formikBag: any) => {
        axios.post(`${API_ROOT}/auth/login`, values)
            .then(res => {
                const {
                    message,
                    success,
                    user,
                    userToken
                } = res.data;
                if(res.status == 200){
                    localStorage.setItem("userToken", userToken);
                    verifyToken()
                        .then((res: ResponseMsg) => {
                            const {success, payload: user, msgHeader} = res
                            if(success){
                                this.setState({
                                    hideErr: true
                                })
                                this.props.setUser(user);
                                if(user.roleID == 1){
                                    this.props.history.push(paths.HOME_PATH);
                                } else if ([2].includes(user.roleID)){
                                    this.props.history.push(paths.SHOPS_PATH);
                                }
                            } else {
                                this.setState({hideErr: false, errHeader: msgHeader!});
                            }
                        })
                } else {
                    console.log("login failed");
                    console.log(res.data);
                }
            }).catch(err => {
                console.error(err);
            })
    }

    render(){
        const {hideErr, errHeader, errBody} = this.state;
        return (
            <div className="body-spacing">
                
                <Formik
                    validationSchema={validationSchema}
                    onSubmit={this.handleSubmit}
                    initialValues={initialValues}
                    render={(formikBag: FormikProps<FormikValues>) => {
                        const {
                            handleChange,
                            handleSubmit,
                            handleBlur,
                            touched,
                            errors,
                            values,
                            status
                        } = formikBag
                        return (
                            <div className="form-container">
                            <MessageBox hide={hideErr} negative={true} msgHeader={errHeader}/>
                            <Header as="h3">Login</Header>
                            <Form className="centered-form">
                                <InputLabelField
                                    id="emalil"
                                    name="email"
                                    label="Email"
                                    type="email"
                                    autoCorrect="off"
                                    autoCapitalize="false"
                                    onBlur={handleBlur}
                                    hasError={touched.email && errors.email}
                                    value={values.email}
                                    onChange={handleChange}/>
                                <InputLabelField
                                    id="password"
                                    type="password"
                                    name="password"
                                    label="Password"
                                    onBlur={handleBlur}
                                    hasError={touched.password && errors.password}
                                    value={values.password}
                                    onChange={handleChange}/>
                                <Button
                                    primary
                                    type="submit"
                                    onClick={(e) => handleSubmit()}>
                                    Submit
                                </Button>
                                
                            </Form>
                            <Link to={paths.REGISTER_PATH}>
                                Don't have an account? Click here
                            </Link>

                            {/* <SocialButton
                                provider="facebook"
                                appId="434938330599637"
                                color="facebook"
                                onLoginSuccess={this.handleSocialLogin}
                                onLoginFailure={this.handleSocialLoginFailure}>
                                <Icon name="facebook"/>
                                Login with facebook    
                            </SocialButton> */}

                            {/* <FacebookLogin
                                autoLoad
                                appId="434938330599637"
                                callback={this.handleSocialLogin}
                                onClick={this.handleSocialLogin}/>

                            <GoogleLogin
                                clientId="575525077775-p24g7t6hhesiqc7q2aacbe0c1se9vjtm.apps.googleusercontent.com"
                                buttonText="Google Login"
                                cookiePolicy={'single_host_origin'}
                                onSuccess={this.handleSocialLogin}
                                onFailure={this.handleSocialLoginFailure}/> */}
                            </div>
                        )
                    }}/>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withLogin(withRouter(Login)))