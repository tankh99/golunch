import ExpiredStorage from 'expired-storage';
import ResponseMsg from "../models/ResponseMsg";
import config from '../config.json';
import TrackingInfo from "../models/TrackingInfo";
import { formatHourToTime, getDistance } from "./helper";
import { getUserInfo, verifyToken } from "../constants/lookup/auth";
import { getLocationWithValidation, verifyTimeZone, getStartInfo, getLocation } from "./location";
import jwt from 'jsonwebtoken';
import axios from 'axios';
import {API_ROOT} from '../constants/global';

// import { getTime } from "../constants/lookup/tracking";
import { compareDesc, format } from "date-fns";
import TrackingSessionInfo from "../models/TrackingSessionInfo";
import { getDateDiff, getDifferenceBetweenTwoDatesInMillis, getSpeed } from '../utils/helper';
import { stopTracking, startTracking, toggleLoading, setMenuVisibility, showMsg, toggleTrackingBtn, resetMsg } from '../constants/actionCreators';


const secretKey = process.env.REACT_APP_JWT_KEY;
const expiredStorage = new ExpiredStorage();

export function getTime(){
    return new Promise((resolve) => {
        axios.get(`${API_ROOT}/tracking/getTime`)
            .then((res: any)=> {
                return resolve(res);
            })
    })
}


export function getTrackingInfo () : Promise<ResponseMsg>{
    return new Promise((resolve, reject) => {
      const trackingInfoToken = expiredStorage.getItem("trackingInfoList");
      if(trackingInfoToken){
          if(secretKey){
              jwt.verify(trackingInfoToken, secretKey, (err: any, decoded: any) => {
                  if(decoded){
                      const {trackingInfoList} = decoded;
                      return resolve({success: true, payload: trackingInfoList})
                  } else {
                  console.log(err);
                  return resolve({success: true, msgHeader: "error"})
                  }
      
              })
          } else {
          return resolve({success: true, msgHeader: "JWT token not found"})
          }
      } else {
          return resolve({success: false, msgHeader: "Tracking info expired"})
      }
    })
  }

export function checkTrackingInfo(): Promise<ResponseMsg> {
    return new Promise((resolve) => {
        verifyToken()
        .then((res: ResponseMsg) => {
            const {success, payload: userInfo} = res;
            if(success){
                const {id} = userInfo
                getTrackingInfo()
                .then((res: ResponseMsg) => {
                    const {success, payload: trackingInfoList} = res;
                    if(success){
                        let hasTrackingInfo = false;
                        for(let trackingInfo of trackingInfoList){
                            const {userID} = trackingInfo;
                            // as long as there is one entry that belongs to the user in question
                            if(id == userID){
                                hasTrackingInfo = true;
                            }
                        }
                        return resolve({success: hasTrackingInfo})
                    } else {
                        return resolve({success: false, msgHeader: "Could not get tracking info"});
                    }
                })
            } else {
                return resolve({success: false, msgHeader: "User is not logged in"})
            }
        })
        
    })
}

export function getTodayDistance(): Promise<any | undefined>{
    return new Promise((resolve) => {
        verifyToken()
        .then((res: ResponseMsg) => {
            const {success, payload} = res;
            const {id} = payload;
            if(success){
                getTrackingInfo()
                .then((res: ResponseMsg) => {
                    let totalDistance = 0;
                    const {success, payload: trackingInfoList} = res;
                    if(success){
                        for(let trackingInfo of trackingInfoList){
                            const {userID} = trackingInfo
                            if(id == userID){
                                totalDistance += trackingInfo.distance
                            }
                        }
                        return resolve(totalDistance)
                    } else {
                        console.log("Error when getting tracking info")
                        return resolve(undefined)
                    }
                })
                
            } else {
                console.log("Not logged in")
            }
        })
    })
}

export async function checkTrackingEligibility(): Promise<ResponseMsg>{
  return new Promise((resolve) => {
    const {startHour, endHour} = config;
    getTime()
      .then((res: any) => {
        const now = new Date(res.data);
        if(endHour > now.getHours()){
          getUserInfo()
          .then((token: ResponseMsg) => {
            const {success} = token;
            if(success){
                return resolve({success: true});
            //   getLocationWithValidation()
            //     .then((res: ResponseMsg) => {
            //       const {success, msgHeader, msgBody, payload} = res
            //       if(success){
            //         return resolve({success: true, msgHeader: "", msgBody: "", payload});
            //       } 
            //       return resolve({success: false, msgHeader, msgBody});
            //     })
            } else {
              return resolve({success: false, msgHeader: "Not logged in", msgBody: "You need to be logged in to start tracking"});
            }
        })
        } else {// exceeding limit

          const startTimeString = formatHourToTime(startHour);
          const endTimeString = formatHourToTime(endHour);
          return resolve({success: false, msgHeader: "Tracking currently unavailable", msgBody: `You can only track between the times ${startTimeString} and ${endTimeString}`})
        }
      })
  })
}
// gets both start and end coords, calculates the distance, and sends the distance to the server
    // grabs the info
    /* 
    1. distance
    2. startTime
    3. currentTime
    4. date
    functions in order
    1. getLocation
    2. getStartInfo - 1 & 2 will get the start and end coords to form the distance
    3. startTime from startInfo
    4. verifyTimezone() to get the date to be put into new Date()
    5. date will be achieved from above
    */
