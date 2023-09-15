import axios from "axios";
import {API_ROOT} from '../global';
import { verifyToken, getUserInfo } from "./auth";

export async function getUsers(){
    return new Promise((resolve) => {
        axios.get(`${API_ROOT}/users/get`)
        .then(result => {
            return resolve(result);
        })
    })
}

export async function getUserByID(id: number){
    return new Promise((resolve) => {
        axios.get(`${API_ROOT}/users/getByID/${id}`)
        .then(result => {
            return resolve(result);
        }).catch(err => {
            return resolve(err);
        })
    })
}

export async function getUsersByRoles(ids: number[]){
    return new Promise((resolve) => {
        var url = `${API_ROOT}/users/getByRoles?`;
        for(var i = 0; i < ids.length; i++){ // creates url with query params
            var id = ids[i];
            url += `ids=${id}`
            if(i+1 != ids.length){ // adds & to the url if it isn't the last element 
                url += '&';
            } 
        }
        axios.get(url)
        .then(result => {
            return resolve(result);
        }).catch(err => {
            return resolve(err);
        })
    })
}

export function addHistory(datetime: any) {
    return new Promise((resolve) => {
        getUserInfo()
            .then((res: any) => {
                console.log(res)
            })
        // axios.post(`${API_ROOT}/auth`)
    })
} 


export function getUserDistance(id: string){
    return new Promise((resolve) => {
        axios.get(`${API_ROOT}/users/getUserDistance/${id}`)
        .then(result => {
            return resolve(result);
        }).catch(err => {
            return resolve(err);
        })
    })
}