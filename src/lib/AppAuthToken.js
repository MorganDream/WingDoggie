'use strict'

import store from 'react-native-simple-store';

import { getGeocodeWithCoordinate, getPlaceInfoWithCoordinate } from './predefinedClasses';

const SESSION_TOKEN_KEY = 'SESSION_TOKEN_KEY';
const PHOTO_STORE_KEY = 'PHOTO_STORE_KEY';

class AppAuthtoken {
  storeSessionToken (sessionToken) {
    return store.save(SESSION_TOKEN_KEY, {
      sessionToken: sessionToken
    });
  }

  getSessionToken() {
    return store.get(SESSION_TOKEN_KEY);
  }

  deleteSessionToken() {
    return store.delete(SESSION_TOKEN_KEY);
  }
}

class PhotoStore {
  storePhotos (sender, owner, time, location, photos) {
    var photoAlbum = {
      sender: sender,
      owner: owner,
      time: time,
      location: location,
      photos: photos,
      seen: false,
    }

    return store.push(PHOTO_STORE_KEY, photoAlbum);
  }

  storePhoto (sender, owner, time, location, photoBase64, tag, geocode, placeId) {
    var photo = {
      tag: tag,
      sender: sender,
      owner: owner,
      time: time,
      location: location,
      photo: photoBase64,
      geocode: geocode,
      placeId: placeId,
      seen: false,
    }
    return store.push(PHOTO_STORE_KEY, photo);
  }

  fetchPhotos() {
    return store.get(PHOTO_STORE_KEY);
  }
}

export let appAuthToken = new AppAuthtoken();
export let photoStore = new PhotoStore();
