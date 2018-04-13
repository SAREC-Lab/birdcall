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

import Icon from 'react-native-vector-icons/FontAwesome';
import Voice from 'react-native-voice';

export default class VoiceButton extends Component {
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
});
