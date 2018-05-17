'use strict'

const {
  PROFILE_INFO_MODIFY,
  PROFILE_ITEM_PRESSED,
  PROFILE_EDITING_RESET,
  PROFILE_ITEM_EDITED,
} = require('../../lib/constants').default;

export function saveProfileInfo(key, value) {
  return {
    type: PROFILE_INFO_MODIFY,
    payload: {
      key: key,
      value: value
    }
  }
}

export function onProfileItemPressed(index) {
  return {
    type: PROFILE_ITEM_PRESSED,
    payload: index,
  }
}

export function resetEditingState() {
  return {
    type: PROFILE_EDITING_RESET
  }
}

export function onChangeText(text) {
  return {
    type: PROFILE_ITEM_EDITED,
    payload: text,
  }
}
