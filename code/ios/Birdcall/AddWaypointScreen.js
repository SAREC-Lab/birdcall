/**
 * Based on Sample React Native App and react-native-voice example
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
} from 'react-native';

export default class AddWaypointScreen extends Component {
  static navigationOptions = {
    title: 'New Waypoint',
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      lat: '',
      lon: ''
    }
  }

  addPressed(e) {
    this.props.navigation.state.params.returnData(this.state.name, this.state.lat, this.state.lon);
    this.props.navigation.goBack()
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.labelAndInput}>
          <Text>Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => this.setState({name: text})}
          />
        </View>
        <View style={styles.labelAndInput}>
          <Text>Latitude</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => this.setState({lat: text})}
            keyboardType='numbers-and-punctuation'
          />
        </View>
        <View style={styles.labelAndInput}>
          <Text>Longitude</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => this.setState({lon: text})}
            keyboardType='numbers-and-punctuation'
          />
        </View>
        <Button title='Add' onPress={this.addPressed.bind(this)}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  input: {
    borderColor: '#dddddd',
    borderWidth: 1,
    borderRadius: 3,
    padding: 5,
    marginTop: 3,
  },
  labelAndInput: {
    margin: 10,
  }
});
