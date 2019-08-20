import { LOAD_PATHS, LOAD_DATA, LOAD_REGION_DATA } from '../actions/types';

const initialState = {
  geographyPaths: [],
  countryMarkers: [],
  capitalMarkers: [],
  populationData: {},
  regionDataSets: {},
};

export default function(state = initialState, action) {
  const {
    geographyPaths,
    countryMarkers,
    capitalMarkers,
    populationData,
    regionDataSets,
    usMap,
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
        countryMarkers,
        capitalMarkers,
        populationData,
        regionDataSets,
        usMap,
      };
    case LOAD_REGION_DATA:
      return {
        ...state,
        geographyPaths,
        countryMarkers,
        capitalMarkers,
        regionDataSets,
      };
    default:
      return state;
  }
}
