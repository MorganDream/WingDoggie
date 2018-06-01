'use strict'

const {
  PROFILE_INFO_MODIFY,
  PROFILE_ITEM_PRESSED,
  PROFILE_EDITING_RESET,
  PROFILE_ITEM_EDITED,
  INIT_PROFILE_WITH_USER,
} = require('../../lib/constants').default;

import { Users } from '../../lib/dataTable';

const InitialState = require('./profileInitialState').default;

const initialState = new InitialState();

export default function profileReducer(state = initialState, action){
  if (!(state instanceof InitialState) || (state == undefined)) return initialState.mergeDeep(state);

  switch (action.type) {
    case INIT_PROFILE_WITH_USER: {
      var nextState = state;
      Users.map(user => {
        if (user.name == action.payload) {
          nextState = state.setIn(['profileInfo', 'name'], user.name)
                              .setIn(['profileInfo', 'gender'], user.gender)
                              .setIn(['profileInfo', 'district'], user.district)
                              .setIn(['profileInfo', 'sign'], user.sign)
                              .setIn(['profileInfo', 'image'], user.image);
          return;
        }
      });
      return nextState;
    }
    case PROFILE_INFO_MODIFY:{
      var nextState = state.setIn(['profileInfo', action.payload.key], action.payload.value)
      return nextState;
    }
    case PROFILE_EDITING_RESET: {
      var nextState = state.set('changedText', '')
                          .set('rightDisabled', true)
                          .set('indexBeingEditing', '');
      return nextState;
    }
    case PROFILE_ITEM_EDITED: {
      var nextState = state.set('changedText', action.payload)
                          .set('rightDisabled', false)
      return nextState;
    }
    case PROFILE_ITEM_PRESSED: {
      var nextState = state;
      switch (action.payload) {
        case 'image':{
          nextState = state.setIn(['editing', 'leftText'], '取消')
                  .setIn(['editing', 'title'], '头像')
                  .setIn(['editing', 'rightText'], '完成')
                  .set('indexBeingEditing', action.payload);
          break;
        }

        case 'name':
          nextState = state.setIn(['editing', 'leftText'], '取消')
                    .setIn(['editing', 'title'], '设置姓名')
                    .setIn(['editing', 'rightText'], '完成')
                    .set('indexBeingEditing', action.payload);
          break;
        case 'gender':
          nextState = state.setIn(['editing', 'leftText'], '取消')
                   .setIn(['editing', 'title'], '设置性别')
                   .setIn(['editing', 'rightText'], '完成')
                   .set('indexBeingEditing', action.payload);
          break;
        case 'district':
          nextState = state.setIn(['editing', 'leftText'], '取消')
                   .setIn(['editing', 'title'], '设置地区')
                  .setIn(['editing', 'rightText'], '完成')
                  .set('indexBeingEditing', action.payload);
          break;
        case 'sign':{
          nextState = state.setIn(['editing', 'leftText'], '取消')
                    .setIn(['editing', 'title'], '设置签名')
                    .setIn(['editing', 'rightText'], '完成')
                    .set('indexBeingEditing', action.payload);
          break;
        }

      }
      return nextState;
    }
  }

  return state;
};
