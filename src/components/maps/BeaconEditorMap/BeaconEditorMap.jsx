import React from 'react';
import './BeaconEditorMap.css';


import { Map2 } from '../Map2';

import { SatelliteBackground } from '../layers/SatelliteBackground';
import { BaseContourLayer2 } from '../layers/BaseContourLayer2';
import { BackgroundImageLayer } from '../layers/BackgroundImageLayer';
import { GeoJsonLayer } from '../layers/GeoJsonLayer';
import { LocationLayer3 } from '../layers/LocationLayer3';
import { BeaconLayer3 } from '../layers/BeaconLayer3';

// import { BeaconEditorMapPropTypes } from '../../types';

export function BeaconEditorMap(props) {
  const {
    curPosition, gameModel, mapConfig, translator, geomanConfig,
  } = props;

  return (
    <Map2
      curPosition={curPosition}
      gameModel={gameModel}
      mapConfig={mapConfig}
      geomanConfig={geomanConfig}
      commonPropsExtension={{
        translator,
        gameModel,
      }}
    >
      <SatelliteBackground enableByDefault />
      <BaseContourLayer2
        enableByDefault
      />
      <BackgroundImageLayer
        enableByDefault
        editable={false}
      />
      <GeoJsonLayer
        enableByDefault={false}
      />
      <BeaconLayer3
        enableByDefault
      />
    </Map2>
  );
}

// BeaconEditorMap.propTypes = BeaconEditorMapPropTypes;
