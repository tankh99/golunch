import * as React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {Route, Redirect, Switch, RouteComponentProps, withRouter } from 'react-router-dom';
import {StyleSheet, css} from 'aphrodite';
import {Sidebar, Segment, Dimmer, Transition, Button, Message, Icon} from 'semantic-ui-react';
import {isMobileDevice, API_ROOT, showNoty} from '../../constants/global';
import Navbar from './Navbar'
import MobileNavbar from './MobileNavbar';
import SidebarMenu from './SidebarMenu';
import PrivateRoute from './PrivateRoute';
import Home from '../public/Home';
import Location from '../public/Location';
import Login from '../public/Login';
import Register from '../public/Register';
import Account from '../public/Account';
import Rewards from '../public/Rewards';
import Page404 from '../Page404';
import Scanner from '../public/Scanner';
import Statistics from '../public/Statistics';
import Shops from '../shops/Shops';
import MyMapComponent from '../../components/MyMapComponent';
import Shop from '../shops/Shop';
import * as paths from '../../constants/paths';
import { stopTracking, startTracking, toggleLoading, setMenuVisibility, showMsg, toggleTrackingBtn, resetMsg } from '../../constants/actionCreators';
import { getLocationWithValidation, getStartInfo, verifyTimeZone, getLocation } from '../../utils/location';
import { getDistance } from '../../utils/helper';
import { getUserInfo, verifyToken } from '../../constants/lookup/auth';
import { dispatchToggleLoading } from '../../utils/display';
// import {ResponseMsg} from '../../models';
import ResponseMsg from '../../models/ResponseMsg';
import {format, compareAsc, compareDesc} from 'date-fns';
import ExpiredStorage from 'expired-storage';
import uuidv4 from 'uuidv4';
import TrackingInfo from '../../models/TrackingInfo';
import jwt from 'jsonwebtoken';
import config from '../../config.json';
import TrackingSessionInfo from '../../models/TrackingSessionInfo';
import { getTrackingInfo, checkTrackingEligibility, finishTracking, checkTrackingInfo } from '../../utils/tracking';
import { getTime } from '../../utils/tracking';
import Noty from 'noty';
import { motion } from 'framer-motion';

interface PathParamProps {

}

interface P extends RouteComponentProps<PathParamProps>{
    // tracking
    startCoords: any,
    endCoords: any,
    isTracking: boolean,
    loading: boolean,
    loggedIn: boolean,
    // tracking functions
    startTracking: any,
    stopTracking: any,
    toggleLoading: any,
    trackingEnabled: boolean,
    toggleTrackingBtn: any,
    // msg
    msgHeader: string,
    msgBody: string,
    // msg functions
    hideMsg: boolean,
    showMsg: any,
    resetMsg: any,    

    

}

/* reasons why tracking would be disabled: 
  1. location nservices are disabled, 
  2. current time is not within the accepted time period
  3. user is not logged in */
interface S {
    menuVisible: boolean,
    hideBottomBar: boolean,
    //tracking
    loading: boolean,
    trackingEnabled: boolean,
    isTracking: boolean,
    checkedTrackingEligibility: boolean,
    checkedIsTracking: boolean,
    //message
    hideMsg: boolean,
    msgHeader: string,
    msgBody: string,
    showRefreshBtn: boolean,
    hasTrackingInfo: boolean,
    ignore: boolean,
}

const mapStateToProps = (state: any) => {
    return {
        loggedIn: state.auth.loggedIn,
        startCoords: state.tracker.startCoords,
        endCoords: state.tracker.endCoords,
        isTracking: state.tracker.isTracking,
        trackingEnabled: state.tracker.trackingEnabled,
        loading: state.display.loading,
        menuVisible: state.display.menuVisible,
        msgHeader: state.display.msgHeader,
        msgBody: state.display.msgBody,
        hideMsg: state.display.hideMsg
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        startTracking: (startCoords: any, startTime: Date) => dispatch(startTracking({startCoords, startTime})),
        stopTracking: () => dispatch(stopTracking()),
        toggleLoading: (loading: boolean) => dispatch(toggleLoading(loading)),
        setMenuVisibility: (menuVisible: boolean) => dispatch(setMenuVisibility(menuVisible)),
        showMsg: (msgHeader: string, msgBody: string) => dispatch(showMsg({msgHeader, msgBody})),
        resetMsg: () => dispatch(resetMsg()),
        toggleTrackingBtn: (enabled: boolean) => dispatch(toggleTrackingBtn(enabled))
    }
}

