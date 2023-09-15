import React from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps} from 'react-router-dom';
import ContentContainer from '../../components/ContentContainer';
import HeroInfo from '../../components/HeroInfo';
import {format, differenceInMilliseconds} from 'date-fns'
import { getDateDiff, getDifferenceBetweenTwoDatesInMillis, getSpeed } from '../../utils/helper';
import { getTodayDistance, } from '../../utils/tracking';
import ExpiredStorage from 'expired-storage';
import ResponseMsg from '../../models/ResponseMsg';
import TrackingInfo from '../../models/TrackingInfo';
import {StyleSheet, css} from 'aphrodite';
import * as paths from '../../constants/paths';

interface PathParamProps {
    distance: string,
    startTime: string,
    endTime: string
}

interface P extends RouteComponentProps<PathParamProps>{

}

interface S {
    showStats: boolean,
    distance: number,
    todayDistance: number,
    speed: number,
    trackingInfoList: any,
}

class Statistics extends React.Component<P, S>{

    constructor(props: P){
        super(props);
        this.state = {
            showStats: false,
            distance: 0,
            todayDistance: 0,
            speed: 0,
            trackingInfoList: '',

        }
    }

    componentDidMount(){
        if(this.props.history.location.state){
            let {distance, startTime, endTime, speed} = this.props.history.location.state;
            startTime = new Date(startTime);
            endTime = new Date(endTime);
            // const formattedDate = getDateDiff(endTime, startTime);
            distance = parseFloat(distance.toFixed(2));
            if(!speed){
                speed = 0;
            } else {
                speed = parseFloat(speed.toFixed(2));
            }
            if(distance){
                this.setState({
                    showStats: true,
                    distance,
                    speed
                })
            
            }
            getTodayDistance()
            .then((res: any) => {
                const todayDistance = Math.round(res * 100)/100;
                this.setState({
                    todayDistance
                })
            })
        } else {
            this.props.history.push(paths.LOGIN_PATH)
        }  
    }

    render(){
        const {showStats, distance, todayDistance, speed} = this.state
        return(
            <div className="body-vertical-spacing">
                <ContentContainer header="Statistics">
                    <HeroInfo header="Travelled Distance">
                        <p>{distance}km</p>
                    </HeroInfo>
                    <HeroInfo header="Average Speed">
                        <p>{speed} km/h</p>
                    </HeroInfo>
                </ContentContainer>
                <p className={css(styles.warningTextContainer)}>
                    <strong>Note:</strong> Remember to scan a QR at any of our restaurants to save the distance tracked. 
                    Distance will be doubled when you scan our restaurant's QR code to account for the distance to walk back home
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


export default Statistics