export function finishTracking(): Promise<ResponseMsg> {
    // start coords and start time
    return new Promise((resolve) => {
      getLocation()
          .then((locationRes: ResponseMsg) => {
              // current location
              const {success, payload: userCoords} = locationRes
              if(success){
                  // start coords & startTime
                  getStartInfo()
                    .then((startInfo: TrackingSessionInfo | null) => {

                        if(startInfo != null){
                            const {coords, time} = startInfo
                            const now = new Date();
                            let currentDateTime = format(now, "YYYY-MM-DD HH:mm:ss");
                            if(coords != null){
                                let endCoords = userCoords;
                                // endCoords = {lat: 1.311385, lng: 103.774403}; // placeholder to simulate walking distance
                                // endCoords = {lat: 1.311385, lng: 103.794403};
                                const distance = getDistance(coords, endCoords);
                                getUserInfo()
                                    .then((userInfoRes: ResponseMsg) => {
                                        const {success, payload: userInfo} = userInfoRes; // payload is userinfo
                                        let speed = getSpeed(currentDateTime, time, distance);
                                        const date = new Date();
                                        date.setHours(0);
                                        date.setMinutes(0)
                                        date.setSeconds(0);
                                        if(success){
                                            // TODO: change this back to <
                                            if(speed < config.speedLimit && speed >= 0){
                                                const {user} = userInfo;
                                                const {id, publicKey} = user;
                                                const obj: TrackingInfo = {
                                                    date,
                                                    userID: id,
                                                    startTime: time,
                                                    endTime: currentDateTime,
                                                    distance,
                                                    speed,
                                                    publicKey
                                                }
                                                
                                                updateTrackingInfo(obj);
                                                return resolve({success: true, payload: obj}); 
                                            } else{
                                                return resolve({success: false, payload: speed});
                                            }
                                        } else {
                                            console.log("Could not get user info")
                                        }
                                  

                                    }).catch(err => {
                                        console.error(err);
                                    })
                            //   const trackingInfo: TrackingSessionInfo = {coords: userCoords, time: now};
                            //   return resolve(trackingInfo);
                            } else {
                                console.error("Error: Start coords could not be found");
                            }    
                        } else {
                            console.log("Start info could not be found")
                        }
                    })
                  
              } else {
                  console.error("Error: location could not be found")
                  console.log(locationRes)
              }
      }).catch(err => {
          console.error(err);
      })
    })
}

// puts the new tracking info into an array and sets it into localstorage with expiry
export function updateTrackingInfo (newTrackingInfo: TrackingInfo) { 
    const expiredStorage = new ExpiredStorage();
    const trackingInfoString = expiredStorage.getItem("trackingInfoList");
    
    const {startHour, endHour} = config;
    const now = new Date();
    const end = new Date()
    end.setHours(endHour);
    // returns 1 if the 1st date is before the 2nd, -1 otherwise
    // so the current date should be the 1st parameter
    if(compareDesc(now, end) == 1){
        const diffInMillis  = end.getTime() - now.getTime();
        const diffInHours = diffInMillis / 1000 / 60 / 60;

        const expiryTime = diffInMillis / 1000;
        // const expiryTime = 10;
        const signOptions = {
            expiresIn: expiryTime
        }
        
        // const secretKey = process.env.REACT_APP_JWT_KEY;
        if(secretKey){
            if(trackingInfoString !== null){ // one already exists
                getTrackingInfo()
                    .then((res: ResponseMsg) => {
                        const {success, payload: trackingInfoList} = res;
                        trackingInfoList.push(newTrackingInfo);
                        const trackingInfoToken = jwt.sign({trackingInfoList: trackingInfoList}, secretKey, signOptions)
                        expiredStorage.setItem("trackingInfoList", trackingInfoToken, expiryTime);
                    })
            } else {
                let trackingInfoList = []
                trackingInfoList.push(newTrackingInfo)
                const trackingInfoToken = jwt.sign({trackingInfoList: trackingInfoList}, secretKey, signOptions)
                expiredStorage.setItem("trackingInfoList", trackingInfoToken, expiryTime)
            }
        } else {
            console.error("Could not find JWT key");
        }
    }
}