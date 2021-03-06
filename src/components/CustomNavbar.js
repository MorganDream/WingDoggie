import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native'
import React from 'react'
import { Actions } from 'react-native-router-flux'

const styles = StyleSheet.create({
  transparentContainer: {
    position:'absolute',
    flexDirection: 'row',
    top: 20,
    alignItems: 'flex-end',
  },
  container: {
    height: 90,
    flexDirection: 'row',
    paddingTop: 20,
    backgroundColor: 'white',
    alignItems: 'flex-end',
  },
  navBarItem: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  titleItem: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: 200,
  },
  title: {
    height: 30,
    fontSize: 15,
    fontWeight: '800',
    fontFamily: 'Arial-BoldMT',
  },
  middleTitle: {
    height: 30,
    fontSize: 20,
    fontWeight: '800',
    fontFamily: 'Arial-BoldMT',
  }
})

export default class CustomNavBar extends React.Component {


  _renderLeft() {
    if (Actions.currentScene === 'customNavBar1') {
      return (
        <TouchableOpacity
          onPress={() => console.log('Hamburger button pressed')}
          style={[styles.navBarItem, { paddingLeft: 10}]}>
          <Image
            style={{width: 30, height: 50}}
            resizeMode="contain"
            source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hamburger_icon.svg/1200px-Hamburger_icon.svg.png'}}></Image>
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity
          onPress={Actions.pop}
          style={[styles.navBarItem, { paddingLeft: 10}]}>
          <Image
            style={{width: 30, height: 50}}
            resizeMode="contain"
            source={{uri: 'https://image.flaticon.com/icons/png/512/0/340.png'}}></Image>
        </TouchableOpacity>
      )
    }
  }

  _renderMiddle() {
    return (
      <View style={styles.titleItem}>
        {
          this.props.onTitlePress?
          <TouchableOpacity
            onPress={this.props.onTitlePress}
            style={{ paddingRight: 10 }}>
            <Text style={styles.middleTitle}>{ this.props.title }</Text>
          </TouchableOpacity> :
          <Text style={styles.middleTitle}>{ this.props.title }</Text>
        }
      </View>
    )
  }

  _renderRight() {
    return (
      <View style={[styles.navBarItem, { flexDirection: 'row', justifyContent: 'flex-end' }]}>
        <TouchableOpacity
          onPress={this.props.onRightPress}
          style={{ paddingRight: 10 }}>
          <Text style={styles.title}>{ this.props.rightTitle }</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    let dinamicStyle = {}
    if (Actions.currentScene === 'doggieDetails' ||
        Actions.currentScene === 'ownerDetails' ||
        Actions.currentScene === 'doggieInAR' ) {
      dinamicStyle = styles.transparentContainer;
    } else {
      dinamicStyle = styles.container;
    }

    return (
        <SafeAreaView style={dinamicStyle}>
          { this._renderLeft() }
          { this._renderMiddle() }
          { this._renderRight() }
        </SafeAreaView>
    )
  }
}
