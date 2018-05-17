'use strict'

import React from 'react';
import { View, Image, StyleSheet, ImageBackground, Text, Animated } from 'react-native';

class AnimatedBackground extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      fadeAnim : new Animated.Value(1),
      xPosition : new Animated.Value(0)
    };
    console.log(this.props.style)
  }

  render(){
    return (
      <View {...this.props}>
        <Animated.View style={[styles.view, {opacity:this.state.fadeAnim, transform: [{translateX:this.state.xPosition}]}]}>
          <ImageBackground style={styles.image} source={require('../resources/login_back.png')} >
            {this.props.children}
          </ImageBackground>
        </Animated.View>
      </View >
    )
  }

  componentDidMount(){
    let shiftRightAnimation = Animated.timing(
      this.state.xPosition,
      {
        toValue: -300,
        duration: 1500
      }
    );

    let shiftBackAnimation = Animated.timing(
      this.state.xPosition,
      {
        toValue: 0,
        duration: 1500
      }
    );

    let shiftAnimation = Animated.sequence([shiftRightAnimation, shiftBackAnimation]);
  //  Animated.loop(shiftAnimation).start();

    let fadeInAnimation = Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 0,
        duration: 2000
      }
    );

    let fadeOutAnimation = Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 1,
        duration: 2000
      }
    );

    let fadeAnimation = Animated.sequence([fadeInAnimation, fadeOutAnimation]);

  //  Animated.loop(fadeAnimation).start();
  }

  componentWillUnmount(){
  }
}

const styles = {
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  image: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width:800,
    // transform: [{translateX:-100}]
  }
}

module.exports = AnimatedBackground;
