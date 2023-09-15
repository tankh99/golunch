import React from 'react';
import ContentContainer from '../../../components/ContentContainer';
import { Header, Item, Icon, Divider } from 'semantic-ui-react';
import config from '../../../config.json';

interface P {
    shop: any
}

interface S {

}

class ShopInfo extends React.Component<P,S>{

    render(){
        const {shop} = this.props; 
        const {address, startTime, endTime, officeNumber} = shop
        const {website} = config;
        return(
            <ContentContainer header="Info">
                <Item.Group className="grouped-icon-info">
                    <Item>
                        <Item.Content verticalAlign="middle">
                            <Item.Header>
                                <Icon name="map marker alternate"/>
                                {address}
                            </Item.Header>
                        </Item.Content>
                    </Item>
                    <Divider/>
                    <Item>
                        <Item.Content verticalAlign="middle">
                            <Item.Header>
                                <Icon name="clock outline"/>
                                {startTime} - {endTime}
                            </Item.Header>
                        </Item.Content>
                    </Item>
                    <Divider/>
                    <Item>
                        <Item.Content verticalAlign="middle">
                            <Item.Header>
                                <Icon name="phone"/>
                                {officeNumber}
                            </Item.Header>
                        </Item.Content>
                    </Item>
                    <Divider/>
                    <Item>
                        <Item.Content verticalAlign="middle">
                            <Item.Header>
                                <Icon name="world"/>
                                {website}
                            </Item.Header>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </ContentContainer>
        )
    }
}

export default ShopInfo