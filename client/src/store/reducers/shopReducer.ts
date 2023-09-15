import { ADD_SHOP, EDIT_SHOP, DELETE_SHOP, POPULATE_SHOPS, SEARCH_SHOPS, RESET_SHOPS_SEARCH } from "../../constants/actionTypes";
import Shop from '../../models/Shop';

interface S {
    shops: any,
    searchResults: any,
    loading: boolean
}

const initialState: S = {
    shops: [],
    searchResults: [],
    loading: true
}

export default (state = initialState, action: any) => {
    switch(action.type){
        case POPULATE_SHOPS:
            return {
                ...state,
                loading: false,
                shops: action.payload,
                searchResults: action.payload
            }
        case SEARCH_SHOPS:
            return {
                ...state,
                searchResults: state.shops.filter((s: Shop) => s.name.toLowerCase().includes(action.payload.toLowerCase())),
            }
        case RESET_SHOPS_SEARCH:
            return {
                ...state,
                searchResults: state.shops
            }
        case ADD_SHOP:
            var shops = state.shops.concat(action.payload);
            return {
                ...state,
                shops: shops,
                searchResults: shops
            }
        case EDIT_SHOP:
            var editedShop = action.payload
            var newShops = state.shops.map((shop: Shop, index: number) => {
                if(shop.id == editedShop.id){
                    return {
                        ...shop,
                        ...editedShop
                    }
                } else {
                    return {
                        ...shop
                    }
                }
            })
            return {
                ...state,
                shops: newShops,
                searchResults: newShops
            }
        case DELETE_SHOP:
            var filteredShops = state.shops.filter((s: Shop) => s.id != action.payload);
            return {
                ...state,
                shops: filteredShops,
                searchResults: filteredShops
            }
        default: {
            return state
        }
    }
}