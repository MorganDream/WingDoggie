'use strict'

import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';

class DrawerContent extends React.Component {
  render () {
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={require('../resources/wing_dog.jpg')} />
        <View style={styles.listContainer}>
          <TouchableHighlight style={styles.button}
            onPress={()=> {Actions.main()}}
            underlayColor={'#7373a5'}>
            <Text>Home</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button}
            onPress={()=> {Actions.myDog()}}
            underlayColor={'#7373a5'}>
            <Text>My Doggie</Text>
            </TouchableHighlight>
          <TouchableHighlight style={styles.button}
            onPress={()=> {Actions.myClaim()}}
            underlayColor={'#7373a5'}>
            <Text>My Profile</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button}
            onPress={()=> {Actions.searchNearby()}}
            underlayColor={'#7373a5'}>
            <Text>Search Nearby</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button}
            onPress={()=> {Actions.travelAlbum()}}
            underlayColor={'#7373a5'}>
            <Text>Album</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#d0d0e1',
    padding: 20,
    width: 200,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 80,
  },
  listContainer: {
    flex:1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffe6f2',
    paddingTop: 100,
    paddingBottom: 200,
  }
})

module.exports = DrawerContent;
