import React from 'react';
import ShopLayout from './ShopLayout';
import { Header } from 'semantic-ui-react';

const initialValues = {
    name: "",
    address: "",
    startTime: "",
    endTime: "",
    officeNumber: "",
    lat: 0,
    lng: 0,
    imageUrl: "",
    shopRewards: [
        {
            id: "",
            name: "",
            distance: "",
            description: "",
        }
    ],
    shopImage: "",
    isPromoted: false
}

interface P {

}

export default (props: P) => {
    return (
        <div>
            <Header as="h3">Add Shop</Header>
            <ShopLayout initialValues={initialValues} postUrl="/shops/add"/>
        </div>   
    )
}