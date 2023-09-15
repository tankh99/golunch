import React from 'react';
import {connect} from 'react-redux';
import {Formik, FormikProps} from 'formik';
import axios from 'axios';
import {API_ROOT} from '../../../../constants/global';
import * as Yup from 'yup';
import {InputLabelField, TextAreaLabelField, DropdownLabelField, SuggestionInputLabelField} from '../../../../components/form'
import {Form, Grid, Button, Message, Header, TextArea} from 'semantic-ui-react'
import { getLocationFromAddress } from '../../../../utils/location';

interface FormValues {
    id?: number,
    name: string,
    description?: string,
    imageUrl: any,
    shopItems: any, // TODO: replace this with ShopItem[]
    user: any
}

interface P {
    formikBag: any,
    initialValues?: any,
    postUrl: string,
    showMsg: any
}

interface S {
    addresses: any,
    imageUrl: string,
    success?: boolean,
    feedbackHeader: string,
    feedbackMsg: string,
    hideMsg: boolean
}


const validationSchema = Yup.object().shape({
    name: Yup.string().required("Shop name is required"),
    description: Yup.string(),
    imageUrl: Yup.mixed(),
    shopItems: Yup.mixed()
})



class ShopInfo extends React.Component<P,S> {

    constructor(props: P){
        super(props);
        this.state = {
            addresses: [],
            imageUrl: "",
            hideMsg: true,
            feedbackHeader: "",
            feedbackMsg: "",
            success: undefined,
        }
    }

    onFileChange = (e: any, setFieldValue: any) => {
        var file = e.target.files[0]
        this.setState({
            imageUrl: file
        })
        // console.log(e.target.name);
        setFieldValue(e.target.name, file)
    }

    onAddressChange = (e: any, setFieldValue: any) => {
        e.persist();
        const address = e.target.value;
        setFieldValue(e.target.name, address)
        setTimeout(() => {
            this.setState({
                addresses: []
            })
            if(address.length < 1){
                this.setState({
                    addresses: []
                })
            }

            if(address){
                getLocationFromAddress(address)
                .then((res: any) => {
                    const {results, status} = res.data;
                    if(status == "OK"){
                        let coords = results[0].geometry.location;
                        let formattedAddress = results[0].formatted_address;
                        setFieldValue("coords", JSON.stringify(coords));
                        this.setState({
                            addresses: this.state.addresses.concat(formattedAddress)
                        })
                        
                    }
                })
            }
        }, 800)
    }

    onSelectSuggestion = (e: any, setFieldValue: any) => {
        const value = e.target.innerHTML;
        setFieldValue("address", value)
        this.setState({
            addresses: []
        })
    }

    render(){
        const {
            initialValues,
            formikBag
        } = this.props
        const {
            values, 
            setFieldValue,
            handleChange,
            handleBlur,
            touched,
            errors,
            isSubmitting
        } = formikBag
        const {addresses, imageUrl, hideMsg, feedbackHeader, feedbackMsg, success} = this.state
        return (
            <React.Fragment>
                <Grid columns={2} doubling stackable>
                <Grid.Column>
                    <InputLabelField
                        id="imageUrl"
                        type="file"
                        name="imageUrl"
                        accept="image/*"
                        label="Restaurant Image"
                        image={imageUrl ? imageUrl : values.imageUrl}
                        onChange={(e: any) => this.onFileChange(e, setFieldValue)}/>
                </Grid.Column>
                <Grid.Column>
                    <InputLabelField
                        id="name"
                        name="name"
                        label="Name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        hasError={touched.name && errors.name}/>
                    <SuggestionInputLabelField
                        id="address"
                        name="address"
                        label="Address"
                        onSelectSuggestion={(e: any) => this.onSelectSuggestion(e, setFieldValue)}
                        value={values.address}
                        suggestions={addresses}
                        onChange={(e: any) => this.onAddressChange(e, setFieldValue)}
                        hasError={touched.address && errors.address}/>
    
                    <InputLabelField
                        id="startTime"
                        name="startTime"
                        label="Start Time"
                        type="time"
                        value={values.startTime}
                        onChange={handleChange}
                        hasError={touched.startTime && errors.startTime} />
                    <InputLabelField
                        id="endTime"
                        name="endTime"
                        label="End Time"
                        type="time"
                        value={values.endTime}
                        onChange={handleChange}
                        hasError={touched.endTime && errors.endTime}/>
                    <InputLabelField
                        id="officeNumber"
                        name="officeNumber"
                        label="Office Number"
                        value={values.officeNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        hasError={touched.officeNumber && errors.officeNumber}/>
                    {/* <DropdownLabelField
                        id="address"
                        name="address"
                        label="Address"
                        options={addresses}
                        idName="id"
                        optionName="name"
                        value={values.address}
                        onChange={(option: any) => this.onAddressChange(option, setFieldValue)}
                        hasError={touched.address && errors.address}/> */}
                    {/* <input type="hidden" name="lat" value={values.lat}/>
                    <input type="hidden" name="lng" value={values.lng}/> */}
                    {/* <TextAreaLabelField
                        id="address"
                        name="address"
                        label="Address"
                        placeholder="Address"
                        rows={8}
                        value={values.address}
                        onChange={(e: any) => this.onAddressChange(e, setFieldValue)}
                        hasError={touched.address && errors.address}/> */}
                    {/* <TextAreaLabelField
                        id="description"
                        name="description"
                        label="Description"
                        placeholder="Shop Description..."
                        rows={5}
                        value={values.description}
                        onChange={handleChange}
                        hasError={touched.description && errors.description}/> */}
                    <InputLabelField
                        id="isPromoted"
                        name="isPromoted"
                        type="checkbox"
                        label="Is Promoted"
                        checked={values.isPromoted}
                        value={values.isPromoted}
                        onChange={handleChange} />
                </Grid.Column>
                </Grid>
                <div className="fixed-form-buttons">
                    <Button
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        type="submit"
                        >Submit</Button>
                </div>
            </React.Fragment>
            // <Formik
            // validationSchema={validationSchema}
            // enableReinitialize={true}
            // initialValues={initialValues}
            // onSubmit={this.handleSubmit}
            // render={(formikBag: FormikProps<FormValues>) => {
            //     const {
            //         values,
            //         handleChange,
            //         handleBlur,
            //         handleSubmit,
            //         setFieldValue,
            //         touched,
            //         errors,
            //         isSubmitting
            //     } = formikBag;
                
            //     return(
            //     <div>
            //         <Header as="h3">General</Header>
                    
            //         <Form encType="multipart/form-data" onSubmit={handleSubmit}>
            //         </Form>
            //     </div>
            //     )
            // }}/>
        )
    }
}

export default connect(null, null)(ShopInfo);