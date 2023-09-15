import React from 'react';
import {FieldArray} from 'formik';
import {Grid, Button, Header, Card} from 'semantic-ui-react';
import ShopReward from './ShopReward';
import {StyleSheet, css} from 'aphrodite';

interface P {
    formikBag?: any,
    values: any,
    setFieldValue: any
}

interface S {

}

class ShopRewards extends React.Component<P,S>{

    remove = (arrayHelpers: any, index: number) => {
        arrayHelpers.remove(index)
    }

    render(){
        const {
            formikBag,
            values,
            setFieldValue
        } = this.props
        return (
            <FieldArray
                name="shopRewards"
                render={(arrayHelpers) => {
                    return (
                        <div >
                            <Grid doubling stackable >
                                <div className={css(styles.dynamicAddBtnContainer)}>
                                    <Header className="no-header-margin" as="h3">Rewards</Header>
                                    <Button primary type="button" className="dynamic-add-btn" onClick={() => 
                                        arrayHelpers.push({
                                            name: "",
                                            distance: "",
                                            description: ""
                                        })}>
                                        Add Reward
                                    </Button>
                                </div>
                                <Card.Group>
                                {values.shopRewards && values.shopRewards.map((item: any, index: number) => {
                                    return (
                                        <ShopReward
                                            key={index}
                                            className="dynamic-card"
                                            removeFunction={() => this.remove(arrayHelpers, index)}
                                            index={index}
                                            groupName="shopRewards"
                                            values={values}
                                            formikBag={formikBag}
                                            setFieldValue={setFieldValue}/>
                                    )
                                })}
                                </Card.Group>
                                {/* <Grid.Row columns={2}>
                                {values.shopRewards && values.shopRewards.map((item: any, index: number) => {
                                    return (
                                        <React.Fragment key={index}>
                                            <Grid.Column columns={2}>
                                                <ShopReward
                                                    className="dynamic-card"
                                                    removeFunction={() => this.remove(arrayHelpers, index)}
                                                    index={index}
                                                    groupName="shopRewards"
                                                    values={values}
                                                    formikBag={formikBag}
                                                    setFieldValue={setFieldValue}/>
                                            </Grid.Column>
                                        </React.Fragment>
                                    )
                                })}
                                </Grid.Row> */}
                            </Grid>
                        </div>
                    )
                }}/>
        )
    }
}

export default ShopRewards

const styles = StyleSheet.create({
    dynamicAddBtnContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    }
})