import {
  LOAD_PATHS,
  LOAD_DATA,
  LOAD_REGION_DATA,
  ADD_REGION_DATA,
  GET_ELLIPSES,
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
};

export default function(state = initialState, action) {
  const {
    geographyPaths,
    regionMarkers,
    capitalMarkers,
    populationData,
    regionDataSets,
    mapViewRegionIds,
    mapViewCountryIds,
  } = action;

  switch (action.type) {
    case LOAD_PATHS:
      return {
        ...state,
        geographyPaths: action.geographyPaths,
      };
    case LOAD_DATA:
      return {
        ...state,
        geographyPaths,
        regionMarkers,
        capitalMarkers,
        populationData,
        regionDataSets,
        mapViewRegionIds,
        mapViewCountryIds,
      };
    case LOAD_REGION_DATA:
      return {
        ...state,
        geographyPaths,
        regionMarkers,
        capitalMarkers,
      };
    case ADD_REGION_DATA:
      return {
        ...state,
        regionDataSets,
        mapViewRegionIds,
      };
    case GET_ELLIPSES:
      return {
        ...state,
        regionEllipsesData: action.regionEllipsesData,
      };
    default:
      return state;
  }
}
