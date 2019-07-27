import React, { Component, Fragment } from 'react';
import './App.css';
import * as R from 'ramda';

import {
  BrowserRouter as Router, Switch, Route, Redirect, Link, NavLink
} from 'react-router-dom';
import Prototype1 from '../Prototype1';
import MapEditor from '../MapEditor';
import MusicEditor from '../MusicEditor';
import Beacons from '../Beacons';

import 'bootstrap/dist/css/bootstrap.min.css';


export default class App extends Component {
  state = {
    svgWidth: 800,
    svgHeight: 581,
    imagePositionX: 50,
    imagePositionY: 68,
    imageOpacity: 80,
    imageScale: 800
    // beacons: sortBeacons(correctedBeacons),
    // polygonData: getPolygons(correctedBeacons),
    // sounds : [
    //   {
    //    x: 50,
    //    y: 100,
    //    soundR: 200,
    //    color: "crimson",
    //    name: 'drums'
    //  },
    //   {
    //    x: 250,
    //    y: 300,
    //    soundR: 150,
    //    color: "grey",
    //    name: 'techno'
    //  },
    //  {
    //    x: 450,
    //    y: 100,
    //    soundR: 250,
    //    color: "green",
    //    name: 'organ'
    // }],
    // players ,
    // playing: false,
    // movePlayers: true,
    // soundsLoaded: false,
    // movableId: null,
    // showBeaconMarkers: false,
    // listenPlayer: players[0].id
  };

  componentDidMount() {
    // initSound(() => {
    //   this.setState({
    //     soundsLoaded: true
    //   });
    // });
    // this.animatePlayer();
  }

  onStateChange = prop => (e) => {
    // console.log('prop');
    this.setState({
      [prop]: e.target.value
    });
  }

  render() {
    const {
      imagePositionX, imagePositionY, imageOpacity, imageScale, svgWidth, svgHeight
    } = this.state;
    // const { sounds, players, playing, soundsLoaded, beacons, polygonData, movable, showBeaconMarkers, movePlayers, listenPlayer } = this.state;

    return (
      <Router>
        <div className="App">
          <header>
            <nav className="view-switch">
              <ul>
                <li>
                  <NavLink to="/mapEditor">Map Editor</NavLink>
                </li>
                <li>
                  <NavLink to="/beacons">Beacons</NavLink>
                </li>
                <li>
                  <NavLink to="/soundManager">Sound Manager</NavLink>
                </li>
                <li>
                  <NavLink to="/demo">Demo</NavLink>
                </li>
              </ul>
            </nav>
          </header>

          <main>

            <Switch>
              <Route path="/mapEditor">
                <MapEditor
                  imagePositionX={imagePositionX}
                  imagePositionY={imagePositionY}
                  imageOpacity={imageOpacity}
                  imageScale={imageScale}
                  svgWidth={svgWidth}
                  svgHeight={svgHeight}
                  onPropChange={this.onStateChange}
                />
              </Route>
              <Route path="/beacons">
                <Beacons
                  imagePositionX={imagePositionX}
                  imagePositionY={imagePositionY}
                  imageOpacity={imageOpacity}
                  imageScale={imageScale}
                  svgWidth={svgWidth}
                  svgHeight={svgHeight}
                />
              </Route>
              <Route path="/soundManager">
                <MusicEditor />
              </Route>
              <Route path="/demo">
                <Prototype1 />
              </Route>

              <Route render={() => <Redirect to="/mapEditor" />} />
            </Switch>
          </main>
        </div>
      </Router>
    );
  }
}
