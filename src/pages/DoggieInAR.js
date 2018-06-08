'use strict';

import React from 'react';
import { View, Dimensions, PanResponder, StyleSheet, TouchableHighlight, Animated } from 'react-native';
import { ARKit, withProjectedPosition } from 'react-native-arkit';

import { connect } from "react-redux";
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux'

import * as arActions from '../reducers/ar/arActions';

var projectPosition = null;

function mapStateToProps(state) {
  return {
    ar:state.arReducer,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(arActions, dispatch),
  }
}

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const Cursor3D = withProjectedPosition()(({positionProjected, projectionResult}) => {
  if(!projectionResult) {
    // nothing has been hit, don't render it
    return null;
  }
  return (
    <ARKit.Group
      opacity={0.5}
      position={positionProjected}
      id="cursor_group">
    <ARKit.Torus
      id="cursor_torus"
      position={{x:0, y:0.05, z:0}}
      transition={{duration: 0.1}}
      shape={{ringR: 0.06, pipeR: 0.005}}
      material={{
        color: '#00cc00',
        lightingModel: ARKit.LightingModel.Constant,
      }}
    />
    <ARKit.Text
     id="cursor_text"
     text="Tap Here to Show"
     position={{
       x:0, y:0.1, z:0
     }}
     font={{ size: 0.02, depth: 0.01 }}
     material={{
       color: '#00cc00',
       lightingModel: ARKit.LightingModel.Constant,
     }}
     constraint={ARKit.Constraint.BillboardAxisAll}
    />
    </ARKit.Group>
  )
})

const CursorModel = withProjectedPosition()(({positionProjected, projectionResult}) => {
  if(!projectionResult) {
    // nothing has been hit, don't render it
    return null;
  }
  projectPosition = positionProjected;
  return (
    <ARKit.Model
      id="model_selected_inner"
      position={positionProjected}
      scale={1}
      transition={{duration: 0.1}}
      material={{diffuse: '#4d79ff'}}
      model={{
        scale: 1, // this is deprecated, use the scale property that is available on all 3d objects
        file: 'Models.scnassets/wolf/Wolf_One_dae.dae', // make sure you have the model file in the ios project
      }}
    />
  )
})

class DoggieInAR extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modelTouchPoint: {x: 0, y:0}
    }

    this.ARPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderStart: (evt, gestureState) => {
        ARKit.hitTestSceneObjects({
          x: gestureState.x0,
          y: gestureState.y0,
        }).then(res => {
          return res.results.map(
            result => {
              if (result.id == 'model') {
                this.setState({
                  modelTouchPoint: {x: gestureState.x0, y:gestureState.y0}
                });
                this.props.actions.setSelected(true);
              }
            }
          )
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        this.setState({
          modelTouchPoint: {x: gestureState.x0 + gestureState.dx, y:gestureState.y0 + gestureState.dy}
        });
      },
      onPanResponderEnd: (evt, gestureState) => {
        ARKit.hitTestSceneObjects({
          x: gestureState.x0,
          y: gestureState.y0
        }).then(res => {
          return res.results.map(
            result => {
              if(result.id.startsWith('cursor')) {
                this.props.actions.changeModelPosition(result.position);
              }
            }
          )
        });

        if (this.props.ar.selected) {
          setTimeout(
            () => {
              this.props.actions.setSelected(false);
              this.props.actions.changeModelPosition(projectPosition);
            }, 200
          )
        }
      },
    });
  }

  componentWillMount() {
    this.props.actions.reInit();
  }

  render() {
    return (
      <View style={styles.container}>
      <ARKit
          autoenablesDefaultLighting={false}
          style={styles.arkit}
          planeDetection={ARKit.ARPlaneDetection.Horizontal}
          lightEstimationEnabled={true}
          worldAlignment={
            ARKit.ARWorldAlignment.ARWorldAlignmentGravityAndHeading}
          // origin={{position: {x: -2, y: -1, z:0}, transition: {duration: 1}}}

          onPlaneDetected={this.onPlaneUpdated}
          // // event listener for plane update
          onPlaneUpdated={this.onPlaneUpdated}
          onPlaneRemoved={this.onPlaneRemoved}
          onFeaturesDetected={this.onFeaturesDetected}
          onFeaturesUpdated={this.onFeaturesDetected}
          //
          // // arkit sometimes removes detected planes
          // onPlaneRemoved={anchor => console.log(anchor)}
          onARKitError={console.log} // if arkit could not be initialized (e.g. missing permissions), you will get notified here

          {...this.ARPanResponder.panHandlers}>
          <ARKit.Light
            position={{ x: 0, y: 10, z: 0 }}
            type={ARKit.LightType.Omni}
            eulerAngles={{ x: -Math.PI / 2 }}
            spotInnerAngle={45}
            spotOuterAngle={45}
            color="white"
          />

          {this.props.ar.planes.map(plane => {
            return (
              <ARKit.Plane
              key={plane.id}
              eulerAngles={
                {x: Math.PI/2}
              }
              position={{
                x: (plane.position.x + plane.center.x),
                y: (plane.position.y + plane.center.y),
                z: (plane.position.z + plane.center.z)
              }}
              shape={{
                width: plane.extent.z,
                height: plane.extent.x
              }}
              material={{
                color: '#ffffff',
                lightingModel: ARKit.LightingModel.Constant,
                colorBufferWriteMask: ARKit.ColorMask.None,
              }}
              />
            )
          })
          }
          {
            !this.props.ar.modelPosition &&
            <Cursor3D
              id="cursor"
              projectPosition={{
                x: windowWidth / 2,
                y: windowHeight / 2,
                plane: (results) => results.length > 0 ? results[results.length-1] : null
              }}
            />
          }
          {
            this.props.ar.modelPosition && !this.props.ar.selected &&
            <ARKit.Model
              id="model"
              position={this.props.ar.modelPosition}
              scale={1}
              material={{diffuse: '#663300'}}
              transition={{duration: 0.1}}
              model={{
                scale: 1, // this is deprecated, use the scale property that is available on all 3d objects
                file: 'Models.scnassets/wolf/Wolf_One_dae.dae', // make sure you have the model file in the ios project
              }}
            />
          }
          {
            this.props.ar.modelPosition && this.props.ar.selected &&
            <CursorModel
              id="model_selected"
              projectPosition={{
                x: this.state.modelTouchPoint.x,
                y: this.state.modelTouchPoint.y,
                plane: (results) => results.length > 0 ? results[results.length-1] : null
              }}
            />
          }
        </ARKit>
        {
          this.props.ar.modelPosition &&
          <TouchableHighlight
            style={styles.touchable}
            underlayColor={'#000000'}
            activeOpacity={0}
            onPress={this.onTouchablePressed_}>
            <View style={styles.touchableInner}/>
          </TouchableHighlight>
        }
      </View>
    );
  }

  onTouchablePressed_ = () => {
    ARKit.snapshot().then(res => {
      console.log(res);
      Actions.imagePreViewer({
        imageSource: {
          uri: res.url,
        }
      });
    })
    .catch(err => {
      console.log(err);
    })
  }

  onFeaturesDetected = event=> {
  //  console.log(event.nativeEvent.featurePoints);
  }

  onPlaneUpdated = anchor => {
    this.props.actions.addOrUpdatePlane(anchor);
  }

  onPlaneRemoved = anchor => {
    this.props.actions.removePlane(anchor);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  arkit: {
    flex:1,
  },
  touchable: {
    position:'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#cccccc',
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  touchableInner:{

  }
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(DoggieInAR);
