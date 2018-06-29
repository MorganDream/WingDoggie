'use strict'

import React from 'react';
import { View, Text, TouchableHighlight, Keyboard, StyleSheet, ActivityIndicator, Image } from 'react-native';

import { connect } from "react-redux";
import {bindActionCreators} from 'redux';

import appAuthToken from '../lib/AppAuthToken';

import * as authActions from '../reducers/auth/authActions';
import * as friendsActions from '../reducers/friends/friendsActions';

function mapStateToProps(state) {
  return {
    auth: state.authReducer
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...authActions, ...friendsActions }, dispatch)
  }
}

class MainPage extends React.Component {
  componentWillMount() {
    this.props.actions.setUser(this.props.auth.loginUserName);
  }

  render(){
      return(
        <View style={styles.view}>
          <Text style={styles.welcomeText}>Welcome, {this.props.auth.loginUserName}</Text>
          <TouchableHighlight style={styles.button}
            underlayColor={'#0000b3'}
            onPress={this.onLogoutPressed_}>
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableHighlight>
        </View>
      )
  }

  onLogoutPressed_ = () => {
    this.props.actions.logout();
  }
}

const styles=StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: '#9999ff',
  },
  welcomeText: {
    fontSize: 30,
    padding:50
  },
  buttonText: {
    fontSize: 20,
    padding: 20
  },
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(MainPage);
