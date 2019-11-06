import { isMobile } from 'react-device-detect';
import * as types from '../actions/types';
import { mapConfig } from '../assets/mapViewSettings';

const tooltipLocalStorage = localStorage.getItem('tooltip');
const userTooltip =
  tooltipLocalStorage !== null ? tooltipLocalStorage === 'true' : !isMobile;

const initialState = {
  center: [10, 0],
  defaultCenter: [10, 0],
  zoom: 1,
  defaultZoom: 1,
  zoomFactor: 2,
  scale: 210,
  dimensions: [980, 551],
  orientation: 'default',
  disableOptimization: false,
  filterRegions: [],
  filterRegionsStyles: {},
  currentMap: 'World',
  subRegionName: 'country',
  regionKey: 'alpha3Code',
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
  tooltip: userTooltip,
  slider: false,
  sliderYear: 2018,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.LOAD_DATA:
    case types.LOAD_PATHS:
    case types.REGION_CLICK:
    case types.QUIZ_ANSWER:
    case types.SET_QUIZ_STATE:
    case types.QUIZ_CLOSE:
    case types.SET_LABEL:
      return {
        ...state,
        disableOptimization: true,
      };
    case types.SET_REGION_CHECKBOX:
      const { checkedRegions, filterRegions } = action;
      return {
        ...state,
        disableOptimization: true,
        checkedRegions,
        filterRegions,
      };
    case types.CHANGE_MAP_VIEW:
      const { center, zoom } = mapConfig[action.regionName];
      return {
        ...state,
        zoom,
        center,
        defaultZoom: zoom,
        defaultCenter: center,
        filterRegions: action.filterRegions,
        currentMap: action.regionName,
        disableOptimization: true,
      };
    case types.REGION_SELECT:
      return {
        ...state,
        zoom: action.zoom,
        center: action.center,
        disableOptimization: true,
      };
    case types.DISABLE_OPT:
      return {
        ...state,
        filterRegionsStyles: action.filterRegionsStyles,
        disableOptimization: false,
      };
    case types.ZOOM_MAP:
      return {
        ...state,
        zoom: state.zoom * action.factor,
      };
    case types.RECENTER_MAP:
      return {
        ...state,
        center: [
          state.defaultCenter[0],
          state.defaultCenter[1] + Math.random() / 1000,
        ],
        zoom: state.defaultZoom,
      };
    case types.SET_MAP:
      return {
        ...state,
        dimensions: action.dimensions,
        orientation: action.orientation,
        zoomFactor: action.zoomFactor,
        disableOptimization: true,
      };
    case types.MOVE_CENTER:
      return {
        ...state,
        center: action.center,
      };
    case types.SET_CHOROPLETH:
      return {
        ...state,
        choropleth: action.choropleth,
        disableOptimization: true,
      };
    case types.SET_CHORO_YEAR:
      return {
        ...state,
        sliderYear: action.value,
        disableOptimization: true,
      };
    case types.TOGGLE_TOOLTIP:
      localStorage.setItem('tooltip', (!state.tooltip).toString());
      return {
        ...state,
        tooltip: !state.tooltip,
        disableOptimization: true,
      };
    case types.TOGGLE_SLIDER:
      return {
        ...state,
        slider: action.value,
      };
    case types.LOAD_REGION_DATA:
      const { subRegionName } = action;
      const regionKey = subRegionName === 'country' ? 'alpha3Code' : 'regionID';
      return {
        ...state,
        subRegionName,
        regionKey,
      };
    default:
      return state;
  }
}
