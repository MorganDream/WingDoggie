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

const ADD_FRIEND_REQUEST = 'ADD_FRIEND_REQUEST';
const FRIENDS = 'FRIENDS_OF_';
class Friends {
  storeAddFriendRequest(from, to, message) {
    var time = new Date();
    var tag = time.getTime() + '_' + from + '_' + to;
    var addFriendRequest = {
      from: from,
      to: to,
      message: message,
      status: 0,
      key: tag,
    }
    return store.push(ADD_FRIEND_REQUEST, addFriendRequest);
  }

  getAddFriendRequest() {
    return store.get(ADD_FRIEND_REQUEST);
  }

  removeAddFriendRequests(from, to) {
    return store.get(ADD_FRIEND_REQUEST)
      .then(addFriendRequests => {
        return store.delete(ADD_FRIEND_REQUEST)
          .then( () => {
            return addFriendRequests.map(request => {
              if (!(request.from == from && request.to == to)) {
                return store.push(ADD_FRIEND_REQUEST, request);
              } else {
                request.status = 1;
                return store.push(ADD_FRIEND_REQUEST, request);
              }
            })
          .catch(error => error)
          })
      })
      .catch(error => error);
  }

  makeFriends(userA, userB) {
    return store.get(FRIENDS + userA)
      .then(friends => {
        if (!!friends && friends.indexOf(userB) >= 0) {
          return;
        }
        return Promise.all([
          store.push(FRIENDS + userA, userB),
          store.push(FRIENDS + userB, userA)
        ])
      })
      .catch(error => error)
  }

  getFriends(user) {
    return store.get(FRIENDS + user);
  }

  breakUpFriends(userA, userB) {
    return Promise.all([
      store.get(FRIENDS + userA)
        .then(friends => {
          return store.update(FRIENDS + userA,
            friends.filter(friend => friend != userB));
        })
        .catch(error => error),
      store.get(FRIENDS + userB)
        .then(friends => {
          return store.update(FRIENDS + userB,
            friends.filter(friend => friend != userA));
        })
        .catch(error => error)
    ])
  }
}

export let appAuthToken = new AppAuthtoken();
export let photoStore = new PhotoStore();
export let friends = new Friends();
