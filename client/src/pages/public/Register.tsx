import React from 'react';
import {Header, Form, Button, Icon } from 'semantic-ui-react';
import {Formik, withFormik, FormikProps} from 'formik'
import * as Yup from 'yup';
import {withRouter, RouteComponentProps, Link} from 'react-router-dom';
import axios from 'axios';
import {API_ROOT, showNoty} from '../../constants/global';
import {InputLabelField} from '../../components/form';
import * as paths from '../../constants/paths';
import {connect} from 'react-redux'
import MessageBox from './components/MessageBox';

interface PathParamProps {

}

interface FormValues {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    cfmPassword: string
}

interface P extends FormikProps<FormValues>, RouteComponentProps<PathParamProps> {

}

interface S {
    hideErr: boolean,
    errHeader: string,
    errBody?: string
}

const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    cfmPassword: ""
}

const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    password: Yup.string().required("Password is required"),
    cfmPassword: Yup.string().required("Confirm your passwrod")
    .oneOf([Yup.ref("password")], "Passwords do not match")
})

class Register extends React.Component<P, S> {
    
    constructor(props: P){
        super(props);
        this.state = {
            hideErr: true,
            errHeader: "",
            errBody: ""
        }
    }

    handleSubmit = (values: FormValues, {setSubmitting}: any) => {
        axios.post(`${API_ROOT}/auth/register`, (values))
            .then((res: any) => {
                if(res.status == 200){
                    showNoty("success", "Successfully registered account!")
                    this.setState({
                        hideErr: true
                    })
                    this.props.history.push(paths.LOGIN_PATH);
                }
            }).catch((err: any) => {
                if(err.response){
                    const {data, status} = err.response;
                    console.log(err.response);
                    showNoty("error", "That email has already been registered in our system. Please use another email")
                    this.setState({
                        hideErr: false,
                        errHeader: data
                    })
                }
            })
    }

    render(){
        const {hideErr, errHeader, errBody} = this.state;
        return (
            <div className="form-container body-spacing">
                <MessageBox hide={hideErr} negative={true} msgHeader={errHeader}/>
                <Header as="h3">Register</Header>
                <Formik
                    initialValues={initialValues}
                    onSubmit={this.handleSubmit}
                    validationSchema={validationSchema}
                    render={(formikBag: FormikProps<FormValues>) => {
                        const {
                            values,
                            handleChange,
                            handleSubmit,
                            errors,
                            touched,
                            handleBlur,
                        } = formikBag;
                        return (
                            <Form className="centered-form" onSubmit={handleSubmit}>
                            <InputLabelField
                                id="firstName"
                                name="firstName"
                                label="First Name*"
                                onBlur={handleBlur}
                                hasError={touched.firstName && errors.firstName}
                                value={values.firstName}
                                onChange={handleChange}/>
                            <InputLabelField
                                id="lastName"
                                name="lastName"
                                label="Last Name"
                                onBlur={handleBlur}
                                hasError={touched.lastName && errors.lastName}
                                value={values.lastName}
                                onChange={handleChange}/>
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
                                label="Password*"
                                onBlur={handleBlur}
                                hasError={touched.password && errors.password}
                                value={values.password}
                                onChange={handleChange}/>
                            <InputLabelField
                                id="cfmPassword"
                                type="password"
                                name="cfmPassword"
                                label="Confirm Password*"
                                onBlur={handleBlur}
                                hasError={touched.cfmPassword && errors.cfmPassword}
                                value={values.cfmPassword}
                                onChange={handleChange}/>
                            <Button
                                primary
                                type="submits">
                                Register    
                            </Button>
                            
                        </Form>
                        )
                    }}/>
                    <Link to={paths.LOGIN_PATH}>
                        I already have an account. Log in here.
                    </Link>
            </div>
        )
    }
}

export default connect(null, null)(withRouter(Register));