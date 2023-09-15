import React from 'react';
import {withFormik, Formik, FormikProps} from 'formik';
import {connect} from 'react-redux';
import * as Yup from 'yup';
import axios from 'axios';
import {API_ROOT, isEmptyObj, showNoty} from '../../../constants/global';
import { Form, Grid, Button, Message, Tab, TabPane } from 'semantic-ui-react';
// import {Tab as RTab, Tabs, TabList, TabPanel} from 'react-tabs';
import { getUsers, getUsersByRoles } from '../../../constants/lookup/users';
import ShopInfoForm from './form/ShopInfoForm';
import { addShop, editShop } from '../../../constants/actionCreators';
import ShopRewardsForm from './form/ShopRewardsForm';
import { getLocationFromAddress } from '../../../utils/location';
import AddQR from './AddQR';
import { StyleSheet, css } from 'aphrodite';

interface FormValues {
    id: number,
    name: string,
    address: string,
    officeNumber: string,
    startTime: any,
    endTime: any,
    lat: number | string,
    lng: number | string,
    shopRewards: any,
    imageUrl: any,
    coords?: any
}

interface P {
    initialValues: any,
    postUrl: string,
    addShop?: any,
    editShop?: any,
}

interface S {
    hideMsg: boolean,
    feedbackHeader: string,
    feedbackMsg: string,
    success?: boolean,
    users: any,
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        addShop: (shop: any) => dispatch(addShop(shop)),
        editShop: (shop: any) => dispatch(editShop(shop))
    }
}


const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    description: Yup.string(),
    shopRewards: Yup.array().of(
        Yup.object({
            name: Yup.string().required("Name is required"),
            description: Yup.string(),
            distance: Yup.string().required("Distance is required")
        })
    )
})

class ShopLayout extends React.Component<P, S> {

    public topRef: any = React.createRef();

    constructor(props: P){
        super(props)
        this.state = {
            hideMsg: true,
            feedbackHeader: "",
            feedbackMsg: "",
            success: undefined,
            users: [],
        }
        this.topRef = React.createRef()
    }
    
    
    componentDidMount(){
        getUsersByRoles([2])
            .then((res: any) => {
                this.setState({users: res.data})
            })
    }

    scrollToRef = () => {
        window.scrollTo(0, this.topRef.current.offsetTop)
    }

    getPanes = (formikBag: FormikProps<FormValues>) => {
        const {errors} = formikBag
        let rewardsError = false
        if(errors.shopRewards){
            rewardsError = true
        }
        
        const panes = [
            {
                menuItem: "General", 
                pane: {
                    key:"general",
                    content: 
                        <ShopInfoForm
                            showMsg={this.showMsg}
                            postUrl={this.props.postUrl}
                            initialValues={this.props.initialValues}
                            formikBag={formikBag}/>
                }
            },
            {
                menuItem: "Rewards", 
                pane:{
                    key:"rewards",
                    content:
                        <ShopRewardsForm
                            showMsg={this.showMsg}
                            postUrl={this.props.postUrl}
                            // initialValues={this.props.initialValues}
                            formikBag={formikBag}/>
                    
                }
            },
            {
                menuItem: "Add QR", 
                pane:{
                    key:"addqr",
                    content:
                        <AddQR
                        showMsg={this.showMsg}
                        postUrl={this.props.postUrl}
                        formikBag={formikBag}                                                                                                                                                                                                                                                                                 
                        />
                    
                }
            }
        ]
        return panes;
    }
    

