import {
  LOAD_PATHS,
  LOAD_DATA,
  LOAD_REGION_DATA,
  ADD_REGION_DATA,
  GET_ELLIPSES,
  GET_REGION_SEARCH_LIST,
} from '../actions/types';

const initialState = {
  geographyPaths: [],
  regionMarkers: [],
  capitalMarkers: [],
  populationData: {},
  regionDataSets: {},
  regionEllipsesData: {},
  mapViewRegionIds: {},
  mapViewCountryIds: {},
  regionSearchList: {},
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOAD_PATHS:
      return {
        ...state,
        geographyPaths: action.geographyPaths,
      };
    case LOAD_DATA:
      return {
        ...state,
        geographyPaths: action.geographyPaths,
        regionMarkers: action.regionMarkers,
        capitalMarkers: action.capitalMarkers,
        populationData: action.populationData,
        regionDataSets: action.regionDataSets,
        mapViewRegionIds: action.mapViewRegionIds,
        mapViewCountryIds: action.mapViewCountryIds,
      };
    case LOAD_REGION_DATA:
      const updatedRegion = state.regionDataSets[action.currentMap];
      return {
        ...state,
        geographyPaths: updatedRegion.geographyPaths,
        regionMarkers: updatedRegion.regionMarkers,
        capitalMarkers: updatedRegion.capitalMarkers,
      };
    case ADD_REGION_DATA:
      return {
        ...state,
        regionDataSets: {
          ...state.regionDataSets,
          [action.regionName]: action.newRegionDataSet,
        },
        mapViewRegionIds: {
          ...state.mapViewRegionIds,
          [action.regionName]: action.newRegionIdList,
        },
      };
    case GET_ELLIPSES:
      return {
        ...state,
        regionEllipsesData: {
          ...state.regionEllipsesData,
          [action.currentMap]: action.markersArray,
        },
      };
    case GET_REGION_SEARCH_LIST:
      return {
        ...state,
        regionSearchList: {
          ...state.regionSearchList,
          [action.currentMap]: action.regionSearchOptions,
        },
      };
    default:
      return state;
  }
}
