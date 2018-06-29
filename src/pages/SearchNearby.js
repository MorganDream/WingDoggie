'use strict'

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

import MapView from 'react-native-maps';
import { Marker, Circle } from 'react-native-maps';
import { Location } from 'expo';

import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import {Actions} from 'react-native-router-flux';

import * as locActions from '../reducers/location/locActions';

import Radar from '../components/Radar';
import Bubble from '../components/Bubble';
import DoggieCard from '../components/DoggieCard';

function mapStateToProps(state) {
  return {
    loc:state.locReducer,
  }
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(locActions, dispatch),
  }
};

class SearchNearby extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
      { this.props.loc.isSearching && <Text style={styles.stateText}>Searching...</Text> }
      <TouchableOpacity
        ref={ref => {this.searchTouchable = ref;}}
        style={this.props.loc.isSearching? styles.buttonIsSearching:styles.button}
        onPress={this.onSeachPressed_}>
        <Text
          style={this.props.loc.isSearching? styles.searchTouchableTextIsSearching: styles.searchTouchableText}>
          {this.props.loc.isSearching? 'Cancel':'Search'}
        </Text>
      </TouchableOpacity>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.doggieContainer}
        horizontal={true}
        overScrollMode={'always'}>
      {
        this.props.loc.discoveredNearbyDoggies.map(doggie => {
          if (doggie=='none') {
            return (
              <Text style={styles.result}>No Doggies Nearby</Text>
            )
          }
          return (
            <DoggieCard key={doggie.name}
              name={doggie.name}
              onPressReact1={() => {
                Actions.doggieDetails({
                  title: 'Doggie Details',
                  doggie: doggie
                })
              }}
              onPressReact2={() => {
                Actions.doggieInAR({
                  title: doggie.name,
                  doggie:doggie,
                });
              }} />
          )
        })
      }
      </ScrollView>
      <MapView style={styles.map}
        ref={ref => { this.map = ref; }}
        initialRegion={this.props.loc.mapLocation.toJS()}
        onRegionChangeComplete={this.onRegionChangeComplete}
        showsUserLocation={true}
        showsMyLocationButton={true}
        userLocationAnnotationTitle={"You are here"}
        loadingEnabled={true}
        showsScale={true}
        zoomEnabled={false}
        zoomControlEnabled={false}
      >
          <Marker
            coordinate={this.props.loc.currentLocation}>
            <Radar style={styles.collView} radius={100} isSearching={this.props.loc.isSearching}/>
          </Marker>
          {
            this.props.loc.discoveredNearbyDoggies.map(doggie => {
              if (doggie=='none') {
                return;
              }
              return (
                <Marker
                  title={doggie.name}
                  key={doggie.name}
                  coordinate={doggie.position.toJS()}
                >
                <Bubble text={doggie.name} />
                </Marker>
              )
            })
          }
      </MapView>
      </View>
    )
  }

  componentWillMount() {
    this.watchId = navigator.geolocation.getCurrentPosition(location => {
      console.log(location);
      this.toCurrentLocation_(location.coords);
    }, error=>{
      console.log(error);
    }, {
      timeout: 30000,   // 30 seconds until it fires a GPS error
      maximumAge: 0,   // 15 seconds
      enableHighAccuracy: true,   //check frequently and accurately
      distanceFilter: 1    // don't update if user stays still though
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  onSeachPressed_ = () => {
    this.props.actions.shiftSearchState();
    if (!this.props.loc.isSearching) {
      var self = this;
      this.timeoutId = setTimeout(() => {
        self.props.actions.findNearyByDoggiesRequest();
      }, 3000);
    } else {
      clearTimeout(this.timeoutId);
    }
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
    flex:1,
    alignItems: 'center',
  },
  stateText: {
    top: 290,
    fontSize: 20,
    fontFamily: 'Copperplate'
  },
  map: {
    position: 'absolute',
    height: 260,
    top: 0,
    left: 0,
    right: 0,
  },
  button: {
    top: 300,
    paddingTop:10,
    paddingBottom:10,
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: '#803300',
    borderRadius: 20,
  },
  buttonIsSearching: {
    top: 300,
    paddingTop:10,
    paddingBottom:10,
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: '#fff0e6',
    borderRadius: 20,
  },
  searchTouchableText: {
    color:'white',
    fontSize: 20,
    fontFamily: 'Heiti SC'
  },
  searchTouchableTextIsSearching: {
    color:'black',
    fontSize: 20,
    fontFamily: 'Heiti SC'
  },
  scrollView: {
    top: 340,
    bottom: 200,
    backgroundColor: '#e0e0eb',
  },
  doggieContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingBottom: 100,
  },
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(SearchNearby);
