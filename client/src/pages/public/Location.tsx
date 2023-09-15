import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
// import {GoogleMap} from 'react-google-maps';
// import ReactGoogleMapLoader from 'react-google-maps-loader';

interface P {
}

interface S {
    coords: any,
    isTracking: boolean
}

class Location extends React.Component<P,S>{
    constructor(props: P){
        super(props)
        this.state = {
            coords: {
                longitude: undefined,
                latitude: undefined
            },
            isTracking: false
        }
    }

    componentDidMount(){
        
        navigator.geolocation.watchPosition(position => {
            const {coords} = position
            this.setState({
                coords
            })
        }, err => {
            console.error(err);
        })
    }

    startTracking = () => {
        this.setState({
            isTracking: true
        })
    }

    render(){
        const {
            coords
        } = this.state;
        
        return (
            <div>
                <div>Latitude: {coords.latitude}</div>
                <div>Longitude: {coords.longitude}</div>
                {coords.latitude && coords.longitude &&
                true
                }
                
                {/* <Map   
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyB6KhVwjDZZ9v9k0GoU2B167x6-AtFIHdA"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{height: '400px'}}/>}
                    mapElement={<div style={{height: '100%'}}/>}
                    showMarker={true}
                    lat={coords.latitude}
                    lng={coords.longitude}/> */}
                <br/>
                <Button
                    icon
                    primary
                    type="button"
                    labelPosition="left"
                    onClick={this.startTracking}>
                    <Icon name="location arrow"/>
                    Start Tracking
                </Button>
            </div>
        )
        
    }
}


export default Location
// export default geolocated({
//     positionOptions: {
//         enableHighAccuracy: false
//     },
//     watchPosition: true,
//     userDecisionTimeout: 5000
// })(Location)