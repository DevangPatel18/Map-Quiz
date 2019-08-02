import { isMobile } from 'react-device-detect';
import {
  SET_REGION_CHECKBOX,
  REGION_SELECT,
  COUNTRY_SELECT,
  DISABLE_OPT,
  ZOOM_MAP,
  RECENTER_MAP,
  SET_MAP,
  LOAD_DATA,
  LOAD_PATHS,
  COUNTRY_CLICK,
  QUIZ_ANSWER,
  MOVE_CENTER,
  SET_QUIZ_STATE,
  QUIZ_CLOSE,
  SET_CHOROPLETH,
  SET_LABEL,
  TOGGLE_TOOLTIP,
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
  currentMap: 'World',
  checkedRegions: {
    'North & Central America': true,
    'South America': true,
    Caribbean: true,
    Europe: true,
    Africa: true,
    Asia: true,
    Oceania: true,
  },
  choropleth: 'None',
  tooltip: !isMobile,
  sliderToggle: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOAD_DATA:
    case LOAD_PATHS:
    case COUNTRY_CLICK:
    case QUIZ_ANSWER:
    case SET_QUIZ_STATE:
    case QUIZ_CLOSE:
    case SET_LABEL:
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
    case COUNTRY_SELECT:
      return {
        ...state,
        zoom: action.zoom,
        center: action.center,
        disableOptimization: true,
      };
    case DISABLE_OPT:
      return {
        ...state,
        disableOptimization: false,
      };
    case ZOOM_MAP:
      return {
        ...state,
        zoom: action.zoom,
      };
    case RECENTER_MAP:
      return {
        ...state,
        center: action.center,
        zoom: action.zoom,
      };
    case SET_MAP:
      return {
        ...state,
        dimensions: action.dimensions,
        zoomFactor: action.zoomFactor,
        disableOptimization: true,
      };
    case MOVE_CENTER:
      return {
        ...state,
        center: action.center,
      };
    case SET_CHOROPLETH:
      return {
        ...state,
        choropleth: action.choropleth,
        disableOptimization: true,
      };
    case TOGGLE_TOOLTIP:
      return {
        ...state,
        tooltip: !state.tooltip,
        disableOptimization: true,
      };
    default:
      return state;
  }
}
