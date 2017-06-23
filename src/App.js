import React, { Component } from 'react';

import {GoogleApiWrapper} from 'google-maps-react';
import AppStore from './AppStore';
import Map from 'google-maps-react';
import Marker from 'google-maps-react';
import logo from './logo.png';
import Route from './Route';
import './App.css';


class App extends Component {

  _onChange() {
    this.setState({
      vehicleRoutes: AppStore.getVehicleRoutes(),
      vehicleCount: AppStore.getVehicleCount()
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      vehicleRoutes: [],
      vehicleCount: {}
    }
  }

  componentDidMount() {
    AppStore.addChangeListener('LOADED', this._onChange.bind(this));
  }

  componentWillUnmount() {
    AppStore.removeChangeListener('LOADED', this._onChange.bind(this));
  }

  render() {

    let markers = undefined;
    if (this.state.vehicleRoutes) {
      markers = this.state.vehicleRoutes.map((routeInfo) =>
        <Marker position={routeInfo.coordinates}
                name={routeInfo.name}
                title={routeInfo.name} />
      );
    }
    const style = {
      width: '350px',
      height: '400px'
    };
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Frontend Coding Exercise</h2>
        </div>
        <div className="App-content">
          <Route vehicleRoutes={this.state.vehicleRoutes}
                 vehicleCount={this.state.vehicleCount} />
          <div className="App-map">
            <Map google={window.google}
              style={style}
              className={'map'}
              zoom={14}>
              {markers}
            </Map>
          </div>
        </div>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo'
})(App);
