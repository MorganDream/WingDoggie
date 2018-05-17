'use strict'

const {Record} = require('immutable');

var InitialState =  Record({
  username:'',
  password:'',
  verifying: false,
  LoginState: false,
  loginUserName: '',
  loginHint: 'Verifying',
  loginSpinnerAnimating: true,
});

export default InitialState
