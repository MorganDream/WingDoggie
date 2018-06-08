'use strict'

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

class TouchableListItem extends React.Component {
  render(){
    return (
      <View {...this.props}>
        <TouchableOpacity
          style={styles.touchable}
          onPress={this.props.onPressReact}
          disabled={!this.props.editable}>
          <Text> {this.props.title}</Text>
          <View style={styles.listEnd}>
            {...this.props.children}
            {this.props.editable? <Image style={styles.image} source={require('../resources/next.png')} /> : <View />}
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {

  },
  touchable: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  //  backgroundColor: '#d0d0e1',
    padding: 5,
  },
  image: {
    width: 15,
    height: 15,
  },
  listEnd: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

module.exports = TouchableListItem;
