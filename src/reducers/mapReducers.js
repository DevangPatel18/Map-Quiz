import {
  SET_REGION_CHECKBOX,
  REGION_SELECT,
  DISABLE_OPT,
  RECENTER_MAP,
  SET_MAP,
  LOAD_DATA,
  LOAD_PATHS,
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
    case LOAD_PATHS:
      return {
        ...state,
        disableOptimization: true,
      };
    case SET_REGION_CHECKBOX:
      const { checkedRegions, filterRegions } = action;
      return {
        ...state,
        disableOptimization: true,
        checkedRegions,
        filterRegions,
      };
    case REGION_SELECT:
      return {
        ...state,
        ...action.map,
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
