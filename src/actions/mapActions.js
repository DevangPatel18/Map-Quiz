import { geoPath } from 'd3-geo';
import projection from '../helpers/projection';
import {
  REGION_SELECT,
  COUNTRY_SELECT,
  SET_REGION_CHECKBOX,
  DISABLE_OPT,
  ZOOM_MAP,
  RECENTER_MAP,
} from './types';
import store from '../store';
import {
  alpha3Codes,
  mapConfig,
  alpha3CodesSov,
} from '../assets/regionAlpha3Codes';

export const setRegionCheckbox = regionName => async dispatch => {
  const checkedRegions = { ...store.getState().map.checkedRegions };
  if (regionName) {
    checkedRegions[regionName] = !checkedRegions[regionName];
  }

  const filterRegions = Object.keys(checkedRegions)
    .filter(region => checkedRegions[region])
    .map(region => alpha3CodesSov[region])
    .reduce((a, b) => a.concat(b), []);

  await dispatch({ type: SET_REGION_CHECKBOX, checkedRegions, filterRegions });
  dispatch({ type: DISABLE_OPT });
};

export const regionSelect = regionName => async dispatch => {
  const { center, zoom } = mapConfig[regionName];
  const map = {
    zoom,
    center,
    defaultZoom: zoom,
    defaultCenter: center,
    currentMap: regionName,
    filterRegions: alpha3Codes[regionName],
    markerToggle: '',
  };
  const quiz = {
    selectedProperties: '',
  };
  await dispatch({ type: REGION_SELECT, map, quiz });
  dispatch({ type: DISABLE_OPT });
  if (regionName === 'World') {
    const { checkedRegions } = store.getState().map;
    const filterRegions = Object.keys(checkedRegions)
      .filter(region => checkedRegions[region])
      .map(region => alpha3CodesSov[region])
      .reduce((a, b) => a.concat(b), []);
    await dispatch({
      type: SET_REGION_CHECKBOX,
      checkedRegions,
      filterRegions,
    });
    dispatch({ type: DISABLE_OPT });
  }
};

export const countrySelect = geographyPath => async dispatch => {
  const { countryMarkers } = store.getState().data;
  const { dimensions } = store.getState().map;
  const { properties } = geographyPath;

  const center = countryMarkers.find(
    x => x.alpha3Code === properties.alpha3Code
  ).coordinates;

  const path = geoPath().projection(projection());
  const bounds = path.bounds(geographyPath);
  const width = bounds[1][0] - bounds[0][0];
  const height = bounds[1][1] - bounds[0][1];
  let zoom = 0.7 / Math.max(width / dimensions[0], height / dimensions[1]);

  zoom = properties.alpha3Code === 'USA' ? zoom * 6 : zoom;

  zoom = Math.min(zoom, 64);
  await dispatch({
    type: COUNTRY_SELECT,
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
