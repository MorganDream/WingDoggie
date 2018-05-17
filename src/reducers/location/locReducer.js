'use strict'

const {
  MAP_LOCATION_CHANGE,
  CURRENT_LOCATION_CHANGE,
  SET_DOGGIE_BUFFER_DESTINATION,
} = require('../../lib/constants').default;

const InitialState = require('./locInitialState').default;

const initialState = new InitialState();

export default function locReducer(state = initialState, action){
  if (!(state instanceof InitialState) || (state == undefined)) return initialState.mergeDeep(state);

  switch (action.type) {
    case MAP_LOCATION_CHANGE:{
      var nextState = state.setIn(['mapLocation', 'latitude'], action.payload.latitude)
                        .setIn(['mapLocation', 'longitude'], action.payload.longitude)
                        .setIn(['mapLocation', 'latitudeDelta'], action.payload.latitudeDelta)
                        .setIn(['mapLocation', 'longitudeDelta'], action.payload.longitudeDelta);
      return nextState;
    }
    case CURRENT_LOCATION_CHANGE: {
      var nextState = state.setIn(['currentLocation', 'latitude'], action.payload.latitude)
                        .setIn(['currentLocation', 'longitude'], action.payload.longitude)
                        .setIn(['currentLocation', 'latitudeDelta'], action.payload.latitudeDelta)
                        .setIn(['currentLocation', 'longitudeDelta'], action.payload.longitudeDelta);
      return nextState;
    }
    case SET_DOGGIE_BUFFER_DESTINATION: {
      var nextState = state.set('doggieBufferDestination', action.payload);
      return nextState;
    }
  }

  return state;
};
