/**
 * Based on Sample React Native App and react-native-voice example
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableHighlight
} from 'react-native';

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
      fetch('http://127.0.0.1:5000/', {
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
    return (
      <TouchableHighlight onPress={this.recordingPressed.bind(this)}>
        <Text>{this.state.isRecording ? 'Stop' : 'Start'}</Text>
      </TouchableHighlight>
    );
  }
}


export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <VoiceButton/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
