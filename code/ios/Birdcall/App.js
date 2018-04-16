/**
 * Based on Sample React Native App and react-native-voice example
 */

import React, { Component } from 'react';

import HomeScreen from './HomeScreen';
import AddWaypointScreen from './AddWaypointScreen';

import { StackNavigator } from 'react-navigation';

const RootStack = StackNavigator (
  {
    Home: {
      screen: HomeScreen,
    },
    AddWaypoint: {
      screen: AddWaypointScreen,
    },
  },
  {
    initialRouteName: 'Home',
  }
);

export default class App extends Component {
  render() {
    return <RootStack />;
  }
}
