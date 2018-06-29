'use strict';

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

const InitialState = require('./friendsInitialState').default;

const initialState = new InitialState();

export default function friendsReducer(state = initialState, action){
  if (!(state instanceof InitialState) || (state == undefined)) return initialState.mergeDeep(state);

  switch (action.type) {
    case FRIENDS_SET_USER: {
      return state.set('user', action.payload);
    }
    case FRIENDS_ADD_SET_TARGET: {
      return state.setIn(['addFriend', 'target'], action.payload);
    }
    case FRIENDS_ADD_MESSAGE_EDIT: {
      return state.setIn(['addFriend', 'message'], action.payload);
    }
    case FRIENDS_ADD_REQUEST: {
      return state.setIn(['addFriend', 'target'], action.payload.target)
                  .setIn(['addFriend', 'message'], action.payload.message)
                  .setIn(['addFriend', 'status'], 1)
                  .setIn(['addFriend', 'hint'], '发送中');
    }
    case FRIENDS_ADD_REQUEST_SENT_SUCCESS: {
      return state.setIn(['addFriend', 'status'], 2)
                  .setIn(['addFriend', 'hint'], '发送成功');
    }
    case FRIENDS_ADD_REQUEST_SENT_FAILURE: {
      return state.setIn(['addFriend', 'status'], -1)
                  .setIn(['addFriend', 'hint'], action.payload);
    }
    case FRIENDS_ADD_RESET: {
      return state.setIn(['addFriend', 'message'], '')
                  .setIn(['addFriend', 'status'], 0)
                  .setIn(['addFriend', 'hint'], '');
    }
    case FRIENDS_GET_FRIENDS_REQUEST: {
      return state.setIn(['getFriends', 'fetching'], true)
                  .setIn(['getFriends', 'pullToRefreshing'], action.payload)
                  .setIn(['getFriends', 'failure'], null)
    }
    case FRIENDS_GET_FRIENDS_SUCCESS: {
      return state.setIn(['getFriends', 'fetching'], false)
                  .setIn(['getFriends', 'pullToRefreshing'], false)
                  .setIn(['getFriends', 'addFriendRequests'], action.payload.addFriendRequests)
                  .setIn(['getFriends', 'friends'], action.payload.friends);
    }
    case FRIENDS_GET_FRIENDS_FAILURE: {
      return state.setIn(['getFriends', 'fetching'], false)
                  .setIn(['getFriends', 'pullToRefreshing'], false)
                  .setIn(['getFriends', 'failure'], action.payload);
    }
  }
  return state;
};
