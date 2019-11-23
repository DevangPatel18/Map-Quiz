import {
  scaleSequential,
  interpolateReds,
  interpolateOranges,
  interpolatePiYG,
  interpolatePurples,
} from 'd3';
import store from '../store';
import { jenks } from './jenksNaturalBreaks';

const choroParams = {
  population: {
    colorScheme: interpolateReds,
    units: 'people',
  },
  area: {
    colorScheme: interpolateOranges,
    units: 'km²',
  },
  gini: {
    colorScheme: interpolatePiYG,
    units: '',
  },
  density: {
    colorScheme: interpolatePurples,
    units: 'people / km²',
  },
};

const choroplethColor = (choropleth, geo) => {
  const { slider, sliderYear, currentMap } = store.getState().map;
  const { populationData, choroplethParams } = store.getState().data;
  const mapChoroData = choroplethParams[currentMap];
  const { regionID } = geo.properties;
  if (mapChoroData && mapChoroData[choropleth] && !slider) {
    return choroplethParams[currentMap][choropleth]['regionStyles'][regionID];
  }

  const { bounds } = mapChoroData[choropleth];
  let choroplethNum;
  if (slider && populationData[geo.properties.regionID]) {
    choroplethNum = populationData[geo.properties.regionID][sliderYear];
  } else {
    choroplethNum = geo.properties[choropleth.toLowerCase()];
  }

  if (choroplethNum) {
    const { color } = bounds.find(({ val }) => choroplethNum <= val);
    if (color) return color;
  }
  return '#000000';
};

export const getChoroplethParams = choropleth => {
  const geographyPaths = getChoroplethRegions();
  const { dataSet, numOnly } = getChoroplethData(choropleth, geographyPaths);
  if (numOnly.length === 0) return {};
  const classes = Math.min(parseInt(numOnly.length / 2), 10);
  const jenksOutput = jenks(numOnly, classes);
  const scaleFunc = getScaleFunction(choropleth, jenksOutput);

  const regionStyles = dataSet.reduce((acc, { regionID, val }) => {
    const idx = jenksOutput.findIndex(bound => val <= bound);
    acc[regionID] = val ? scaleFunc(idx) : '#000000';
    return acc;
  });

  const bounds = jenksOutput.map((bound, idx) => ({
    val: bound,
    color: scaleFunc(idx),
  }));

  return { regionStyles, bounds };
};

const getChoroplethRegions = () => {
  const { currentMap, filterRegions } = store.getState().map;
  let { geographyPaths } = store.getState().data;
  return currentMap !== 'World'
    ? geographyPaths.filter(({ properties }) =>
        filterRegions.includes(properties.regionID)
      )
    : geographyPaths;
};

const getChoroplethData = (choropleth, geographyPaths) => {
  const dataSet = geographyPaths
    .map(geoPath => ({
      regionID: geoPath.properties.regionID,
      val: geoPath.properties[choropleth],
    }))
    .sort((objA, objB) => objA.val - objB.val);
  const numOnly = dataSet.map(obj => obj.val).filter(Number);
  return { dataSet, numOnly };
};

const getScaleFunction = (choropleth, jenksOutput) =>
  scaleSequential(choroParams[choropleth].colorScheme).domain([
    0,
    [jenksOutput.length - 1],
  ]);

export { choroParams, choroplethColor };
