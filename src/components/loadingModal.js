'use strict'

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

class LoadingModal extends React.Component{
  render(){
    return (
      <Modal style={styles.modal}>
        <View>
          <Text>{this.props.text}</Text>
          <ActivityIndicator size="small" color="#00ff00" />
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  modal:{
    marginTop:800,
    flexDirection: 'row',
    width: 200,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

module.exports = LoadingModal;
