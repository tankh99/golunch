import {format, subHours, subMinutes, differenceInMilliseconds, differenceInSeconds, differenceInHours} from 'date-fns';
import FormattedHour from '../models/FormattedHour';


export function rad (x: number){
    return x * Math.PI / 180;
};

export function getDistance (p1: any, p2: any) {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(p2.lat - p1.lat);
    var dLong = rad(p2.lng - p1.lng);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // distance in meter

    d /= 1000;
    return d; 
};

// TIME

export function formatHourToTime (hour: number) {
    // const ampm = hour >= 12 ? 'PM' : 'AM'
    // if(hour > 12){
    //     hour -= 12
    // }
    const formatObj = formatHour(hour);
    const hourDate = new Date(0, 0, 0, formatObj.hour, 0, 0, 0);
    // const timeString = format(hourDate, "HH:mm A"); // lowercase a symbolizes the AM or PM
    const timeString = format(hourDate, "HH:mm") + formatObj.ampm
    return timeString
}

export function formatTime(date: Date): string{
    let hour = date.getHours();
    const formatObj = formatHour(hour)
    date.setHours(formatObj.hour);
    const timeString = format(date, "HH:mm:ss") + formatObj.ampm;
    return timeString;
}

export function formatHour(hour: number): FormattedHour{
    const ampm = hour >= 12 ? 'PM' : 'AM'
    if(hour > 12){
        hour -= 12
    }
    return {hour, ampm}
}

export function getDifferenceBetweenTwoDatesInMillis(date1: Date, date2: Date): number{
    const diffInMillis = Math.abs(date1.getTime() - date2.getTime());
    return diffInMillis;
}

export function getSpeed(date1: Date | string, date2: Date | string , distance:number): number{
    const secondsDiff = Math.abs(differenceInSeconds(date1, date2));
    const speed = distance/(secondsDiff) * 3600;
    // console.log(secondsDiff)
    // console.log(distance);
    // console.log(speed);
    // console.log(isFinite(speed));
    
    // alert(`Distance: ${distance}, Time: ${secondsDiff}, Speed: ${speed}`);
    if(isFinite(speed)){
        return speed;
    } else if (secondsDiff == 0){ // means that the user just immediately stopped tracking the moment he started tracking
        return 0;
    } else {
        console.log("You divided by 0")
        return speed;
    }
}


export function getDateDiff(end: Date, start: Date): Date{
    const diffInMillis = differenceInMilliseconds(end, start);
    const diffDate = new Date(diffInMillis);
    const cleanedDate = cleanDate(diffDate);
    return cleanedDate;
}

export function cleanDate (date: Date){
    const defaultDate = new Date(0) // safari, starts at 8hrs, google chrome starts at 7hr 30 mins
    date = subHours(date, defaultDate.getHours());
    date = subMinutes(date, defaultDate.getMinutes());;
    return date;
}
