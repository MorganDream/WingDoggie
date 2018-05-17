'use strict'

import React from 'react';
import ExpoGraphics from 'expo-graphics';
import ExpoTHREE from 'expo-three';
import * as THREE from 'three';
const { scaleLongestSideToSize } = ExpoTHREE.utils;

import { StyleSheet, View, Dimensions } from 'react-native';

const onProgress = function(xhr) {
  if (xhr.lengthComputable) {
    const percentComplete = xhr.loaded / xhr.total * 100;
    console.log(Math.round(percentComplete, 2) + '% downloaded');
  }
};

async function loadModel(modelName) {
  console.log(modelName);
  const model = {
    'walking': require(`../resources/models/wolf/Wolf_dae.dae`),
    'standing': require(`../resources/models/wolf/Wolf_One_dae.dae`),
  };

  const collada = await ExpoTHREE.loadAsync(
    model[modelName],
    onProgress,
    name => model[name]
  );

  return collada;
}

class ColladaMarkerView extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   loading: true,
    // }
  }
  render() {
    return (
      <View {...this.props}>
      <ExpoGraphics.View
        style={styles.view}
        onContextCreate={this._onContextCreate}
        onRender={this._onRender}
        arEnabled={false}
      />
      </View>
    )
  }

  _onRender = delta => {
    if (this.mixer) {
      this.mixer.update(delta);
    }
    this.renderer.render(this.scene, this.camera);
  }

  _onContextCreate = async gl => {
    const { scale } = Dimensions.get('window');
    this.renderer = ExpoTHREE.createRenderer({
      gl,
    });
    this.renderer.capabilities.maxVertexUniforms = 52502;
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(gl.drawingBufferWidth / scale, gl.drawingBufferHeight / scale);
  //  this.renderer.setClearColor(0x000000, 1.0);

    this.camera = new THREE.PerspectiveCamera(50, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 10000);
    this.camera.position.set(4, 2, 0);
    this.camera.lookAt(0, 0, 0);

    this.setupScene();

    const { scene: mesh, animations } = await loadModel(this.props.modelName);
    scaleLongestSideToSize(mesh, 3);
    this.mixer = new THREE.AnimationMixer(mesh);
    const action = this.mixer.clipAction(animations[0]).play();
    this.scene.add(mesh);
  }

  setupScene = () => {
    // scene
    this.scene = new THREE.Scene();

    // Standard Background
//    this.scene.background = new THREE.Color(0xffffff);
  //  this.scene.add(new THREE.GridHelper(50, 50, 0xffffff, 0x555555));
  //  this.scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

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
  view: {
  //  flex:1,
  //  backgroundColor: 'green',
    width: 1000,
    height: 1000,
  }
});

module.exports = ColladaMarkerView;
