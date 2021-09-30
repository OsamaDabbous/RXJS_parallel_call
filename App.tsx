import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Image, Alert, Animated } from 'react-native';
import { of, from, Observable, Subscriber, interval, forkJoin } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { switchMap, catchError, map } from 'rxjs/operators';

interface props {
  name: String;
}
type state = {
  imagesResponse: Array<Response>,
  fadeAnim: any
}

class App extends Component<props, state>{
  state: state = {
    imagesResponse: [],
    fadeAnim: new Animated.Value(0)

  }


  fadeIn = () => {
    Animated.timing(this.state.fadeAnim, {
      toValue: 1,
      duration: 5000, useNativeDriver: true
    }).start();
  };
  data$ = forkJoin([
    fromFetch('https://source.unsplash.com/random/300x300'
    ), fromFetch('https://source.unsplash.com/random/100x300'
    ), fromFetch('https://source.unsplash.com/random/300x100'
    )
  ]);
  componentDidMount() {
    this.data$.subscribe({
      next: response => this.setState({ imagesResponse: response })
      ,
      complete: () => { console.log('complete'); this.fadeIn() }
    }
    );
  }
  componentWillUnmount() {
    this.data$.unsubscribe();
  }

  render() {
    const { imagesResponse } = this.state
    return (<Animated.View style={{ opacity: this.state.fadeAnim }}
    >
      {
        imagesResponse && imagesResponse.map(image =>
          <Image key={image.url} source={{ uri: image.url }} style={{ width: 100, height: 100 }} />)

      }
    </Animated.View>);
  }


}




export default App;
