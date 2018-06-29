'use strict'

import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableHighlight } from 'react-native';

import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

const DEFAULT_LONGITUDE_DELTA = 0.005;
const DEFAULT_LATITUDE_DELTA = 0.005;

class PhotoLocation extends React.Component {
  getInitialRegion_ = () => {
    return {
      latitude: this.props.location.latitude,
      longitude: this.props.location.longitude,
      latitudeDelta: DEFAULT_LATITUDE_DELTA,
      longitudeDelta: DEFAULT_LONGITUDE_DELTA,
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView style={styles.map}
          initialRegion={this.getInitialRegion_()}
          loadingEnabled={true}
          showsUserLocation={true}
          showsMyLocationButton={true}
          userLocationAnnotationTitle={"You are here"}
        >
          <Marker
            coordinate={this.props.location}
          >
            <TouchableHighlight underlayColor={'#333300'}>
              <ImageBackground style={styles.image} source={this.props.imageSource} >
                <View style={styles.badger}>
                  <Text style={styles.badgerText}>{this.props.photoCount}</Text>
                </View>
              </ImageBackground>
            </TouchableHighlight>
          </Marker>
        </MapView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  image: {
    width:100,
    height: 100,
    borderWidth: 5,
    borderColor: '#b3b3cc',
    borderRadius: 10,
    alignItems: 'flex-end',
  },
  badger: {
    width:24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'blue',
    alignItems: 'center'
  },
  badgerText: {
    fontSize: 20,
    color: 'white'
  },
});

module.exports = PhotoLocation;
