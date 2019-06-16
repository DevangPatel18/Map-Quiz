import {
  CONTINENT_SELECT,
  REGION_SELECT,
  DISABLE_OPT,
  RECENTER_MAP,
  SET_MAP,
  LOAD_DATA,
} from '../actions/types';

const initialState = {
  center: [10, 0],
  defaultCenter: [10, 0],
  zoom: 1,
  defaultZoom: 1,
  zoomFactor: 2,
  scale: 210,
  dimensions: [980, 551],
  disableOptimization: false,
  filterRegions: [],
  checkedRegions: {
    'North & Central America': true,
    'South America': true,
    Caribbean: true,
    Europe: true,
    Africa: true,
    Asia: true,
    Oceania: true,
  },
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOAD_DATA:
      return {
        ...state,
        disableOptimization: true,
      };
    case DISABLE_OPT:
      return {
        ...state,
        disableOptimization: false,
      };
    default:
      return state;
  }
}
