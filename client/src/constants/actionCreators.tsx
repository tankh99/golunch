import { ENABLE_CAMERA, TOGGLE_CAMERA, SET_USER, CLEAR_USER, ADD_SHOP, EDIT_SHOP, DELETE_SHOP, SEARCH_SHOPS, RESET_SHOPS_SEARCH, POPULATE_SHOPS, SET_START_LOCATION, SET_END_LOCATION, START_TRACKING, STOP_TRACKING, TOGGLE_LOADING, SET_MENU_VISBILITY, SHOW_MSG, TOGGLE_TRACKING_BUTTON, RESET_MSG, LOGIN, LOGOUT } from "./actionTypes";
import Shop from "../models/Shop";
import User from "../models/User";

// services
export function toggleCamera(payload: boolean){
    console.log(payload);
    return {type: TOGGLE_CAMERA, payload}
}

// users
export function setUser(payload: User){
    return {type: SET_USER, payload};
}

export function clearUser(){
    return {type: CLEAR_USER, payload: null};
}

// shops

export function populateShops(payload: Shop[]){
    return {type: POPULATE_SHOPS, payload}
}

export function addShop(payload: Shop){
    return {type: ADD_SHOP, payload}
}

export function editShop(payload: Shop){
    return {type: EDIT_SHOP, payload}
}

export function deleteShop(payload: number){
    return {type: DELETE_SHOP, payload};
}

export function searchShops(payload: string){
    return {type: SEARCH_SHOPS, payload}
}

export function resetShopsSearch(){
    return {type: RESET_SHOPS_SEARCH, payload: null}
}

// Tracker

export function startTracking(payload: any){
    return {type: START_TRACKING, payload}
}

export function stopTracking(payload?: any){
    return {type: STOP_TRACKING, payload}
}

export function toggleTrackingBtn(payload: any){
    return {type: TOGGLE_TRACKING_BUTTON, payload}
}

// display

export function showMsg(payload: any){
    return {type: SHOW_MSG, payload}
}

export function resetMsg(){
    return {type: RESET_MSG, payload: null}
}

export function toggleLoading(payload: any) {
    return {type: TOGGLE_LOADING, payload}
}

export function setMenuVisibility(payload: any){
    return {type: SET_MENU_VISBILITY, payload}
}

// auth

export function login(){
    return {type: LOGIN, payload: null}
}

export function logout(){
    return {type: LOGOUT, payload: null};
}