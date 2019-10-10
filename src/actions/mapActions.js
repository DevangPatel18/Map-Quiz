import { actions } from 'redux-tooltip';
import {
  getGeoPathCenterAndZoom,
  getOrientation,
  getNewCenter,
  getChoroplethTooltipContent,
} from '../helpers/mapActionHelpers';
import * as types from './types';
import store from '../store';

const { show, hide } = actions;

export const setRegionCheckbox = regionName => async dispatch => {
  const checkedRegions = { ...store.getState().map.checkedRegions };
  const { mapViewCountryIds } = store.getState().data;

  if (regionName) {
    checkedRegions[regionName] = !checkedRegions[regionName];
  }

  const filterRegions = Object.keys(checkedRegions)
    .filter(region => checkedRegions[region])
    .map(region => mapViewCountryIds[region])
    .reduce((a, b) => a.concat(b), []);

  await dispatch({
    type: types.SET_REGION_CHECKBOX,
    checkedRegions,
    filterRegions,
  });
  dispatch({ type: types.DISABLE_OPT });
};

export const regionSelect = regionName => async dispatch => {
  const { checkedRegions } = store.getState().map;
  const { mapViewRegionIds, mapViewCountryIds } = store.getState().data;
  await dispatch({
    type: types.CHANGE_MAP_VIEW,
    regionName,
    filterRegions: mapViewRegionIds[regionName] || [],
  });
  dispatch({ type: types.DISABLE_OPT });
  if (regionName === 'World') {
    const filterRegions = Object.keys(checkedRegions)
      .filter(region => checkedRegions[region])
      .map(region => mapViewCountryIds[region])
      .reduce((a, b) => a.concat(b), []);
    await dispatch({
      type: types.SET_REGION_CHECKBOX,
      checkedRegions,
      filterRegions,
    });
    dispatch({ type: types.DISABLE_OPT });
  }
};

export const regionZoom = event => async dispatch => {
  const { geographyPaths } = store.getState().data;
  const geographyPath = geographyPaths.find(
    x => x.properties.name === event.target.innerText
  );

  if (!geographyPath) {
    return;
  }

  const { properties } = geographyPath;
  const { center, zoom } = getGeoPathCenterAndZoom(geographyPath);
  await dispatch({
    type: types.REGION_SELECT,
    selectedProperties: properties,
    center,
    zoom,
  });
  dispatch({ type: types.DISABLE_OPT });
};

export const zoomMap = factor => dispatch => {
  const { zoom } = store.getState().map;
  dispatch({ type: types.ZOOM_MAP, zoom: zoom * factor });
};

export const recenterMap = () => dispatch => {
  const { defaultCenter, defaultZoom } = store.getState().map;
  dispatch({
    type: types.RECENTER_MAP,
    center: [defaultCenter[0], defaultCenter[1] + Math.random() / 1000],
    zoom: defaultZoom,
  });
};

export const setMap = ({ dimensions, zoomFactor }) => async dispatch => {
  const orientation = getOrientation(dimensions[0]);
  await dispatch({
    type: types.SET_MAP,
    dimensions,
    orientation,
    zoomFactor,
  });
  dispatch({ type: types.DISABLE_OPT });
};

export const moveMap = (event, data) => async dispatch => {
  const direction = data.value;
  const newCenter = getNewCenter(direction);
  await dispatch({
    type: types.MOVE_CENTER,
    center: newCenter,
  });
  dispatch({ type: types.DISABLE_OPT });
};

export const setChoropleth = choropleth => async dispatch => {
  await dispatch({ type: types.SET_CHOROPLETH, choropleth });
  dispatch({ type: types.DISABLE_OPT });
};

export const tooltipMove = (geography, evt) => dispatch => {
  const { choropleth } = store.getState().map;
  const { name } = geography.properties;
  let content = name;
  if (choropleth !== 'None') {
    content += getChoroplethTooltipContent(geography);
  }
  const x = evt.clientX;
  const y = evt.clientY + window.pageYOffset;
  dispatch(
    show({
      origin: { x, y },
      content,
    })
  );
};

export const tooltipLeave = () => dispatch => {
  dispatch(hide());
};

export const tooltipToggle = () => async dispatch => {
  await dispatch({ type: types.TOGGLE_TOOLTIP });
  dispatch({ type: types.DISABLE_OPT });
};

export const sliderSet = value => dispatch => {
  dispatch({ type: types.TOGGLE_SLIDER, value });
};

export const setChoroYear = value => async dispatch => {
  await dispatch({ type: types.SET_CHORO_YEAR, value });
  dispatch({ type: types.DISABLE_OPT });
};
