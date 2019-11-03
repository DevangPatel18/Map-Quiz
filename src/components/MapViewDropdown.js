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
  handleDropdown = async (event, { value }) => {
    const {
      data,
      regionSelect,
      getRegionEllipses,
      getRegionSearchOptions,
    } = this.props;
    const { regionEllipsesData, regionSearchList } = data;

    await this.handleMapDataUpdate(value);
    regionSelect(value);
    if (!regionEllipsesData[value]) {
      getRegionEllipses(value);
    }
    if (!regionSearchList[value]) {
      getRegionSearchOptions(value);
    }
  };

  handleMapDataUpdate = async value => {
    const { checkMapDataUpdate } = this.props;
    await checkMapDataUpdate(value);
  };

  render() {
    return (
      <div className="mapViewDropdown">
        <Dropdown
          placeholder="Select Region Quiz"
          fluid
          selection
          options={regionOptions}
          onChange={this.handleDropdown}
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
