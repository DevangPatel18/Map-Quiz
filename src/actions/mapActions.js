import { geoPath } from 'd3-geo';
import { actions } from 'redux-tooltip';
import Papa from 'papaparse';
import projection from '../helpers/projection';
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
import {
  alpha3Codes,
  mapConfig,
  alpha3CodesSov,
} from '../assets/regionAlpha3Codes';

const { show, hide } = actions;

const WorldRegions = Object.keys(alpha3Codes).slice(0, -1);

const geoPathLinks = {
  'United States of America': {
    geoJSON:
      'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_1_states_provinces_shp.geojson',
    data:
      'https://res.cloudinary.com/dbeqp2lyo/raw/upload/v1566493791/Map%20Quiz/usData.csv',
    capitalLatLng:
      'https://res.cloudinary.com/dbeqp2lyo/raw/upload/v1566487851/Map%20Quiz/usLatLng.csv',
  },
};

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
  const { currentMap, checkedRegions } = store.getState().map;
  const { regionDataSets } = store.getState().data;

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
    markerToggle: '',
  };

  if (
    !(WorldRegions.includes(currentMap) && WorldRegions.includes(regionName))
  ) {
    const regionDataSetKey = WorldRegions.includes(regionName)
      ? 'World'
      : regionName;
    if (regionDataSets[regionDataSetKey]) {
      const { geographyPaths, regionMarkers, capitalMarkers } = regionDataSets[
        regionDataSetKey
      ];
      await dispatch({
        type: LOAD_REGION_DATA,
        geographyPaths,
        regionMarkers,
        capitalMarkers,
        regionDataSets,
      });
    } else {
      const newGeographyPaths = await fetch(
        geoPathLinks[regionDataSetKey].geoJSON
      )
        .then(response => response.json())
        .then(featureCollection => featureCollection.features);

      const newRegionMarkers = newGeographyPaths.map(x => {
        const { name, postal } = x.properties;
        const path = geoPath().projection(projection());
        return {
          name,
          regionID: postal,
          coordinates: projection().invert(path.centroid(x)),
          markerOffset: 0,
        };
      });

      await fetch(geoPathLinks[regionDataSetKey].data)
        .then(response => response.text())
        .then(csvtext => {
          Papa.parse(csvtext, {
            header: true,
            skipEmptyLines: true,
            step: row => {
              let geo = newGeographyPaths.find(
                obj => obj.properties.postal === row.data['regionID']
              );
              if (geo) {
                geo.properties = { ...geo.properties, ...row.data };
                const { area, population, name } = geo.properties;
                geo.properties.area = +area;
                geo.properties.population = +population;
                geo.properties.spellings = [name];
              }
            },
          });
        });

      const newCapitalMarkers = [];
      await fetch(geoPathLinks[regionDataSetKey].capitalLatLng)
        .then(response => response.text())
        .then(csvtext => {
          Papa.parse(csvtext, {
            header: true,
            skipEmptyLines: true,
            step: row => {
              let geo = newGeographyPaths.find(
                obj => obj.properties.postal === row.data['regionID']
              );
              if (geo) {
                newCapitalMarkers.push({
                  name: geo.properties.capital,
                  regionID: row.data['regionID'],
                  coordinates: [+row.data['lng'], +row.data['lat']],
                  markerOffset: -7,
                });
              }
            },
          });
        });

      const updatedRegionDataSets = {
        ...regionDataSets,
        [regionDataSetKey]: {
          geographyPaths: newGeographyPaths,
          regionMarkers: newRegionMarkers,
          capitalMarkers: newCapitalMarkers,
        },
      };

      await dispatch({
        type: LOAD_REGION_DATA,
        geographyPaths: newGeographyPaths,
        regionMarkers: newRegionMarkers,
        capitalMarkers: newCapitalMarkers,
        regionDataSets: updatedRegionDataSets,
      });
    }
  }

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

export const regionZoom = geographyPath => async dispatch => {
  const { regionMarkers } = store.getState().data;
  const { dimensions } = store.getState().map;
  const { properties } = geographyPath;

  const regionKey = properties.alpha3Code ? 'alpha3Code' : 'regionID';
  const center = regionMarkers.find(
    x => x[regionKey] === properties[regionKey]
  ).coordinates;

  const path = geoPath().projection(projection());
  const bounds = path.bounds(geographyPath);
  const width = bounds[1][0] - bounds[0][0];
  const height = bounds[1][1] - bounds[0][1];
  let zoom = 0.7 / Math.max(width / dimensions[0], height / dimensions[1]);

  zoom = properties[regionKey] === 'USA' ? zoom * 6 : zoom;

  zoom = Math.min(zoom, 64);
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
