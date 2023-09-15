import React from 'react';
import {StyleSheet, css} from 'aphrodite';
import {connect} from 'react-redux';
import Clock from './components/Clock';
import { Header } from 'semantic-ui-react';
import ContentContainer from '../../components/ContentContainer';
import HeroInfo from '../../components/HeroInfo';
import { getTime } from  '../../utils/tracking';
import { format, differenceInMilliseconds, subMinutes, subHours } from 'date-fns';
import { formatTime, formatHour, getDifferenceBetweenTwoDatesInMillis, getDateDiff } from '../../utils/helper';
import { getStartInfo, getLocationWithValidation } from '../../utils/location';
import config from '../../config.json';
import { stopTracking, showMsg } from '../../constants/actionCreators';
import { userInfo } from 'os';
import ResponseMsg from '../../models/ResponseMsg';
import { dispatchToggleLoading } from '../../utils/display';

interface P {
    startTime: string,
    stopTracking: any,
    showMsg: any
}

interface S {
    timerID?: any,
    startTime: Date | string
    timeLeft: any,
    seconds: number,
    timeElapsed: any
}

const mapStateToProps = (state: any) => {
    return {
        startTime: state.tracker.startTime
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        showMsg: (msgHeader: string, msgBody: string) => dispatch(showMsg({msgHeader, msgBody})),
        stopTracking: (endCoords: any, endTime: Date) => dispatch(stopTracking({endCoords, endTime})),
    }
}

class Tracker extends React.Component<P,S> {

    constructor(props: P){
        super(props);
        this.state = {
            timerID: undefined,
            startTime: "",
            timeLeft: "",
            seconds: 0,
            timeElapsed: ""
        }
    }

    componentDidMount(){
        // dispatchToggleLoading(true);
        let startTime: any = this.props.startTime;
        if(startTime){
            startTime = new Date(startTime);
            this.setState({
                startTime,
                timerID: setInterval(() => this.tick(), 1000)
            })
            // dispatchToggleLoading(false);
        }
        
        // const startInfo = getStartInfo()
        // this.setState({
        // })
    }

    componentWillUnmount(){
        clearInterval(this.state.timerID);
    }

    tick = () => {
        this.getTimeElapsed()
            .then((timeElapsed : any) => {
                this.setState({
                    timeElapsed
                })
                this.getTimeLeft()
                .then((timeLeft: any) => {
                    console.log(timeLeft);
                    console.log("dispatching toggle loading to flase");
                })
            })
    }

    componentDidUpdate(prevProps: P){
        const {startTime: oldStartTime} = prevProps;
        const {startTime} = this.props;
        if(startTime == oldStartTime){
            // console.log(startTime);
            // console.log(new Date());
        }
    }
    // needs: 
    // 1. current time 
    // 2. end time
    // end time - currentTime;
    getTimeLeft = () => {
        return new Promise((resolve) => {
            const {startHour, endHour} = config;
            // end time
            const {stopTracking, showMsg} = this.props;
            getTime()
                .then((res: any) => {
                    const now = new Date(res.data);
                    let endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, 0, 0, 0);
                    const diffInMillis = differenceInMilliseconds(endTime, now);
                    if(diffInMillis > 0){
                        let diffDate = new Date(diffInMillis);
                        diffDate = this.cleanDate(diffDate);
                        const timeLeft = format(diffDate, "HH:mm:ss");
                        // const timeLeft = getDateDiff(diffDate);
                        this.setState({
                            timeLeft
                        })
                    } else {
                        this.setState({
                            timeLeft: "Time's up!"
                        })
                        showMsg("Time ran out", "The end hour has been passed")
                        stopTracking();
                    }
                })

        })
    }

    getTimeElapsed = () => {
        const {startTime} = this.state;
        return new Promise((resolve) => {
            getTime()
            .then((res: any) => {
                const now = new Date(res.data);
                let diffInMillis = Math.abs(differenceInMilliseconds(startTime, now));
                // console.log(startTime);
                // console.log(now);
                let diffDate = new Date(diffInMillis)
                // default is 7 hours and 30 minutes
                diffDate = this.cleanDate(diffDate);
                // console.log(diffDate)
                const timeElapsed = format(diffDate, "HH:mm:ss");
                // const {seconds} = this.state;
                // const now = new Date(seconds * 1000);
                // const timeElapsed = format(now, "HH:mm:ss");
                // // console.log(now)
                return resolve(timeElapsed)
            })
        })
    }

    // removes the default hour and minutes that exists even within a zero-initialized date
    cleanDate = (date: Date) => {
        const defaultDate = new Date(0) // safari, starts at 8hrs, google chrome starts at 7hr 30 mins
        date = subHours(date, defaultDate.getHours());
        date = subMinutes(date, defaultDate.getMinutes());;
        return date;
    }

    render(){
        const {timeLeft, timeElapsed} = this.state;
        return (
            <div className="">
                <ContentContainer header="Statistics">
                    <HeroInfo header="Time Elapsed">
                        <p>{timeElapsed}</p>
                    </HeroInfo>
                    <HeroInfo header="Time Left">
                        <p>{timeLeft}</p>
                    </HeroInfo>
                </ContentContainer>
                <p className={css(styles.warningTextContainer)}>
                    <strong>Warning:</strong> if you go at a faster speed than {config.speedLimit}km/h, your distance will be invalidated. This is to prevent users from accumulating distance by riding vehicles 
                    <br/><br/>
                    <strong>Note:</strong> This application uses point-to-point distance tracking, so walking around in circles doesn’t count towards your distance. 
                    Distance tracked after time left reaches 0 is wiped if you don't scan the QR code located at the counters at each of our restaurants
                </p>
            </div>
        )
    }
}

const styles = StyleSheet.create({
    warningTextContainer: {
        padding: '0 20px 0 20px',
        // color: 'red'
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Tracker);