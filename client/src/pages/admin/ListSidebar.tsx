import React from 'react';
import { Sidebar, Segment, Button, Search, Menu} from 'semantic-ui-react';
import ListItem from './ListItem';
import {connect} from 'react-redux';
import {SearchBar} from '../../components/form';
import { Link } from 'react-router-dom';
import * as paths from '../../constants/paths';


interface P {
    items: any,
    itemName: string,
    className?: string,
    onSearchChange: any,
    searchValue: string
}

interface S {

}

const mapStateToProps = (state : any) => {
    return {
        shops: state.shops.shops
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        
    }
}

class ListSidebar extends React.Component<P, S>{

    render(){
        const {
            itemName,
            items,
            className,
            onSearchChange,
            searchValue,
        } = this.props
        return(
            <div>
                <Sidebar
                    as={Segment}
                    className={`${className} admin-sidebar`}
                    animation="overlay"
                    icon="labeled"
                    inverted
                    vertical
                    visible={true}>
                    <div className="admin-sidebar-content">
                        <div className="centered-container">
                            <Link className="sidebar-add-btn" to={paths.ADD_SHOP_PATH}>
                                <Menu.Item className="add-shop-btn">
                                    <Button primary>
                                        Add {itemName}s
                                    </Button>
                                </Menu.Item>
                            </Link>
                        </div>
                        <div className="centered-container">
                            <SearchBar onChange={onSearchChange} value={searchValue} />
                        </div>
                        <div className="sidebar-list">
                            {items && items.map((item: any, index: number) => {
                                return (
                                    <ListItem
                                        key={index}
                                        item={item}/>
                                )
                            })}
                        </div>
                    </div>
                </Sidebar>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListSidebar)