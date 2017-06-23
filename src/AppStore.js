import AppDispatcher from './AppDispatcher';
import { EventEmitter } from 'events';


let RTM = require("satori-sdk-js");
let endpoint = "wss://open-data.api.satori.com";
let channel = "transportation";

const appKey = "cd5cCD4cFeFA5106CacD9C59420fe2FB";
const LOADED = 'LOADED';

class AppStore extends EventEmitter {


  constructor() {
    super();
    this.counter = 0;
    this.limit = 10;
    this.vehicleRoutes = [];
    this.vehicleCount = {};
    this.rtm = new RTM(endpoint, appKey);
    this.subscription = this.rtm.subscribe(channel, RTM.SubscriptionMode.SIMPLE, {
      // filter: "SELECT * FROM transportation where"
    })
    this.rtm.on("enter-connected", function() {
      console.log("Connected!");
    });
    var self = this;
    this.subscription.on('rtm/subscription/data', function(pdu) {
      pdu.body.messages.forEach(function(msg) {
        if (self.counter < self.limit) {
          let routeId = 'trip' in msg.entity[0].vehicle ? msg.entity[0].vehicle.trip.route_id : undefined;
          let vehicleInfo = msg.entity[0].vehicle ? msg.entity[0].vehicle : undefined;
          let routeName = vehicleInfo ? vehicleInfo.vehicle.label : undefined;
          if (routeId !== undefined && routeName !== undefined) {
            let position = msg.entity[0].vehicle.position;
            let coordinates = {
              lat: position.latitude, lng: position.longitude
            }
            self.vehicleRoutes.push({
              id: routeId,
              name: routeName,
              coordinates: coordinates,
            });

            self.vehicleCount[routeId] = routeId && routeId in self.vehicleCount ? self.vehicleCount[routeId]++ : 1;

            if (self.counter + 1 === self.limit) {
              self.emitChange(LOADED);
            }
          self.counter++;
          }
        }
      });
    });
    this.rtm.start();

    this.dispatchToken = AppDispatcher.register(this.dispatcherCallback.bind(this))
  }

  emitChange(eventName) {
    this.emit(eventName);
  }

  addChangeListener(eventName, callback) {
    this.on(eventName, callback);
  }

  removeChangeListener(eventName, callback) {
    this.removeListener(eventName, callback);
  }

  getVehicleRoutes() {
    return this.vehicleRoutes;
  }

  getVehicleCount() {
    return this.vehicleCount;
  }

  dispatcherCallback(action) {
    switch (action.actionType) {
      case 'LOADED':
        break;
    }
    this.emitChange(action.actionType);
    return true;
  }
}

export default new AppStore();