    handleSubmit = async (values: any, {errors, setSubmitting}: any) => {
        try{
            var formData = new FormData();
            for(var key in values){
                switch(key){
                    case "shopRewards": // this is necessary for shopItems property to not show up as [Object object]
                        var json = JSON.stringify(values[key])
                        formData.append(key, json);
                        break;
                    case "shopItems": 
                        var json = JSON.stringify(values[key])
                        formData.set(key, json);
                        break;
                    case "shopItemImg":
                        let counter = 0;
                        for (var file of values[key]){
                            formData.set(`${key}.${counter}`, file);
                            counter++;
                        }
                        break;
                    default:
                        formData.set(key, values[key]);
                        break

                }
                

            }
            // chops off the verb on the url (add/edit) and uses it in the switch statement
            var postUrl = API_ROOT + this.props.postUrl;
            var urlArray = postUrl.split("/")
            var actionType = urlArray[urlArray.length - 1]
            
            axios.post(postUrl, formData)
                .then(res => {
                    switch(actionType){
                        case "add":
                            this.props.addShop(res.data)
                            this.showMsg(true, "Added shop successfully", "Time to celebrate!");
                            showNoty("success", "Added shop successfully");
                            break;
                        case "edit":
                            this.props.editShop(res.data);
                            this.showMsg(true, "Edited shop successfully", "");
                            showNoty("success", "Edited shop successfully");
                            break;
                    }
                    setSubmitting(false);
                }).catch(err => {
                    // setStatus({
                    //     success: false,
                    //     feedbackHeader: "Uh oh, something went wrong",
                    //     feedbackMsg: err
                    // })
                    this.setState({
                        success: false,
                        feedbackHeader: "Uh oh, something went wrong",
                        feedbackMsg: err
                    })
                })   
            setSubmitting(false);

        } catch(e) {
            console.log(e);
        }
    }

    showMsg = (success: boolean, header: string, body: string) => {
        this.setState({
            success,
            feedbackHeader: header,
            feedbackMsg: body,
            hideMsg: false
        })
    }
    
    

    render(){

        const {hideMsg, success, feedbackHeader, feedbackMsg} = this.state;
        // const {hideMsg, success, feedbackHeader, feedbackMsg} = this.props.status
        const {
            initialValues
        } = this.props;
        
        return (
            <div className="form-container">
                {/* <div ref={this.topRef}>Top ref here</div> */}
                <Message hidden={hideMsg}  positive={success ? true : false}>
                    <Message.Header>{feedbackHeader}</Message.Header>
                    <p>
                        {feedbackMsg}
                    </p>
                </Message>
                <Formik
                    validationSchema={validationSchema}
                    enableReinitialize={true}
                    initialValues={initialValues}
                    onSubmit={this.handleSubmit}
                    render={(formikBag: FormikProps<FormValues>) => {
                        const {
                            values,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            setFieldValue,
                            touched,
                            errors,
                            isSubmitting
                        } = formikBag;
                        const haveErrors = isEmptyObj(errors)
                        return(
                            <Form onSubmit={handleSubmit}>
                                <Message hidden={haveErrors} negative={true}>
                                    {errors && Object.keys(errors).map((error: any, index) => {
                                        return (

                                            <React.Fragment key={index}>
                                                {error == "shopRewards" 
                                                    ?  <Message.Header>A shop reward's required fields are not filled up</Message.Header>
                                                    : ""
                                                }
                                                {error == "name"
                                                    ? <Message.Header>Name is required for shop</Message.Header>
                                                    : ""} 
                                            </React.Fragment>
                                        )
                                    })}
                                </Message>
                                <Tab panes={this.getPanes(formikBag)} renderActiveOnly={false} />
                                <div className="fixed-form-buttons">
                                    <Button
                                        loading={isSubmitting}
                                        disabled={isSubmitting}
                                        type="submit"
                                        >Submit</Button>
                                </div>
                                {/* <Button type="button" onClick={() => this.scrollToRef()}>Scroll top</Button> */}
                            </Form>
                        )
                    }
                }/>
            </div>
        )
    }
}

const styles = StyleSheet.create({
    errorTab: {
        border: '1px solid red',
        color: 'red'
    }
})

export default connect(null, mapDispatchToProps)(ShopLayout)
// export default connect(null, mapDispatchToProps)(ShopForm)