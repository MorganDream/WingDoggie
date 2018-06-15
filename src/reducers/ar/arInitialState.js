'use strict'

const {Record} = require('immutable');

var InitialState =  Record({
  planes: [],
  modelPosition: null,
  selected: false,
  featurePoints: [],
  snapshots: [],
  sendPhotos: new Record({
    total: 0,
    sended: 0,
    failure: 0,
  })(),
});

export default InitialState
