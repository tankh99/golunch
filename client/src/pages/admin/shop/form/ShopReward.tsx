import React from 'react';
import {InputLabelField, TextAreaLabelField} from '../../../../components/form'
import { Card, Icon, Header } from 'semantic-ui-react';
import { StyleSheet, css } from 'aphrodite';


interface P {
    formikBag?: any,
    className? : string,
    index: number,
    groupName: string, // group name is to describe this entire dynamic field (e.g. shopRewards or shopItems)
    values: any,
    removeFunction: any,
    setFieldValue: any,
    [x:string]: any

}

interface S {
}

class ShopReward extends React.Component<P,S>{

    handleChange = (e: any) => {
        this.props.setFieldValue(e.target.name, e.target.value);
    }

    render(){
        
        const {values, index, groupName, className, removeFunction, formikBag} = this.props
        const {
            handleChange,
            touched,
            errors
        } = formikBag
        // need this, otherwise will try to access property of undefined
        var errorExists = touched[groupName] != null && touched[groupName][index] != null 
            && errors[groupName] != null && errors[groupName][index] != null;
        return (
            <Card className={className}>
                <Card.Header className={css(styles.cardHeader)}>
                    <Header as="h5">
                        Reward {index + 1}
                    </Header>
                    <div>
                        <Icon name="minus" className={css(styles.deleteBtn)} onClick={removeFunction} />
                    </div>
                </Card.Header>
                <Card.Content>
                    <input 
                        type="hidden" 
                        name={`${groupName}.${index}.id`}
                        value={values[groupName][index].id}/>
                    <InputLabelField
                        id="name"
                        label="Name"
                        name={`${groupName}.${index}.name`}
                        value={values[groupName][index].name}
                        hasError={errorExists && touched[groupName][index].name != null && errors[groupName][index].name != null}
                        onChange={handleChange} />
                    <InputLabelField
                        id="distance"
                        label="Distance"
                        type="number"
                        name={`${groupName}.${index}.distance`}
                        value={values[groupName][index].distance}
                        hasError={errorExists && touched[groupName][index].distance != null && errors[groupName][index].dsitance != null}
                        onChange={handleChange}/>
                    <TextAreaLabelField
                        id="description"
                        label="Description"
                        placeholder="Description"
                        name={`${groupName}.${index}.description`}
                        hasError={errorExists && touched[groupName][index].description && errors[groupName][index].description}
                        rows={5}
                        value={values[groupName][index].description}
                        onChange={handleChange} />
                </Card.Content>
            </Card>
        )
    }
}

const styles = StyleSheet.create({
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 10px 0 10px'
    },
    deleteBtn: {
        cursor: 'pointer'
    }
})

export default ShopReward