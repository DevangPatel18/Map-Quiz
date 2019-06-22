import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { regionSelect } from '../actions/mapActions';
import '../App.css';

const regions = [
  { text: 'World', value: 'World' },
  { text: 'North & Central America', value: 'North & Central America' },
  { text: 'South America', value: 'South America' },
  { text: 'Caribbean', value: 'Caribbean' },
  { text: 'Africa', value: 'Africa' },
  { text: 'Europe', value: 'Europe' },
  { text: 'Asia', value: 'Asia' },
  { text: 'Oceania', value: 'Oceania' },
];

const RegionButtons = ({ regionSelect }) => (
  <div className="regionButtons">
    <Dropdown
      placeholder="Select Region Quiz"
      fluid
      selection
      options={regions}
      onChange={e => {
        regionSelect(e.target.innerText);
      }}
    />
  </div>
);

export default connect(
  null,
  { regionSelect }
)(RegionButtons);
