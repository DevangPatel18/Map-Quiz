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
    const { color } = bounds.find(({ upper }) => choroplethNum <= upper);
    if (color) return color;
  }
  return '#000000';
};

export const getChoroplethParams = choropleth => {
  const geographyPaths = getChoroplethRegions();
  const { dataSet, numOnly } = getChoroplethData(choropleth, geographyPaths);
  if (numOnly.length === 0) return {};
  const classes = Math.min(parseInt(numOnly.length / 2), 10);
  const jenksOutput = [...new Set(jenks(numOnly, classes))];
  const scaleFunc = getScaleFunction(choropleth, jenksOutput);

  const regionStyles = dataSet.reduce((acc, { regionID, upper }) => {
    const idx = jenksOutput.findIndex(bound => upper <= bound);
    acc[regionID] = upper ? scaleFunc(idx) : '#000000';
    return acc;
  });

  const bounds = jenksOutput.map((bound, idx) => ({
    lower: jenksOutput[idx - 1],
    upper: bound,
    color: scaleFunc(idx),
  }));
  bounds[0].lower = 0;

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
      upper: geoPath.properties[choropleth],
    }))
    .sort((objA, objB) => objA.upper - objB.upper);
  const numOnly = dataSet.map(obj => obj.upper).filter(Number);
  return { dataSet, numOnly };
};

const getScaleFunction = (choropleth, jenksOutput) =>
  scaleSequential(choroParams[choropleth].colorScheme).domain([
    0,
    [jenksOutput.length - 1],
  ]);

const SI_SYMBOL = ['', 'k', 'M', 'B'];

export const numShorten = number => {
  const tier = (Math.log10(number) / 3) | 0;

  // if zero, we don't need a suffix
  if (tier === 0) return number.toPrecision(3);

  // get suffix and determine scale
  const suffix = SI_SYMBOL[tier];
  const scale = Math.pow(10, tier * 3);

  // scale the number
  const scaled = number / scale;

  // format number and add suffix
  return scaled.toPrecision(3) + suffix;
};

export { choroParams, choroplethColor };
