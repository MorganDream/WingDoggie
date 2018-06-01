'use strict'

import React from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';

import MapView from 'react-native-maps';
import { Marker, Polyline } from 'react-native-maps';

import ExpoTHREE from 'expo-three';

import { connect } from "react-redux";
import { bindActionCreators } from 'redux';

import * as locActions from '../reducers/location/locActions';
import * as doggieActions from '../reducers/doggie/doggieActions';

import ColladaMarkerView from '../components/ColladaMarkerView';

function mapStateToProps(state) {
  return {
    loc:state.locReducer,
    doggie: state.doggieReducer,
  }
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...locActions, ...doggieActions}, dispatch),
  }
};

class ProfileMap extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isReady: false,
    }
    Promise.all(
      [ExpoTHREE.loadAsync(require('../resources/destination.png'))]
    ).then(
      values => {
        console.log(values);
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
      <MapView style={styles.map}
        ref={ref => { this.map = ref; }}
        initialRegion={this.props.loc.mapLocation.toJS()}
        onRegionChangeComplete={this.onRegionChangeComplete}
        showsUserLocation={true}
        showsMyLocationButton={true}
        userLocationAnnotationTitle={"You are here"}
        onUserLocationChange={this.toCurrentLocation_}
        onPoiClick={e=>this.onPoiClickOnMap(e)}
        onLongPress={e=> this.onLongPressOnMap(e)}
        onPress={(e) => this.onMapPress(e)}
      >
          <Marker
            coordinate={this.props.doggie.position}
            title={this.props.doggie.name}
            description={'---- A dog of ' + this.props.doggie.owner} >
            <ColladaMarkerView style={styles.collView} modelName={'walking'} />
          </Marker>
        {
          this.props.loc.doggieBufferDestination &&
            <Marker draggle
              coordinate={this.props.loc.doggieBufferDestination}
              title={'Destination'}
              description={'latitude: '+ this.props.loc.doggieBufferDestination.latitude + ', longitude: ' + this.props.loc.doggieBufferDestination.longitude} >
              <Image source={require('../resources/destination.png')} style={styles.destinationImage} />
            </Marker>
            &&
            <Polyline
              coordinates={[
                this.props.doggie.position,
                this.props.loc.doggieBufferDestination,
              ]}
              strokeColor="#1a53ff"
              strokeWidth={3}
            />
        }
      </MapView>
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
  // {
  //   this.props.loc.markers.map(marker => (
  //     <Marker draggable
  //       key={marker.get('index')}
  //       coordinate={marker.get('coordinate').toJS()}
  //       title={marker.get('name')}
  //       description={'---- A dog of ' + marker.get('master') + '\n' + marker.get('description')} >
  //       <ColladaMarkerView style={styles.collView} modelName={marker.get('modelName')} />
  //     </Marker>
  //   ))
  // }

  componentWillMount() {
    this.watchId = navigator.geolocation.watchPosition(location => {
      this.toCurrentLocation_(location.coords);
    }, error=>{
      console.log(error);
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  onPoiClickOnMap = (e) => {
    console.log('poi click');
    console.log(e.nativeEvent);
  }

  onLongPressOnMap = (e) => {
    console.log(e.nativeEvent);
  }

  onMapPress = (e) => {
    if (e.nativeEvent.action == 'marker-press') {
      return;
    }
    this.props.actions.setBufferDestination(e.nativeEvent.coordinate);
  }

  toCurrentLocation_ = coordinate => {
    this.props.actions.onCurrentLocationChange(coordinate);
    this.map.animateToCoordinate(coordinate, 500);
  }

  onRegionChangeComplete = region => {
    this.props.actions.onRegionChange(region);
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
  collView: {
    width: 60,
    height: 60,
  //  backgroundColor: 'red'
  },
  destinationImage: {
    width: 50,
    height: 50,
  },
  indicatorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(ProfileMap);
