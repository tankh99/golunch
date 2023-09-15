import React from 'react';
import {TextArea} from 'semantic-ui-react';
import {FieldProps} from './FormFieldProps';
import {ErrorMessage} from 'formik';

interface P extends FieldProps{
    placeholder: string,
    rows: number
}

// required
// id, label, name, placeholder, value, onchange
export default (props: P) => {
    const {
        id,
        label,
        hasError,
        value,
        rows,
        ...rest
    } = props
    return(
        <div className="field">
            <label className="label" htmlFor={id}>{label}</label>
            <TextArea
                id={id}
                className={hasError ? "input-error": ""} 
                value={value}
                {...rest}>
            </TextArea>
            <span className="error-msg">
                <ErrorMessage name={props.name}/>
            </span>
        </div>
    )
}