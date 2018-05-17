
import React from "react";
import { View, Image, StyleSheet } from "react-native";

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as authActions from '../reducers/auth/authActions';

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

  componentDidMount(){
    setTimeout(function(){
      this.props.actions.getSessionToken();
    }.bind(this), 3000);
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
