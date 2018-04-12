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

  recordingPressed(e) {
    if (this.state.isRecording) {
      this.stopRecording(e);
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


export default class App extends Component<Props> {
  connect
  
  constructor(props) {
    super(props);
    this.state = {
        connectionUrl: 'http://127.0.0.1:5000',
        waypoints: [{key: 'test'}, {key: 'test2'}, {key: 'testtesttesttest'}, {key: 'test4'}, {key: 'test5'}, {key: 'test6'}]
    };
  }

  connectDronePressed(e) {
    AlertIOS.prompt(
      'Enter Raspberry Pi URL',
      null,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancelled Pressed'),
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
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Birdcall</Text>
        <VoiceButton connectionUrl={this.state.connectionUrl}/>
        <Text style={styles.smallerHeader}>Waypoints</Text>
        <View style={styles.waypointContainer}>
            <FlatList
              data={this.state.waypoints}
              renderItem={({item, index}) => <Text style={styles.item}>{index + 1}. {item.key}</Text>}
              ItemSeparatorComponent={() => <View style={{height: 1, width: '100%', backgroundColor:'#dddddd', margin: 5}}/>}/>
        </View>
        <Button title='Add Waypoint' onPress={this.addWaypointPressed.bind(this)}/>
        <Button title='Connect to Drone' onPress={this.connectDronePressed.bind(this)}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  voice: {
      margin: 10,
      borderWidth: 2,
      borderColor: 'black',
      borderRadius: 5,
      width: 150,
      height: 150,
      alignItems: 'center',
      justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  waypointContainer: {
    margin: 10,
    height: 155,
    backgroundColor: '#eeeeee',
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
});