const signOptions = {
    expiresIn:'12h'
}

class PublicLayout extends React.Component<P,S> {

    public bottomBarRef: any = React.createRef();

    constructor(props: P){
        super(props);
        this.state = {
            hideBottomBar: false,
            menuVisible: false,
            loading: false,
            trackingEnabled: false,
            isTracking: false,
            checkedTrackingEligibility: false,
            checkedIsTracking: false,
            //msg
            hideMsg: true,
            msgHeader: "",
            msgBody: "",
            showRefreshBtn: false,
            hasTrackingInfo: false,
            ignore: true,
        }
    }
    componentDidMount(){
        getStartInfo()
        .then((startInfo: TrackingSessionInfo | null) => {
            if(startInfo != (null || undefined)){ // user was tracking before he refreshed the page
                // console.log(startInfo);
                this.setTrackingDisplayState(startInfo, true);
            }
        })
        // localStorage.removeItem("trackingInfoList");
        // enables/disabled tracking button
        this.updateTrackingEligibility();
        this.checkHasTrackingInfo();
        // automatically hides the bottom bar if user is not at homepage, and is not tracking
        const {location} = this.props.history;
        const {isTracking, showMsg} = this.props;
        getUserInfo()
            .then((res: ResponseMsg) => {
                const {success, payload} = res;
                if(success){
                    this.setState({
                        trackingEnabled: true
                    })
                } else {
                    showMsg("Not logged in", "You need to be logged in to start tracking");
                }
            })
        if(location.pathname != paths.HOME_PATH){
            const startInfo = getStartInfo()
            if(!startInfo){
                this.setState({
                    hideBottomBar: true
                })
            }
        }
        
    }

    componentDidUpdate(prevProps: P, prevState: S){
        const {location: oldLocation, isTracking: oldIsTracking} = prevProps;
        const {location, isTracking} = this.props
        
        const {pathname} = location;
        const {pathname: oldPathname} = oldLocation;
        
        if(location != oldLocation){
            // this extra if statement is to prevent the app from asking for location before user even taps on the tracking button
            if((isTracking != oldIsTracking) || oldPathname == paths.LOGIN_PATH){
                this.updateTrackingEligibility();
            }
            this.checkHasTrackingInfo();
            

        }
        // localStorage.removeItem("trackingInfoList");
    }

    checkHasTrackingInfo = () => {
        checkTrackingInfo()
        .then((res: ResponseMsg) => {
            const {success} = res;
            this.setState({hasTrackingInfo: success})
        })
    }

    updateTrackingEligibility = () : Promise<boolean> => {
        return new Promise((resolve, reject) => {
            const {showMsg, resetMsg} = this.props;
            if(navigator.geolocation){
                // dispatchToggleLoading(true)
                checkTrackingEligibility()
                    .then((res: ResponseMsg) => {
                        // dispatchToggleLoading(false);
                        const {success, msgHeader, msgBody, payload} = res;
                        this.setState({
                            trackingEnabled: success,
                        })
                        
                        if(success){
                            resetMsg();
                            return resolve(true);
                        } else {
                            showMsg(msgHeader, msgBody);
                            return resolve(false);
        
                        }
                    })
            } else {
                alert("Your browser does not support geolocation")
            }
        })
        
    }
    

    // toggles between start and stop tracking buttons and updates the redux store with the start and end coords
    setTrackingDisplayState = (startInfo: TrackingSessionInfo, isTracking: boolean) => {
        console.log("Setting loading to false");
        if(startInfo && isTracking){
            const {coords, time} = startInfo;
            this.props.startTracking(coords, time);
        } else {
            this.props.stopTracking()
        }
        dispatchToggleLoading(false);
    }

