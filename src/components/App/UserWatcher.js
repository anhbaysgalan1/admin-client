import * as R from 'ramda';
import * as gi from '@thi.ng/geom-isec';

import L from 'leaflet/dist/leaflet-src';

import { SoundHolder } from '../../utils/SoundHolder';

const latlngs2arr = R.map((el) => [el.lat, el.lng]);

function latLngsToBounds(latLngs) {
  const bounds = new L.LatLngBounds();
  latLngs.forEach(bounds.extend.bind(bounds));
  return bounds;
}

function isPointInLocation(latlng, latlngPolygon) {
  // const latlngPolygon = loc.getLatLngs();
  // const bounds = loc.getBounds();
  const bounds = latLngsToBounds(latlngPolygon);

  const simpleTest = bounds.contains(latlng);
  if (simpleTest) {
    const coords = [latlng.lat, latlng.lng];
    const polygon = latlngs2arr(latlngPolygon);
    return gi.pointInPolygon2(coords, polygon);
  }
  return false;
}

export class UserWatcher {
  constructor(soundService, dataService, gameModel) {
    this.soundService = soundService;
    this.dataService = dataService;
    this.gameModel = gameModel;
    this.soundHolder = new SoundHolder(soundService);
    this.location = null;
    this.onSoundToKeySet = this.onSoundToKeySet.bind(this);
    this.onUserPositionUpdate = this.onUserPositionUpdate.bind(this);
    this.soundService.on('soundToKeySet', this.onSoundToKeySet);
    this.gameModel.on('userPositionUpdate', this.onUserPositionUpdate);
  }

  dispose() {
    this.soundService.off('soundToKeySet', this.onSoundToKeySet);
    this.gameModel.off('userPositionUpdate', this.onUserPositionUpdate);
    this.soundHolder.dispose();
  }

  onSoundToKeySet({ key, soundName }) {
    if (!this.location) {
      return;
    }
    const { manaLevel } = this.location.options;
    if (manaLevel === key) {
      this.soundHolder.playSound(soundName);
    }
  }

  // updateUserLocation(e) {
  onUserPositionUpdate(user) {
    // const layers = this.userGroup.getLayers();
    // const hasUser = layers.length > 0;
    const coords = user.pos && user.pos.coords;
    const latlng = coords ? {
      lat: coords.latitude,
      lng: coords.longitude,
    } : null;
    const locations = this.dataService.getLocations();
    // const { latlng } = e;
    // if (!latlng) {

    // }
    // if (this.location && isPointInLocation(latlng, this.location.getLatLngs()[0])) {
    if (this.location && isPointInLocation(latlng, this.location.latlngs[0])) {
      return;
    }
    // gi
    const location = locations.find((loc) => isPointInLocation(latlng, loc.latlngs[0]));
    // console.log('location', location && location.options.name);
    if (this.location === location) {
      return;
    }
    if (location) {
      // const { manaLevel } = location.options;
      const { manaLevel } = location;
      const soundName = this.soundService.getSoundForKey(manaLevel);
      this.soundHolder.playSound(soundName);
    } else {
      this.soundHolder.playSound();
      // this.soundService.stopAllSounds();
    }
    this.location = R.clone(location);
  }
}
