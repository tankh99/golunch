import Noty from 'noty';

export const API_ROOT = "/api"


export function isMobileDevice(){
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

export function isEmptyObj(obj: any) {
    for(let prop in obj){
        if(obj.hasOwnProperty(prop)){
            return false
        }
    }
    return true
}

export function showNoty(type: any, text:string){
    new Noty({
        type,
        layout: 'center',
        theme: 'sunset',
        text,
        timeout: 2000
    }).show();
    
}