'use strict'

const {Record} = require('immutable');

// var LatLngConstructor = Record({
//   latitude: 31,
//   longitude: 121,
// });

export function LatLng(latitude, longitude) {
  if (!latitude) {
    latitude = 31;
  }
  if (!longitude) {
    longitude = 121;
  }

  return (new Record({
    latitude: latitude,
    longitude: longitude,
  })());
};
