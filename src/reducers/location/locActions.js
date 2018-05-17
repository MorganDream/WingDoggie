'use strict'

const {
  MAP_LOCATION_CHANGE,
  CURRENT_LOCATION_CHANGE,
  SET_DOGGIE_BUFFER_DESTINATION,
} = require('../../lib/constants').default;

export function onRegionChange(newLocation){
  return {
    type: MAP_LOCATION_CHANGE,
    payload: newLocation
  }
}

export function onCurrentLocationChange(newLocation) {
  return {
    type: CURRENT_LOCATION_CHANGE,
    payload: newLocation
  }
}

export function setBufferDestination(coordinate) {
  return {
    type: SET_DOGGIE_BUFFER_DESTINATION,
    payload: coordinate,
  }
}
