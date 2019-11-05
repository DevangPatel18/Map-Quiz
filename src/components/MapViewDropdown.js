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
  handleDropdown = async (event, dropdownDataObj) => {
    const nextMap = dropdownDataObj.value;
    const {
      data,
      regionSelect,
      getRegionEllipses,
      getRegionSearchOptions,
    } = this.props;
    const { regionEllipsesData, regionSearchList } = data;

    await this.handleMapDataUpdate(nextMap);
    regionSelect(nextMap);
    if (!regionEllipsesData[nextMap]) {
      getRegionEllipses(nextMap);
    }
    if (!regionSearchList[nextMap]) {
      getRegionSearchOptions(nextMap);
    }
  };

  handleMapDataUpdate = async nextMap => {
    if (checkMapViewsBetweenWorldRegions(nextMap)) return;
    const { data, processNewRegionDataSet, loadRegionDataSet } = this.props;
    const { regionDataSets } = data;
    const regionDataSetKey = worldRegions.includes(nextMap) ? 'World' : nextMap;
    if (!regionDataSets[regionDataSetKey]) {
      await processNewRegionDataSet(nextMap);
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
