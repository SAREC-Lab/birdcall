/**
 * Based on Sample React Native App and react-native-voice example
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  AlertIOS,
  Button,
  FlatList,
} from 'react-native';

import VoiceButton from './VoiceButton'

export default class HomeScreen extends Component<Props> {
  connect
  
  static navigationOptions = {
    title: 'Birdcall',
  };
  
  constructor(props) {
    super(props);
    this.state = {
        connectionUrl: 'http://127.0.0.1:5000',
        waypoints: []
    };
  }

  returnData(name, lat, lon, alt) {
    // create new waypoint
    let key = this.state.waypoints.length + 1;
    let wp = {key: ''+key, lat: lat, lon: lon, alt: alt, name: name};
    let waypoints = [...this.state.waypoints, wp];

    let connection = this.state.connectionUrl + '/waypoints';
    // send waypoints
    fetch(connection, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(waypoints)
    })
    .then((response) => response.json())
    .then((response) => {
      // update state
      this.setState({
        waypoints: waypoints
      });
      Alert.alert(JSON.stringify(response))
    })
    .catch((error) => Alert.alert(error.message));
    
  }

  connectDronePressed(e) {
    AlertIOS.prompt(
      'Enter Raspberry Pi URL',
      `Current: ${this.state.connectionUrl}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Connect',
          onPress: (connection) => this.setState({'connectionUrl': connection}),
        },
      ],
      'plain-text'
    );
  }

  addWaypointPressed(e) {
    this.props.navigation.navigate('AddWaypoint', {returnData: this.returnData.bind(this)})
  }


  isReady(e) {
    let connection = this.state.connectionUrl + '/status';
    fetch(connection, {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    })
    .then((response) => response.json())
    .then((response) => Alert.alert(JSON.stringify(response)))
    .catch((error) => Alert.alert(error.message));
  }

  render() {
    return (
      <View style={styles.container}>
        <VoiceButton connectionUrl={this.state.connectionUrl}/>
        <View style={styles.waypointContainer}>
            <Text style={styles.smallerHeader}>Waypoints</Text>
            <View style={styles.listContainer}>
                <FlatList
                  data={this.state.waypoints}
                  renderItem={({item, index}) => <Text style={styles.item}>{item.key}. {item.name}</Text>}
                  ItemSeparatorComponent={() => <View style={styles.line}/>}
                />
            </View>
            <Button title='Add Waypoint' onPress={this.addWaypointPressed.bind(this)}/>
        </View>
        <Button title='Change Pi URL' onPress={this.connectDronePressed.bind(this)}/>
        <Button title='Is ready?' onPress={this.isReady.bind(this)}/>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  waypointContainer: {
    backgroundColor: '#f7f7f7',
    borderRadius: 5,
  },
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  listContainer: {
    margin: 10,
    height: 155,
    width: 200,
  },
  item: {
    textAlign: 'left',
    fontSize: 18,
  },
  header: {
    fontSize: 48,
    textAlign: 'center',
  },
  smallerHeader: {
    padding: 5,
    fontSize: 24,
    textAlign: 'center',
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor:'#dddddd',
    margin: 5
  }
});
