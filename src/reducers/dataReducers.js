import * as types from '../actions/types';

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
  choroplethParams: {},
  regionProfiles: {},
  loadingData: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.LOAD_PATHS:
      return {
        ...state,
        geographyPaths: action.geographyPaths,
      };
    case types.LOAD_DATA:
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
    case types.LOAD_REGION_DATA:
      const updatedRegion = state.regionDataSets[action.currentMap];
      return {
        ...state,
        geographyPaths: updatedRegion.geographyPaths,
        regionMarkers: updatedRegion.regionMarkers,
        capitalMarkers: updatedRegion.capitalMarkers,
      };
    case types.ADD_REGION_DATA:
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
    case types.GET_ELLIPSES:
      return {
        ...state,
        regionEllipsesData: {
          ...state.regionEllipsesData,
          [action.currentMap]: action.markersArray,
        },
      };
    case types.GET_REGION_SEARCH_LIST:
      return {
        ...state,
        regionSearchList: {
          ...state.regionSearchList,
          [action.currentMap]: action.regionSearchOptions,
        },
      };
    case types.SET_CHOROPLETH_PARAMS:
      return {
        ...state,
        choroplethParams: {
          ...state.choroplethParams,
          [action.currentMap]: {
            ...state.choroplethParams[action.currentMap],
            [action.attribute]: {
              regionStyles: action.regionStyles,
              bounds: action.bounds,
            },
          },
        },
      };
    case types.LOADING_DATA:
      return {
        ...state,
        loadingData: action.value,
      };
    case types.ADD_REGION_PROFILE:
      return {
        ...state,
        regionProfiles: {
          ...state.regionProfiles,
          [action.regionID]: {
            ...action.regionProfileData,
          },
        },
      };
    default:
      return state;
  }
}
