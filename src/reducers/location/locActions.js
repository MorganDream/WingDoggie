'use strict'

const {
  MAP_LOCATION_CHANGE,
  CURRENT_LOCATION_CHANGE,
  SET_DOGGIE_BUFFER_DESTINATION,
  SEARCH_STATE_SHIFT,
  FIND_NEARBY_DOGGIES_REQUEST,
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

export function shiftSearchState() {
  return {
    type: SEARCH_STATE_SHIFT,
  }
}

export function findNearyByDoggiesRequest() {
  return {
    type:FIND_NEARBY_DOGGIES_REQUEST,
  }
}

export function onSearchButtonPressed(isSearching) {
  return dispatch => {
    dispatch(shiftSearchState());
    if (!isSearching) {
      dispatch(findNearyByDoggiesRequest);
    }
    return dispatch => {      
      return ;
    }
  }
}
