import { INFO_TAB, LOAD_PATHS, LOAD_DATA } from '../actions/types';

const initialState = {
  geographyPaths: [],
  countryMarkers: [],
  capitalMarkers: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
