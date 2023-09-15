import React from 'react';
import Select from 'react-select';
import { FieldProps } from './FormFieldProps';


interface P extends FieldProps{
    options: any,
    optionName: any,
    idName: any
}

export default (props: P) => {

    const {
        id,
        name,
        label,
        options,
        optionName,
        onChange,
        idName,
        value
    } = props
    
    return (
        <div className="field">
            <label htmlFor={id} className="label">{label}</label>
            {/* <Select id={id} 
                name={name} 
                onChange={onChange} 
                options={options}
                value={{label: "Goo goop", value: "1"}}/> */}
            <Select id={id} 
                name={name} 
                onChange={onChange} 
                options={options}
                value={value}
                getOptionLabel={(option) => option[optionName]}
                getOptionValue={(option) => option[idName]}/>
        </div>
    )
}