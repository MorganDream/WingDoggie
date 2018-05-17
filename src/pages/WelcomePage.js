'use strict'

import React from "react";
import { View, Button, TouchableHighlight, Alert, StyleSheet, Text } from "react-native";
import { connect } from "react-redux";
import {Actions} from 'react-native-router-flux';

import AnimatedBackground from '../components/animatedBackground';

class WelcomePage extends React.Component {
  render() {
    return (
      <AnimatedBackground style={styles.background}>
        <View style={styles.topView}>
          <Text style={styles.welcomeText}>Welcome to Profile Demo</Text>
          <View style={styles.view}>
            <TouchableHighlight
              style={styles.touchable}
              underlayColor={'#555'}
              onPress={this.onLoginPressed_}>
              <Text style={styles.text}>Login</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.touchable}
              underlayColor={'#555'}
              onPress={this.onOtherPressed_}>
              <Text style={styles.text}>Forget Password?</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.touchable}
              underlayColor={'#555'}
              onPress={this.onOtherPressed_}>
              <Text style={styles.text}>Register</Text>
            </TouchableHighlight>
          </View>
        </View>
      </AnimatedBackground>
    )
  }

  onOtherPressed_ = () => {
    Alert.alert(
      'Profile Login',
      'Login Success!',
      [
        {text: 'OK', onPress:() => {console.log('OK')}},
        {text: 'Cancel', onPress:()=>{console.log('Cancel pressed.')}}
      ]
    );
  }

  onLoginPressed_ = () => {
    Actions.login();
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // flexDirection: 'column'
  },
  topView: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcomeText:{
    paddingTop:100,
    flex:0.4,
    fontSize:30,
    color: '#ff6600'
  },
  view: {
    flex: 0.6,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
//    transform: [{translateX:0}],
    width:300,
    height: 300,
    marginBottom: 100
  //  position: 'absolute',
  //  backgroundColor: 'transparent'
    // flexDirection: 'row'
  },
  touchable: {
    // flex: 1,
    padding: 20,
  //  alignItems: 'flex-end',
//    justifyContent: 'flex-end',
  },
  text: {
    // flex:1,
    fontSize: 20,
    fontWeight: 'bold',
//    position: 'absolute',
    color:'#ffffff',
    opacity:0.8
  }
});

module.exports = connect()(WelcomePage)
