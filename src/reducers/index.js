'use strict';

import authReducer from './auth/authReducer';
import locReducer from './location/locReducer';
import profileReducer from './profile/profileReducer';
import doggieReducer from './doggie/doggieReducer';
import arReducer from './ar/arReducer';
import friendsReducer from './friends/friendsReducer';

import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  authReducer,
  locReducer,
  profileReducer,
  doggieReducer,
  arReducer,
  friendsReducer,
})

export default rootReducer;
