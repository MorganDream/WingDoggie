'use strict'

import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

class ImagePreViewer extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={this.props.imageSource} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  }
});

module.exports = ImagePreViewer;
