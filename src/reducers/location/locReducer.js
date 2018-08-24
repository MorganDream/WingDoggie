'use strict'

import geolib from 'geolib';

const {
  MAP_LOCATION_CHANGE,
  CURRENT_LOCATION_CHANGE,
  SET_DOGGIE_BUFFER_DESTINATION,
  SEARCH_STATE_SHIFT,
  FIND_NEARBY_DOGGIES_REQUEST,
} = require('../../lib/constants').default;

import { Users } from '../../lib/dataTable';

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
                        .setIn(['currentLocation', 'longitude'], action.payload.longitude);
      return nextState;
    }
    case SET_DOGGIE_BUFFER_DESTINATION: {
      var nextState = state.set('doggieBufferDestination', action.payload);
      return nextState;
    }
    case SEARCH_STATE_SHIFT: {
      return state.set('isSearching', !state.isSearching)
                  .set('discoveredNearbyDoggies', []);
    }
    case FIND_NEARBY_DOGGIES_REQUEST: {
      var nearbyDoggies = [];
      Users.map(user => {
        var doggie = user.doggie;
        var distance = geolib.getDistance(state.currentLocation.toJS(), user.doggie.position.toJS(), 1, 1);
        if (distance < 10000000) {
          nearbyDoggies.push(doggie);
        }
      });
      var nextState = state.set('isSearching', false);
      if (nearbyDoggies.length > 0) {
        nextState = nextState.set('discoveredNearbyDoggies', nearbyDoggies);
      } else {
        nextState = nextState.set('discoveredNearbyDoggies', ['none']);
      }

      return nextState;
    }
  }

  return state;
};
