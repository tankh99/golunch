import React from 'react';
import ShopLayout from './ShopLayout';
import { Header } from 'semantic-ui-react';
import {RouteComponentProps} from 'react-router-dom'
import {getShop, getShopModel} from '../../../constants/lookup/shops';
import * as paths from '../../../constants/paths';

interface PathParamProps {
    id?: string
}

interface P extends RouteComponentProps<PathParamProps> {

}

interface S {
    initialValues: any
}

export default class EditShop extends React.Component<P,S> {

    constructor(props: P){
        super(props);
        this.state = {
            initialValues: {
                name: "",
                address: "",
                startTime: "",
                endTime: "",
                officeNumber: "",
                shopImage: "",
                shopRewards: [
                    {
                        id: "",
                        name: "",
                        distance: "",
                        description: "",
                    }
                ],
                isPromoted: false
            }
        }
    }

    componentDidMount(){
        var {id} = this.props.match.params;
        if(id){
            this.updateShopState(id)
        }
    }

    updateShopState = (id: string) => {
        getShopModel(id)
            .then((model: any) => {
                if(model){
                    this.setState({
                        initialValues: model
                    })
                } else {
                    this.props.history.push(paths.MANAGE_SHOPS_PATH);
                }
            })
            
    }

    componentDidUpdate(prevProps: P, prevState: S){
        var {id} = this.props.match.params;
        if(id != prevProps.match.params.id){
            if(id){
                this.updateShopState(id)
            } else {
                console.log("could not find id param")
            }
            
        }   
    }


    render(){
        const {initialValues} = this.state
        return (
            <div>
                <Header as="h3">Edit Shop</Header>
                <ShopLayout initialValues={initialValues} postUrl="/shops/edit"/>
            </div>   
        )
    }
}