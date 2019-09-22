import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { regionSelect, checkMapDataUpdate } from '../actions/mapActions';
import { getRegionEllipses } from '../actions/dataActions';
import { mapViewsList } from '../assets/mapViewSettings';
import '../App.css';

const regionOptions = mapViewsList.map(regionText => ({
  text: regionText,
  value: regionText,
}));

const MapViewDropdown = props => {
  const { data, regionSelect, checkMapDataUpdate, getRegionEllipses } = props;
  const { regionEllipsesData } = data;

  return (
    <div className="mapViewDropdown">
      <Dropdown
        placeholder="Select Region Quiz"
        fluid
        selection
        options={regionOptions}
        onChange={async (e, data) => {
          await checkMapDataUpdate(data.value);
          regionSelect(data.value);
          if (!regionEllipsesData[data.value]) {
            getRegionEllipses(data.value);
          }
        }}
      />
    </div>
  );
};

const mapStateToProps = state => ({
  data: state.data,
});

export default connect(
  mapStateToProps,
  { regionSelect, checkMapDataUpdate, getRegionEllipses }
)(MapViewDropdown);
