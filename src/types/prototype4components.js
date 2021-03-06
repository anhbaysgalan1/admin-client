
import {
  number, string, func, arrayOf,
} from 'prop-types';

import {
  beacon2PropTypes,
  locationPropTypes,
} from './primitives';

import {
  spiritServicePropTypes, gameModelPropTypes,
} from './services';


export const Map2PropTypes = {
  // dataService: dataServicePropTypes.isRequired,
};

export const SpiritEditorPropTypes = {
  spiritService: spiritServicePropTypes.isRequired,
};

export const SpiritContentPropTypes = {
  spiritService: spiritServicePropTypes.isRequired,
  id: number.isRequired,
};

export const SpiritListPropTypes = {
  spiritService: spiritServicePropTypes.isRequired,
  t: func.isRequired,
};

export const LocationPopupPropTypes = {
  name: string.isRequired,
  attachedMarkers: arrayOf(number).isRequired,
  allBeacons: arrayOf(beacon2PropTypes).isRequired,
  allLocations: arrayOf(locationPropTypes).isRequired,
  onLocMarkerChange: func.isRequired,
  onClose: func.isRequired,
  onChange: func.isRequired,
};

export const MarkerPopupPropTypes = {
  name: string.isRequired,
  lat: number.isRequired,
  lng: number.isRequired,
  onClose: func.isRequired,
  onChange: func.isRequired,
};

export const AbilitiesInputPropTypes = {
  spiritService: spiritServicePropTypes.isRequired,
  id: number.isRequired,
  t: func.isRequired,
  className: string,
};

export const SearchPropTypes = {
  onSearchChange: func.isRequired,
  t: func.isRequired,
  className: string.isRequired,
  placeholder: string.isRequired,
};

export const SoundManagerPropTypes = {
  // soundService: soundServicePropTypes.isRequired,
};

export const MusicSelectPropTypes = {
  // soundService: soundServicePropTypes.isRequired,
};

export const MusicSelectControlPropTypes = {
  // soundService: soundServicePropTypes.isRequired,
};

export const FractionListPropTypes = {
  spiritService: spiritServicePropTypes.isRequired,
};

export const SoundSettingsFormPropTypes = {
  gameModel: gameModelPropTypes.isRequired,
  t: func.isRequired,
};
export const SoundStageEchoPropTypes = {
  gameModel: gameModelPropTypes.isRequired,
  // t: func.isRequired,
};
export const ModelRunControlPropTypes = {
  gameModel: gameModelPropTypes.isRequired,
  // t: func.isRequired,
};

export const GeoDataStreamSimulatorPropTypes = {
  // gameModel: gameModelPropTypes.isRequired,
  // t: func.isRequired,
};
