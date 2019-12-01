import { geoPath } from 'd3-geo';
import projection from './projection';
import { OceaniaUN, CaribbeanUN } from './regionCodeArrays';
import { OceaniaEllipseDimensions, labelDist, labelist } from './markerParams';
import { worldRegions } from '../assets/mapViewSettings';
import store from '../store';

const getMaxAreaForEllipse = currentMap => {
  switch (currentMap) {
    case 'Caribbean':
    case 'India':
      return 2000;
    case 'Oceania':
      return 29000;
    case 'Germany':
    case 'Italy':
    case 'Japan':
      return 0;
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
      OceaniaUN.includes(x.properties.regionID);
    filterFunc = x => filterByArea(x) || filterByOceaniaISOCodes(x);
  }
  return filterFunc;
};

export const getCaribbeanMarkerProperties = regionID => {
  const { capitalMarkers } = store.getState().data;
  const marker = capitalMarkers.find(x => x.regionID === regionID);
  let deltaX = 20;
  let deltaY = -20;
  [deltaX, deltaY] = labelDist(deltaX, deltaY, regionID);
  let circleX = deltaX;
  let circleY = deltaY;
  let lineX = deltaX;
  let lineY = deltaY;

  if (!labelist.includes(regionID)) {
    circleX = deltaX * 0.8;
    circleY = deltaY * 0.8;
    lineX = deltaX * 0.46;
    lineY = deltaY * 0.46;
  } else {
    circleX = deltaX * 0.93;
    circleY = deltaY * 0.93;
    lineX = deltaX * 0.81;
    lineY = deltaY * 0.81;
  }

  return { marker, circleX, circleY, lineX, lineY };
};

const getGeoEllipseDimensions = region => {
  const { currentMap } = store.getState().map;
  const { regionID } = region.properties;
  const path = geoPath().projection(projection());
  const bounds = path.bounds(region);
  const originWidth = bounds[1][0] - bounds[0][0];
  const originHeight = bounds[1][1] - bounds[0][1];
  const radius =
    CaribbeanUN.includes(regionID) || !worldRegions.includes(currentMap)
      ? 1.5
      : 3;
  const width = Math.max(originWidth, radius);
  const height = Math.max(originHeight, radius);
  const angle = 0;
  return { width, height, angle };
};

export const getEllipseMarkerProperties = region => {
  const { regionMarkers } = store.getState().data;
  const regionID = region.properties.regionID;
  let ellipseData;
  let marker = '';
  if (Object.keys(OceaniaEllipseDimensions).includes(regionID)) {
    ellipseData = OceaniaEllipseDimensions[regionID];
    marker = regionMarkers.find(x => x.regionID === regionID);
  } else {
    ellipseData = getGeoEllipseDimensions(region);
    const path = geoPath().projection(projection());
    marker = {
      name: region.properties.name,
      regionID,
      coordinates: projection().invert(path.centroid(region)),
      markerOffset: 0,
    };
  }
  const rotate = `rotate(${ellipseData.angle})`;

  return { ...ellipseData, marker, rotate };
};
