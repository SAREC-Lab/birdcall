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
  TouchableHighlight
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Voice from 'react-native-voice';
import { StackNavigator } from 'react-navigation';

export class VoiceButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isRecording: false,
        error: '',
        results: []
    };
    Voice.onSpeechError = this.onSpeechError.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
  }

  
  async startRecording(e) {
      this.setState({
        isRecording: true,
        error: '',
        results: []
      });

      try {
        await Voice.start('en-US');
      } catch (e) {
        console.log(e);
      }
  }
  
  async stopRecording(e) {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }

  onSpeechError(e) {
    this.setState({
      error: JSON.stringify(e.error),
    });
  }

  onSpeechResults(e) {
    this.setState({
      results: e.value,
    });
  }

  sendMessage() {
      fetch(this.props.connectionUrl, {
          method: 'POST',
          headers: {
              'content-type': 'application/json'
          },
          body: JSON.stringify({
              message: this.state.results
          })
      })
      .then((response) => response.json())
      .then((response) => Alert.alert(JSON.stringify(response)))
      .catch((error) => Alert.alert(error.message));
  }

  recordingPressed(e) {
    if (this.state.isRecording) {
      this.stopRecording(e);

      if (this.state.results.length !== 0) {
        Alert.alert(
          'Message Recorded',
          JSON.stringify(this.state.results),
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Send', onPress: () => this.sendMessage()}
          ],
        );
      } else {
        Alert.alert('No Message Recorded');
      }
      
      this.setState({
        isRecording: false,
        error: '',
        results: []
      });
    } else {
      this.startRecording(e);
    }
  }

  render() {
    let iconName = this.state.isRecording ? 'stop' : 'microphone';
    let iconColor = this.state.isRecording ? 'red' : 'black';
    return (
      <TouchableHighlight onPress={this.recordingPressed.bind(this)} style={styles.voice}>
        <Icon name={iconName} size={96} color={iconColor}/>
      </TouchableHighlight>
    );
  }
}

export class AddWaypointScreen extends Component {
  static navigationOptions = {
    title: 'Add Waypoints',
  };


  addPressed(e) {
    this.props.navigation.state.params.returnData("test", 1, 2);
    this.props.navigation.goBack()
  }

  render() {
    return (
      <View style={styles.container}>
        <Button title='Add' onPress={this.addPressed.bind(this)}/>
      </View>
    );
  }
}

export class HomeScreen extends Component<Props> {
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

  returnData(name, lat, lon) {
    // create new waypoint
    let key = this.state.waypoints.length + 1;
    let wp = {key: ''+key, lat: lat, lon: lon, name: name};
    let waypoints = [...this.state.waypoints, wp];
    
    // send waypoints
    fetch(this.state.connectionUrl + '/waypoints', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
          waypoints: waypoints
        })
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
                  ItemSeparatorComponent={() => <View style={styles.line}/>}/>
            </View>
            <Button title='Add Waypoint' onPress={this.addWaypointPressed.bind(this)}/>
        </View>
        <Button title='Connect to Drone' onPress={this.connectDronePressed.bind(this)}/>
      </View>
    );
  }
}

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

const styles = StyleSheet.create({
  voice: {
      borderWidth: 2,
      borderColor: 'black',
      borderRadius: 5,
      width: 150,
      height: 150,
      alignItems: 'center',
      justifyContent: 'center',
  },
  waypointContainer: {
    backgroundColor: '#f5f5f5',
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
