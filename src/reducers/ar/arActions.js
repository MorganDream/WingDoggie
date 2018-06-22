'use strict'

var _ = require('lodash');

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
  AR_FETCH_PHOTOS_REQUEST,
  AR_FETCH_PHOTOS_SUCCESS,
  AR_FETCH_PHOTOS_FAILURE
} = require('../../lib/constants').default;

import { photoStore } from '../../lib/AppAuthToken';
import { getGeocodeWithCoordinate, getPlaceInfoWithCoordinate } from '../../lib/predefinedClasses';

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

function uploadPhotos(images, sender, owner, time, location, tag, district, placeId, dispatch) {
  if (images.length <= 0) {
    return ;
  }

  return photoStore.storePhoto(sender, owner, time, location,
    images[0], tag, district, placeId)
    .then(() => {
      dispatch(sendPhotosSuccess());
      images.splice(0, 1);
      return uploadPhotos(images, sender, owner, time, location, tag, district, placeId, dispatch);
    })
    .catch(error => {
      console.log(error);
      dispatch(sendPhotosFailure(error));
    });

}

export function sendPhotos(sender, owner, location, photos) {
  return dispatch => {
    dispatch(sendPhotosRequest(photos.length));
    var time = new Date();
    var tag = time.getTime() + '_' + sender + '_' + owner;
    return Promise.all([getGeocodeWithCoordinate(location.latitude, location.longitude),
        getPlaceInfoWithCoordinate(location.latitude, location.longitude)])
        .then(results => {
          return Promise.all(photos).then(images => {
            uploadPhotos(images, sender, owner, time, location,
              tag, results[0][results[0].length-2].formatted_address, results[1].name, dispatch);
          });
        })
        .catch(err => {
          console.log(err);
          dispatch(sendPhotosFailure(err));
        });
  }
}

export function fetchPhotosRequest(pullToRefreshing) {
  return {
    type: AR_FETCH_PHOTOS_REQUEST,
    payload: pullToRefreshing,
  }
}

export function fetchPhotosSuccess(userPhotos) {
  return {
    type: AR_FETCH_PHOTOS_SUCCESS,
    payload: userPhotos
  }
}

export function fetchPhotosFailure(err) {
  return {
    type: AR_FETCH_PHOTOS_FAILURE,
    payload: err
  }
}

export function fetchPhotosForUser(userName, pullToRefreshing) {
  return dispatch => {
    dispatch(fetchPhotosRequest(pullToRefreshing));
    return photoStore.fetchPhotos()
      .then(res => {
        if (!res || res.length <= 0) {
          dispatch(fetchPhotosFailure('No Photos'));
          return;
        }

        var userPhotos = [];
        res.map(photo => {
          photo.owner == userName && userPhotos.push(photo);
        });
        dispatch(fetchPhotosSuccess(_.groupBy(userPhotos, function(photo) {
          return photo.tag;
        })));
      })
      .catch(err => {
        console.log(err);
        dispatch(fetchPhotosFailure(err));
      })
  }
}
