import { actions } from 'redux-tooltip';
import {
  getGeoPathCenterAndZoom,
  getOrientation,
  getNewCenter,
  getChoroplethTooltipContent,
} from '../helpers/mapActionHelpers';
import { getRegionStyles } from '../helpers/MapHelpers';
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
  await dispatch({ type: types.UPDATE_MAP, regionStyles: getRegionStyles() });
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
  await dispatch({ type: types.UPDATE_MAP, regionStyles: getRegionStyles() });
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
    await dispatch({ type: types.UPDATE_MAP, regionStyles: getRegionStyles() });
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
  await dispatch({ type: types.UPDATE_MAP, regionStyles: getRegionStyles() });
  dispatch({ type: types.DISABLE_OPT });
};

export const zoomMap = factor => dispatch => {
  dispatch({ type: types.ZOOM_MAP, factor });
};

export const recenterMap = () => dispatch => {
  dispatch({ type: types.RECENTER_MAP });
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
  await dispatch({ type: types.UPDATE_MAP, regionStyles: getRegionStyles() });
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
  await dispatch({ type: types.UPDATE_MAP, regionStyles: getRegionStyles() });
  dispatch({ type: types.DISABLE_OPT });
};
