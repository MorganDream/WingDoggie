'use strict';

import React from 'react';
import { AppRegistry, View } from 'react-native';
import { ARKit } from 'react-native-arkit';

class TestAR extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
      <ARKit
          style={{ flex: 1 }}
          debug
          // enable plane detection (defaults to Horizontal)
          planeDetection={ARKit.ARPlaneDetection.HorizontalVertical}

          // enable light estimation (defaults to true)
          lightEstimationEnabled={true}

          worldAlignment={ARKit.ARWorldAlignment.GravityAndHeading}

          origin={{position: {x: -2, y: -1, z:0}, transition: {duration: 1}}}
          // get the current lightEstimation (if enabled)
          // it fires rapidly, so better poll it from outside with
          // ARKit.getCurrentLightEstimation()
          // onLightEstimation={e => console.log(e.nativeEvent)}
          //
          // // event listener for (horizontal) plane detection
          // onPlaneDetected={anchor => console.log(anchor)}
          //
          // // event listener for plane update
          // onPlaneUpdated={anchor => console.log(anchor)}
          //
          // // arkit sometimes removes detected planes
          // onPlaneRemoved={anchor => console.log(anchor)}
          //
          // // event listeners for all anchors, see [Planes and Anchors](#planes-and-anchors)
          // onAnchorDetected={anchor => console.log(anchor)}
          // onAnchorUpdated={anchor => console.log(anchor)}
          // onAnchorRemoved={anchor => console.log(anchor)}
          //
          // // you can detect images and will get an anchor for these images
          // detectionImages={[{ resourceGroupName: 'DetectionImages' }]}


          onARKitError={console.log} // if arkit could not be initialized (e.g. missing permissions), you will get notified here
        >
          <ARKit.Model
            position={{ x: 0, y: -1, z: 0 }}
            scale={1}
            model={{
              scale: 1, // this is deprecated, use the scale property that is available on all 3d objects
              file: 'Models.scnassets/wolf/Wolf_One_dae.dae', // make sure you have the model file in the ios project
            }}
          />
          <ARKit.Sphere
            position={{ x: 0, y: 0, z: 0 }}
            shape={{ radius: 0.05 }}
          />
        </ARKit>
      </View>
    );
  }
}

module.exports = TestAR;
