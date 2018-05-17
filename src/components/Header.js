'use strict'

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

class Header extends React.Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={this.props.onLeftPress}>
          <Text style={styles.leftButtonText}>{this.props.leftText}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{this.props.title}</Text>
        <TouchableOpacity onPress={this.props.onRightPress} disabled={this.props.rightDisabled}>
          <Text style={this.props.rightDisabled? styles.rightButtonTextDisabled:styles.rightButtonText}>{this.props.rightText}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    top: 0,
    height: 90,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 10,
    backgroundColor: '#1a1a1a',
  },
  leftButtonText: {
    color: 'white',
    padding: 15,
    fontSize: 15,
  },
  title: {
    color: 'white',
    padding: 15,
    fontSize: 20,
  },
  rightButtonText: {
    color: 'green',
    padding: 15,
    fontSize: 15,
  },
  rightButtonTextDisabled: {
    color: 'green',
    padding: 15,
    fontSize: 15,
    opacity: 0.5,
  },
});

module.exports = Header;
