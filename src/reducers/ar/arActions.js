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

import { photoStore } from '../../lib/AppAuthToken';

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

export function updateFeaturePoints(updatedFeaturePoints) {
  return {
    type: AR_FEATUREPOINTS_UPDATE,
    payload: updatedFeaturePoints,
  }
}

export function takeSnapshots(snapshots, isAdding) {
  return {
    type:AR_SNAPSHOTS_ADD_REMOVE,
    payload: {
      data: snapshots,
      isAdding: isAdding
    }
  }
}

export function resetSendPhotos() {
  return {
    type: AR_SEND_PHOTOS_RESET
  }
}

export function sendPhotosRequest(numOfPhotos) {
  return {
    type: AR_SEND_PHOTOS_REQUEST,
    payload: numOfPhotos
  }
}

export function sendPhotosSuccess() {
  return {
    type: AR_SEND_PHOTOS_SUCCESS
  }
}

export function sendPhotosFailure(error) {
  return {
    type: AR_SEND_PHOTOS_FAILURE,
    payload: error
  }
}

export function sendPhotos(sender, owner, location, photos) {
  return dispatch => {
    dispatch(sendPhotosRequest(photos.length));
    var time = new Date();
    return photos.map(photo => {
      return photoStore.storePhotos (sender, owner, time, location, photo)
        .then(() => {
          setTimeout(function(){
            dispatch(sendPhotosSuccess());
          },1000);          
        })
        .catch(error => {
          console.log(error);
          dispatch(sendPhotosFailure(error));
        });
    })
  }
}
