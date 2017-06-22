import React, { Component } from 'react';
import './Route.css';


class RouteItem extends Component {

  constructor(props) {
    super(props);
    this.showMarkerOnMap = this.showMarkerOnMap.bind(this);
  }

  showMarkerOnMap(event) {
    event.preventDefault();
    // TODO
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
    const routes = this.props.routes.map((routeInfo) =>
      <RouteItem route={routeInfo.name} number={this.props.totals[routeInfo.id]} />
    );

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
