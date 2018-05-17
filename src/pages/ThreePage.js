'use strict'

import React from 'react';
import { StyleSheet, Animated, PanResponder, View } from 'react-native';
import Expo from "expo";
import * as THREE from 'three';
import ExpoTHREE from 'expo-three';

import ColladaMarkerView from '../components/ColladaMarkerView';

class ThreePage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      ready: false,
      pan: new Animated.ValueXY({x: 0, y:0}),
    };

    this.glViewPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderStart: (evt, gestureState) => {

      },
      onPanResponderMove: Animated.event(
        [
          null,
          {dx: this.state.pan.x, dy: this.state.pan.y}
        ]
      ),
      onPanResponderEnd: (evt, gestureState) => {

      },
    });
  }

  componentWillMount() {
    (async () => {
      this._textureAsset = Expo.Asset.fromModule(
        require('../resources/login_back.png')
      );
      await this._textureAsset.downloadAsync();
      console.log("ok");
      this.setState({ ready: true });
    })();
  }

  render() {
    return (
      this.state.ready?
      <View style={styles.view}>
        <Animated.View
          {...this.glViewPanResponder.panHandlers}
          style={[styles.animateView, {transform: this.state.pan.getTranslateTransform()}]}>

          <Expo.GLView style={styles.glview}
            onContextCreate={this._onGLContextCreate}
          />
        </Animated.View>
      </View>
      :<Expo.AppLoading style={styles.loader}/>
    )
  }


   _onGLContextCreate = async gl => {
      console.log(this._textureAsset);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000
      );
      const renderer = ExpoTHREE.createRenderer({ gl });
      renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

      const geometry = new THREE.SphereBufferGeometry(1, 36, 36);
      const material = new THREE.MeshBasicMaterial({
        map: await ExpoTHREE.createTextureAsync({
          asset: Expo.Asset.fromModule(require("../resources/login_back.png"))
        })
      });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
      camera.position.z = 2;
      const render = () => {
        requestAnimationFrame(render);
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
        renderer.render(scene, camera);
        gl.endFrameEXP();
      };
      render();
    };
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  collView: {
    // flex: 1,
    // width:200,
    // height: 200,
  //  backgroundColor: 'red',
  },
  animateView: {
    width:200,
    height:200,
  },
  glview: {
    flex:1,
//    backgroundColor: 'black',
  },
  loader: {
    width: 200,
    height: 200,
    color: 'red',
  }
});

module.exports = ThreePage;
