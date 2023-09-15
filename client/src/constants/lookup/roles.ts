import axios from "axios";
import {API_ROOT} from '../global';

export async function getRoles(){
    return new Promise((resolve) => {
        axios.get(`${API_ROOT}/roles/get`)
            .then(res => {
                return resolve(res);
            })
    })
}

export async function getSelectedRoles(ids: any){
    return new Promise((resolve) => {
        var url = `${API_ROOT}/roles/getByID?`;
        for(var i = 0; i < ids.length; i++){ // creates url with query params
            var id = ids[i];
            url += `ids=${id}`
            if(i+1 != ids.length){ // adds & to the url if it isn't the last element 
                url += '&';
            } 
        }
        axios.get(url)
            .then(res => {
                return resolve(res);
            })
    })
}