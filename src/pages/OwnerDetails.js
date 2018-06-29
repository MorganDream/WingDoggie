'use strict'

import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableHighlight, } from 'react-native';

import TouchableListItem from '../components/TouchableListItem';

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

class OwnerDetails extends React.Component {

  render() {
    var iconSource = this.props.owner.name == 'Jack' ?
      require('../resources/default_avatar.jpg'): require('../resources/default_avatar_girl.jpeg');
    return (
      <View style={styles.container}>
        <Image style={styles.imageBackground} source={require('../resources/sea.jpg')} />
        <View style={styles.listContainer}>
          <TouchableListItem index='name' style={styles.listItem} title='姓名'>
            <Text style={styles.touchableText}>{this.props.owner.name}</Text>
          </TouchableListItem>
          <TouchableListItem index='home' style={styles.listItem} title='性别'>
            <Text style={styles.touchableText}>{this.props.owner.gender}</Text>
          </TouchableListItem>
          <TouchableListItem index='destination' style={styles.listItem} title='地区'>
            <Text style={styles.touchableText}>{this.props.owner.district}</Text>
          </TouchableListItem>
          <TouchableListItem index='owner' style={styles.listItem} title='签名'>
            <Text style={styles.touchableText}>{this.props.owner.sign}</Text>
          </TouchableListItem>
          <TouchableHighlight style={styles.addTouchable}
            underlayColor={'#0047b3'}
            onPress={this._onActionButtonTouched}>
            { this._renderActionButton() }
          </TouchableHighlight>
        </View>
        <View style={styles.avatarContainer}>
          <Image style={styles.avatar} source={iconSource}/>
        </View>
      </View>
    )
  }

  _renderActionButton = () => {
    if (this.props.mode == 'CHECK_USER_PROFILE') {
      return (
        <View style={styles.addFriendContainer}>
          <Image style={styles.addFriendIcon} source={require('../resources/add_friend.png')} />
          <Text style={styles.addFriendText}>加为好友</Text>
        </View>
      )
    } else if (this.props.mode == 'HANDLE_FRIEND_REQUEST') {
      return (
        <View style={styles.addFriendContainer}>
          <Text style={styles.addFriendText}>接受请求</Text>
        </View>
      )
    } else if (this.props.mode == 'HANDLE_FRIEND_PROFILE') {
      return (
        <View style={styles.addFriendContainer}>
          <Text style={styles.addFriendText}>删除好友</Text>
        </View>
      )
    }
  }

  _onActionButtonTouched = () => {
    var self = this;
    if (this.props.mode == 'CHECK_USER_PROFILE') {
      Actions.addFriend({
        target: self.props.owner,
        title: '添加好友',
        rightTitle: '发送',
        onRightPress: () => {
          self.props.actions.addFriend(self.props.friends.user,
              self.props.friends.addFriend.target,
              self.props.friends.addFriend.message);
        },
      })
    } else if (this.props.mode == 'HANDLE_FRIEND_REQUEST') {
      this.props.actions.acceptAddFriendRequest(this.props.friends.user, this.props.requestFrom);
      Actions.pop();
    } else if (this.props.mode == 'HANDLE_FRIEND_PROFILE') {
      Actions.pop();
    }
  }
}

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBackground: {
    height: 0.35*windowHeight,
    alignItems: 'center',
    justifyContent: 'center',
    width:800,
  },
  listContainer: {
    paddingTop: 100,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: windowWidth,
    height: 0.65*windowHeight,
  },
  listItem: {
    width: 0.7*windowWidth,
    height: 50,
    padding: 2,
    marginTop: 10,
    marginLeft: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0eb',
    borderRightWidth: 2,
    borderRightColor: '#e0e0eb',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  touchableText: {
    color: '#660033',
    fontSize: 20,
  },
  avatarContainer: {
    position: 'absolute',
    top: 0.25*windowHeight,
    width: 0.2*windowHeight,
    height:0.2*windowHeight,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#4d2e00',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 0.2*windowHeight,
    height:0.2*windowHeight,
  },
  addTouchable: {
    marginVertical: 50,
    backgroundColor: '#99c2ff',
    padding: 10,
    borderRadius: 10,
  },
  addFriendContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  addFriendIcon: {
    width: 0.05*windowHeight,
    height:0.05*windowHeight,
  },
  addFriendText: {
    fontSize: 20,
    paddingLeft: 8,
  },
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(OwnerDetails);
