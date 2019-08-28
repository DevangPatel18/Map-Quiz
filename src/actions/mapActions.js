import { actions } from 'redux-tooltip';
import {
  getStatesForRegionSelect,
  getNewRegionDataSet,
  getGeoPathCenterAndZoom,
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
} from './types';
import store from '../store';
import { alpha3Codes, alpha3CodesSov } from '../assets/regionAlpha3Codes';

const { show, hide } = actions;

const WorldRegions = Object.keys(alpha3Codes).slice(0, -1);

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
  const { checkedRegions } = store.getState().map;
  const { map, quiz } = getStatesForRegionSelect(regionName);

  await dispatch({ type: CHANGE_MAP_VIEW, map, quiz });
  dispatch({ type: DISABLE_OPT });
  if (regionName === 'World') {
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

export const checkMapDataUpdate = regionName => async dispatch => {
  const { currentMap } = store.getState().map;
  const { regionDataSets } = store.getState().data;

  if (
    !(WorldRegions.includes(currentMap) && WorldRegions.includes(regionName))
  ) {
    const regionDataSetKey = WorldRegions.includes(regionName)
      ? 'World'
      : regionName;
    if (regionDataSets[regionDataSetKey]) {
      const {
        geographyPaths,
        regionMarkers,
        capitalMarkers,
        subRegionName,
      } = regionDataSets[regionDataSetKey];
      await dispatch({
        type: LOAD_REGION_DATA,
        geographyPaths,
        regionMarkers,
        capitalMarkers,
        regionDataSets,
        subRegionName,
      });
    } else {
      const {
        geographyPaths,
        regionMarkers,
        capitalMarkers,
        subRegionName,
      } = await getNewRegionDataSet(regionDataSetKey);

      const updatedRegionDataSets = {
        ...regionDataSets,
        [regionDataSetKey]: {
          geographyPaths,
          regionMarkers,
          capitalMarkers,
          subRegionName,
        },
      };

      await dispatch({
        type: LOAD_REGION_DATA,
        geographyPaths,
        regionMarkers,
        capitalMarkers,
        regionDataSets: updatedRegionDataSets,
        subRegionName,
      });
    }
  }
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
  await dispatch({
    type: SET_MAP,
    dimensions,
    zoomFactor,
  });
  dispatch({ type: DISABLE_OPT });
};

export const moveMap = direction => async dispatch => {
  const { center } = store.getState().map;
  let newCenter;
  const step = 5;
  switch (direction) {
    case 'up':
      newCenter = [center[0], center[1] + step];
      break;
    case 'down':
      newCenter = [center[0], center[1] - step];
      break;
    case 'left':
      newCenter = [center[0] - step, center[1]];
      break;
    case 'right':
      newCenter = [center[0] + step, center[1]];
      break;
    default:
  }
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
  const { choropleth, slider, sliderYear } = store.getState().map;
  const { populationData } = store.getState().data;
  const { name, alpha3Code } = geography.properties;
  let content = name;
  let contentData;
  if (choropleth !== 'None') {
    if (slider) {
      contentData = populationData[alpha3Code]
        ? parseInt(populationData[alpha3Code][sliderYear]).toLocaleString()
        : 'N/A';
    } else {
      contentData = geography.properties[choropleth]
        ? geography.properties[choropleth].toLocaleString()
        : 'N/A';
    }
    content += ` - ${contentData}`;
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
