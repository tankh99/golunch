import React from 'react';
import {BrowserRouter as Router, Route, Switch, RouteComponentProps, withRouter,} from 'react-router-dom';
import PublicLayout from './pages/layout/PublicLayout';
import AdminLayout from './pages/layout/AdminLayout';
import { getShops } from './constants/lookup/shops';
import {connect} from 'react-redux';
import Shop from './models/Shop';
import { populateShops, toggleLoading, setMenuVisibility } from './constants/actionCreators';
import {isMobileDevice} from './constants/global';
import MobileNavbar from './pages/layout/MobileNavbar';
import Navbar from './pages/layout/Navbar';
import SidebarMenu from './pages/layout/SidebarMenu';
import {Sidebar, Segment, Dimmer} from 'semantic-ui-react';
import {StyleSheet, css} from 'aphrodite';
import { verifyToken } from './constants/lookup/auth';
import * as paths from './constants/paths';
import PrivateRoute from './pages/layout/PrivateRoute';
import Page404 from './pages/Page404';
import bg from './images/bg-2.png';

interface PathParamProps {

}

interface P extends RouteComponentProps<PathParamProps>{
  populateShops: any,
  toggleLoading: any,
  menuVisible: boolean,
  toggleMenu: any
}

interface S {
  
}

const mapStateToProps = (state: any) => {
  return {
    menuVisible: state.display.menuVisible
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    populateShops: (shops: Shop[]) => dispatch(populateShops(shops)),
    toggleLoading: (loading: boolean) => dispatch(toggleLoading(loading)),
    toggleMenu: (menuVisible: boolean) => dispatch(setMenuVisibility(menuVisible))
  }
}

class App extends React.Component<P,S> {
  constructor(props: P){
    super(props);
    this.state = {
      
    }
  }
  componentDidMount(){
      //populate shops first
      
      getShops()
        .then((res: any) => {
          this.props.populateShops(res.data);
        })
      // check sidebarm nenu based on device
      // if(isMobileDevice()){
      //     this.setState({menuVisible: false})
      // } else {
      //     this.setState({menuVisible: false})
      // }
  }

  toggleMenu = () => {
      const visible = !this.props.menuVisible;
      this.props.toggleMenu(visible);
  }

  setMenuVisibilty = (visible: boolean) => {
      this.props.toggleMenu(visible);
  }

  render(){
    // const {menuVisible} = this.state;
    const {menuVisible} = this.props
    return (

      <Router>
        {isMobileDevice() ? <MobileNavbar setMenuVisibility={this.setMenuVisibilty} toggleMenu={this.toggleMenu}/> 
                : <Navbar toggleMenu={this.toggleMenu}/>}                
        <Sidebar.Pushable className={`body-container ${css(styles.sidebarPushable)}`} as={Segment}>
          {/* Hide sidebar if on mobile device, show if on dekstop */}
          <SidebarMenu 
              animation={isMobileDevice() ? "overlay": "overlay"}
              className={isMobileDevice() ? "mobile-drawer": ""}
              visible={isMobileDevice() ? menuVisible : menuVisible}/>
          <Dimmer.Dimmable dimmed={menuVisible}>
            <div className={css(styles.background)}>
              <Switch>
                <PrivateRoute path="/admin" allowedRoleIDs={[2,3]} component={AdminLayout}/>
                <Route path="/" component={PublicLayout}/>
                <Route component={Page404}/>
              </Switch>
            </div>
          </Dimmer.Dimmable>
          <Dimmer className="dimmer" active={menuVisible} onClickOutside={() => this.setMenuVisibilty(false)} />
        </Sidebar.Pushable>
      </Router>
    )
  }
}

const styles = StyleSheet.create({
  sidebarPushable: {
    border: 0
  },
  background: {
    backgroundColor: 'var(--bg)',
    backgroundImage: `url(${bg})`,
    backgroundRepeat: 'repeat',
    cursor: 'default'
  }
})


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
