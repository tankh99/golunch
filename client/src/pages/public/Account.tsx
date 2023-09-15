import * as React from 'react';
import Register from './Register';
import ContentContainer from '../../components/ContentContainer';
import {StyleSheet, css} from 'aphrodite'
import HorizontalLabelValue from './components/HorizontalLabelValue';
import { getTodayDistance } from '../../utils/tracking';
import TrackingInfo from '../../models/TrackingInfo';
import HeroInfo from '../../components/HeroInfo';
import { getUserInfo, verifyToken } from '../../constants/lookup/auth';
import ResponseMsg from '../../models/ResponseMsg';
import axios from 'axios';
import { API_ROOT } from '../../constants/global';
import { getDistance } from '../../constants/lookup/distance';
import { RouteComponentProps } from 'react-router';
import * as paths from '../../constants/paths';
import { getUserByID } from '../../constants/lookup/users';

interface P extends RouteComponentProps {

}

interface S {
    firstName: string,
    lastName: string,
    email: string,
    todayDistance: number,
    accumulatedDistance: number,
    totalDistance: number
}

export default class Account extends React.Component<P,S> {

    constructor(props: P){
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            todayDistance: 0,
            accumulatedDistance: 0,
            totalDistance: 0,
        }
    }

    componentDidMount(){
        getTodayDistance()
        .then((res: any) => {
            if(res){
                const todayDistance = Math.round(res * 100)/100;
                this.setState({
                    todayDistance
                })
            }
        })
        
        verifyToken()
        .then((res: ResponseMsg) => {
            const {success, payload} = res;
            if(success){
                const {id, firstName, lastName, email} = payload;
                this.setState({
                    firstName,
                    lastName,
                    email,
                })

                getUserByID(id)
                .then((res: any) => {
                    const {accumulatedDistance, totalDistance} = res.data
                    this.setState({
                        accumulatedDistance,
                        totalDistance
                    })
                })
            }
        })

    }

    render(){
        const {todayDistance, accumulatedDistance, totalDistance, firstName, lastName, email} = this.state;
        return (
            <div className="body-vertical-spacing">
                <ContentContainer header="Personal Info">
                    <table className={css(styles.profileInfo)}>
                        <tbody>
                            <HorizontalLabelValue label="First Name" value={firstName} />
                            <HorizontalLabelValue label="Last Name" value={lastName} />
                            <HorizontalLabelValue label="Email" value={email} />
                        </tbody>
                    </table>
                </ContentContainer>
                <ContentContainer header="Distance">
                    <HeroInfo header="Today's Distance">
                        <p>
                            {todayDistance}km
                        </p>
                    </HeroInfo>
                    <HeroInfo header="Accumulated Distance">
                        <p>
                            {accumulatedDistance}km
                        </p>
                    </HeroInfo>
                    {/* <HeroInfo header="Total Distance (All Time)">
                        <p>
                            {totalDistance}km
                        </p>
                    </HeroInfo> */}
                </ContentContainer>
            </div>
        )
    }
}

const styles = StyleSheet.create({
    profileInfo: {

    }
})