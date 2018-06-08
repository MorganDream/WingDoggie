'use strict'

const {
  AR_ADD_UPDATE_PLANE,
  AR_REMOVE_PLANE,
  AR_CHANGE_MODEL_POSITION,
  AR_REINIT_STATE,
  AR_MODEL_SELECT,
} = require('../../lib/constants').default;

export function addOrUpdatePlane(planeAnchor) {
  return {
    type: AR_ADD_UPDATE_PLANE,
    payload: planeAnchor,
  }
}

export function removePlane(planeAnchor) {
  return {
    type: AR_REMOVE_PLANE,
    payload: planeAnchor.id,
  }
}

export function changeModelPosition(position) {
  return {
    type: AR_CHANGE_MODEL_POSITION,
    payload: position,
  }
}

export function reInit() {
  return {
    type: AR_REINIT_STATE,
  }
}

export function setSelected(selected) {
  return {
    type: AR_MODEL_SELECT,
    payload: selected
  }
}
