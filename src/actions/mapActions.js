import { actions } from 'redux-tooltip';
import {
  getStatesForRegionSelect,
  getUpdatedRegionDataSets,
  getUpdatedMapViewRegionIds,
  getGeoPathCenterAndZoom,
  getOrientation,
  checkMapViewsBetweenWorldRegions,
  getNewCenter,
  getChoroplethTooltipContent,
} from '../helpers/mapActionHelpers';
import {
  CHANGE_MAP_VIEW,
  REGION_SELECT,
  SET_REGION_CHECKBOX,
  DISABLE_OPT,
  ZOOM_MAP,
  RECENTER_MAP,
  SET_MAP,
  MOVE_CENTER,
  SET_CHOROPLETH,
  SET_CHORO_YEAR,
  TOGGLE_TOOLTIP,
  TOGGLE_SLIDER,
  LOAD_REGION_DATA,
  ADD_REGION_DATA,
} from './types';
import store from '../store';
import { worldRegions } from '../assets/mapViewSettings';

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

  await dispatch({ type: SET_REGION_CHECKBOX, checkedRegions, filterRegions });
  dispatch({ type: DISABLE_OPT });
};

export const regionSelect = regionName => async dispatch => {
  const { checkedRegions } = store.getState().map;
  const { mapViewCountryIds } = store.getState().data;
  const { mapAttributes, quizAttributes } = getStatesForRegionSelect(
    regionName
  );

  await dispatch({ type: CHANGE_MAP_VIEW, mapAttributes, quizAttributes });
  dispatch({ type: DISABLE_OPT });
  if (regionName === 'World') {
    const filterRegions = Object.keys(checkedRegions)
      .filter(region => checkedRegions[region])
      .map(region => mapViewCountryIds[region])
      .reduce((a, b) => a.concat(b), []);
    await dispatch({
      type: SET_REGION_CHECKBOX,
      checkedRegions,
      filterRegions,
    });
    dispatch({ type: DISABLE_OPT });
  }
};

export const checkMapDataUpdate = regionName => async dispatch => {
  if (checkMapViewsBetweenWorldRegions(regionName)) return;

  let { regionDataSets } = store.getState().data;
  const regionDataSetKey = worldRegions.includes(regionName)
    ? 'World'
    : regionName;
  if (!regionDataSets[regionDataSetKey]) {
    const updatedRegionDataSets = await getUpdatedRegionDataSets(
      regionDataSetKey
    );
    const { geographyPaths } = updatedRegionDataSets[regionDataSetKey];
    const updatedMapViewRegionIds = getUpdatedMapViewRegionIds(
      geographyPaths,
      regionDataSetKey
    );

    await dispatch({
      type: ADD_REGION_DATA,
      regionDataSets: updatedRegionDataSets,
      mapViewRegionIds: updatedMapViewRegionIds,
    });
    regionDataSets = store.getState().data.regionDataSets;
  }
  const regionDataSet = regionDataSets[regionDataSetKey];

  await dispatch({
    type: LOAD_REGION_DATA,
    ...regionDataSet,
  });
};

export const regionZoom = geographyPath => async dispatch => {
  const { properties } = geographyPath;
  const { center, zoom } = getGeoPathCenterAndZoom(geographyPath);
  await dispatch({
    type: REGION_SELECT,
    selectedProperties: properties,
    center,
    zoom,
  });
  dispatch({ type: DISABLE_OPT });
};

export const zoomMap = factor => dispatch => {
  const { zoom } = store.getState().map;
  dispatch({ type: ZOOM_MAP, zoom: zoom * factor });
};

export const recenterMap = () => dispatch => {
  const { defaultCenter, defaultZoom } = store.getState().map;
  dispatch({
    type: RECENTER_MAP,
    center: [defaultCenter[0], defaultCenter[1] + Math.random() / 1000],
    zoom: defaultZoom,
  });
};

export const setMap = ({ dimensions, zoomFactor }) => async dispatch => {
  const orientation = getOrientation(dimensions[0]);
  await dispatch({
    type: SET_MAP,
    dimensions,
    orientation,
    zoomFactor,
  });
  dispatch({ type: DISABLE_OPT });
};

export const moveMap = direction => async dispatch => {
  const newCenter = getNewCenter(direction);
  await dispatch({
    type: MOVE_CENTER,
    center: newCenter,
  });
  dispatch({ type: DISABLE_OPT });
};

export const setChoropleth = choropleth => async dispatch => {
  await dispatch({ type: SET_CHOROPLETH, choropleth });
  dispatch({ type: DISABLE_OPT });
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
  await dispatch({ type: TOGGLE_TOOLTIP });
  dispatch({ type: DISABLE_OPT });
};

export const sliderSet = value => dispatch => {
  dispatch({ type: TOGGLE_SLIDER, value });
};

export const setChoroYear = value => async dispatch => {
  await dispatch({ type: SET_CHORO_YEAR, value });
  dispatch({ type: DISABLE_OPT });
};
