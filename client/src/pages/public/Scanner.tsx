import React from 'react';
import QrReader from 'react-qr-reader';
// import QrReader from 'react-qr-scanner'
import {connect} from 'react-redux';
import {Route, Redirect, Switch, RouteComponentProps, withRouter } from 'react-router-dom';
import { toggleCamera } from '../../constants/actionCreators';
import { Button } from 'semantic-ui-react';
import {StyleSheet, css} from 'aphrodite';
import { getUserMedia } from '../../utils/camera';
import axios from 'axios';
import {isMobileDevice, API_ROOT, showNoty} from '../../constants/global';
import * as paths from '../../constants/paths';
import { getTrackingInfo } from '../../utils/tracking';
import TrackingInfo from '../../models/TrackingInfo';
import ExpiredStorage from 'expired-storage';
import Noty from 'noty';


interface S {
    result: any,
    delay: number | boolean
    trackingInfoList: any,
}

interface P {
    enableCamera: any,
    disableCamera: any,
    cameraEnabled?: boolean,
    history: any,
    location: any,
}

const mapStateToProps = (state: any) => {
    // console.log(state.services);
    return {
        cameraEnabled: state.services.cameraEnabled
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        enableCamera: () => dispatch(toggleCamera(true)),
        disableCamera: () => dispatch(toggleCamera(false))
    }
}

class Scanner extends React.Component<P, S> {
    constructor(props: P){
        super(props);
        this.state = {
            result: undefined,
            delay: 2000,
            trackingInfoList: '',
        }
    }

    componentDidMount(){
        this.props.enableCamera();
        // this.checkShopQRs();

    }

    // should not change state in this method, because component will not be re-rendered
    componentWillUnmount(){ 
        this.props.disableCamera();
    }

    handleScan = (data: any) => {
        
        if(data) {
            this.setState({result: data})
            console.log(data);
            let breakCondition = false;
            // loops through all shops in the database and checks if their access token is equal to the scanned qr code data
            axios.get(`${API_ROOT}/shops/get`)
            .then((res:any)=>{
                res.data.map((each:any)=> {
                    if([each.accessToken].includes(data) && !breakCondition){     
                        console.log("Access token is valid");
                        breakCondition= true;
                        const trackingInfoList: TrackingInfo[]= this.props.location.state.trackingInfoList;
                        this.setState({trackingInfoList:trackingInfoList})

                        axios.post(`${API_ROOT}/tracking/scanQR`, this.state.trackingInfoList)
                        .then((res: any) => {                        
                            if(res.status == 200){
                                showNoty('success',"Your today's distance has been saved");     
                                localStorage.removeItem("trackingInfoList");   
                                this.props.history.push(paths.HOME_PATH);
                            }
                        })
                    }
                }) 
                if (breakCondition == false)
                {
                    showNoty('error','Invalid QR Code. Please check again!');
                }             
            })
            
            
        }   
    }

    checkShopQRs = () => {
        const data = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjJmMTgwYTBkLWExYWMtNTIxYy04NDNlLWJhMGI4NTFmM2MyOCIsImlhdCI6MTU2MzI2NjMyMCwiZXhwIjoxNTYzMzUyNzIwfQ.zLkR4X3TPVOEvCs322_e3XF99y2qdmXZKA5ItLHEGXw"

        this.setState({result: data})
        let breakCondition = false;
        axios.get(`${API_ROOT}/shops/get`)
        .then((res:any)=>{
            res.data.map((each:any)=> {
                if([each.accessToken].includes(data) && !breakCondition){             
                    breakCondition= true;
                    const trackingInfoList: TrackingInfo[]= this.props.location.state.trackingInfoList;
                    this.setState({trackingInfoList:trackingInfoList})

                    axios.post(`${API_ROOT}/tracking/scanQR`, this.state.trackingInfoList)
                    .then((res: any) => {                        
                        if(res.status == 200){
                            showNoty('success','Your tracking info has been updated');
                            this.stop()  
                            localStorage.removeItem("trackingInfoList");   
                            this.props.history.push(paths.HOME_PATH);
                        }
                    })
                }
                else{
                    showNoty("error", "The QR code scanned is invalid")             
                }
            }) 
            if (breakCondition == false)
            {
                showNoty('error','Invalid QR Code. Please check again!');
            }             
        })
    }

    handleError = (err: any) => {
        console.error(err);
    }

    start = () => {
        this.props.enableCamera()
    }

    stop = () => {
        this.props.disableCamera();
        getUserMedia()
        .then((stream: any) => {
            // stream.getTracks()[0].stop();
            stream.getAudioTracks().forEach((track: any) => track.stop());
        })
    }

    render(){
        const {
            cameraEnabled
        } = this.props
        const {
            delay,
            result
        } = this.state
        return(
            <div>
                
                <QrReader
                    className={`scanner`}
                    style={cameraEnabled ? {display: "block"} : {display: "none"}}
                    //delay={cameraEnabled ? 1000 : false}  
                    delay={2300}       
                    onError={this.handleError}
                    onScan={this.handleScan}/>
            </div>
        )
    }
}

const styles = StyleSheet.create({
    
})

export default connect(mapStateToProps, mapDispatchToProps)(Scanner);