'use strict'

import {LatLng} from '../../lib/predefinedClasses';

const {Record} = require('immutable');
const DEFAULT_LONGITUDE_DELTA = 0.04;
const DEFAULT_LATITUDE_DELTA = 0.09;
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

var Marker = Record({
  index: 0,
  coordinate: LatLng(),
  description: DEFAULT_MARKER_DESCRIPTION,
  modelName: '',
  name: '',
  master: '',
});

var defaultMarker1 = new Marker().set('name', 'Lou')
                              .set('master', 'Alice')
                              .set('modelName', 'standing')
                              .set('description', 'I am tired of walking and enjoying surroundings now.');

var defaultMarker2 = new Marker().set('name', 'Max')
                              .set('master', 'Morgan')
                              .set('modelName', 'walking')
                              .set('description', 'I am happy walking on the map!')
                              .setIn(['coordinate', 'latitude'], 31.0342)
                              .setIn(['coordinate', 'longitude'], 122.0234)
                              .set('index', 1);

var InitialState = Record({
  mapLocation: new Location(),
  currentLocation: new Location(),
  markers: [defaultMarker1, defaultMarker2],
  doggieBufferDestination: null,
});

export default InitialState;