    // get location to enable tracking and set variable in the redux store
    /* startTracking will perform 3 functions
    1. update tracking state so that it hides the start button and shows the stop button instead (as well as alters the redux state)
    2. sets the startCoords and startTime into the sessionStorage so that tracking persists through page refreshes
    3. inserts a record in the userHistory table to keep track of when the user started their journey
    */
    startTracking = () => {
        dispatchToggleLoading(true);
        checkTrackingEligibility()
            .then((res: ResponseMsg) => {
                const {success, payload, msgHeader, msgBody} = res;
                if(success){
                    getLocation()
                        .then((res: ResponseMsg) => {
                            const {success, msgHeader, msgBody, payload} = res
                            if(success){
                                // const startTime = format(new Date(), "HH:mm");
                                const secretKey = process.env.REACT_APP_JWT_KEY;
                                if(secretKey){
                                    const userCoordsToken = jwt.sign({startCoords: payload}, secretKey)
                                    sessionStorage.setItem("startCoords", userCoordsToken);
                                    getTime()
                                        .then((res: any) => {
                                            const date = new Date(res.data)
                                            const startTimeToken = jwt.sign({startTime: date}, secretKey)
                                            sessionStorage.setItem("startTime", startTimeToken);
                                            this.setTrackingDisplayState({coords: payload, time: date}, true);
                                            this.props.history.push(paths.HOME_PATH);
                                            this.props.resetMsg()
                                        })
                                } else {
                                    console.log("Could not find secret key")
                                    dispatchToggleLoading(false);
                                }
                            } else {
                                this.props.showMsg(msgHeader, msgBody)
                                dispatchToggleLoading(false);
                            }
                    })
                } else {
                    this.props.showMsg(msgHeader, msgBody);
                    dispatchToggleLoading(false);
                }
            }).catch(err => {
                console.log(err);
                dispatchToggleLoading(false);
            })
    }
    
    stopTracking = () => {
        //this.setState({trackingBtnText:'Continue Tracking'})
        dispatchToggleLoading(true);
        this.updateTrackingEligibility()
            .then((eligible: boolean) => {
                if(eligible){
                    finishTracking()
                    .then((res: ResponseMsg) => {
                        const {success, payload} = res;
                        this.setTrackingDisplayState({coords: "", time: ""}, false);
                        sessionStorage.removeItem("startCoords");
                        sessionStorage.removeItem("startTime");

                        if(success){
                        // if(res && typeof res != "number"){
                            const {startTime, endTime, distance, speed} = payload;
                            this.props.history.push({
                                pathname: paths.STATISTICS_PATH,
                                state: {
                                    distance,
                                    startTime,
                                    endTime,
                                    speed
                                }
                            });
                        // } 
                        } else {
                           showNoty("error", "Your tracking session has been invalidated")
                           this.props.showMsg("Your speed is " + payload.toFixed(2) + " km/hr which is over the limit!", "Your previous tracking session has been invalidated due to you going over the speed limit. This might be caused by you cycling or driving");
                        }
                        
                    }).catch(err => {
                        console.log("could not get response from finish trackign")
                    })
                }
            })
    }

    scanQR = () => {
        getTrackingInfo()
        .then((res: ResponseMsg) => {
            const {success, payload: trackingInfoList} = res
            if(success){
                // // uncomment the below uncommented code if you wanna skip scanning QR code
                // axios.post(`${API_ROOT}/tracking/scanQR`, trackingInfoList)
                // .then((res: any) => {           
                //     if(res.status == 200){
                //         showNoty('success','Your tracking info has been updated');     
                //         localStorage.removeItem("trackingInfoList");   
                //         this.props.history.push(paths.HOME_PATH);
                //     }
                // })
                
                if(success){
                    this.props.history.push(paths.SCANNER_PATH, {trackingInfoList :trackingInfoList});
                } else {
                    showNoty("error", "Could not get tracking information")
                    console.log("Could not get trackingInfoList");
                }
            } else {
                showNoty('error','Tracking info does not exist!');
            }
        })
    }
    toggleBottomBar = () => {
        this.setState((prevState) => ({
            hideBottomBar: !prevState.hideBottomBar,
        }))
        // this.props.resetMsg();
    }
       

