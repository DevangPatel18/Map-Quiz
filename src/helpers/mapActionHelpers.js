import { geoPath } from 'd3-geo';
import projection from '../helpers/projection';
import { getRegionStyles, getSelectUpdatedRegionStyles } from './MapHelpers';
import store from '../store';

export const getGeoPathCenterAndZoom = geographyPath => {
  const { regionMarkers } = store.getState().data;
  const { dimensions } = store.getState().map;
  const { properties } = geographyPath;

  const center = regionMarkers.find(x => x.regionID === properties.regionID)
    .coordinates;
  const path = geoPath().projection(projection());
  const bounds = path.bounds(geographyPath);
  const width = bounds[1][0] - bounds[0][0];
  const height = bounds[1][1] - bounds[0][1];
  let zoom = 0.7 / Math.max(width / dimensions[0], height / dimensions[1]);

  zoom = properties.regionID === 'USA' ? zoom * 6 : zoom;
  zoom = Math.min(zoom, 64);
  return { center, zoom };
};

export const getOrientation = (width = 980) => {
  switch (width) {
    case 980:
      return 'landscape';
    case 645:
      return 'medium';
    case 420:
      return 'small';
    case 310:
      return 'portrait';
    default:
      return 'landscape';
  }
};

export const getNewCenter = direction => {
  const { center } = store.getState().map;
  const step = 5;
  switch (direction) {
    case 'up':
      return [center[0], center[1] + step];
    case 'down':
      return [center[0], center[1] - step];
    case 'left':
      return [center[0] - step, center[1]];
    case 'right':
      return [center[0] + step, center[1]];
    default:
      return center;
  }
};

export const getChoroplethTooltipContent = geography => {
  const { choropleth, slider, sliderYear } = store.getState().map;
  const { populationData } = store.getState().data;
  const { regionID } = geography.properties;
  let contentData;
  if (slider) {
    contentData = populationData[regionID]
      ? parseInt(populationData[regionID][sliderYear]).toLocaleString()
      : 'N/A';
  } else {
    contentData = geography.properties[choropleth]
      ? geography.properties[choropleth].toLocaleString()
      : 'N/A';
  }
  return ` - ${contentData}`;
};

export const getVisibleRegionStyles = () => {
  const { currentMap, filterRegions } = store.getState().map;
  return currentMap === 'World'
    ? getRegionStyles()
    : getSelectUpdatedRegionStyles(filterRegions);
};
