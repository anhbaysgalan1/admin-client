import React, { Component } from 'react';
import './RealTrackDemo.css';


import L from 'leaflet/dist/leaflet-src';
import * as R from 'ramda';

import * as Hotline from 'leaflet-hotline';

// require('leaflet-hotline')(L);

// import trackData from '../../../../dataAnalysis/playerTracks2.json';
// import trackData from '../../../../dataAnalysis/data/pt3.json';
import tracksData from '../../../../dataAnalysis/data/pt6.json';
import usersData from '../../../../dataAnalysis/data/usersData.json';
import beaconLatlngs from '../../../../dataAnalysis/data/googleMapBeaconList.json';
// import * as BeaconUtils from '../../../../dataAnalysis/beaconUtils';

// import { userTracks } from '../../../../dataAnalysis/makeDetailedUserTracks';

import { COLOR_PALETTE } from '../../../../utils/colorPalette';

// console.log('BeaconUtils', BeaconUtils);

console.log('Hotline', Hotline);

const defaultOptions = {
  // id: userName,
  // color: COLOR_PALETTE[index % COLOR_PALETTE.length].color.background,
  // palette: {
  //   0.0: '#00000000',
  //   1.0: '#ffffffff',
  // },
  palette: {
    0.0: '#00ff00',
    0.25: '#008800',
    0.5: '#ffff00',
    0.75: '#ff8800',
    1.0: '#ff0000',
  },
  weight: 5,
  outlineColor: '#000000',
  outlineWidth: 1,
};

// import { RealTrackDemoPropTypes } from '../../types';

export class RealTrackDemo extends Component {
  beaconGroup = L.layerGroup([]);

  beaconNameKey = 'beaconGroup';

  // static propTypes = RealTrackDemoPropTypes;

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const {
      enableByDefault, layerCommunicator,
    } = this.props;
    // this.subscribe('on', gameModel);
    this.populate();
    layerCommunicator.emit('setLayersMeta', {
      layersMeta: this.getLayersMeta(),
      enableByDefault: false,
    });
    console.log('RealTrackDemo mounted');
  }

  componentDidUpdate() {
    console.log('RealTrackDemo did update');
  }

  componentWillUnmount() {
    this.clear();
    console.log('RealTrackDemo will unmount');
  }

  getLayersMeta() {
    return {
      [this.beaconNameKey]: this.beaconGroup,
      ...this.tracks,
    };
  }

  // eslint-disable-next-line max-lines-per-function
  // eslint-disable-next-line react/sort-comp
  populate() {
    // const {
    //   gameModel, translator,
    // } = this.props;

    beaconLatlngs.forEach((beacon) => {
      const marker = L.marker({
        lat: beacon.lat,
        lng: beacon.lng,
      }, { id: beacon.id });
      marker.on('mouseover', function (e) {
        marker.bindPopup(`${beacon.id}`);
        this.openPopup();
      });
      marker.on('mouseout', function (e) {
        this.closeTooltip();
      });
      this.beaconGroup.addLayer(marker);
    });

    this.tracks = R.toPairs(tracksData).map(([userId, user]) => {
      const group = L.layerGroup([]);
      const preparedTracks = user.tracks.map((trackData) => this.prepareTrack(trackData, user)).filter((data) => {
        if (data.preparedTrack.length < 2) {
          console.warn('User', user.userData.name, 'has track with', data.preparedTrack.length, 'points');
          return false;
        }
        return true;
      });

      const tracks = preparedTracks.map((data) => {
        const track = L.hotline(data.preparedTrack, {
          ...defaultOptions,
          min: data.min,
          max: data.max,
        });
        return track;
      });
      tracks.forEach(group.addLayer.bind(group));

      const points = R.sum(preparedTracks.map(R.pipe(R.prop('preparedTrack'), R.length)));

      return [`${user.userData.name} (id ${userId}, ${points} points, ${tracks.length} tracks)`, group];
    });
    this.tracks = R.fromPairs(this.tracks);
  }

  // eslint-disable-next-line class-methods-use-this
  prepareTrack(trackData, user) {
    const preparedTrack = trackData.map((el) => ([el.lat, el.lng, el.timeMillis])).filter((value, index, arr) => {
      if (arr[index + 1] && value[2] === arr[index + 1][2]) {
        console.warn('User', user.userData.name, 'has track with two measures with the equal time', value[2]);
        return false;
      }
      return true;
    });
    return {
      preparedTrack,
      min: R.head(preparedTrack)[2],
      max: R.last(preparedTrack)[2],
    };
  }

  clear() {
    this.beaconGroup.clearLayers();
    R.values(this.tracks).forEach((track) => track.clearLayers());
  }

  render() {
    return null;
  }
}