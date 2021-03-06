import React, { Component } from 'react';
import './LocationPopup3.css';
import * as R from 'ramda';

import ReactDOM from 'react-dom';
import classNames from 'classnames';

// import { LocationPopup3PropTypes } from '../../types';

export class LocationPopup3 extends Component {
  // static propTypes = LocationPopup3PropTypes;

  constructor(props) {
    super(props);
    this.state = {
      // unattachedList: [],
      // attachedList: [],
      // selectedAddMarker: null,
      // selectedRemoveMarker: null,
    };
  }

  componentDidMount = () => {
    // this.updateComponentState();
  }

  componentDidUpdate = (prevProps) => {
    const {
      label, allBeacons, attachedMarkers, manaLevel,
    } = this.props;
    if (label === prevProps.label
    // && manaLevel === prevProps.manaLevel
    // && R.equals(attachedMarkers, prevProps.attachedMarkers)
    // && R.equals(allBeacons, prevProps.allBeacons)
    ) {

    }
    // this.updateComponentState();
  }

  _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.props.onClose();
    }
  }

  // eslint-disable-next-line max-lines-per-function
  makeContent() {
    const {
      // unattachedList, attachedList, selectedAddMarker, selectedRemoveMarker,
    } = this.state;
    const {
      label, onChange, t, manaLevel,
    } = this.props;

    const common = 'w-33p font-bold py-2 px-4 focus:outline-none focus:shadow-outline';
    const selectedButton = 'bg-blue-500 hover:bg-blue-700 text-white';
    const unselectedButton = 'bg-gray-300 hover:bg-gray-400 text-gray-800';
    return (
      <div className="LocationPopup">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="locationName"
          >
            {t('locationName')}
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="locationName"
            type="text"
            value={label}
            onChange={onChange('label')}
            onKeyPress={this._handleKeyDown}
          />
        </div>
      </div>
    );
  }

  render() {
    const { locationPopupDom } = this.props;
    return ReactDOM.createPortal(
      this.makeContent(),
      locationPopupDom,
    );
  }
}
