import React, { Component } from 'react';

import {GoogleApiWrapper} from 'google-maps-react'
import Map from 'google-maps-react';
import Marker from 'google-maps-react';
import logo from './logo.png';
import Route from './Route';
import './App.css';

let RTM = require("satori-sdk-js");
let endpoint = "wss://open-data.api.satori.com";
let appKey = "cd5cCD4cFeFA5106CacD9C59420fe2FB";
let channel = "transportation";
let routeList = [];
let totalBusList = {};
let limit = 0;
let rtm = new RTM(endpoint, appKey);
let subscription = rtm.subscribe(channel, RTM.SubscriptionMode.SIMPLE, {
  // filter: "SELECT * FROM transportation where"
})

rtm.on("enter-connected", function() {
  console.log("Connected!");
});

subscription.on('rtm/subscription/data', function (pdu) {
  pdu.body.messages.forEach(function(msg) {
    if (limit < 10) {
      const routeId = 'trip' in msg.entity[0].vehicle ? msg.entity[0].vehicle.trip.route_id : undefined;
      if (routeId !== undefined) {
        routeList.push({
          id: routeId,
          name: msg.entity[0].vehicle.label? msg.entity[0].vehicle.label: '--',
          position: msg.entity[0].vehicle.position,
        });
        totalBusList[routeId] = routeId && routeId in totalBusList ? totalBusList[routeId]++ : 1;
      }
      limit++;
    }
  });
});

rtm.start();


class App extends Component {

  constructor(props) {
    super(props);

    // Dummy data
    this.routeList = [{"id":"034","name": "Route 12", "position":{"latitude":40.062126,"longitude":-83.01329,"bearing":90,"speed":0.000008630155}},{"id":"102", "name": "Route 23", "position":{"latitude":40.15002,"longitude":-82.92249,"bearing":270,"speed":0.0000051780935}},{"id":"102","position":{"latitude":40.111465,"longitude":-83.016785,"bearing":180,"speed":0.0000010356187}},{"id":"034", "name": "Route 46", "position":{"latitude":40.048286,"longitude":-82.91049,"bearing":270,"speed":0.0000018986342}},{"id":"023", "name": "Route 22", "position":{"latitude":39.98862,"longitude":-82.914024,"bearing":180,"speed":0.0000070767273}},{"id":"023", "name": "Route 24", "position":{"latitude":39.946922,"longitude":-82.915276,"bearing":270}},{"id":"001","position":{"latitude":39.949085,"longitude":-82.95905,"bearing":90,"speed":0.0000025890467}},{"id":"003", "name": "Route 26", "position":{"latitude":39.87759,"longitude":-83.04566,"bearing":180}},{"id":"008","position":{"latitude":39.938652,"longitude":-82.99604,"speed":0.000003106856}},{"id":"007", "name": "Route 56", "position":{"latitude":39.957176,"longitude":-82.99018,"bearing":180,"speed":0.0000010356187}}];
    this.totalBusList = {"102": 1,"034": 2,"023": 1,"001": 1,"003": 1,"008": 1,"007": 1};
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Frontend Coding Exercise</h2>
        </div>
        <div className="App-content">
          <Route routes={this.routeList} totals={this.totalBusList} />
          <Map google={window.google}
            className={'map'}
            zoom={14}>
            <Marker
              title={'Route'}
              name={'SOMA'}
              position={{lat: 37.778519, lng: -122.405640}} />
          </Map>
        </div>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo'
})(App);
