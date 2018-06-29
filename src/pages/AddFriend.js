'use strict'

import React from 'react';
import { StyleSheet, View, KeyboardAvoidingView, TextInput, Text, Image, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';

import { connect } from "react-redux";
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux'

import * as friendsActions from '../reducers/friends/friendsActions';

function mapStateToProps(state) {
  return {
    friends: state.friendsReducer,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(friendsActions, dispatch)
  }
}

class AddFriend extends React.Component {
  componentWillMount() {
    this.props.actions.addFriendSetTarget(this.props.target.name);
  }

  render() {
    var imageSource = this.props.target.name == 'Jack' ?
      require('../resources/default_avatar.jpg'): require('../resources/default_avatar_girl.jpeg');
    return (
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.targetContainer}>
          <Image style={styles.avatar} source={imageSource} />
          <View>
            <Text style={styles.name}>{this.props.target.name}</Text>
            <Text style={styles.info}>{this.props.target.gender}  25岁</Text>
          </View>
        </View>
        <View>
          <Text style={styles.textInputLabel}>填写验证信息</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => {
              this.props.actions.onMessageEdit(text);
            }}
            multiline = {true}
            autoFocus={true}/>
        </View>
        <Modal style={styles.modal} isVisible={this.props.friends.addFriend.status != 0}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{this.props.friends.addFriend.hint}</Text>
            <ActivityIndicator size="small" color="#00ff00" animating={this.props.friends.addFriend.status == 1} />
          </View>
        </Modal>
      </KeyboardAvoidingView>
    )
  }

  componentWillReceiveProps(nextProps) {
    var self = this;
    if (nextProps.friends.addFriend.status != this.props.friends.addFriend.status &&
      (nextProps.friends.addFriend.status == 2 || nextProps.friends.addFriend.status == -1)) {
        setTimeout(function(){
          self.props.actions.resetAddFriendStatus();
          Actions.pop();
        },1000)
      }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f5'
  },
  targetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    margin: 20,
    borderRadius: 40,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 3,
  },
  info: {
    color: 'grey',
    paddingVertical: 3,
  },
  textInputLabel: {
    fontSize: 15,
    color: 'grey',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  textInput: {
    backgroundColor: 'white',
    height: 150,
    borderWidth: 0.7,
    borderColor:'#d1d1e0',
    fontSize:20,
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

module.exports = connect(mapStateToProps, mapDispatchToProps)(AddFriend);
