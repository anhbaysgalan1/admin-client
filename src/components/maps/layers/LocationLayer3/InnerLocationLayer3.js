import L from 'leaflet/dist/leaflet-src';
import * as R from 'ramda';

export class InnerLocationLayer3 {
  group = L.layerGroup([]);

  nameKey = 'locationsLayer';

  getLayersMeta() {
    return {
      [this.nameKey]: this.group,
    };
  }

  clear() {
    this.group.clearLayers();
  }

  populate(gameModel, translator, setLocationEventHandlers, t) {
    // const locationsData = gameModel.get('locations').map(translator.moveTo);
    const isNotEmptyPolygon = R.pipe(
      R.prop('polygon'),
      R.equals({}),
      R.not,
    );
    const prepareArray = R.pipe(
      R.filter(isNotEmptyPolygon),
      R.map(translator.moveTo),
    );
    const locationsData = prepareArray(gameModel.get('locationRecords'));
    R.map(this.createAndAddLocation(setLocationEventHandlers, t), locationsData);
    // this.updateLocationsView();
  }

  createAndAddLocation = (setLocationEventHandlers, t) => R.pipe(
    this.createLocation(t),
    setLocationEventHandlers,
    this.group.addLayer.bind(this.group),
  );

  // eslint-disable-next-line class-methods-use-this
  createLocation = R.curry((t, { polygon, label, id }) => {
    const loc = L.polygon([polygon[0]], {
      id, label,
    });
    loc.on('mouseover', function (e) {
      loc.bindTooltip(t('locationTooltip', { name: this.options.label }));
      this.openTooltip();
    });
    loc.on('mouseout', function (e) {
      this.closeTooltip();
    });
    return loc;
  })

  onPostLocationRecord(locationRecord, setLocationEventHandlers, t) {
    this.createAndAddLocation(setLocationEventHandlers, t)(locationRecord);
  }

  onPutLocationRecord(locationRecord) {
    const loc = this.group.getLayers().find((loc2) => loc2.options.id === locationRecord.id);
    loc.setLatLngs([locationRecord.polygon[0]]);
  }

  onRemoveLocation(location, gameModel) {
    this.group.removeLayer(location);
    gameModel.execute({
      type: 'deleteLocationRecord',
      id: location.options.id,
    });
    // this.updateLocationsView();
  }

  removeMarkerFromLocations(markerId, gameModel) {
    this.group.eachLayer((loc2) => {
      const props = loc2.options;
      if (R.contains(markerId, props.markers)) {
        props.markers = props.markers.filter((el) => el !== markerId);
        gameModel.execute({
          type: 'putLocation',
          id: props.id,
          props: {
            markers: R.clone(props.markers),
          },
        });
      }
    });
  }

  onLocMarkerChange(action, markerId, gameModel, locId) {
    this.removeMarkerFromLocations(markerId, gameModel);
    const loc = this.group.getLayers().find((loc2) => loc2.options.id === locId);
    const props = loc.options;
    if (action === 'add') {
      props.markers = [...props.markers];
      props.markers.push(markerId);
    } else if (action === 'remove') {
      props.markers = props.markers.filter((el) => el !== markerId);
    } else {
      console.error(`Unknown action ${action}`);
    }
    gameModel.execute({
      type: 'putLocation',
      id: locId,
      props: {
        markers: R.clone(props.markers),
      },
    });
    // this.updateLocationsView();
    return props;
  }

  onLocationChange(prop, value, gameModel, id) {
    const location = this.group.getLayers().find((loc) => loc.options.id === id);
    if (prop === 'label') {
      location.options[prop] = value;
      gameModel.execute({
        type: 'putLocationRecord',
        id,
        props: {
          [prop]: value,
        },
      });
    }
  }

  // updateLocationsView() {
  //   this.group.getLayers().forEach((loc, i) => {
  //     const { markers, manaLevel } = loc.options;
  //     loc.setStyle({
  //       color: markers.length > 0 ? 'blue' : 'red',
  //       // fillColor: COLOR_PALETTE[i % COLOR_PALETTE.length].color.background,
  //       // fillOpacity: 0.5,
  //       fillOpacity: 0.8,
  //       // eslint-disable-next-line no-nested-ternary
  //       // fillColor: COLOR_PALETTE[manaLevel === 'low' ? 0
  //       //   : (manaLevel === 'normal' ? 12
  //       //     : 16)].color.background,
  //       // eslint-disable-next-line no-nested-ternary
  //       fillColor: manaLevel === 'low' ? 'hsla(233, 0%, 50%, 1)'
  //         : (manaLevel === 'normal' ? 'hsla(233, 50%, 50%, 1)'
  //           : 'hsla(233, 100%, 50%, 1)'),
  //       // fillOpacity:
  //       //   // eslint-disable-next-line no-nested-ternary
  //       //   manaLevel === 'low' ? 0.2
  //       //     : (manaLevel === 'normal' ? 0.6
  //       //       : 1)
  //       // ,
  //     });
  //   });
  // }
}
