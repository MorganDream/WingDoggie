'use strict'

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

class Bubble extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.bubble}>
          <Text style={styles.amount}>{this.props.text}</Text>
        </View>
        <View style={styles.arrowBorder} />
        <View style={styles.arrow} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      alignSelf: 'flex-start',
    },
    bubble: {
      flex: 0,
      flexDirection: 'row',
      alignSelf: 'flex-start',
      backgroundColor: 'white',
      padding: 2,
      borderRadius: 3,
      borderColor: '#000',
      borderWidth: 0.5,
    },
    amount: {
      color: '#000',
      fontSize: 13,
    },
    arrow: {
      backgroundColor: 'transparent',
      borderWidth: 4,
      borderColor: 'transparent',
      borderTopColor: '#000',
      alignSelf: 'center',
      marginTop: -9,
    },
    arrowBorder: {
      backgroundColor: 'transparent',
      borderWidth: 4,
      borderColor: 'transparent',
      borderTopColor: '#000',
      alignSelf: 'center',
      marginTop: -0.5,
    },
});

module.exports = Bubble;
