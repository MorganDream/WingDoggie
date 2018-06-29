'use strict'

import React from 'react';
import { View, StyleSheet, Text, Image,ScrollView, ActivityIndicator, TouchableHighlight, RefreshControl } from 'react-native';

import { connect } from "react-redux";
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux'

import { Users } from '../lib/dataTable';

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
            var imageSources = photoAlum.map(photo => {
              return {uri:'data:image/png;base64,' + photo.photo};
            });
            var senderImageSource = photoAlum[0].sender == 'Jack'?
              require('../resources/default_avatar.jpg'): require('../resources/default_avatar_girl.jpeg');
            return (
              <View key={photoAlum[0].tag}>
                <View style={styles.infoContainer}>
                  <View>
                    <TouchableHighlight underlayColor={'#333300'} onPress={() => {
                      Actions.photoLocation({
                        title: photoAlum[0].placeId,
                        location: photoAlum[0].location,
                        imageSource: {
                          uri: 'data:image/png;base64,' + photoAlum[0].photo
                        },
                        photoCount: photoAlum.length,
                      });
                    }}>
                      <View style={styles.locationTouchable}>
                        <View>
                          <Text style={styles.title}>{photoAlum[0].geocode}</Text>
                          <Text style={styles.placeTitle}>{photoAlum[0].placeId}</Text>
                        </View>
                        <Text style={styles.rightArrow}>›</Text>
                      </View>
                    </TouchableHighlight>
                    <Text style={styles.content}>{new Date(photoAlum[0].time).toLocaleDateString()}</Text>
                  </View>
                  <View style={styles.senderContainer}>
                    <Text style={styles.senderBy}>- by </Text>
                    <TouchableHighlight underlayColor={'#b3b3cc'} onPress={() => {
                      Users.map(user => {
                        if (user.name == photoAlum[0].sender) {
                          Actions.ownerDetails({
                            owner: user,
                            title: '个人资料',
                            mode: 'CHECK_USER_PROFILE'
                          });
                        }
                      })
                    }}>
                      <View style={styles.senderIconContainer}>
                        <Image style={styles.sender} source={senderImageSource} />
                        <Text style={styles.senderRightArrow}>›</Text>
                      </View>
                    </TouchableHighlight>
                  </View>
                </View>
                <View style={styles.photoContainer}>
                  {
                    photoAlum.map(photo => {
                      return (
                        <TouchableHighlight style={styles.image} key={photo.photo} onPress={()=> {
                          Actions.imagePreviewSwiper({
                            imageSources: imageSources,
                            currentIndex: photoAlum.indexOf(photo),
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
    paddingTop: 10,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  senderBy: {
    fontSize: 15,
    color: 'grey',
    fontWeight: 'bold'
  },
  senderIconContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  sender: {
    width:50,
    height: 50,
  },
  photoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 20,
  },
  image: {
    width:100,
    height:100,
  },
  locationTouchable: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rightArrow: {
    fontSize: 40,
    paddingHorizontal: 10,
    fontWeight: 'bold'
  },
  senderRightArrow: {
    fontSize: 30,
    paddingLeft: 5,
    fontWeight: 'bold'
  }
})

module.exports = connect(mapStateToProps, mapDispatchToProps)(TravelAlbum);
