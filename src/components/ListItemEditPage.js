'use strict'

import React from 'react';
import { View, Text, Image, StyleSheet, TextInput } from 'react-native';

import Header from './Header';

import { connect } from "react-redux";
import { bindActionCreators } from 'redux';

import {Actions} from 'react-native-router-flux';

import * as profileActions from '../reducers/profile/profileActions';

function mapStateToProps(state) {
  return {
    profile: state.profileReducer,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(profileActions, dispatch)
  }
}

class ListItemEditPage extends React.Component {
  render() {
    return (
      <View style={styles.container}>
       <Header leftText={this.props.profile.editing.leftText}
              title={this.props.profile.editing.title}
              rightText={this.props.profile.editing.rightText}
              onLeftPress={this.onLeftPress}
              onRightPress={this.onRightPress}
              rightDisabled={this.props.profile.rightDisabled}>
       </Header>
       <TextInput style={styles.input}
          clearButtonMode='while-editing'
          onChangeText={this.onChangeText}
          defaultValue={this.props.profile.profileInfo[this.props.profile.indexBeingEditing]}>
       </TextInput>
      </View>
    )
  }

// {this.props.isImageEditing ? this.renderImageEditing() : this.renderTextEditing()}
  onLeftPress = () => {
    this.props.actions.resetEditingState();
    Actions.pop();
  }

  onRightPress =() => {
    this.props.actions.saveProfileInfo(this.props.profile.indexBeingEditing, this.props.profile.changedText);
    this.props.actions.resetEditingState();
    Actions.pop();
  }

  onChangeText = text => {
    this.props.actions.onChangeText(text);
  }

}

const styles = StyleSheet.create({
  input: {
    top: 20,
    height: 40,
    borderColor: '#b3b3b3',
    borderWidth: 1,
    backgroundColor: 'white'
  },
  container: {
    backgroundColor: '#f2f2f2',
    flex: 1,
  }
})

module.exports = connect(mapStateToProps, mapDispatchToProps)(ListItemEditPage);
