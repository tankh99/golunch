
import React from 'react';
import {ErrorMessage, Field} from 'formik';
import {FieldProps} from './FormFieldProps';

interface P extends FieldProps{
    suggestions: any,
    onSelectSuggestion: any
}

// required
// id, label, name, placeholder, value, onchange
export default (props : P) => {
    const {
        label,
        image,
        hasError,
        value,
        suggestions,
        onSelectSuggestion,
        ...rest
    } = props
    
    return(
        <div className="field">
            <label className="label" htmlFor={props.id}>{label}</label>
            <div>
                <Field
                    placeholder={label}
                    className={hasError ? "input-error": ""}
                    value={value}
                    {...rest}/>
                {suggestions && suggestions.length > 0
                    ?
                    <div className="suggestions-wrapper">
                        <div className="suggestions-container">
                            {suggestions.map((suggestion: any, index: number) => {
                                return(
                                    <div key={index} 
                                        className="suggestion"
                                        onClick={onSelectSuggestion} >
                                        {suggestion}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    :""}
            </div>
            <span className="error-msg">
                <ErrorMessage name={props.name}/>
            </span>
        </div>
    )
}