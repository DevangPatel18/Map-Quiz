import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { regionSelect } from '../actions/mapActions';
import {
  processNewRegionDataSet,
  loadRegionDataSet,
  getRegionEllipses,
  getRegionSearchOptions,
} from '../actions/dataActions';
import { checkMapViewsBetweenWorldRegions } from '../helpers/dataActionHelpers';
import { mapViewsList, worldRegions } from '../assets/mapViewSettings';
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
    if (checkMapViewsBetweenWorldRegions(value)) return;
    const { data, processNewRegionDataSet, loadRegionDataSet } = this.props;
    const { regionDataSets } = data;
    const regionDataSetKey = worldRegions.includes(value) ? 'World' : value;
    if (!regionDataSets[regionDataSetKey]) {
      await processNewRegionDataSet(value);
    }
    await loadRegionDataSet(regionDataSetKey);
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
    processNewRegionDataSet,
    loadRegionDataSet,
    getRegionEllipses,
    getRegionSearchOptions,
  }
)(MapViewDropdown);
