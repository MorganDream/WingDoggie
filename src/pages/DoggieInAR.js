'use strict';

import React from 'react';
import { View, Dimensions, PanResponder, StyleSheet,
  TouchableHighlight, Animated, ImageBackground, Image,
  Text, Alert, ActivityIndicator } from 'react-native';
import { ARKit, withProjectedPosition } from 'react-native-arkit';
import Modal from 'react-native-modal';
import RNFS from 'react-native-fs';

import { connect } from "react-redux";
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux'

import * as arActions from '../reducers/ar/arActions';

var projectPosition = null;

function mapStateToProps(state) {
  return {
    ar:state.arReducer,
    loc: state.locReducer,
    auth: state.authReducer,
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
        scale: 0.1, // this is deprecated, use the scale property that is available on all 3d objects
        file: 'Models.scnassets/elf/elf.dae', // make sure you have the model file in the ios project
      }}
    />
  )
})

class DoggieInAR extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modelTouchPoint: {x: 0, y:0},
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
          style={styles.arkit}
          planeDetection={ARKit.ARPlaneDetection.Horizontal}
          lightEstimationEnabled
          worldAlignment={
            ARKit.ARWorldAlignment.ARWorldAlignmentGravityAndHeading}

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
            position={{ x: 0, y: 10, z: 10 }}
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
              id={plane.id}
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
                plane: this.findUsablePlane
              }}
            />
          }
          {
            this.props.ar.modelPosition && !this.props.ar.selected &&
            <ARKit.Model
              id="model"
              position={this.props.ar.modelPosition}
              scale={0.1}
              transition={{duration: 0.1}}
              model={{
                scale: 1, // this is deprecated, use the scale property that is available on all 3d objects
                file: 'Models.scnassets/elf/elf.dae', // make sure you have the model file in the ios project
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
                plane: this.findUsablePlane
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
        {
          this.props.ar.snapshots.length > 0 &&
              <TouchableHighlight
                style={styles.touchableImageLibray}
                activeOpacity={0}
                onPress={this.onImageLibrayPressed_}>
                <ImageBackground style={styles.imageIcon} source={require('../resources/imageLibrary.png')} >
                  <View style={styles.badger}>
                    <Text style={styles.badgerText}>{this.props.ar.snapshots.length}</Text>
                  </View>
                </ImageBackground>
              </TouchableHighlight>
        }
        <Modal style={styles.modal} isVisible={this.props.ar.sendPhotos.total > 0 }>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{this.props.ar.sendPhotos.sended}/{this.props.ar.sendPhotos.total}</Text>
            {this.modalLoadProgress()}
          </View>
        </Modal>
      </View>
    );
  }

  modalLoadProgress = () => {
    var self = this;
    if (this.props.ar.sendPhotos.sended < this.props.ar.sendPhotos.total) {
      return (
        <ActivityIndicator size="small" color="#00ff00" animating={true} />
      )
    }else if(this.props.ar.sendPhotos.total > 0) {
      setTimeout(function(){
        self.props.actions.resetSendPhotos();
      }, 1000);
      return (
        <Image source={require('../resources/confirm_green.png')} style={{width:35, height:35}} />
      )
    }
  }

  findUsablePlane = results => {
      if (results.length <= 0) {
        return null;
      }
      for (var i=0; i< this.props.ar.planes.length; i++) {
        var planeIndex = results.findIndex(result => {
          return result.id == this.props.ar.planes[i].id;
        })
        if(planeIndex >= 0){
          return results[planeIndex];
        }
      }
      return null;
  }

  onImageLibrayPressed_ = () => {
    var self = this;
    Actions.imageLibrary({
      title: 'Images',
      rightTitle: '发送',
      onRightPress: () => {
        Alert.alert(
          'Send Photos',
          'Do you want to send these photos of this elf to her master?',
          [
            {
              text: 'Yes',
              onPress: () => {
                self.props.actions.sendPhotos(self.props.auth.loginUserName,
                  self.props.doggie.owner,
                  self.props.loc.currentLocation,
                  self.props.ar.snapshots.map(snapshotUrl => {
                    var imageName = snapshotUrl.slice(snapshotUrl.indexOf('=')+1, snapshotUrl.lastIndexOf('&'));
                    return RNFS.copyAssetsFileIOS(snapshotUrl,
                      RNFS.CachesDirectoryPath + '/' + imageName + '.jpg', -1, -1)
                      .then(res => {
                        return RNFS.readFile(res, 'base64')                        
                      })
                      .catch(error => {
                        console.log(error);
                        return null;
                      })
                  }));
              }
            },
            {
              text: 'Not Now',
              onPress: () => {
                console.log('Not Now');
              }
            }
          ]
        );
      }
    });
  }

  onTouchablePressed_ = () => {
    var self = this;
    ARKit.snapshot().then(res => {
      console.log(res);
      Actions.imagePreViewer({
        imageSource: {
          uri: res.url,
        },
        title: '保存',
        rightTitle: '删除',
        onTitlePress: () => {
          self.props.actions.takeSnapshots([res.url], true);
          Actions.pop();
        },
        onRightPress: () => {
          Alert.alert(
            'REMIND',
            'Are you sure you want to delete this photo?',
            [
              {text: 'Yes', onPress: () => {
                Actions.pop();
                return RNFS.unlink(res.url)
                  .then(() => {
                    console.log(res.url + ' DELETED');
                  })
                  .catch((err) => {
                    console.log(err.message);
                  });
              }},
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
            ],
          );
        }
      });
    })
    .catch(err => {
      console.log(err);
    })
  }

  onFeaturesDetected = event=> {
    this.props.actions.updateFeaturePoints(event.nativeEvent.featurePoints);
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
  touchableImageLibray: {
    position:'absolute',
    bottom: 50,
    right:10,
    alignSelf: 'flex-end',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  touchableInner:{

  },
  badger: {
    width:24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'red',
    alignItems: 'center'
  },
  imageIcon: {
    width: 60,
    height: 60,
    alignItems: 'flex-end'
  },
  badgerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  modal:{
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalText:{
    color:'black',
    fontSize: 20
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    width: 200,
    height: 100
  },
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(DoggieInAR);
