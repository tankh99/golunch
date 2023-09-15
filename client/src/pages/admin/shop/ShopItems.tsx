import React from 'react';
import {FieldArray} from 'formik';
import { Grid, Card, Icon, Image, Placeholder } from 'semantic-ui-react';
// import plusImage from '../../../images/plus-image.png'
import {InputLabelField} from '../../../components/form'
import ShopItem from './ShopItem';

interface P{
    values: any,
    setFieldValue: any
}

export default class ShopItems extends React.Component<P, {}>{
    render(){
        const {
            values,
            setFieldValue
        } = this.props;
        return (
            <FieldArray
                name="shopItems"
                render={(arrayHelpers) => {
                    return(
                        <Grid columns={2} className="shop-items-container" stackable doubling>
                            {values.shopItems && values.shopItems.map((item: any, index: number) => {
                                return (
                                    <React.Fragment key={index}>
                                        <Grid.Column>
                                            <ShopItem
                                                key={index}
                                                index={index}
                                                groupName={'shopItems'}
                                                setFieldValue={setFieldValue}
                                                values={values}/>
                                        </Grid.Column>
                                    </React.Fragment>
                                )
                            })}
                            <Grid.Column>
                                <Card className="add-item-btn" onClick={() => arrayHelpers.push("")}>
                                    <Card.Content>
                                        <Placeholder>
                                            <Placeholder.Header image>
                                                <Placeholder.Line/>
                                                <Placeholder.Line/>
                                            </Placeholder.Header>
                                            <Placeholder.Paragraph>
                                                <Placeholder.Line/>
                                                <Placeholder.Line/>
                                            </Placeholder.Paragraph>
                                        </Placeholder>
                                    </Card.Content>
                                </Card>
                            </Grid.Column>
                        </Grid>
                        // <Card.Group itemsPerRow={2} className="shop-items-container">
                        //     {values.shopItems && values.shopItems.map((item: any, index: number) => {
                        //         return (
                        //             <ShopItem
                        //                 key={index}
                        //                 index={index}
                        //                 image={item.imageUrl}
                        //                 groupName={'shopItems'}
                        //                 setFieldValue={setFieldValue}
                        //                 values={values}/>
                        //         )
                        //     })}
                        //     <Card className="add-item-btn" onClick={() => arrayHelpers.push("")}>
                        //         <Card.Content>
                        //             <Placeholder>
                        //                 <Placeholder.Header image>
                        //                     <Placeholder.Line/>
                        //                     <Placeholder.Line/>
                        //                 </Placeholder.Header>
                        //                 <Placeholder.Paragraph>
                        //                     <Placeholder.Line/>
                        //                     <Placeholder.Line/>
                        //                 </Placeholder.Paragraph>
                        //             </Placeholder>
                        //         </Card.Content>
                        //     </Card>
                        // </Card.Group>
                    )
                }}/>
        )
    }
}