import { LOAD_PATHS, LOAD_DATA } from '../actions/types';

const initialState = {
  geographyPaths: [],
  countryMarkers: [],
  capitalMarkers: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOAD_PATHS:
      return {
        ...state,
        geographyPaths: action.geographyPaths,
      };
    case LOAD_DATA:
      const { geographyPaths, countryMarkers, capitalMarkers } = action;
      return {
        ...state,
        geographyPaths,
        countryMarkers,
        capitalMarkers,
      };
    default:
      return state;
  }
}