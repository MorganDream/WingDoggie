'use strict'

const {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_ACTION_END,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  ON_USERNAME_FIELD_CHANGE,
  ON_PASSWORD_FIELD_CHANGE,
  SESSION_TOKEN_REQUEST,
  SESSION_TOKEN_REQUEST_SUCCESS,
  SESSION_TOKEN_REQUEST_FAILURE,
  LOGIN_USER_NAME,
} = require('../../lib/constants').default;

import { appAuthToken } from '../../lib/AppAuthToken';
import { Users } from '../../lib/dataTable';

import {Actions} from 'react-native-router-flux';

export function onUsernameFieldChange (value) {
  return {
    type: ON_USERNAME_FIELD_CHANGE,
    payload: value
  }
}

export function onPasswordFieldChange (value) {
  return {
    type: ON_PASSWORD_FIELD_CHANGE,
    payload: value
  }
}

export function loginRequest(){
  return {
    type: LOGIN_REQUEST
  }
}

export function loginSuccess(){
  return {
    type: LOGIN_SUCCESS,
  }
}

export function loginFailure(error){
  return {
    type: LOGIN_FAILURE,
    payload: error,
  }
}

export function loginActionEnd(){
  return {
    type: LOGIN_ACTION_END
  }
}

export function setLoginUserName(username) {
  return {
    type: LOGIN_USER_NAME,
    payload: username
  }
}

export function sessionTokenRequest(){
  return {
    type: SESSION_TOKEN_REQUEST
  }
}

export function sessionTokenRequestSuccess(token) {
  return {
    type: SESSION_TOKEN_REQUEST_SUCCESS,
    payload: token
  }
}

export function sessionTokenRequestFailure(error) {
  return {
    type:SESSION_TOKEN_REQUEST_FAILURE,
    payload: error
  }
}

export function getSessionToken () {
  return dispatch => {
    dispatch(sessionTokenRequest());
    return appAuthToken.getSessionToken()
      .then(token => {
        if (token) {
          dispatch(sessionTokenRequestSuccess(token));
          dispatch(setLoginUserName(token.sessionToken));
          Actions.mainStack();
      //  Actions.doggieDetails();
        } else {
          dispatch(sessionTokenRequestSuccess(null));
          Actions.welcome();
        }
      })
      .catch(error => {
        dispatch(sessionTokenRequestFailure(error));
        Actions.welcome();
      });
  }
}



function veiryWithNameAndPassword(username, password, onSuccess, onFail) {
  return new Promise((resolve, reject) => {
    setTimeout(function(){
      Users.map(user => {
        let fixedName = user.name;
        let fixedPass = user.password;
        console.log(fixedName);
        if(username == fixedName && password == fixedPass){
          resolve(username);
        }
      });
      reject('Username or Password is not right!');
    }, 2000);
  });
}

export function saveSessionToken (json) {
  return appAuthToken.storeSessionToken(json)
}

export function login (username, password) {
  console.log(username);
  return dispatch => {
    dispatch(loginRequest());
    return veiryWithNameAndPassword(username, password)
      .then(function(token){
        saveSessionToken(token);
        dispatch(loginSuccess());
        setTimeout(()=> {
          dispatch(loginActionEnd());
          dispatch(setLoginUserName(token));
          Actions.mainStack();
        }, 50);
      })
      .catch(function(error){
        console.log(error);
        dispatch(loginFailure(error));
        setTimeout(() => {
          dispatch(loginActionEnd());
        }, 1500);
      })
  }
}

export function logoutRequest(){
  return {
    type: LOGOUT_REQUEST
  }
}

export function logoutSuccess(){
  return {
    type: LOGOUT_SUCCESS
  }
}

export function logoutFailure(error){
  return {
    type: LOGOUT_FAILURE,
    payload: error
  }
}

function deleteSessionToken(){
  return
}

export function logout(){
  return dispatch => {
    dispatch(logoutRequest());
    return appAuthToken.deleteSessionToken()
      .then(()=> {
        dispatch(logoutSuccess());
        Actions.welcome();
      })
      .catch(error => {
        dispatch(logoutFailure(error));
      })
  }
}