    render(){
        const {trackingEnabled, showRefreshBtn, hideBottomBar, hasTrackingInfo} = this.state
        const {loading, isTracking, msgBody, msgHeader, hideMsg} = this.props
        const bottomBarHeight = this.bottomBarRef.current && this.bottomBarRef.current.clientHeight;
        // console.log(bottomBarHeight);
        const animations = {
            container: {
                hidden: {
                    y: bottomBarHeight - 27,
                    transition: {
                        stiffness: 50,
                        when: 'afterChildren'
                    }
                },
                visible: {
                    y: 0,
                    transition: {
                        stiffness: 50,
                        when: 'afterChildren'
                    }
                }
            },
            errMsg: {
                hidden: {
                    scale: 0
                },
                visible: {
                    scale: 1
                }
            }
        }
        
        return (
            <div className={`body-content`}>
                <Switch>
                    <Redirect exact path="/" to={paths.HOME_PATH}/>
                    <Route path={paths.HOME_PATH} component={Home} />
                    <Route path={paths.SCANNER_PATH} component={Scanner}/>
                    <Route path={paths.LOCATION_PATH} component={Location}/>
                    <Route path={`${paths.REWARDS_PATH}/:id`} component={Rewards}/>
                    <Route path={paths.STATISTICS_PATH} component={Statistics}/>
                    <Route path={paths.MAP_PATH} component={MyMapComponent}/>
                    {/* Shops */}
                    <Route path={`${paths.SHOPS_PATH}/:id`} component={Shop}/>
                    <Route path={paths.SHOPS_PATH} component={Shops}/>
                    {/* Account related stuff */}
                    <Route path={paths.LOGIN_PATH} component={Login}/>
                    <Route path={paths.REGISTER_PATH} component={Register}/>
                    <PrivateRoute path={paths.ACCOUNT_PATH} allowedRoleIDs={[1,2,3]} component={Account}/>
                    <Route path={`${paths.REWARDS_PATH}/:id`} component={Rewards}/>
                    
                    <Route component={Page404}/>
                </Switch>
                <motion.div 
                    className={`${css(styles.fixedBottomBar)}`}
                    initial="visible"
                    ref={this.bottomBarRef}
                    variants={animations.container}
                    animate={hideBottomBar ? 'hidden' : 'visible'}>
                    <div className={css(styles.bottomBarNotch)} onClick={this.toggleBottomBar}></div>
                    
                    <motion.div 
                        // variants={animations.content}
                        className={`${css(styles.fixedBottomBarContainer)}`}>
                        <Message 
                            hidden={hideMsg} 
                            onDismiss={this.props.resetMsg}
                            className={`full-width`} negative={true}>
                            <Message.Header>{msgHeader}</Message.Header>
                            <p>{msgBody}</p>
                        </Message>
                        
                        {isTracking ? 
                            <Button negative loading={loading} disabled={!trackingEnabled || loading} className={`${css(styles.trackingBtn)}`} onClick={this.stopTracking}>
                                Stop Tracking
                            </Button>
                        :   hasTrackingInfo 
                            ?
                            <div className={css(styles.continueTrackingContainer)}>
                                <Button onClick={this.scanQR} className={`${css(styles.trackingBtn)}`}>Scan QR</Button>
                                <Button primary loading={loading} disabled={!trackingEnabled || loading} className={`${css(styles.trackingBtn)}`} onClick={this.startTracking}>
                                    Continue Tracking
                                </Button>
                            </div>
                            :
                            <Button primary loading={loading} disabled={!trackingEnabled || loading} className={`${css(styles.trackingBtn)}`} onClick={this.startTracking}>
                                Start Tracking     
                            </Button>
                        }
                    </motion.div>
                 </motion.div>
            </div>
            
        )
    }
}


const styles = StyleSheet.create({
    bottomBarNotch: {
        background: "#ccc",
        borderRadius: '15px',
        height: '8px',
        width: '75px',
        marginBottom: '10px',
        cursor: 'pointer'
    },
    
    fixedBottomBar: {
        position:'fixed',
        width: '100%',
        bottom: 0,
        right: 0,
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems:'center',
        background: 'white',
        borderRadius: '10px 10px 0 0',
        boxShadow: '0 -5px 5px rgba(0,0,0,0.2)',
        zIndex: 49, // 1 less than dimmer
    },
    fixedBottomBarContainer: {
        width: '100%'
    },
    trackingBtn: {
        width: '100%',
    },
    startTrackingBtn: {
        background: '@primaryColor'
    },
    stopTrackingBtn: {
        background: 'red'
    },
    continueTrackingContainer: {
        display: 'flex',
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PublicLayout))

