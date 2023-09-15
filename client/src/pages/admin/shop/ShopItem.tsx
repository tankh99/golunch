import React from 'react';
import {Card, Placeholder} from 'semantic-ui-react';
import {InputLabelField} from '../../../components/form'

interface P{
    index: number,
    groupName: string,
    values: any,
    setFieldValue: any
}

interface S {
    image: any
}

export default class ShopItem extends React.Component<P, S>{

    constructor(props: P){
        super(props);
        this.state = {
            image: null,
        }
    }

    handleChange = (e: any, setFieldValue: any) => {
        setFieldValue(e.target.name, e.target.value);
    }

    onImgChange = (e: any, setFieldValue: any) => {
        e.persist();
        var file = e.target.files[0]
        setFieldValue(e.target.name, file)
        this.setState({
            image: file
        })
    }
    

    render(){
        const {
            index,
            groupName,
            values,
            setFieldValue
        } = this.props
        const {
            image
        } = this.state;
        return (
            <Card className="shop-item" key={index}>
                <Card.Content>
                    <InputLabelField
                        id="shopItemImg"
                        name={`shopItemImg.${index}`}
                        label="Item Image"
                        type="file"
                        onChange={(e: any) => this.onImgChange(e, setFieldValue)}
                        image={image}/>
                    <InputLabelField
                        id="name"
                        label="Name"
                        name={`${groupName}.${index}.name`}
                        value={values.shopItems[index].name}
                        onChange={(e: any) => this.handleChange(e, setFieldValue)}/>
                    <InputLabelField
                        id="price"
                        label="Price"
                        name={`${groupName}.${index}.price`}
                        value={values.shopItems[index].price}
                        onChange={(e: any) => this.handleChange(e, setFieldValue)}/>
                </Card.Content>
            </Card>
        )
    }
}