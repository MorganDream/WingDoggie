'use strict'

import React from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

import Svg, { Circle, Line} from 'react-native-svg';

class Radar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lineRotation : new Animated.Value(0),
      lineRotationWithoutAnimation: 0,
    }

    this.state.lineRotation.addListener( (lineRotation) => {
      this.setState({
        lineRotationWithoutAnimation: lineRotation.value,
      });
    });
  }

  render(){
      return(
        <View style={styles.view}>
            <Svg
              height={this.props.radius*2}
              width={this.props.radius*2}
            >
              <Circle
                  ref={ ref => this.circle = ref }
                  cx={this.props.radius}
                  cy={this.props.radius}
                  r={this.props.radius}
                  fill="#ff6666"
                  fillOpacity="0.3"
              />
              <Circle
                  cx={this.props.radius}
                  cy={this.props.radius}
                  r="5"
                  fill="#ff6666"
                  fillOpacity="1"
              />
              <Line
                ref={ ref => this.line = ref }
                x1={this.props.radius}
                y1={this.props.radius}
                x2="0"
                y2={this.props.radius}
                stroke="red"
                strokeWidth="2"
                opacity="0.5"
                rotation={this.state.lineRotationWithoutAnimation}
                origin={this.props.radius, this.props.radius}
              />
            </Svg>
        </View>
      )
  }

  componentDidMount() {
    let lineRotationAnimation = Animated.timing(
      this.state.lineRotation,
      {
        toValue: this.state.lineRotation.__getValue() + 360,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true
      }
    );
    this.searchAnimation = Animated.loop(lineRotationAnimation);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isSearching != nextProps.isSearching) {
      if (nextProps.isSearching) {
        this.searchAnimation.start();
      } else {
        this.searchAnimation.stop();
        this.state.lineRotation.setValue(0);
      }
    }
  }
}

const styles=StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

module.exports = Radar;
