'use strict'

import React from 'react';
import { View, Text, Dimensions, StyleSheet, Image, TouchableHighlight, Alert, ActivityIndicator } from 'react-native';
import ExpoGraphics from 'expo-graphics';
import ExpoTHREE from 'expo-three';
import * as THREE from 'three';
import { Asset } from 'expo';

import TouchableListItem from '../components/TouchableListItem';
import ColladaMarkerView from '../components/ColladaMarkerView';
import CustomNavBar from '../components/CustomNavbar';

import { connect } from "react-redux";
import { bindActionCreators } from 'redux';

import * as doggieActions from '../reducers/doggie/doggieActions';

import {Actions} from 'react-native-router-flux';

function mapStateToProps(state) {
  return {
    doggie: state.doggieReducer,
    loc: state.locReducer,
    auth: state.authReducer,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(doggieActions, dispatch)
  }
}

const { scaleLongestSideToSize } = ExpoTHREE.utils;

const models = {
  'Wolf_One_dae.dae': require('../resources/models/wolf/Wolf_One_dae.dae'),
  'doggieTravelling.jpg': require('../resources/doggieTravelling.jpg'),
  'doggieAtHome.jpg': require('../resources/doggieAtHome.jpg'),
};

class MyDoggie extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isReady: false,
    }

    this.props.actions.initDoggieWithUser(this.props.auth.loginUserName);

    Promise.all(
      [ExpoTHREE.loadAsync(models['Wolf_One_dae.dae']),
      ExpoTHREE.loadAsync(models['doggieTravelling.jpg']),
      ExpoTHREE.loadAsync(models['doggieAtHome.jpg'])]
    ).then(
      values => {
        this.mesh = values[0];
        this.setState({isReady: true});
      },
      error => {
        console.log(error);
      }
    );
  }

  componentWillMount() {
    var self = this;
    this.timer = setInterval(
      () => {
        self.props.actions.updateDoggieLocation();
      },
      200
    )
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
   if (this.state.isReady){
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          {
            this.props.doggie.isTravelling?
            <View style={styles.header}>
              {this.props.doggie.home.toJS().altitude == this.props.doggie.destination.toJS().altitude &&
              this.props.doggie.home.toJS().longitude == this.props.doggie.destination.toJS().longitude ?
              <Text style={styles.titleText}>Returning...</Text>:
              <Text style={styles.titleText}>Travelling...</Text>}
              <Image style={styles.image} source={require('../resources/doggieTravelling.jpg')} loadingIndicatorSource={require('../resources/default.jpg')}/>
            </View> :
            <View style={styles.header}>
              <Text style={styles.titleText}>At Home...</Text>
              <Image style={styles.image} source={require('../resources/doggieAtHome.jpg')} loadingIndicatorSource={require('../resources/default.jpg')}/>
            </View>
          }
          <TouchableListItem index='name' style={styles.listItem} title='昵称' onPressReact={() => this.onPressReact('name')} editable={false}>
            <Text>{this.props.doggie.name}</Text>
          </TouchableListItem>
          <TouchableListItem index='postion' style={styles.positionListItem} title='位置' onPressReact={() => this.onPressReact('postion')} editable={false}>
            <View>
              <Text>纬度： {this.props.doggie.position.latitude.toFixed(2)} </Text>
              <Text>经度： {this.props.doggie.position.longitude.toFixed(2)} </Text>
            </View>
          </TouchableListItem>
          <TouchableListItem index='speed' style={styles.listItem} title='速度' onPressReact={() => this.onPressReact('speed')} editable={false}>
            <Text>{this.props.doggie.speed}</Text>
          </TouchableListItem>
          <TouchableListItem index='bearing' style={styles.listItem} title='方向' onPressReact={() => this.onPressReact('bearing')} editable={false}>
            <Text>{this.props.doggie.bearing.toFixed(0)}</Text>
          </TouchableListItem>
          <View style={styles.actionButtonContainer}>
              <TouchableHighlight underlayColor={'#676798'}
                    style={styles.actionButton}
                    onPress={this.onAction}>
                  {
                    this.props.doggie.isTravelling?
                    <Text style={styles.actionButtonText}>New Destination</Text> :
                    <Text style={styles.actionButtonText}>Go Travalling!</Text>
                  }
              </TouchableHighlight>
              {
                this.props.doggie.isTravelling && (
                  <TouchableHighlight underlayColor={'#676798'}
                        style={styles.actionButton}
                        onPress={this.goHome}>
                      {
                        <Text style={styles.actionButtonText}>Go Home</Text>
                      }
                  </TouchableHighlight>
                )
              }
          </View>
        </View>
        <View style={styles.graphicContainer}>
          <ColladaMarkerView style={styles.collView} modelName={'walking'} />
        </View>
      </View>
    )
  } else {
    return (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }
  }

  onPressReact = (index) => {
    console.log(index);
  //  this.props.actions.onProfileItemPressed(index);
  //  Actions.listEdit();
  }

  onAction = () => {
    var self = this;
    Actions.map({
      title: 'Set Destination',
      rightTitle: 'Confirm',
      onRightPress: ()=> {
        if (!self.props.loc.doggieBufferDestination) {
          Alert.alert(
            'Destination Not Set!',
            'Please select a destination with a LONG PRESS on the map.',
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
          )
        } else {
          Alert.alert(
            'Confirmation on Destination:',
            'altitude: ' + self.props.loc.doggieBufferDestination.latitude.toFixed(2) + '\n' +
            'longitude: ' + self.props.loc.doggieBufferDestination.longitude.toFixed(2),
            [
              {text: 'OK', onPress: () => {
                self.props.actions.onDestinationUpdated(self.props.loc.doggieBufferDestination.latitude,
                                                    self.props.loc.doggieBufferDestination.longitude);
                // Actions.pop();
              }},
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
            ],
            { cancelable: false }
          )
        }

      }
    });
  }

  goHome = () => {
    this.props.actions.goHome(1000);
  }

    _onRender = delta => {
      if (this.mesh) {
        this.mesh.rotation.y += 0.02 * delta;
        this.mesh.rotation.x += 0.02 * delta
      }
      this.renderer.render(this.scene, this.camera);
    }

    _onContextCreate = async gl => {
      if(!this.mesh) {
        console.log('Error! Mesh Not Ready!');
        return;
      }
      const { scale } = Dimensions.get('window');
      this.renderer = ExpoTHREE.createRenderer({
        gl,
      });
      this.renderer.capabilities.maxVertexUniforms = 52502;
      this.renderer.setPixelRatio(scale);
      this.renderer.setSize(gl.drawingBufferWidth / scale, gl.drawingBufferHeight / scale);

      this.camera = new THREE.PerspectiveCamera(50, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 10000);
      this.camera.position.set(0, 2, 4);
      this.camera.lookAt(0, 0, 0);

      this.setupScene();

      scaleLongestSideToSize(this.mesh, 2);
      // this.mesh = mesh;
      // this.mixer = new THREE.AnimationMixer(mesh);
      // const action = this.mixer.clipAction(animations[0]).play();
      this.scene.add(this.mesh);
    }

    setupScene = () => {
      // scene
      this.scene = new THREE.Scene();
      this.setupLights();
    };

    setupLights = () => {
      // lights
      const directionalLightA = new THREE.DirectionalLight(0xffffff);
      directionalLightA.position.set(1, 1, 1);
      this.scene.add(directionalLightA);

      const directionalLightB = new THREE.DirectionalLight(0xffeedd);
      directionalLightB.position.set(-1, -1, -1);
      this.scene.add(directionalLightB);

      const ambientLight = new THREE.AmbientLight(0x222222);
      this.scene.add(ambientLight);
    };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  indicatorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 180,
  },
  image: {
    height: 110,
    width: 160,
  },
  listItem: {
    paddingLeft: 10,
    height: 60,
    width: 180,
  },
  positionListItem: {
    paddingLeft: 10,
    height: 90,
    width: 180,
  },
  textContainer: {
    flex: 1.1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 50,
    backgroundColor: '#d0d0e1',
  },
  actionButtonContainer: {
    paddingTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    alignItems: 'center',
    height: 30,
    width: 180,
    padding: 10,
    marginBottom: 70,
  },
  titleText: {
    fontSize: 20,
    color: '#00cc00',
    fontWeight: '800',
  },
  actionButtonText: {
    fontSize: 20,
    fontWeight: '800',
    textShadowOffset: {
      height: 60,
      width: 100,
    },
    textAlign: 'right',
    textShadowColor: 'grey',
    fontFamily: 'Arial-BoldMT',
    textDecorationLine: 'underline'
  },
  graphicContainer: {
    flex: 1,
    backgroundColor: '#ffe6f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  collView: {
    width: 300,
    height: 300,
  }
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(MyDoggie);
