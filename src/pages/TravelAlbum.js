'use strict'

import React from 'react';
import { View, StyleSheet, Text, Image,ScrollView, ActivityIndicator, TouchableHighlight, RefreshControl } from 'react-native';

import { connect } from "react-redux";
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux'

import * as arActions from '../reducers/ar/arActions';

function mapStateToProps(state) {
  return {
    ar: state.arReducer,
    auth: state.authReducer,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(arActions, dispatch)
  }
}

class TravelAlbum extends React.Component {
  componentWillMount() {
    this.props.actions.fetchPhotosForUser(this.props.auth.loginUserName, false);
  }

  _onRefresh = () => {
    this.props.actions.fetchPhotosForUser(this.props.auth.loginUserName, true);
  }

  render() {
    if (this.props.ar.fetchPhotos.fetching && !this.props.ar.fetchPhotos.pullToRefreshing) {
      return (
        <View style={styles.indicatorContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
    } else {
      return (
        <ScrollView style={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={this.props.ar.fetchPhotos.pullToRefreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        >
        {
          this.props.ar.fetchPhotos.photos.length <= 0 &&
          <Text>{this.props.ar.fetchPhotos.failure}</Text>
        }
        {
          this.props.ar.fetchPhotos.photos.map(photoAlum => {
            return (
              <View key={photoAlum[0].tag}>
                <View style={styles.infoContainer}>
                  <View>
                    <Text style={styles.title}>{photoAlum[0].geocode}</Text>
                    <Text style={styles.placeTitle}>{photoAlum[0].placeId}</Text>
                    <Text style={styles.content}>{new Date(photoAlum[0].time).toLocaleDateString()}</Text>
                  </View>
                  <View style={styles.senderContainer}>
                    <Text style={styles.sender}>--by {photoAlum[0].sender}</Text>
                  </View>
                </View>
                <View style={styles.photoContainer}>
                  {
                    photoAlum.map(photo => {
                      return (
                        <TouchableHighlight style={styles.image} key={photo.photo} onPress={()=> {
                          Actions.imagePreViewer({
                            imageSource: {uri:'data:image/png;base64,' + photo.photo}
                          })
                        }}>
                          <Image
                            style={styles.image}
                            source={{uri:'data:image/png;base64,' + photo.photo}} />
                        </TouchableHighlight>

                      )
                    })
                  }
                </View>
              </View>
            )
          })
        }
        </ScrollView>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  indicatorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  placeTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'grey',
    paddingBottom: 10,
  },
  content: {
    fontSize: 15,
  },
  senderContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  sender: {
    fontSize: 20,
  },
  photoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 20,
  },
  image: {
    width:100,
    height:100,
  }
})

module.exports = connect(mapStateToProps, mapDispatchToProps)(TravelAlbum);
