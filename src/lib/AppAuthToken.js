'use strict'

import store from 'react-native-simple-store';

export class AppAuthtoken {

  constructor () {
    this.SESSION_TOKEN_KEY = 'SESSION_TOKEN_KEY';
  }

  storeSessionToken (sessionToken) {
    return store.save(this.SESSION_TOKEN_KEY, {
      sessionToken: sessionToken
    });
  }

  getSessionToken() {
    return store.get(this.SESSION_TOKEN_KEY);
  }

  deleteSessionToken() {
    return store.delete(this.SESSION_TOKEN_KEY);
  }
}

export let appAuthToken = new AppAuthtoken();
