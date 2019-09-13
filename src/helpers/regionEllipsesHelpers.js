import { geoPath } from 'd3-geo';
import projection from './projection';
import { OceaniaUN, CaribbeanUN } from './regionCodeArrays';
import { OceaniaEllipseDimensions, labelDist, labelist } from './markerParams';
import store from '../store';

const getMaxAreaForEllipse = currentMap => {
  switch (currentMap) {
    case 'Caribbean':
      return 2000;
    case 'Oceania':
      return 29000;
    default:
      return 6000;
  }
};

export const getFilterFunction = currentMap => {
  const maxAreaforEllipse = getMaxAreaForEllipse(currentMap);
  const filterByArea = x => x.properties.area < maxAreaforEllipse;
  let filterFunc = filterByArea;
  if (currentMap === 'World') {
    const filterByOceaniaISOCodes = x =>
      OceaniaUN.includes(x.properties.alpha3Code);
    filterFunc = x => filterByArea(x) || filterByOceaniaISOCodes(x);
  }
  return filterFunc;
};

export const getCaribbeanMarkerProperties = alpha3Code => {
  const { capitalMarkers } = store.getState().data;
  const marker = capitalMarkers.find(x => x.alpha3Code === alpha3Code);
  let deltaX = 20;
  let deltaY = -20;
  [deltaX, deltaY] = labelDist(deltaX, deltaY, alpha3Code);
  let circleX = deltaX;
  let circleY = deltaY;
  let lineX = deltaX;
  let lineY = deltaY;

  if (!labelist.includes(alpha3Code)) {
    circleX = deltaX * 0.8;
    circleY = deltaY * 0.8;
    lineX = deltaX * 0.65;
    lineY = deltaY * 0.65;
  } else {
    circleX = deltaX * 0.93;
    circleY = deltaY * 0.93;
    lineX = deltaX * 0.88;
    lineY = deltaY * 0.88;
  }

  return { marker, circleX, circleY, lineX, lineY };
};

const getGeoEllipseDimensions = region => {
  const { alpha3Code } = region.properties;
  const path = geoPath().projection(projection());
  const bounds = path.bounds(region);
  const originWidth = bounds[1][0] - bounds[0][0];
  const originHeight = bounds[1][1] - bounds[0][1];
  const radius = CaribbeanUN.includes(alpha3Code) ? 1.5 : 3;
  const width = Math.max(originWidth, radius);
  const height = Math.max(originHeight, radius);
  const angle = 0;
  return { width, height, angle };
};

export const getEllipseMarkerProperties = region => {
  const { regionMarkers } = store.getState().data;
  const { alpha3Code } = region.properties;
  const marker = regionMarkers.find(x => x.alpha3Code === alpha3Code);
  let ellipseData;
  if (Object.keys(OceaniaEllipseDimensions).includes(alpha3Code)) {
    ellipseData = OceaniaEllipseDimensions[alpha3Code];
  } else {
    ellipseData = getGeoEllipseDimensions(region);
  }
  const { width, height, angle } = ellipseData;
  const rotate = `rotate(${angle})`;

  return { marker, width, height, rotate };
};
