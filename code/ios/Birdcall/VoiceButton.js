/**
 * Based on Sample React Native App and react-native-voice example
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableHighlight,
  ActivityIndicator
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Voice from 'react-native-voice';

export default class VoiceButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isReady: false,
        isRecording: false,
        error: '',
        results: []
    };
    
    Voice.onSpeechError = this.onSpeechError.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);

    const timer = setInterval(() => {
      if (this.state.isReady) {
        clearInterval(timer);
      } else {
        let connection = this.props.connectionUrl + '/status';
        fetch(connection, {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((response) => this.setState({'isReady': response['ready']}))
        .catch((error) => console.log(error.message));
      }
    }, 1000);

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
    let lowerCaseResults = this.state.results.map(s => s.toLowerCase());
    let connection = this.props.connectionUrl + '/commands';
    fetch(connection, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            message: lowerCaseResults
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
          ]);
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
    const iconName = this.state.isRecording ? 'stop' : 'microphone';
    const iconColor = this.state.isRecording ? 'red' : 'black';
    const element = this.state.isReady ? (
      <Icon name={iconName} size={96} color={iconColor}/>
    ) : (
      <ActivityIndicator size='large' color='gray'/>
    );
    return (
      <TouchableHighlight
        onPress={this.recordingPressed.bind(this)}
        style={[styles.voice, this.state.isReady ? styles.ready : styles.notReady]}
        underlayColor='white'
        disabled={!this.state.isReady}
      >
        {element}
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  voice: {
      borderWidth: 2,
      borderRadius: 5,
      width: 150,
      height: 150,
      alignItems: 'center',
      justifyContent: 'center',
  },
  notReady: {
    borderColor: 'gray',
  },
  ready: {
    borderColor: 'rgb(0,122,255)',
  },
});
