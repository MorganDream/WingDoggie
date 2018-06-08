/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { Stack, Router, Scene, Drawer } from 'react-native-router-flux';
import { Provider } from 'react-redux';

import Login from './src/pages/Login';
import WelcomePage from './src/pages/WelcomePage';
import LaunchScreen from './src/pages/LaunchScreen';
import MainPage from './src/pages/Main';
import ProfileMap from './src/pages/ProfileMap';
import ThreePage from './src/pages/ThreePage';
import PersonalProfile from './src/pages/PersonalProfile';
import MyDoggie from './src/pages/MyDoggie';
import DoggieInAR from './src/pages/DoggieInAR';
import SearchNearby from './src/pages/SearchNearby';
import DoggieDetails from './src/pages/DoggieDetails';
import ImagePreViewer from './src/pages/ImagePreViewer';

import DrawerContent from './src/components/DrawerContent';
import ListItemEditPage from './src/components/ListItemEditPage';
import CustomNavBar from './src/components/CustomNavbar';

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './src/reducers';

import AuthInitialState from './src/reducers/auth/authInitialState';
import LocInitialState from './src/reducers/location/locInitialState';
import ProfileInitialState from './src/reducers/profile/profileInitialState';
import DoggieInitialState from './src/reducers/doggie/doggieInitialState';
import ARInitialState from './src/reducers/ar/arInitialState';

function configureStore() {
  return applyMiddleware(thunk)(createStore)();
}

function getInitialState() {
  return {
    authReducer: new AuthInitialState(),
    locReducer: new LocInitialState(),
    profileReducer: new ProfileInitialState(),
    doggieReducer: new DoggieInitialState(),
    arReducer: new ARInitialState(),
  }
}

const store = applyMiddleware(thunk)(createStore)(rootReducer, getInitialState());

export default class App extends React.Component {

  constructor(props){
    super(props);
    console.disableYellowBox = true;
  }

  render() {
    return (
      <Provider store={store}>
        <Router sceneStyle={{ backgroundColor:'white'}}>
         <Scene key="modal" modal>
          <Scene key='root'>
            <Stack key="loginStack" hideNavBar>
              <Scene key="session"
                component={LaunchScreen}
                type="push"
                initial/>
              <Scene key="welcome"
                component={WelcomePage}
                type="push" />
              <Scene key="login"
                component={Login}
                type="push" />
            </Stack>
            <Stack key="mainStack" hideNavBar>
              <Drawer
                key="drawer"
                navigationBarStyle={styles.drawerPageNavbar}
                contentComponent={DrawerContent}
                drawerWidth={200} >
                  <Scene key="searchNearby"
                    component={SearchNearby}
                    type="push"/>
                  <Scene key="myClaim"
                    component={PersonalProfile}
                    type="push" />
                  <Scene key="main"
                    component={MainPage}
                    type="push"
                    initial />
                  <Scene key="myDog"
                    component={MyDoggie}
                    type="push" />
             </Drawer>
             <Scene key="tabPages"
              tabs
              hideNavBar
              tabBarStyle={styles.tabBar}>
              <Scene key="three"
                component={ThreePage}
                type="push" />
             </Scene>
           </Stack>
          </Scene>
          <Scene key="doggieDetails"
           component={DoggieDetails}
           type="push"
           navBar={CustomNavBar}/>
          <Scene key="map"
           component={ProfileMap}
           navBar={CustomNavBar}
           type="push" />
          <Scene key="listEdit"
           component={ListItemEditPage}
           type="push"
           hideNavBar />
          <Scene key="doggieInAR"
           component={DoggieInAR}
           type="push"
           navBar={CustomNavBar} />
          <Scene key="imagePreViewer"
            component={ImagePreViewer}
            type="push"
            navBar={CustomNavBar} />
         </Scene>
        </Router>
      </Provider>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  tabBar: {
    height: 70
  },
  drawerPageNavbar: {
//    backgroundColor: '#1a1a1a'
  }
});
