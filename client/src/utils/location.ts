import { getTimeZone } from '../constants/lookup/api';
import { getUserInfo } from '../constants/lookup/auth';
import ResponseMsg from '../models/ResponseMsg';
import config from '../config.json';
import TrackingSessionInfo from '../models/TrackingSessionInfo';
import { getDistance, formatHourToTime } from './helper';
import { getTime } from '../utils/tracking';
import jwt from 'jsonwebtoken';
import axios from 'axios';

export function getLocationFromAddress(address: string){
  return new Promise((resolve) => {
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY!;
    const baseUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`;
    axios.get(baseUrl)
    .then((res: any) => {
      return resolve(res);
    })
  })
}


export function getStartInfo(): Promise<TrackingSessionInfo | null> {
  return new Promise((resolve) => {
    let startCoordsToken = sessionStorage.getItem("startCoords");
    let startTimeToken = sessionStorage.getItem("startTime");
    // for some reason, if you store undefined inside the storage, it will always pass the normal undefined/null test.
    // since the return value is in the form of a string
    if(startCoordsToken){
      const secretKey = process.env.REACT_APP_JWT_KEY;
      if(secretKey){
        jwt.verify(startCoordsToken, secretKey, (err: any, decoded: any) => {
          if(decoded){
            const {startCoords} = decoded;
            if(startTimeToken){
              jwt.verify(startTimeToken, secretKey, (err: any, decoded: any) => {
                if(decoded){
                  const {startTime} = decoded;
                  if(startCoords && startTime){
                    return resolve({coords: startCoords, time: startTime})
                  } else {
                    console.log("start coords and start time could not be found")
                    return resolve(null);
                  }
                } else {
                  console.log(err);
                  return resolve(null)
                }
              })
            } else {
              console.log("Could not find startTimeToken")
              return resolve(null)
            }
          } else {
            console.error(err);
            return resolve(null)
          }
        })
      }
    } else {
        return resolve(null);
    }
  })
}

const positionOptions = {
  timeout: 8000,
  maximumAge: 0
}

export function getLocation(): Promise<ResponseMsg>{
  return new Promise((resolve) => {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((location: any) => {
        const coordsObj = {acc: location.coords.accuracy, lat: location.coords.latitude, lng: location.coords.longitude};
        let obj = {
          success: true,
          payload: coordsObj
        }
        return resolve(obj);
      }, (err: any) => {
        const obj = formatLocationErrMsg(err);
        return resolve(obj);
      }, positionOptions)
    } else {
        alert("your browser does not support location services");
    }
  })
}

  export function getLocationWithValidation(): Promise<ResponseMsg> {
    return new Promise((resolve) => {
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((location: any) => {
          // SUCCESS
          var coordsString = `${location.coords.latitude},${location.coords.longitude}`
          // var newCoordsString = "39.6034810,-119.6822510";
        //   var startCoordsObj = {lat: location.coords.latitude, lng: location.coords.longitude};
        //   var endCoordsObj = {lat: 1.3444464, lng: 103.956141}; //simei mrt
        //   var distance = getDistance(startCoordsObj, endCoordsObj);
          // verify that timezone time is within the accepted range
          const coordsObj = {acc: location.coords.accuracy, lat: location.coords.latitude, lng: location.coords.longitude};
          
          verifyTimeZone(coordsObj)
            .then((res: ResponseMsg) => {
              const {success, msgHeader, msgBody} = res;
                const obj = {
                    success,
                    msgHeader,
                    msgBody,
                    payload: coordsObj
                }
                return resolve(obj);
            })
        // ERROR
        }, (err: any) => {
          const obj = formatLocationErrMsg(err);
          return resolve(obj);
        }, positionOptions);
      } else {
        console.log("your browser does not support location services");
      }
    })
  }

  export function formatLocationErrMsg(err: any){
    let msgHeader = "";
    let msgBody = "";
    switch(err.code) {
      case err.PERMISSION_DENIED:
        msgHeader = "Location service disabled",
        msgBody = "Please enable location services to proceed"
        break;
      case err.POSITION_UNAVAILABLE:
        msgHeader = "Location information is unavailable.",
        msgBody = "Please enable location services to proceed. For mobile devices, you can enable location services through your phone settings"
        break;
      case err.TIMEOUT:
        msgHeader = "Timeout Error";
        msgBody = "The request to get user location timed out.";
        break;
      case err.UNKNOWN_ERROR:
        msgHeader = "An unknown error occurred."
        break;
    }
    const obj = 
    {
      success: false,
      msgHeader: msgHeader,
      msgBody: msgBody,
    }
    return obj;
  }

 export function verifyTimeZone (coords: any): Promise<ResponseMsg> {
    return new Promise((resolve, reject) => {
      var now = new Date();
      var timestamp  = now.getTime() / 1000;
      const {lat, lng} = coords;
      const coordsString = `${lat},${lng}`;
      getTimeZone(coordsString, timestamp)
        .then((res: any) => {
          if(res.status == 200){
            const {rawOffset, timeZoneId, timeZoneName} = res.data;
            var tzOffsetInMin = rawOffset / 60;
            var tzDateString = now.toLocaleString("en-US", {timeZone: timeZoneId});
            // var tzDateString2 = new Intl.DateTimeFormat("en-US", {timeZone: timeZoneId, timeZoneName: timeZoneName});
            var tzDate = new Date(tzDateString);
            // THE TIME RANGe
            const {startHour, endHour} = config;
            
            const currentHour = tzDate.getHours();
            if(startHour <= currentHour && endHour >= currentHour){
              var obj: ResponseMsg = {success: true, payload: tzDate};
              return resolve(obj);
            } else {
              const startTimeString = formatHourToTime(startHour);
              const endTimeString = formatHourToTime(endHour);
              const obj: ResponseMsg = {success: false, msgHeader:"Tracking currently unavailable", msgBody:`You can only track between the times ${startTimeString} and ${endTimeString}`};
              return resolve(obj)
            }
          } else {
            console.error(res);
            return null;
          }
      })
    }) 
  }


//   getLocationSuccess = (location: any) => {
//     return new Promise((resolve) =>{
//       var coordsString = `${location.coords.latitude},${location.coords.longitude}`
//       // var newCoordsString = "39.6034810,-119.6822510";
//       var startCoordsObj = {lat: location.coords.latitude, lng: location.coords.longitude};
//       var endCoordsObj = {lat: 1.3444464, lng: 103.956141}; //simei mrt
//       var distance = getDistance(startCoordsObj, endCoordsObj);
//       this.setState({
//         hideMsg: true
//       })
//       // verify that timezone time is within the accepted range
//       this.verifyTimeZone(coordsString)
//         .then((verified: any) => {
//           this.setState({
//             loading: false,
//             trackingEnabled: verified,
//             startCoords: location.coords
//           })
//           return resolve(location);
//         })
      
//     })
//   }

//   getLocationError = (err: any) => {
//     console.error(err)
//     let msgHeader = "";
//     let showRefreshBtn = false;
//     switch(err.code) {
//       case err.PERMISSION_DENIED:
//         msgHeader = "User denied the request for Geolocation."
//         break;
//       case err.POSITION_UNAVAILABLE:
//         msgHeader = "Location information is unavailable."
//         break;
//       case err.TIMEOUT:
//         msgHeader = "The request to get user location timed out.";
//         showRefreshBtn = true
//         break;
//       case err.UNKNOWN_ERROR:
//         msgHeader = "An unknown error occurred."
//         break;
//     }
//     this.showMsg(msgHeader, "", showRefreshBtn);
//     this.setState({
//       loading: false,
//       success: false,
//     })
//   }