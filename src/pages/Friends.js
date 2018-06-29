'use strict';

import React from 'react';
import { StyleSheet, View, ScrollView, Text, FlatList, TouchableHighlight, ActivityIndicator, RefreshControl, Image } from 'react-native';

import { connect } from "react-redux";
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';

import * as friendsActions from '../reducers/friends/friendsActions';

import { Users } from '../lib/dataTable';

function mapStateToProps(state) {
  return {
    friends: state.friendsReducer
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(friendsActions, dispatch)
  }
}

class Friends extends React.Component {
  componentWillMount() {
    this.props.actions.getFriends(this.props.friends.user, false);
  }

  _onRefresh = () => {
    this.props.actions.getFriends(this.props.friends.user, true);
  }

  render() {
    if (this.props.friends.getFriends.fetching && !this.props.friends.getFriends.pullToRefreshing) {
      return (
        <View style={styles.indicatorContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
    } else {
      return (
        <ScrollView
          style={styles.overallContainer}
          refreshControl={
            <RefreshControl
              refreshing={this.props.friends.getFriends.pullToRefreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }>
          <TouchableHighlight
            style={[styles.listItem, {marginVertical: 20,}]}
            underlayColor={'#a3a3c2'}
            onPress={() => {
              var addFriendRequests = [];
              if (this.props.friends.getFriends.addFriendRequests) {
                for (var status in this.props.friends.getFriends.addFriendRequests) {
                  var data = this.props.friends.getFriends.addFriendRequests[status];
                  var title = status == 0 ? '未处理': '已处理';
                  addFriendRequests.push({
                    title: title,
                    data: data,
                  });
                }
              }
              Actions.newFriends({
                addFriendRequests: addFriendRequests
              })
            }}
          >
            <View style={[styles.avartarInfoContainer, {alignItems:'center', justifyContent: 'space-between'}]}>
              <View style={{flexDirection: 'row'}}>
                <Image style={styles.avatar} source={require('../resources/add_friend.png')} />
                <View style={[styles.infoContainer,{justifyContent: 'center'}]}>
                  <Text style={styles.from}>New Friends</Text>
                </View>
              </View>
              {
                !!this.props.friends.getFriends.addFriendRequests &&
                !!this.props.friends.getFriends.addFriendRequests[0] &&
                this.props.friends.getFriends.addFriendRequests[0].length > 0 &&
                <View style={styles.badger}>
                  <Text style={styles.badgerText}>{this.props.friends.getFriends.addFriendRequests[0].length}</Text>
                </View>
              }
            </View>
          </TouchableHighlight>
          <FlatList
            data={this.props.friends.getFriends.friends}
            renderItem={this._renderItemForFriends}
            keyExtractor={this._keyExtractor}
            ListEmptyComponent={this._renderListEmptyComponentForFriends}
          />
        </ScrollView>
      )
    }
  }

  _keyExtractor = (item, index) => index;

  _renderItemForFriends = ({item}) => {
    var imageSource = item == 'Jack' ?
      require('../resources/default_avatar.jpg'): require('../resources/default_avatar_girl.jpeg');
    return (
      <TouchableHighlight
        style={styles.listItem}
        underlayColor={'#a3a3c2'}
        onPress={() => {
          Users.map(user => {
            if (user.name == item) {
              Actions.ownerDetails({
                owner: user,
                title: '好友资料',
                mode: 'HANDLE_FRIEND_PROFILE',
              })
            }
          })
        }}
      >
        <View style={styles.listItemContent}>
          <View style={styles.avartarInfoContainer}>
            <Image style={styles.avatar} source={imageSource} />
            <View style={styles.infoContainer}>
              <Text style={styles.from}>{item}</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  _renderListEmptyComponentForFriends = () => (
    <Text>You Have Not Got Any Friends Yet</Text>
  )
}

const styles = StyleSheet.create({
  overallContainer: {
    backgroundColor: '#e0e0eb'
  },
  indicatorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItem: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f0f0f5',
    borderBottomWidth: 0.5,
    borderBottomColor: '#a3a3c2'
  },
  listItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avartarInfoContainer: {
    flexDirection: 'row'
  },
  avatar: {
    width: 60,
    height: 60,
  },
  infoContainer: {
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  from: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  message: {
    fontSize: 12,
    fontFamily: 'HelveticaNeue-ThinItalic',
    color: '#360845'
  },
  checkButton: {
    backgroundColor: '#e0e0eb',
    width: 50,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  badger: {
    width:24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'red',
    alignItems: 'center',
  },
  badgerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(Friends);
