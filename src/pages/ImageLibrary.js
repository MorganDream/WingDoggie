'use strict'

import React from 'react';
import { View, ScrollView, StyleSheet, ImageBackground, Image, Dimensions, ImageStore, TouchableHighlight, Alert } from 'react-native';

import { connect } from "react-redux";
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux'

import * as arActions from '../reducers/ar/arActions';

function mapStateToProps(state) {
  return {
    ar: state.arReducer,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(arActions, dispatch)
  }
}

class ImageLibrary extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground style={styles.background} source={require('../resources/navi_chart.jpg')}>
          <ScrollView contentContainerStyle={styles.scrollView}>
          {
            this.props.ar.snapshots.map(url => {
              return (
                <TouchableHighlight style={styles.touchable} key={url} onPress={()=> {
                  var self = this;
                  Actions.imagePreViewer({
                    imageSource: {
                      uri: url,
                    },
                    rightTitle: '删除',
                    onRightPress: () => {
                      Alert.alert(
                        'REMIND',
                        'Are you sure you want to delete this photo?',
                        [
                          {text: 'Yes', onPress: () => {
                            self.props.actions.takeSnapshots([url], false);
                            Actions.pop();
                            self.forceUpdate();
                            setTimeout(()=>{
                              ImageStore.removeImageForTag(url);
                            },2000);
                          }},
                          {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
                        ],
                      );
                    }
                  });
                }}>
                  <Image style={styles.image} source={{uri: url}}/>
                </TouchableHighlight>
              )
            })
          }
          </ScrollView>
        </ImageBackground>
      </View>
    )
  }
}

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  background: {
    height: windowHeight,
  },
  scrollView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  image: {
    flex:1,
    borderRadius: 10,
  },
  touchable: {
    marginTop:20,
    width:100,
    height:150,
    borderRadius: 10,
    borderWidth: 3,
    borderColor:'white'
  }
})

module.exports = connect(mapStateToProps, mapDispatchToProps)(ImageLibrary);
