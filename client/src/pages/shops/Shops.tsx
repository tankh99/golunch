import React from 'react';
import axios from 'axios';
import {API_ROOT} from '../../constants/global';
import * as paths from '../../constants/paths';
import {Link} from 'react-router-dom';
import {List, Item, Placeholder, Header, Loader, Segment} from 'semantic-ui-react';
import ContentContainer from '../../components/ContentContainer';
import {StyleSheet,  css } from 'aphrodite';
import { SearchBar } from '../../components/form';
import {motion} from 'framer-motion';
import DynamicImage from '../../components/DynamicImage';

interface P {

}

interface S {
    allShops: any,
    shops: any,
    searchText: string,
    loading: boolean
}

class Shops extends React.Component<P,S>{

    constructor(props: P){
        super(props);
        this.state = {
            allShops: [],
            shops: [],
            searchText: "",
            loading: false
        }
    }

    componentDidMount(){
        this.setState({
            loading: true
        })
        axios.get(`${API_ROOT}/shops/get`)
            .then((res: any) => {
                this.setState({
                    shops: res.data,
                    allShops: res.data,
                    loading: false
                })
            })
    }

    onChange = (e: any) => {
        e.persist();
        const {value} = e.target;
        this.setState({
            searchText: value,
            loading: true
        })
        setTimeout(() => {
            const filteredShops = this.state.allShops.filter((s: any) => s.name.toLowerCase().includes(value.toLowerCase()))
            if(value.length < 1){
                this.setState({
                    shops: this.state.allShops,
                    loading: false
                })
            } else {
                this.setState({
                    shops: filteredShops,
                    loading: false,
                })
            }

        }, 300)
    }

    render(){
        const {shops, searchText, loading} = this.state
        return(
            <div className="body-vertical-spacing">
                <ContentContainer header="Shops">
                    <SearchBar value={searchText} onChange={this.onChange}/>
                    {loading 
                    ?
                    <Segment basic>
                        <Loader active/>
                    </Segment> 
                    :
                    <motion.div 
                        className="ui items"
                        initial="hidden"
                        animate={loading ? "hidden" : "visible"}
                        variants={animations.shopsContainer}>
                        {(shops && shops.length > 0) 
                        ? shops.map((item: any, index: number) => {
                            return (
                                <motion.div
                                    key={index}
                                    variants={animations.shop}>
                                    <Link
                                        className={`item ${css(styles.shopItem)}`}
                                        to={`${paths.SHOPS_PATH}/${item.id}`}>
                                        <DynamicImage
                                            className={"shop-item-image-container"}
                                            src={item.imageUrl}
                                            alt={item.name}/>
                                        
                                        <Item.Content className={css(styles.shopContent)}>
                                            <Header as="h4">{item.name}</Header>
                                            <Item.Description>{item.description}</Item.Description>
                                        </Item.Content>
                                    </Link>
                                </motion.div>
                                
                            )
                        })
                        :
                        <div>
                            No shops found
                        </div> 
                    }
                    </motion.div>
                    }
                </ContentContainer>
            </div>
        )
    }
}

const animations = {    
    shopsContainer:{
        hidden: {
            // scale: 0,
            // opacity: 0
        },
        visible: {
            // scale: 1,
            // opacity: 1,
            transition: {
                // when: 'beforeChildren',
                when: 'beforeChildren',
                staggerChildren: 0.1,
                // duration: 0.4
        }
    }
    },
    shop: {
        hidden: {
            opacity: 0, 
            y: 50
        },
        visible: {
            opacity: 1,
            y: 0
        }
    }
}

const styles = StyleSheet.create({
    shopsContainer:{
        overflow: 'hidden'
    },
    shopItem: {
        display: 'flex',
        borderBottom: '1px solid var(--shape)',
        paddingBottom: '15px'
    },
    shopItemImageContainer:{
        width: '150px',
        height: '150px',
        background: 'var(--shape)',
        display: 'flex',
        'img': {
            width: '100%'
        }
    },
    shopContent: {
        marginTop: '10px'
    }
})

export default Shops;