'use strict'

import React from 'react';
import { View, Text, Dimensions, StyleSheet, Image, ActivityIndicator } from 'react-native';
import ExpoGraphics from 'expo-graphics';
import ExpoTHREE from 'expo-three';
import * as THREE from 'three';

import TouchableListItem from '../components/TouchableListItem';

import { connect } from "react-redux";
import { bindActionCreators } from 'redux';

import * as profileActions from '../reducers/profile/profileActions';

import {Actions} from 'react-native-router-flux';

function mapStateToProps(state) {
  return {
    profile: state.profileReducer
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(profileActions, dispatch)
  }
}

const { scaleLongestSideToSize } = ExpoTHREE.utils;

const onProgress = function(xhr) {
  if (xhr.lengthComputable) {
    const percentComplete = xhr.loaded / xhr.total * 100;
    console.log(Math.round(percentComplete, 2) + '% downloaded');
  }
};

const models = {
  'StickFigurea.obj': require('../resources/models/figure/StickFigurea.obj'),
  'texture': require('../resources/models/figure/zbrushstickfigur_00000.jpg'),
  'default_avatar.jpg': require('../resources/default_avatar.jpg'),
};

async function loadFigure() {

  const texture = await ExpoTHREE.loadAsync(models['texture']);

  const object = await ExpoTHREE.loadAsync(models['StickFigurea.obj'], onProgress, name => models[name]);

  const SCALE = 2.436143; // from original model
  const BIAS = -0.428408; // from original model
  const materialNormal = new THREE.MeshNormalMaterial({
    displacementScale: SCALE,
    displacementBias: BIAS,
    normalMap: texture,
    normalScale: new THREE.Vector2(1, -1),
    //flatShading: true,
    side: THREE.DoubleSide,
  });

  const geometry = object.children[0].geometry;
  geometry.center();
  const mesh = new THREE.Mesh(geometry, materialNormal);
  return mesh;
}

class PersonalProfile extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isReady: false,
    }
    Promise.all(
      [loadFigure(),
      ExpoTHREE.loadAsync(models['default_avatar.jpg'])]
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

  render() {
   if (this.state.isReady) {
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <TouchableListItem index='image' style={styles.imageListItem} title='头像' onPressReact={() => this.onPressReact('image')} editable={false}>
            <Image style={{width: 100, height: 100}} source={require('../resources/default_avatar.jpg')} />
          </TouchableListItem>
          <TouchableListItem index='name' style={styles.listItem} title='姓名' onPressReact={() => this.onPressReact('name')}>
            <Text>{this.props.profile.profileInfo.name}</Text>
          </TouchableListItem>
          <TouchableListItem index='gender' style={styles.listItem} title='性别' onPressReact={() => this.onPressReact('gender')}>
            <Text>{this.props.profile.profileInfo.gender}</Text>
          </TouchableListItem>
          <TouchableListItem index='district' style={styles.listItem} title='地区' onPressReact={() => this.onPressReact('district')}>
            <Text>{this.props.profile.profileInfo.district}</Text>
          </TouchableListItem>
          <TouchableListItem index='sign' style={styles.listItem} title='签名' onPressReact={() => this.onPressReact('sign')}>
            <Text>{this.props.profile.profileInfo.sign}</Text>
          </TouchableListItem>
        </View>
        <View style={styles.graphicContainer}>
          <ExpoGraphics.View
            style={styles.view}
            onContextCreate={this._onContextCreate}
            onRender={this._onRender}
            arEnabled={false}
          />
        </View>
      </View>
    )
  }else {
    return (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }
  }

  onPressReact = (index) => {
    console.log(index);
    this.props.actions.onProfileItemPressed(index);
    Actions.listEdit();
  }

    _onRender = delta => {
      if (this.mesh) {
        this.mesh.rotation.y += 0.02 * delta;
        this.mesh.rotation.x += 0.02 * delta
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
  imageListItem: {
    paddingLeft: 10,
    height: 160,
    width: 180
  },
  listItem: {
    paddingLeft: 10,
    height: 60,
    width: 180,
  },
  textContainer: {
    flex: 1.1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 50,
    backgroundColor: '#d0d0e1',
  },
  graphicContainer: {
    flex: 1,
    backgroundColor: '#ffe6f2',
  },
  view: {
    width: 600,
    height: 600,
    backgroundColor: 'black'
  }
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(PersonalProfile);
