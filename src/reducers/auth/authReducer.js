'use strict'

const {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  ON_USERNAME_FIELD_CHANGE,
  ON_PASSWORD_FIELD_CHANGE,
  LOGIN_ACTION_END,
  LOGIN_USER_NAME,
} = require('../../lib/constants').default;
const InitialState = require('./authInitialState').default;

const initialState = new InitialState();

export default function authReducer(state = initialState, action){
  // console.log('initial state is :' + initialState);

  if (!(state instanceof InitialState) || (state == undefined)) return initialState.mergeDeep(state)

  switch (action.type) {
    case ON_USERNAME_FIELD_CHANGE:{
      var nextState = state.set('username', action.payload);
      return nextState;
    }
    case ON_PASSWORD_FIELD_CHANGE:{
      var nextState = state.set('password', action.payload);
      return nextState;
    }
    case LOGIN_REQUEST:{
      var nextState = state.set('verifying', true)
                          .set('loginHint', 'Verifying')
                          .set('loginSpinnerAnimating', true);
      return nextState;
    }

    case LOGIN_FAILURE:{
      var nextState = state.set('loginHint', action.payload)
                          .set('loginSpinnerAnimating', false);
      return nextState;
    }

    case LOGIN_SUCCESS:{
      var nextState = state.set('loginHint', 'Success!')
                          .set('loginSpinnerAnimating', false);
      return nextState;
    }

    case LOGIN_ACTION_END:{
      var nextState = state.set('verifying', false)
                          .set('loginHint', 'Verifying')
                          .set('loginSpinnerAnimating', true);
      return nextState;
    }

    case LOGIN_USER_NAME: {
      var nextState = state.set('loginUserName', action.payload);
      return nextState;
    }
  }
  /**
  * ## Default
  */
  return state
}
