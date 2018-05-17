'use strict'

import {LatLng} from '../../lib/predefinedClasses';

const {Record} = require('immutable');

var InitialState = Record({
  name: 'Max',
  owner: 'Jack',
  home: LatLng(),
  isTravelling: false, //home or travalling
  position: LatLng(),
  speed: 0,
  bearing: 0, //0->north, 180->south
  destination: LatLng(),
  timeTag: new Date(),
});

export default InitialState
