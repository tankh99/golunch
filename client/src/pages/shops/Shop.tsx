import React from 'react';
import {withRouter, RouteComponentProps} from 'react-router-dom'
import axios from 'axios';
import {Image, Tab, Header, Divider} from 'semantic-ui-react';
import {API_ROOT} from '../../constants/global';
import { getShop, getShopModel } from '../../constants/lookup/shops';
import DynamicImage from '../../components/DynamicImage';
import ShopInfo from './components/ShopInfo';
import ShopMenu from './components/ShopMenu';
import {format} from 'date-fns'
import ShopRewards from './components/ShopRewards';
import { formatHour } from '../../utils/helper';
import { motion } from 'framer-motion';

interface PathParamProps {
    id: string
}

interface P extends RouteComponentProps<PathParamProps>{
    
}

interface S {
    shop: any,
    loading: boolean,
    activeIndex: number
}

class Shop extends React.Component<P,S>{

    constructor(props: P){
        super(props);
        this.state = {
            shop: "",
            loading: false,
            activeIndex: 0
        }
    }

    componentDidMount(){
        const {id} = this.props.match.params;
        this.setState({
            loading: true
        })
        getShopModel(id)
            .then((shopModel: any) => {
                this.setState({
                    shop: shopModel,
                    loading: false
                })
            })
    }

    parseTime = (timeString: string) => {
        if(timeString){
            const splicedString = timeString.split(":");
            
            let hours = parseInt(splicedString[0]);
            const minutes = parseInt(splicedString[1]);
            let formattedHours = formatHour(hours).hour;
            const date = new Date(0, 0, 0, formattedHours, minutes);
            const formattedDate = format(date, "HH:mmA");
            return formattedDate
        }
    }

    getPanes = () => {
        let {shop, activeIndex} = this.state;
        if(shop){
            shop.startTime = this.parseTime(shop.startTime);
            shop.endTime = this.parseTime(shop.endTime);
        }


        const panes = [
            {
                menuItem: "Info",
                pane: {
                    key: "info",
                    content:
                    <motion.div
                        variants={animations.shopContent}
                        animate={activeIndex == 0 ? "visible" : "hidden"} >
                        <ShopInfo shop={shop} />
                    </motion.div>
                }
            },
            {
                menuItem: "Menu",
                pane: {
                    key: "menu",
                    content:
                    <motion.div
                        variants={animations.shopContent}
                        animate={activeIndex == 1 ? "visible" : "hidden"} >
                        <ShopMenu/>
                    </motion.div>
                }
            },
            {
                menuItem: "Rewards",
                pane: {
                    key: "rewards",
                    content:
                    <motion.div
                        variants={animations.shopContent}
                        animate={activeIndex == 2 ? "visible" : "hidden"} >
                        <ShopRewards
                            rewards={shop.shopRewards} />
                    </motion.div>
                }
            }
        ]
        return panes
    }

    handleTabChange = (e: any, data: any) => {
        const {activeIndex} = data;
        this.setState({
            activeIndex
        })
    }

    render(){
        const {shop, loading} = this.state;
        const {id, name, imageUrl, description} = shop;
        return(
            <motion.div 
                initial="hidden"
                animate={loading ? "hidden" : "visible"}
                variants={animations.shopContainer}
                className="shop-page-spacing">
                <div className="image-text-wrapper">
                    <DynamicImage src={imageUrl} alt={name}/>
                    <div className="text-container">
                        <Header as="h1">{name}</Header>
                        {/* <Header as="h3">Eastpoint Mall</Header> */}
                    </div>
                </div>
                <Tab className="menu-tabs" 
                    renderActiveOnly={false}
                    onTabChange={this.handleTabChange}
                    menu={{ secondary: true, pointing: true }} 
                    panes={this.getPanes()}/>
            </motion.div>
        )
    }
}

const animations = {
    shopContainer: {
        hidden: {
            opacity: 0,
            scale: 0
        },
        visible: {
            opacity: 1,
            scale: 1
        }
    },
    shopContent: {
        hidden: {
            y: 50,
            opacity: 0,
            transition: {
                sitffness: 50,
                damping: 20,
                type: 'spring',
                duration: 1
            }
            // opacity: 0,
            // scale: 0
        },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                sitffness: 50,
                damping: 20,
                type: 'spring'
            }
            // opacity: 1,
            // scale: 1
        }
    }
}

export default Shop;