'use strict'

import geolib from 'geolib';

const {
  DOGGIE_STATE_HOME,
  DOGGIE_DESTINATION_UPDATE,
  UPDATE_DOGGIE_LOCATION,
  INIT_DOGGIE_WITH_USER,
} = require('../../lib/constants').default;

import { Users } from '../../lib/dataTable';

const InitialState = require('./doggieInitialState').default;

const initialState = new InitialState();

export default function locReducer(state = initialState, action){
  if (!(state instanceof InitialState) || (state == undefined)) return initialState.mergeDeep(state);

  switch (action.type) {
    case INIT_DOGGIE_WITH_USER: {
      var nextState = state;
      Users.map(user => {
        if (user.name == action.payload) {
          nextState = state.set('name', user.doggie.name)
                          .set('owner', user.doggie.owner)
                          .set('isTravelling', user.doggie.isTravelling)
                          .set('speed', user.doggie.speed)
                          .set('bearing', user.doggie.bearing)
                          .set('timeTag', (new Date()))
                          .setIn(['home', 'latitude'], user.doggie.home.latitude)
                          .setIn(['home', 'longitude'], user.doggie.home.longitude)
                          .setIn(['position', 'latitude'], user.doggie.position.latitude)
                          .setIn(['position', 'longitude'], user.doggie.position.longitude)
                          .setIn(['destination', 'latitude'], user.doggie.destination.latitude)
                          .setIn(['destination', 'longitude'], user.doggie.destination.longitude);
          return;
        }
      });
      return nextState;
    }
    case DOGGIE_STATE_HOME:{
      var bearing = geolib.getRhumbLineBearing(state.get('position').toJS(), state.get('home').toJS());
      var nextState = state.set('speed', action.payload.speed)
                          .set('bearing', bearing)
                          .setIn(['destination', 'latitude'], state.getIn(['home', 'latitude']))
                          .setIn(['destination', 'longitude'], state.getIn(['home', 'longitude']))
                          .set('timeTag', (new Date()));
      return nextState;
    }
    case DOGGIE_DESTINATION_UPDATE: {
      console.log(action.payload);
      var bearing = geolib.getRhumbLineBearing(state.get('position').toJS(), action.payload);
      var speed = 10;
      var nextState = state.setIn(['destination', 'latitude'], action.payload.latitude)
                          .setIn(['destination', 'longitude'], action.payload.longitude)
                          .set('bearing', bearing)
                          .set('speed', speed)
                          .set('timeTag', (new Date()))
                          .set('isTravelling', true);
      return nextState;
    }
    case UPDATE_DOGGIE_LOCATION: {
      if(state.get('speed') <= 0) {
        return state;
      }
      var newTimeTag = new Date();
      var timeInterval = (newTimeTag - state.get('timeTag'))/1000; // in unit of second
      var distance = state.get('speed')*timeInterval;
      var newLocation = geolib.computeDestinationPoint(state.get('position').toJS(), distance,
                                            state.get('bearing'));
      var nextState = state.setIn(['position', 'latitude'], newLocation.latitude)
                          .setIn(['position', 'longitude'], newLocation.longitude)
                          .set('timeTag', newTimeTag);
      console.log(geolib.getDistanceSimple(state.get('position').toJS(), state.get('destination').toJS()));
      if (geolib.getDistanceSimple(state.get('position').toJS(), state.get('destination').toJS()) < 10) {
        nextState = nextState.set('speed', 0)
                .set('bearing', 0);
        if (geolib.getDistanceSimple(state.get('destination').toJS(), state.get('home').toJS()) < 10) {
          nextState = nextState.set('isTravelling', false);
        }
      }
      return nextState;
    }
  }

  return state;
};
