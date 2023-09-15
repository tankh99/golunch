import axios from 'axios';

var API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

// timestamp is to calculate whether daylight savings time offset should be applied
// timestamp is in SECONDS, so convert from milliseconds to seconds by dividing by 100
export function getTimeZone(coordsString: string, timestamp: number){
    return new Promise((resolve) => {
        var url = `https://maps.googleapis.com/maps/api/timezone/json?location=${coordsString}&timestamp=${timestamp}&key=${API_KEY}`;
        axios.get(url)
          .then((res: any) => {
            return resolve(res);
          }).catch((err: any) => {
            return resolve(err);
          })
    })
}

