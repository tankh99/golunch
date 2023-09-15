

import axios from 'axios';
import {API_ROOT} from '../global';

export function getUserRewardsByUserID(userID: string){
    return new Promise((resolve) => {
        axios.get(`${API_ROOT}/userRewards/getUserRewardsByUserID/${userID}`)
        .then(result => {
            return resolve(result);
        }).catch(err => {
            return resolve(err);
        })
    })
}

export function redeemReward(rewardID: number, userID: number, distance: number){
    return new Promise((resolve) => {
        axios.post(`${API_ROOT}/userRewards/addUserReward`, {rewardID, userID, distance})
            .then((res: any) => {
                return resolve(res);
            }).catch(err => {
                console.error(err);
            })
    })
}

export function claimReward(id: string){
    return new Promise((resolve) => {
        axios.get(`${API_ROOT}/userRewards/claimReward/${id}`)
            .then((res: any) => {
                return resolve(res.data);
            }).catch(err => {
                console.error(err);
            })
    })
}
// export function deleteUserRewards(id: number){
//     return new Promise((resolve) => {
//         axios.get(`${API_ROOT}/userRewards/deleteUserRewards/${id}`)
//         .then(result => {
//             return resolve(result);
//         }).catch(err => {
//             return resolve(err);
//         })
//     })
// }

export function addUserRewards(userID: number ,id: number, distance: number){
    return new Promise((resolve) => {
        axios.post(`${API_ROOT}/userRewards/addUserRewards`, {userID, id, distance})
        .then(result => {
            return resolve(result);
        }).catch(err => {
            return resolve(err);
        })
    })
}