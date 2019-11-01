import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { regionSelect } from '../actions/mapActions';
import {
  checkMapDataUpdate,
  getRegionEllipses,
  getRegionSearchOptions,
} from '../actions/dataActions';
import { mapViewsList } from '../assets/mapViewSettings';
import '../App.css';

const regionOptions = mapViewsList.map(regionText => ({
  text: regionText,
  value: regionText,
}));

class MapViewDropdown extends Component {
  render() {
    const {
      data,
      regionSelect,
      checkMapDataUpdate,
      getRegionEllipses,
      getRegionSearchOptions,
    } = this.props;
    const { regionEllipsesData, regionSearchList } = data;

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
            if (!regionSearchList[data.value]) {
              getRegionSearchOptions(data.value);
            }
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.data,
});

export default connect(
  mapStateToProps,
  {
    regionSelect,
    checkMapDataUpdate,
    getRegionEllipses,
    getRegionSearchOptions,
  }
)(MapViewDropdown);
