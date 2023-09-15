import React from 'react';
import ContentContainer from '../../../components/ContentContainer';
import tea from '../../../images/food/tea.jpeg';
import {Image} from 'semantic-ui-react';
import MenuItemContainer from './MenuItemContainer';

interface P {

}

interface S {

}

class ShopMenu extends React.Component<P,S>{
    render(){
        return(
            <div>
                <ContentContainer 
                    header="Drinks"
                    subheader="Delicious beverages for the road">
                    <MenuItemContainer
                        name="Tea"
                        description="It' just tea"
                        price={10.99}
                        imageUrl={`images/food/tea.jpeg`}/>
                </ContentContainer>
                <ContentContainer
                    header="Appetizers"
                    subheader="Sweet sweet treats">
                    <MenuItemContainer
                        name="Salad"
                        description="A delicious, salad"
                        price={5.00}
                        imageUrl={`images/food/salad.jpeg`}/>
                </ContentContainer>
                <ContentContainer
                    header="Lunch"
                    subheader="The feast for gods">
                    <MenuItemContainer
                        name="Turkey Potluck"
                        description="Braised turkey, marinated with sweet duck sauce, roasted over a fire for 6 hours"
                        price={20.00}
                        imageUrl="images/food/turkey.jpeg"/>
                    <MenuItemContainer
                        name="Big Fat Burger"
                        description="Big Fat Burger has all the ingredients that you could ever want"
                        price={15.99}
                        imageUrl="images/food/burger.jpg"/>
                </ContentContainer>
                
            </div>
        )
    }
}

export default ShopMenu