import React from 'react';
import {RouteComponentProps, Switch, Route} from 'react-router-dom';
import {connect} from 'react-redux'
import {Sidebar} from 'semantic-ui-react'
import ListSidebar from '../ListSidebar';
import {searchShops, resetShopsSearch} from '../../../constants/actionCreators';
import { getShop } from '../../../constants/lookup/shops';
import * as paths from '../../../constants/paths';
import AddShop from './AddShop';
import EditShop from './EditShop';


interface PathParamProps{
    id?: string
}

interface P extends RouteComponentProps<PathParamProps>{
    resetShopsSearch: any,
    searchShops: any,
    shops: any,
    searchResults: any
}

interface S {
    shop: any,
    loading: boolean,
    searchText: string,
}

const mapStateToProps = (state: any) => {
    return {
        shops: state.shops.shops,
        searchResults: state.shops.searchResults
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        searchShops: (searchText: string) => dispatch(searchShops(searchText)),
        resetShopsSearch: () => dispatch(resetShopsSearch())
    }
}
class ManageShops extends React.Component<P,S>{

    constructor(props: P){
        super(props);
        this.state = {
            shop: "",
            loading: false,
            searchText: ""
        }
    }

    
    handleSearchChange = (e: any) => {
        e.persist();
        var searchText = e.target.value;
        this.setState({loading: true, searchText});
        setTimeout(() => {
            if (searchText.length < 1) {
                this.props.resetShopsSearch()
            }
            this.props.searchShops(searchText.trim())
          }, 300)
    }
    

    render(){
        const {id} = this.props.match.params
        // adds the id to the url if it exists, if not, it's just normal
        // var postUrl = "/shops"
        // if(id){
        //     postUrl += `/${id}` 
        // }
        const {searchResults} = this.props
        const {searchText} = this.state
        return(
            <div>
                <ListSidebar 
                    itemName="Restaurant"
                    items={searchResults}
                    onSearchChange={this.handleSearchChange} 
                    searchValue={searchText}/>
                <Switch>
                    <Route path={paths.ADD_SHOP_PATH} component={AddShop}/>
                    <Route path={`${paths.EDIT_SHOP_PATH}/:id`} component={EditShop}/>
                </Switch>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageShops);