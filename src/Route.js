import React, { Component } from 'react';
import './Route.css';


class RouteItem extends Component {

  constructor(props) {
    super(props);
    this.showMarkerOnMap = this.showMarkerOnMap.bind(this);
  }

  showMarkerOnMap(event) {
    event.preventDefault();
  }

  render() {
    return (
      <tr>
        <td onClick={this.showMarkerOnMap}>{this.props.route}</td>
        <td className="number">{this.props.number}</td>
      </tr>
    )
  }
}

class Route extends Component {

  render() {
    let routes = undefined;
    if (this.props.vehicleRoutes.length != 0) {
      routes = this.props.vehicleRoutes.map((routeInfo) =>
        <RouteItem route={routeInfo.name} number={this.props.vehicleCount[routeInfo.id]} />
      );
    } else {
      routes = <tr><td colspan="2">Loading Routes...</td></tr>
    }

    return (
      <div className="Route">
        <table className="table">
          <thead>
            <tr className="header">
              <th>Route</th>
              <th>Busess on Route</th>
            </tr>
          </thead>
          <tbody>
            {routes}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Route;
