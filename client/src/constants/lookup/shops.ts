import axios from "axios";
import {API_ROOT} from '../global';
import { getLocationFromAddress } from "../../utils/location";

export function getShop(id: string){
    return new Promise((resolve, reject) => {
        axios.get(`${API_ROOT}/shops/get/${id}`)
            .then(res => {
                return resolve(res)
            }).catch(err => {
                return resolve(err);
            })
    })
}

export function getPromotedShops(){
    return new Promise((resolve) => {
        axios.get(`${API_ROOT}/shops/getPromoted`)
            .then(res => {
                let shops = res.data;
                for(let shop of shops){
                    shop.imageUrl  = shop.imageUrl.replace(/\\/g, "/") //windows issue
                }
                return resolve(shops);
            }).catch(err => {
                return resolve(err);
            })
    })
}

export function getShopModel(id: string){
    return new Promise((resolve) => {
        getShop(id)
            .then((shopRes: any) => {
                if(shopRes.data){
                    var shop = shopRes.data[0];
                    if(shop){
                        // if(shop.address){
                        //     getLocationFromAddress(shop.address)
                        //     .then((res: any) => {
                        //         const {results, status} = res.data;
                        //         shop.imageUrl  = shop.imageUrl.replace(/\\/g, "/") //windows issue where / would be replaced with \
                        //         if(status == "OK"){
                        //             let coords = results[0].geometry.location;
                        //             let {lat, lng} = coords;
                        //             shop.lat = lat;
                        //             shop.lng = lng;
                        //         } else {
                        //             console.log("Could not find location from address (Remove this feature soon)")
                        //         }
                        //     })
                        // }

                        for(let property in shop){// this is to set empty values to default strings
                            if(shop.hasOwnProperty(property)){ 
                                const value = shop[property];
                                if(!value){ // if value is null;
                                    shop[property] = ""
                                }
                            }
                        }
                        
                        
                        getShopRewards(id)
                        .then((shopRewards: any) => {
                            shop.shopRewards = shopRewards;
                            return resolve(shop);
                        })
                    } else {
                        return resolve(undefined);
                    }
                } else {
                    return resolve(undefined);
                }
            })
    })
}

export function getShopRewards(id: string){
    return new Promise((resolve) => {
        axios.get(`${API_ROOT}/shopRewards/get/${id}`)
            .then((res: any) => {
                return resolve(res.data)
            })
    })
}

export function getShops(){
    return new Promise((resolve) => {
        axios.get(`${API_ROOT}/shops/get`)
            .then(res => {
                return resolve(res);
            })
    })
}
