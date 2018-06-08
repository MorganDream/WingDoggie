'use strict'

const {Record} = require('immutable');

var InitialState =  Record({
  planes: [],
  modelPosition: null,
  selected: false,
});

export default InitialState
