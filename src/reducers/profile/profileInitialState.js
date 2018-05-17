'use strict'

const DEFAULT_NAME = 'Morgan';
const DEFAULT_GENDER = '男';
const DEFAULT_DISTRICT = '上海市普陀区';
const DEFAULT_DEFAULT_SIGN = 'Hi Baby.';
const DEFAULT_IMAGE_SOURCE = '../resources/default_avatar.jpg';

const {Record} = require('immutable');

var ProfileInfo = Record({
  name: DEFAULT_NAME,
  gender: DEFAULT_GENDER,
  district: DEFAULT_DISTRICT,
  sign: DEFAULT_DEFAULT_SIGN,
  image: DEFAULT_IMAGE_SOURCE,
});

var HeaderTexts = Record({
  leftText: '取消',
  title: '标题',
  rightText: '完成',
});

var InitialState =  Record({
  loading: true,
  profileInfo : new ProfileInfo(),
  editing: new HeaderTexts(),
  indexBeingEditing: '',
  changedText: '',
  rightDisabled: true,
});

export default InitialState
