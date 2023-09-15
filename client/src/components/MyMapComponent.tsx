import React from 'react';
import {Map, Marker, InfoWindow, GoogleApiWrapper, MapProps, InfoWindowProps} from 'google-maps-react';
import {getLocation} from '../utils/location';
import ResponseMsg from '../models/ResponseMsg';
import {StyleSheet, css} from 'aphrodite';

interface P extends MapProps, InfoWindowProps{

}

interface S {
    showingInfoWindow: boolean,
    activeMarker: any,
    selectedPlace: any
}

class MyMapComponent extends React.Component<P,S>{

    constructor(props: P){
        super(props);
        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {}
        }
    }

    componentDidMount(){
        getLocation()
            .then((res: ResponseMsg) => {
                console.log(res);
            })
    }

    onMarkerClick = (props: any, marker: any, e: any) => {
        console.log(props);
        console.log(marker);
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
          });
    }
    
    onMapClick = (props: any) => {
        if (this.state.showingInfoWindow) {
          this.setState({
            showingInfoWindow: false,
            activeMarker: null
          });
        }
      }

    // onInfoWindowClose = (e: any) => {
    //     console.log(e)
    // }

    render(){
        const {google, map} = this.props;
        return(
            <div>
                <Map
                    onClick={this.onMapClick} 
                    styles={[styles.map]}
                    google={google} zoom={11} >
                    <Marker
                        onClick={this.onMarkerClick}/>
                    <InfoWindow
                        google={google}
                        map={map}
                        marker={this.state.activeMarker}>
                        <div>
                            Fucking garbage
                        </div>
                    </InfoWindow>
                    {/* <InfoWindow 
                        google={google}
                        marker={this.state.activeMarker}
                        visible={this.state.showingInfoWindow} >
                        <div>
                            Fucking garbage
                        </div>
                    </InfoWindow> */}
                </Map>
            </div>
        )
    }
}

const styles = StyleSheet.create({
    map: {
        marginBottom: '80px'
    }
})

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY
})(MyMapComponent)