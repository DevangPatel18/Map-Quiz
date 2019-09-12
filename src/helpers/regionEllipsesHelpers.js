import { OceaniaUN } from './regionCodeArrays';

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
