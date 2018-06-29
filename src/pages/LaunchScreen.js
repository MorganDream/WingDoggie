
import React from "react";
import { View, Image, StyleSheet, Alert } from "react-native";

import { Asset } from 'expo';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as authActions from '../reducers/auth/authActions';

const images = [
  require('../resources/add_friend.png'),
  require('../resources/already_friend.png'),
  require('../resources/cancel.png'),
  require('../resources/comfirm.png'),
  require('../resources/confirm_green.png'),
  require('../resources/default_avatar_girl.jpeg'),
  require('../resources/default_avatar.jpg'),
  require('../resources/default.jpg'),
  require('../resources/destination.png'),
  require('../resources/doggieAtHome.jpg'),
  require('../resources/doggieTravelling.jpg'),
  require('../resources/imageLibrary.png'),
  require('../resources/launchscreen.png'),
  require('../resources/login_back.png'),
  require('../resources/marker.png'),
  require('../resources/meow.jpg'),
  require('../resources/navi_chart.jpg'),
  require('../resources/next.png'),
  require('../resources/sea.jpg'),
  require('../resources/wing_dog.jpg'),
]

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(authActions, dispatch)
  }
}

class LaunchScreen extends React.Component {

  render() {
    return (
      <View style={styles.view}>
        <Image style={styles.image} source={require("../resources/launchscreen.png")}/>
      </View>
    );
  }

  preCacheImages = () => {
    var self = this;
    Asset.loadAsync(images).then(
      res => {
        self.props.actions.getSessionToken();
      }
    )
    .catch(err => {
      Alert.alert(
        'Error!',
        'Catch error while downloading resources',
        [
          {text: 'Retry', onPress: () => {
            self.preCacheImages();
          }},
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
        ],
      );
    })
  }

  componentDidMount(){
    if (__DEV__) {
      setTimeout(function(){
        this.props.actions.getSessionToken();
      }.bind(this), 3000);
    }else {
      this.preCacheImages();
    }
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    flex: 1,
  }
});

module.exports = connect(null, mapDispatchToProps)(LaunchScreen);
