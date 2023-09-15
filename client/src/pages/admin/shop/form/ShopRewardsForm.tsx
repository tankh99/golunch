import React from 'react';
import { Header, Form, Button } from 'semantic-ui-react';
import { Formik, FormikProps } from 'formik';
import ShopRewards from './ShopRewards';

interface FormValues {
    id?: number,
    name: string,
    description?: string,
    shopImage: any,
    shopItems: any, // TODO: replace this with ShopItem[]
    shopRewards: any
}

interface P {
    postUrl: string,
    formikBag: any,
    initialValues?: any,
    showMsg: any
}

interface S {

}

class ShopRewardsForm extends React.Component<P,S>{
    handleSubmit = (values : any, {setSubmitting}: any) => {
        console.log(values);
        setSubmitting(false);
    }

    render(){
        const {formikBag} = this.props
        const {
            values,
            setFieldValue
        } = formikBag
        return (
            <div className="dynamic-form-container">

                <ShopRewards
                    formikBag={formikBag}
                    values={values}
                    setFieldValue={setFieldValue}/>
            </div>
        )
    }
}

export default ShopRewardsForm