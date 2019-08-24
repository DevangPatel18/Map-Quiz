import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { regionSelect, checkMapDataUpdate } from '../actions/mapActions';
import { alpha3Codes } from '../assets/regionAlpha3Codes';
import '../App.css';

const regionOptions = Object.keys(alpha3Codes).map(regionText => ({
  text: regionText,
  value: regionText,
}));

const RegionButtons = ({ regionSelect, checkMapDataUpdate }) => (
  <div className="regionButtons">
    <Dropdown
      placeholder="Select Region Quiz"
      fluid
      selection
      options={regionOptions}
      onChange={(e, data) => {
        checkMapDataUpdate(data.value);
        regionSelect(data.value);
      }}
    />
  </div>
);

export default connect(
  null,
  { regionSelect, checkMapDataUpdate }
)(RegionButtons);
