import { LOAD_PATHS, LOAD_DATA, LOAD_REGION_DATA } from '../actions/types';

const initialState = {
  geographyPaths: [],
  regionMarkers: [],
  capitalMarkers: [],
  populationData: {},
  regionDataSets: {},
};

export default function(state = initialState, action) {
  const {
    geographyPaths,
    regionMarkers,
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
        regionMarkers,
        capitalMarkers,
        populationData,
        regionDataSets,
        usMap,
      };
    case LOAD_REGION_DATA:
      return {
        ...state,
        geographyPaths,
        regionMarkers,
        capitalMarkers,
        regionDataSets,
      };
    default:
      return state;
  }
}
