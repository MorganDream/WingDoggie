'use strict';

var _ = require('lodash');

const {
  FRIENDS_SET_USER,
  FRIENDS_ADD_SET_TARGET,
  FRIENDS_ADD_MESSAGE_EDIT,
  FRIENDS_ADD_REQUEST,
  FRIENDS_ADD_REQUEST_SENT_SUCCESS,
  FRIENDS_ADD_REQUEST_SENT_FAILURE,
  FRIENDS_ADD_RESET,

  FRIENDS_GET_FRIENDS_REQUEST,
  FRIENDS_GET_FRIENDS_SUCCESS,
  FRIENDS_GET_FRIENDS_FAILURE,
} = require('../../lib/constants').default;

import { friends } from '../../lib/AppAuthToken';

export function setUser(userName) {
  return {
    type: FRIENDS_SET_USER,
    payload: userName,
  }
}

export function addFriendSetTarget(target) {
  return {
    type: FRIENDS_ADD_SET_TARGET,
    payload: target,
  }
}

export function onMessageEdit(text) {
  return {
    type: FRIENDS_ADD_MESSAGE_EDIT,
    payload: text,
  }
}

export function addFriendRequest(target, message) {
  return {
    type: FRIENDS_ADD_REQUEST,
    payload: {
      target: target,
      messge: message,
    }
  }
}

export function addFriendRequestSentSuccess() {
  return {
    type: FRIENDS_ADD_REQUEST_SENT_SUCCESS,
  }
}

export function addFriendRequestSentFailure(error) {
  return {
    type: FRIENDS_ADD_REQUEST_SENT_FAILURE,
    payload: error,
  }
}

export function addFriend(user, target, message) {
  return dispatch => {
    dispatch(addFriendRequest(target, message));
    return friends.storeAddFriendRequest(user, target, message)
      .then(() => {
        dispatch(addFriendRequestSentSuccess());
      })
      .catch(error => {
        console.log(error);
        dispatch(addFriendRequestSentFailure(error));
      })
  }
}

export function resetAddFriendStatus() {
  return {
    type: FRIENDS_ADD_RESET,
  }
}


export function getFriendsRequest(pullToRefreshing) {
  return {
    type: FRIENDS_GET_FRIENDS_REQUEST,
    payload: pullToRefreshing,
  }
}

export function getFriendsSuccess(toBeDispatched) {
  return {
    type: FRIENDS_GET_FRIENDS_SUCCESS,
    payload: toBeDispatched
  }
}

export function getFriendsFailure(error) {
  return {
    type: FRIENDS_GET_FRIENDS_FAILURE,
    payload: error
  }
}

export function getFriends(user, pullToRefreshing) {
  return dispatch => {
    dispatch(getFriendsRequest(pullToRefreshing));
    return friends.getAddFriendRequest()
      .then(addFriendRequests => {
         if (!!addFriendRequests && addFriendRequests.length > 0) {
           addFriendRequests = addFriendRequests.filter(addFriendRequest => addFriendRequest.to == user);
           addFriendRequests = _.groupBy(addFriendRequests, request => request.status);
         }
         return friends.getFriends(user)
           .then(friendsList => {
             var toBeDispatched ={
               addFriendRequests: addFriendRequests,
               friends: friendsList
             }
             dispatch(getFriendsSuccess(toBeDispatched));
           })
           .catch(error => {
             console.log(error);
             dispatch(getFriendsFailure(error));
           });
      })
      .catch(error => {
        console.log(error);
        dispatch(getFriendsFailure(error));
      })
  }
}

export function acceptAddFriendRequest(user, from) {
  return dispatch => {
    return friends.makeFriends(user, from)
      .then(() => {
        console.log('Make Friends Success!')
        return friends.removeAddFriendRequests(from, user)
          .then(() => {
            console.log('Remove Add Friend Request Success');
          })
          .catch(err => {
            console.log(err);
          })
      })
      .catch(err => {
        console.log(err);
      })
  }
}
