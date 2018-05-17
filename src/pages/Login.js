'use strict'

import React from 'react';
import { View,KeyboardAvoidingView, Text, TextInput, TouchableHighlight, StyleSheet, ActivityIndicator, Keyboard } from 'react-native';
import { connect } from "react-redux";
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux'
import Modal from 'react-native-modal';

import * as authActions from '../reducers/auth/authActions';

function mapStateToProps(state) {
  return {
    auth:state.authReducer
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(authActions, dispatch)
  }
}

class LoginForm extends React.Component {
  render(){
    return (
      <KeyboardAvoidingView {...this.props}>
        <Text style={styles.textInputLabel}>{this.props.label}</Text>
        <TextInput placeholder={this.props.placeholder} style={styles.textInputStyle}
          clearButtonMode='while-editing'
        //  returnKeyType='yahoo'
          onChangeText={text => {this.props.onChangeText(text)}}
          secureTextEntry={this.props.isPassword? true:false} />
      </KeyboardAvoidingView>
    )
  }
}

class Login extends React.Component {
  render(){
    return (
      <KeyboardAvoidingView style={styles.view}>
        <LoginForm label='Name' placeholder='user name' onChangeText={this.onUserNameChanged.bind(this)}
            style={[styles.form, {marginTop: 100}]} />
        <LoginForm label='Password' placeholder='password' onChangeText={this.onPasswordChanged.bind(this)}
            isPassword='true' style={styles.form} />
        <TouchableHighlight style={styles.button} onPress={this.onLoginButtonPressed_.bind(this)}>
          <Text style={{color:'white', fontSize: 20, opacity:0.7}}>Login</Text>
        </TouchableHighlight>
        <Modal style={styles.modal} isVisible={this.props.auth.verifying}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{this.props.auth.loginHint}</Text>
            <ActivityIndicator size="small" color="#00ff00" animating={this.props.auth.loginSpinnerAnimating} />
          </View>
        </Modal>
      </KeyboardAvoidingView>
    )
  }

  onUserNameChanged = newName => {
   this.props.actions.onUsernameFieldChange(newName);
  }

  onPasswordChanged = newPass => {
   this.props.actions.onPasswordFieldChange(newPass);
  }

  onLoginButtonPressed_ = () => {
    //Actions.main();
   Keyboard.dismiss();
   this.props.actions.login(this.props.auth.username, this.props.auth.password);
  }
}

const styles = StyleSheet.create({
  view:{
    flex: 1,
    backgroundColor: '#990033',
  },
  textInputStyle: {
    width: 300,
    height:40,
    marginTop:20,
    backgroundColor:'#993366'
  },
  textInputLabel:{
    fontSize: 20,
    color: 'white',
    opacity: 0.6
  },
  form:{
    padding: 20,
    alignItems: 'flex-start',
  },
  button: {
    margin: 20,
    marginTop: 60,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#cc0000',
    width: 200,
  },
  modal:{
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalText:{
    color:'black',
    fontSize: 20
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    width: 200,
    height: 100
  },
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(Login);
