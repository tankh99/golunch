import React from 'react';
import {Formik} from 'formik';
import UserForm from './UserForm';

const initialValues = {
    username: "",
    password: "",
    role: {id: "", role: ""}
}

interface P {

}

export default (props: P) => {
    return(
        <div>
            <UserForm initialValues={initialValues} postUrl="users/add"/>
        </div>
    )
}