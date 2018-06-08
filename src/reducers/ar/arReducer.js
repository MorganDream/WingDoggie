'use strict'

const {
  AR_ADD_UPDATE_PLANE,
  AR_REMOVE_PLANE,
  AR_CHANGE_MODEL_POSITION,
  AR_REINIT_STATE,
  AR_MODEL_SELECT,
} = require('../../lib/constants').default;

import { ModelColors } from './arInitialState';

const InitialState = require('./arInitialState').default;

const initialState = new InitialState();

export default function arReducer(state = initialState, action){
  if (!(state instanceof InitialState) || (state == undefined)) return initialState.mergeDeep(state)

  switch (action.type) {
    case AR_REINIT_STATE: {
      return initialState;
    }
    case AR_ADD_UPDATE_PLANE:{
      var previousPlanes = state.get('planes');

      var updateIndex = previousPlanes.findIndex(plane => {
        return plane.id == action.payload.id;
      });

      if (updateIndex < 0) {
        // add a plane
        previousPlanes.push(action.payload);
        return state.set('planes', previousPlanes);
      } else {
        // update a plane
        previousPlanes.splice(updateIndex, 1)
        previousPlanes.push(action.payload);
        return state.set('planes', previousPlanes);
      }

      return state;
    }
    case AR_REMOVE_PLANE:{
      var previousPlanes = state.get('planes');
      var updateIndex = previousPlanes.findIndex(plane => {
        return plane.id == action.payload;
      });

      if (updateIndex < 0) {
        // impossible, must be a bug
        console.log('impossible, must be a bug');
      } else {
        // update a plane
        previousPlanes.splice(updateIndex, 1)
        return state.set('planes', previousPlanes);
      }

      return state;
    }
    case AR_CHANGE_MODEL_POSITION: {
      return state.set('modelPosition', action.payload);
    }
    case AR_MODEL_SELECT: {
      return state.set('selected', action.payload);
    }
  }
  /**
  * ## Default
  */
  return state
}
