'use strict';

import React from 'react';
import { StyleSheet, ScrollView, View, Text, SectionList, TouchableHighlight, Image } from 'react-native';

import { Actions } from 'react-native-router-flux';
import { Users } from '../lib/dataTable';

class NewFriends extends React.Component {
  render() {
    return (
      <SectionList
        style={styles.flatList}
        sections={this.props.addFriendRequests}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        renderItem={this._renderItemForFriendRequests}
        keyExtractor={this._keyExtractor}
        ListEmptyComponent={this._renderListEmptyComponentForFriendRequests}
      />
    )
  }

  _keyExtractor = (item, index) => index;

  _renderItemForFriendRequests = ({ item, index, section }) => {
    var from = item.from?item.from:'Jack';
    var imageSource = from == 'Jack' ?
      require('../resources/default_avatar.jpg'): require('../resources/default_avatar_girl.jpeg');
    return (
      <TouchableHighlight
        style={styles.listItem}
        underlayColor={'#52527a'}
        onPress={() => {
          Users.map(user => {
            if (user.name == from) {
              if (section.title == '未处理'){
                Actions.ownerDetails({
                  owner: user,
                  title: '好友申请',
                  mode: 'HANDLE_FRIEND_REQUEST',
                  requestFrom: from,
                })
              } else {
                Actions.ownerDetails({
                  owner: user,
                  title: '好友资料',
                  mode: 'HANDLE_FRIEND_PROFILE',
                })
              }
            }
          })
        }}
      >
        <View style={styles.listItemContent}>
          <View style={styles.avartarInfoContainer}>
            <Image style={styles.avatar} source={imageSource} />
            <View style={styles.infoContainer}>
              <Text style={styles.from}>{from}</Text>
              <Text style={styles.message}>{item.message}</Text>
            </View>
          </View>
          <View style={styles.checkButton}>
            <Text>查看</Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }


  _renderListEmptyComponentForFriendRequests = () => (
    <Text>No New Friends</Text>
  )
}

const styles = StyleSheet.create({
  flatList: {
    backgroundColor: '#e0e0eb'
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
  sectionHeader: {
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 20,
  }
});

module.exports = NewFriends;
