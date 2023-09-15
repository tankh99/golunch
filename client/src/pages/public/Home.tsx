import React from 'react'; 
import restaurant_image from '../../images/restaurantImage.jpg';
import {withRouter, RouteComponentProps, Link} from 'react-router-dom'
import { Button, Loader, Dimmer, Message, Icon, Image, Header, Container } from 'semantic-ui-react';
import * as paths from '../../constants/paths';
import {StyleSheet, css} from 'aphrodite';
import axios from 'axios';
import {connect} from 'react-redux';
import Tracker from './Tracker';
import config from '../../config.json';
import Slider from 'react-slick';
import { getPromotedShops } from '../../constants/lookup/shops';
import {motion} from 'framer-motion';

// // for any props you intend to pass via route
// interface PathParamProps {

// }

interface P extends RouteComponentProps{
  isTracking: boolean
}

interface S{
  promotedShops: any,
  loading: boolean,
}

const mapStateToProps = (state: any) => {
  return {
    isTracking: state.tracker.isTracking
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    
  }
}

class Home extends React.Component<P,S> {

  constructor(props: P){
    super(props);
    this.state = {
      promotedShops: [],
      loading: false
    }
  }

  componentDidMount(){
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
    if(apiKey){
      
    }
    this.setState({
      loading: true
    })
    getPromotedShops()
      .then((res: any) => {
        this.setState({
          promotedShops: res,
          loading: false
        })
      })
  }


  render(){
    const {isTracking} = this.props;
    const {promotedShops, loading} = this.state;
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    
    return (
      <div className="body-vertical-spacing">
      {/* <Image src={require(`${process.env.PUBLIC_URL}/static/media`)}/> */}
      {isTracking ? 
        <Tracker/>
        : 
        <div className={`${css(styles.centeredVerticalContainer)}`}>
          {/* <Loader active={loading}>Loading</Loader> */}
          {promotedShops && promotedShops.length > 0
            &&
            <div>
              <Header as="h2" textAlign="center">Promoted Restaurants</Header>
                <Slider {...settings}>
                  {promotedShops.map((shop: any, index: number) => {
                    let {id, imageUrl, name, description} = shop
                    return (
                      <Link key={index} to={`${paths.SHOPS_PATH}/${id}`}>
                        <motion.div
                          key={index}
                          className="image-text-wrapper"
                          initial="hidden"
                          animate={loading ? "hidden" : "visible"}
                          variants={animations.slider}>   
                            <Image className="object-fitted-container" src={require(`../../${imageUrl}`)}/>
                            <div className="text-container">
                              <Header as="h2">{name}</Header>
                              <Header as="h4">{description}</Header>
                            </div>
                        </motion.div>
                      </Link>
                    )
                  })}
                </Slider>
            </div>}
          
          <Container text>
            <h3 className="subtitle-text centered-text">you are tracking for</h3>
            <p className={css(styles.restaurantName)}>{config.restaurantName}</p>
          </Container>
          {/* <div className={css(styles.restaurantInfoContainer)}>
            <div className={css(styles.restaurantImageContainer)}>
              <img src={restaurant_image} className={`${css(styles.restaurantImage)} image`} alt="Restaurant Image"/>
            </div>
          </div> */}
        </div>
      }
      </div>
    )
  }
}

const animations = {
  slider: {
    hidden: {
        x: -800,
        // scale: 0.2
    },
    visible: {
        x: 0,
        // scale: 1
    }
  }
}

const styles = StyleSheet.create({
  dimmer: {
    height: '100vh'
  },
  centeredVerticalContainer:{
    // display:'flex',
    // justifyContent: 'center',
    // flexDirection: 'column'
  },
  trackingErrorText: {
    color: 'red',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px'
  },
  restaurantInfoContainer: {
    margin: 'auto',
    marginTop: 0,
    marginBottom: 0
  },
  restaurantImageContainer: {
    marginTop: '15px',
    marginBottom: '15px',
  },
  restaurantImage: {
    maxHeight: '400px',
    objectFit: 'cover',
    borderRadius: '10px',
  },
  restaurantTextContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '2.5rem'
  },
  restaurantName: {
    fontSize: '2.5rem',
    textAlign: 'center'
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Home);
