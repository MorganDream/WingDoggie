'use strict'

import {LatLng} from '../../lib/predefinedClasses';

const {Record} = require('immutable');
const DEFAULT_LONGITUDE_DELTA = 0.005;
const DEFAULT_LATITUDE_DELTA = 0.01;
const DEFAULT_LATITUDE = 0;
const DEFAULT_LONGITUDE = 0;
const DEFAULT_MARKER_TITLE = "Profile Marker";
const DEFAULT_MARKER_DESCRIPTION = "This is a Map Marker";

var Location = Record({
  latitude: DEFAULT_LATITUDE,
  longitude: DEFAULT_LONGITUDE,
  latitudeDelta: DEFAULT_LONGITUDE_DELTA,
  longitudeDelta: DEFAULT_LONGITUDE_DELTA,
});

var InitialState = Record({
  mapLocation: new Location(),
  currentLocation: new LatLng(49, 60),
  doggieBufferDestination: null,
  isSearching: false,
  discoveredNearbyDoggies: [],
});

export default InitialState;
