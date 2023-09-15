import React from 'react'
import {isMobileDevice} from '../../constants/global';
import {connect} from 'react-redux';
import Navbar from './Navbar';
import MobileNavbar from './MobileNavbar';
import { Sidebar, Segment } from 'semantic-ui-react';
import { Switch, Route } from 'react-router';
import ManageShops from '../../pages/admin/shop/ManageShops';
import AddQR from '../../pages/admin/shop/AddQR';
import * as paths from '../../constants/paths';
import { getShops } from '../../constants/lookup/shops';
import { populateShops, searchShops, resetShopsSearch } from '../../constants/actionCreators';

interface P {
    searchResults: any,
    shops: any,
    searchShops: any,
    resetShopsSearch: any,
    populateShops: any,
}

interface S {
}

const mapStateToProps = (state: any) => {
    return {
        shops: state.shops.shops,
        searchResults: state.shops.searchResults
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        populateShops: (shops: any) => dispatch(populateShops(shops)),
        searchShops: (searchText: string) => dispatch(searchShops(searchText)),
        resetShopsSearch: () => dispatch(resetShopsSearch())
    }
}

class AdminLayout extends React.Component<P, S>{
    

    componentDidMount(){
        getShops()
            .then((res: any) => {
                this.props.populateShops(res.data);
            })
    }

    render(){
        return(
            <Sidebar.Pushable className="body-content body-spacing" as={Segment}> 
                <Segment className="admin-body-content sidebar-margin" basic>
                    <Switch>
                        <Route path={paths.MANAGE_SHOPS_PATH} component={ManageShops}/>
                    </Switch>    
                </Segment>
            </Sidebar.Pushable>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminLayout);