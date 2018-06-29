'use strict'

const {Record} = require('immutable');

var InitialState =  Record({
  user: null,
  addFriend: new Record({
    target: null,
    message: null,
    status: 0, // 0 stands for general state; 1 means sending; 2 means success; -1 means failure
    hint: '',
  })(),
  getFriends: new Record({
    fetching: false,
    addFriendRequests: [],
    friends: [],
    failure: null,
    pullToRefreshing: false,
  })(),
});

export default InitialState;
