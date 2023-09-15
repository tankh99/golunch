
import React from 'react';
import {ErrorMessage, Field} from 'formik';
import Thumb from './Thumb';
import {FieldProps} from './FormFieldProps';

interface P extends FieldProps{
    image?: any,
}

// required
// id, label, name, placeholder, value, onchange
export default (props : P) => {
    const {
        label,
        image,
        hasError,
        value,
        ...rest
    } = props
    return(
        <div className="field">
            <label className="label" htmlFor={props.id}>{label}</label>
            <Thumb 
                file={image}/>
            <Field
                placeholder={label}
                className={hasError ? "input-error": ""}
                value={value}
                {...rest}/>
            <span className="error-msg">
                <ErrorMessage name={props.name}/>
            </span>
        </div>
    )
}