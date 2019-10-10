import { geoPath } from 'd3-geo';
import projection from '../helpers/projection';
import store from '../store';

export const getGeoPathCenterAndZoom = geographyPath => {
  const { regionMarkers } = store.getState().data;
  const { dimensions, regionKey } = store.getState().map;
  const { properties } = geographyPath;

  const center = regionMarkers.find(x => x[regionKey] === properties[regionKey])
    .coordinates;
  const path = geoPath().projection(projection());
  const bounds = path.bounds(geographyPath);
  const width = bounds[1][0] - bounds[0][0];
  const height = bounds[1][1] - bounds[0][1];
  let zoom = 0.7 / Math.max(width / dimensions[0], height / dimensions[1]);

  zoom = properties[regionKey] === 'USA' ? zoom * 6 : zoom;
  zoom = Math.min(zoom, 64);
  return { center, zoom };
};

export const getOrientation = (width = 980) => {
  let orientation;
  switch (width) {
    case 980:
      orientation = 'landscape';
      break;
    case 645:
      orientation = 'medium';
      break;
    case 420:
      orientation = 'small';
      break;
    case 310:
      orientation = 'portrait';
      break;
    default:
  }
  return orientation;
};

export const getNewCenter = direction => {
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
  return newCenter;
};

export const getChoroplethTooltipContent = geography => {
  const { choropleth, slider, sliderYear } = store.getState().map;
  const { populationData } = store.getState().data;
  const { alpha3Code } = geography.properties;
  let contentData;
  if (slider) {
    contentData = populationData[alpha3Code]
      ? parseInt(populationData[alpha3Code][sliderYear]).toLocaleString()
      : 'N/A';
  } else {
    contentData = geography.properties[choropleth]
      ? geography.properties[choropleth].toLocaleString()
      : 'N/A';
  }
  return ` - ${contentData}`;
};
