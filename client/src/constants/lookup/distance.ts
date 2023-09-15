import axios from 'axios'
import { API_ROOT } from '../global';

export function getDistance(address: string){
    return new Promise((resolve) => {
        axios.get(`${API_ROOT}/tracking/getDistance/${address}`)
        .then((res: any) => {
            let distance = res.data;
            distance = Math.round((distance / (10 ** 6)) * 100) / 100
            return resolve(distance);
        })
    })
}