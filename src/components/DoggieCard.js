'use strict'

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

class DoggieCard extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.catImage} source={require('../resources/meow.jpg')} />
        <Text style={styles.title}>{this.props.name}</Text>
        <TouchableOpacity style={styles.touchable1} onPress={this.props.onPressReact1}>
          <Text>详细资料</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchable2} onPress={this.props.onPressReact2}>
          <Text>See Him!</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    margin:10,
    borderWidth: 5,
    borderRadius: 5,
    borderColor: '#000',
    width:130,
    height:220,
    justifyContent:'flex-start',
    alignItems:'flex-start',
    backgroundColor: '#b3b3cc'
  },
  catImage: {
    flex: 1,
    width:120,
  },
  title: {
    padding:10,
    fontSize: 25,
    fontFamily: 'Noteworthy',
    width: 120,
  },
  touchable1: {
    padding: 8,
    width: 120,
    backgroundColor: '#8585ad'
  },
  touchable2: {
    padding: 8,
    width: 120,
    backgroundColor: '#5c5c8a'
  }
});

module.exports = DoggieCard;
