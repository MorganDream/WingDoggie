'use strict'

import store from 'react-native-simple-store';

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
  storePhotos (sender, owner, time, location, photoData) {
    var photo = {
      sender: sender,
      owner: owner,
      time: time,
      location: location,
      photoData: photoData,
      seen: false,
    }

    return store.push(PHOTO_STORE_KEY, photo);
  }

  getPhotos() {
    return store.get(PHOTO_STORE_KEY);
  }
}

export let appAuthToken = new AppAuthtoken();
export let photoStore = new PhotoStore();
