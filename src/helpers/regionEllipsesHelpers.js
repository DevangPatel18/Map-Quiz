import { OceaniaUN } from './regionCodeArrays';
import { labelDist, labelist } from './markerParams';
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

export const getCaribMarkerProperties = alpha3Code => {
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
