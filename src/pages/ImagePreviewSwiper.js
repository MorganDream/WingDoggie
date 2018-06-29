'use strict'

import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

import Swiper from 'react-native-swiper';

class ImagePreviewSwiper extends React.Component {
  render() {
    return (
      <Swiper style={styles.wrapper}
        showsButtons={true}
        loop={false}
        activeDotColor={'#ffffff'}
        dotColor={'#ffffff'}
        dotStyle={{opacity: 0.5}}
        index={this.props.currentIndex}>
        {
          this.props.imageSources.map(imageSource =>
            <View style={styles.container} key={imageSource}>
              <Image style={styles.image} source={imageSource} />
            </View>
          )
        }
      </Swiper>
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

module.exports = ImagePreviewSwiper;
