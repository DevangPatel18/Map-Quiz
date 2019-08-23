import { isMobile } from 'react-device-detect';
import {
  SET_REGION_CHECKBOX,
  CHANGE_MAP_VIEW,
  REGION_SELECT,
  DISABLE_OPT,
  ZOOM_MAP,
  RECENTER_MAP,
  SET_MAP,
  LOAD_DATA,
  LOAD_PATHS,
  REGION_CLICK,
  QUIZ_ANSWER,
  MOVE_CENTER,
  SET_QUIZ_STATE,
  QUIZ_CLOSE,
  SET_CHOROPLETH,
  SET_CHORO_YEAR,
  SET_LABEL,
  TOGGLE_TOOLTIP,
  TOGGLE_SLIDER,
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
  slider: false,
  sliderYear: 2018,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOAD_DATA:
    case LOAD_PATHS:
    case REGION_CLICK:
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
    case CHANGE_MAP_VIEW:
      return {
        ...state,
        ...action.map,
        disableOptimization: true,
      };
    case REGION_SELECT:
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
    case SET_CHORO_YEAR:
      return {
        ...state,
        sliderYear: action.value,
        disableOptimization: true,
      };
    case TOGGLE_TOOLTIP:
      return {
        ...state,
        tooltip: !state.tooltip,
        disableOptimization: true,
      };
    case TOGGLE_SLIDER:
      return {
        ...state,
        slider: action.value,
      };
    default:
      return state;
  }
}
