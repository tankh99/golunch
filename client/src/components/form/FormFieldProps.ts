export interface FieldProps {
    id: string,
    name: string,
    type?: string,
    value?: any,
    label: string,
    hasError?: any,
    onChange?: any,
    onBlur?: any,
    [x:string]: any
}