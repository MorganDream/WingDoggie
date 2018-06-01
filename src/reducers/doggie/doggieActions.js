'use strict'

import geolib from 'geolib';

const {
  DOGGIE_STATE_HOME,
  DOGGIE_DESTINATION_UPDATE,
  UPDATE_DOGGIE_LOCATION,
  INIT_DOGGIE_WITH_USER,
} = require('../../lib/constants').default;

export function initDoggieWithUser(userName) {
  return {
    type: INIT_DOGGIE_WITH_USER,
    payload: userName,
  }
}

export function onDestinationUpdated(latitude, longitude) {
  return {
    type: DOGGIE_DESTINATION_UPDATE,
    payload: {
      latitude: latitude,
      longitude: longitude,
    }
  }
}

export function goHome(speed) {
  return {
    type: DOGGIE_STATE_HOME,
    payload: {
      speed: speed,
    },
  }
}

export function updateDoggieLocation() {
  return {
    type: UPDATE_DOGGIE_LOCATION,
  }
}
