'use strict';

import {LatLng} from './predefinedClasses';

export const Users = [
  {
    id: 0,
    name: 'Jack',
    password: 'Key',
    gender: '男',
    district: '上海市普陀区',
    sign: 'Hi Baby.',
    image: '../resources/default_avatar.jpg',
    doggie: {
      name: 'Max',
      owner: 'Jack',
      home: LatLng(),
      isTravelling: false, //home or travalling
      position: LatLng(31.235, 121.41),
      speed: 0,
      bearing: 0, //0->north, 180->south
      destination: LatLng(),
      timeTag: new Date(),
    }
  },
  {
    id: 1,
    name: 'Alice',
    password: 'Key',
    gender: '女',
    district: '美国夏威夷',
    sign: 'Hi Sugar',
    image: '../resources/default_avatar_girl.jpg',
    doggie: {
      name: 'Smile',
      owner: 'Alice',
      home: LatLng(40, 130),
      isTravelling: true,
      position: LatLng(31.235, 121.41),
      speed: 0,
      bearing: 0,
      destination: LatLng(33, 122),
      timeTag: new Date(),
    }
  },
  {
    id: 2,
    name: 'Jade',
    password: 'Key',
    gender: '女',
    district: '美国夏威夷',
    sign: 'Hi Sugar',
    image: '../resources/default_avatar_girl.jpg',
    doggie: {
      name: 'Smile',
      owner: 'Alice',
      home: LatLng(40, 130),
      isTravelling: true,
      position: LatLng(31.235, 121.41),
      speed: 0,
      bearing: 0,
      destination: LatLng(33, 122),
      timeTag: new Date(),
    }
  },
  {
    id: 3,
    name: 'Eva',
    password: 'Key',
    gender: '女',
    district: '美国夏威夷',
    sign: 'Hi Sugar',
    image: '../resources/default_avatar_girl.jpg',
    doggie: {
      name: 'Smile',
      owner: 'Alice',
      home: LatLng(40, 130),
      isTravelling: true,
      position: LatLng(31.235, 121.41),
      speed: 0,
      bearing: 0,
      destination: LatLng(33, 122),
      timeTag: new Date(),
    }
  }
]
