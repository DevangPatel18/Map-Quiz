import React from 'react';
import { Dropdown } from 'semantic-ui-react';
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

const RegionButtons = props => (
  <div className="regionButtons">
    <Dropdown
      placeholder="Select Region Quiz"
      fluid
      selection
      options={regions}
      onChange={(e) => {
        switch (e.target.innerText) {
          case 'World': props.regionFunc('world'); break;
          case 'North & Central America': props.regionFunc('North & Central America'); break;
          case 'South America': props.regionFunc('South America'); break;
          case 'Caribbean': props.regionFunc('Caribbean'); break;
          case 'Africa': props.regionFunc('Africa'); break;
          case 'Europe': props.regionFunc('Europe'); break;
          case 'Asia': props.regionFunc('Asia'); break;
          case 'Oceania': props.regionFunc('Oceania'); break;
          default:
        }
      }}
    />
  </div>
);

export default RegionButtons;
