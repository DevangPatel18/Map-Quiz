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
  regionStyles: {},
  currentMap: 'World',
  subRegionName: 'country',
  checkedRegions: [
    'North & Central America',
    'South America',
    'Caribbean',
    'Europe',
    'Africa',
    'Asia',
    'Oceania',
  ],
  choropleth: 'None',
  selectedRegions: [],
  tooltip: userTooltip,
  slider: false,
  sliderYear: 2018,
  modalRegionID: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.LOAD_PATHS:
    case types.REGION_CLICK:
    case types.QUIZ_ANSWER:
    case types.SET_QUIZ_STATE:
    case types.QUIZ_GIVE_UP:
    case types.QUIZ_CLOSE:
    case types.SET_LABEL:
      return {
        ...state,
        disableOptimization: true,
      };
    case types.LOAD_DATA:
      return {
        ...state,
        disableOptimization: true,
        regionStyles: action.regionStyles,
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
        choropleth: 'None',
        slider: false,
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
    case types.UPDATE_MAP:
      return {
        ...state,
        regionStyles: action.regionStyles,
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
      return {
        ...state,
        subRegionName,
      };
    case types.HIGHLIGHT_REGIONS:
      return {
        ...state,
        selectedRegions: action.selectedRegions,
        regionStyles: action.regionStyles,
        disableOptimization: true,
      };
    case types.SET_REGION_MODAL:
      return {
        ...state,
        modalRegionID: action.regionID,
      };
    default:
      return state;
  }
}
