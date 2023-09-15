import React from 'react';
import {Formik, FormikProps} from 'formik';
import * as Yup from 'yup'
import {Form, Header, Button} from 'semantic-ui-react'
import {InputLabelField, TextAreaLabelField, DropdownLabelField} from '../../../components/form'
import { getUsersByRoles } from '../../../constants/lookup/users';
import { getRoles, getSelectedRoles } from '../../../constants/lookup/roles';
import { verifyToken } from '../../../constants/lookup/auth';
import axios from 'axios';
import {API_ROOT} from '../../../constants/global';

interface FormValues {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: any
}

interface P {
    initialValues: any,
    postUrl: string
}

interface S{
    users: any,
    roles: any
}

const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().required("Email is required").email(),
    password: Yup.string().required("Password is required")
})

class UserForm extends React.Component<P,S>{

    constructor(props: P){
        super(props);
        this.state = {
            users: [],
            roles: []
        }
    }

    componentDidMount(){
        verifyToken()
            .then((res: any) => {
                if(res.isVerified){
                    var {user} = res;
                    var availableRoles = [];
                    // allow normal admins to only create restaurant users
                    if(user.roleID == 3){
                        availableRoles.push([2])
                    } else if (user.roleID == 4){
                        availableRoles.push([2,3])
                    }
                    getSelectedRoles(availableRoles)
                    .then((res: any) => {
                        console.log(res.data);
                        this.setState({roles: res.data});
                    })
                }
            })
    }

    handleSubmit = (values: any, {setSubmitting}: any) => {
        // var formData = new FormData();
        // for(var key in values){
        //     switch(key){
        //         case "role":
        //             var roleID = values[key].id;
        //             formData.set(key, roleID);
        //             break;
        //         default:
        //             formData.set(key, values[key]);
        //             break;
        //     }
        // }
        // for(var key in values){
        //     console.log(formData.get(key));
        // }
        var {firstName, lastName, password, email, role} = values;
        var newUser = {firstName, lastName, email, password, roleID: role.id};
        var postUrl = API_ROOT + "/" + this.props.postUrl;
        console.log(newUser);
        axios.post(postUrl, newUser)
            .then((res: any) => {
                console.log(res);
            })
        setSubmitting(false)
    }

    onRoleChange = (option: any, setFieldValue: any) => {
        setFieldValue("role", option);
    }

    render(){
        return (
            <div>
                <Formik
                    validationSchema={validationSchema}
                    initialValues={this.props.initialValues}
                    onSubmit={this.handleSubmit}
                    render={(formikBag: FormikProps<FormValues>) => {
                        const {
                            values,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            touched,
                            errors,
                            setFieldValue,
                            isSubmitting
                        } = formikBag;
                        return (
                            <div>
                                <Header>Create user</Header>
                                <Form onSubmit={handleSubmit}>

                                    <InputLabelField
                                        id="firstName"
                                        name="firstName"
                                        label="First Name"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.firstName}
                                        hasError={errors.firstName && touched.firstName}/>
                                    <InputLabelField
                                        id="lastName"
                                        name="lastName"
                                        label="Last Name"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.lastName}
                                        hasError={errors.lastName && touched.lastName}/>
                                    <InputLabelField
                                        id="email"
                                        name="email"
                                        label="Email"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.email}
                                        hasError={errors.email && touched.email}/>
                                    <InputLabelField
                                        id="password"
                                        name="password"
                                        label="Password"
                                        type="password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password}
                                        hasError={errors.password && touched.password}/>
                                    <DropdownLabelField
                                        id="role"
                                        name="role"
                                        label="Role"
                                        onChange={(option: any) => this.onRoleChange(option, setFieldValue)}
                                        idName="id"
                                        optionName="role"
                                        value={values.role}
                                        options={this.state.roles}/>
                                    <div className="fixed-form-buttons">
                                        <Button
                                            loading={isSubmitting}
                                            disabled={isSubmitting}
                                            type="submit"
                                            >Submit</Button>
                                    </div>
                                </Form>
                            </div>
                        )
                    }}/>
            </div>
        )
    }
}

export default UserForm;