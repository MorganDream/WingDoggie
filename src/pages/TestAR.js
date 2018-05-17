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
          <ARKit.Shape
            position={{ x: -1, y: 0, z: 0 }}
            eulerAngles={{
              x: Math.PI,
            }}
            scale={0.01}
            shape={{
              // specify shape by svg! See https://github.com/HippoAR/react-native-arkit/pull/89 for details
              pathSvg: `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <path d="M50,30c9-22 42-24 48,0c5,40-40,40-48,65c-8-25-54-25-48-65c 6-24 39-22 48,0 z" fill="#F00" stroke="#000"/>
              </svg>`,
              pathFlatness: 0.1,
              // it's also possible to specify a chamfer profile:
              chamferRadius: 5,
              chamferProfilePathSvg: `
                <path d="M.6 94.4c.7-7 0-13 6-18.5 1.6-1.4 5.3 1 6-.8l9.6 2.3C25 70.8 20.2 63 21 56c0-1.3 2.3-1 3.5-.7 7.6 1.4 7 15.6 14.7 13.2 1-.2 1.7-1 2-2 2-5-11.3-28.8-3-30.3 2.3-.4 5.7 1.8 6.7 0l8.4 6.5c.3-.4-8-17.3-2.4-21.6 7-5.4 14 5.3 17.7 7.8 1 .8 3 2 3.8 1 6.3-10-6-8.5-3.2-19 2-8.2 18.2-2.3 20.3-3 2.4-.6 1.7-5.6 4.2-6.4"/>
              `,
              extrusion: 10,
            }}
          />
        </ARKit>
      </View>
    );
  }
}

module.exports = TestAR;
