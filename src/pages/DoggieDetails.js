'use strict'

import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';

import TouchableListItem from '../components/TouchableListItem';
import { Users } from '../lib/dataTable';

import { Actions } from 'react-native-router-flux';

class DoggieDetails extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.imageBackground} source={require('../resources/sea.jpg')} />
        <View style={styles.listContainer}>
          <TouchableListItem index='name' style={styles.listItem} title='昵称'>
            <Text style={styles.touchableText}>{this.props.doggie.name}</Text>
          </TouchableListItem>
          <TouchableListItem index='home' style={styles.listItem} title='老家'>
            <Text style={styles.touchableText}>{this.props.doggie.home}</Text>
          </TouchableListItem>
          <TouchableListItem index='destination' style={styles.listItem} title='目的地'>
            <Text style={styles.touchableText}>{this.props.doggie.destination}</Text>
          </TouchableListItem>
          <TouchableListItem index='owner' style={styles.listItem} title='主人' onPressReact={this.goToOwnerProfile} editable={true}>
            <Text style={styles.touchableText}>{this.props.doggie.owner}</Text>
          </TouchableListItem>
        </View>
        <View style={styles.avatarContainer}>
          <Image style={styles.avatar} source={require('../resources/meow.jpg')}/>
        </View>
      </View>
    )
  }

  goToOwnerProfile = () => {
    var self = this;
    Users.map(user => {
      if(user.name == self.props.doggie.owner) {
        Actions.ownerDetails({
          owner: user,
          title: '个人资料',
          mode: 'CHECK_USER_PROFILE'
        })
      }
    });
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
    backgroundColor: '#8a00e6'
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
    borderRadius: 10,
    backgroundColor: '#ff33ff'
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
});

module.exports = DoggieDetails;
