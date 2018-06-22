'use strict'

const {Record} = require('immutable');
const GOOGLE_API_KEY = 'AIzaSyA_QA-qNQfTv7kciVezUclgvIGY_xlMZNg';

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

export function getGeocodeWithCoordinate(latitude, longitude) {
  return fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + latitude + ',' + longitude
    + '&key=' + GOOGLE_API_KEY)
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.status == 'OK') {
        return responseJson.results;
      } else {
        return responseJson.status;
      }
    });
}

export function getPlaceInfoWithCoordinate(latitude, longitude) {
  return fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='
  + latitude + ',' + longitude + '&radius=50&language=zh-CN&key=' + GOOGLE_API_KEY)
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson.results[0];
    });
}
