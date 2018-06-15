'use strict'

const {
  AR_ADD_UPDATE_PLANE,
  AR_REMOVE_PLANE,
  AR_CHANGE_MODEL_POSITION,
  AR_REINIT_STATE,
  AR_MODEL_SELECT,
  AR_FEATUREPOINTS_UPDATE,
  AR_SNAPSHOTS_ADD_REMOVE,
  AR_SEND_PHOTOS_REQUEST,
  AR_SEND_PHOTOS_SUCCESS,
  AR_SEND_PHOTOS_FAILURE,
  AR_SEND_PHOTOS_RESET,
} = require('../../lib/constants').default;

import { ModelColors } from './arInitialState';

const InitialState = require('./arInitialState').default;

const initialState = new InitialState();

function updateFeaturePoints(originPoints, updatedPoints) {
  updatedPoints.map(udpatedPoint => {
    var updateIndex = originPoints.findIndex(originPoint => {
      return originPoint.id == udpatedPoint.id;
    });

    if (updateIndex < 0) {
      originPoints.push(udpatedPoint);
    } else {
      originPoints.splice(updateIndex, 1)
      originPoints.push(udpatedPoint);
    }
  });

  return originPoints;
}

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
    case AR_FEATUREPOINTS_UPDATE: {
      return state.set('featurePoints', updateFeaturePoints(state.get('featurePoints'), action.payload));
    }
    case AR_SNAPSHOTS_ADD_REMOVE: {
      var oldSnapshots = state.get('snapshots');
      if (action.payload.isAdding) {
        Array.prototype.push.apply(oldSnapshots, action.payload.data);
      } else {
        action.payload.data.map(snapshot => {
          oldSnapshots.splice(oldSnapshots.indexOf(snapshot), 1);
        });
      }
      return state.set('snapshots', oldSnapshots);
    }

    case AR_SEND_PHOTOS_REQUEST: {
      return state.setIn(['sendPhotos', 'total'], action.payload);
    }
    case AR_SEND_PHOTOS_SUCCESS: {
      return state.setIn(['sendPhotos', 'sended'], state.getIn(['sendPhotos', 'sended']) + 1);
    }
    case AR_SEND_PHOTOS_FAILURE: {
      return state.setIn(['sendPhotos', 'failure'], state.getIn(['sendPhotos', 'failure']) + 1);
    }
    case AR_SEND_PHOTOS_RESET: {
      return state.setIn(['sendPhotos', 'total'], 0)
                .setIn(['sendPhotos', 'sended'], 0)
                .setIn(['sendPhotos', 'failure'], 0)
                .set('snapshots', []);
    }
  }
  /**
  * ## Default
  */
  return state
}
