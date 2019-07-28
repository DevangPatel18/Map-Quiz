import {
  scaleSequential,
  interpolateReds,
  interpolateOranges,
  interpolatePiYG,
  interpolatePurples,
} from 'd3';

const popScale = scaleSequential(interpolateReds).domain([0, 10]);
const areaScale = scaleSequential(interpolateOranges).domain([0, 17000000]);
const giniScale = scaleSequential(interpolatePiYG).domain([70, 20]);
const densityScale = scaleSequential(interpolatePurples).domain([0, 7]);

const choroParams = {
  population: {
    scaleFunc: popScale,
    bounds: [1, 5, 10, 20, 30, 40, 50, 100, 200, 1000, 1400].map(
      x => x * 1000000
    ),
    units: 'people',
  },
  area: {
    scaleFunc: areaScale,
    bounds: [0, 17000000],
    units: 'km²',
  },
  gini: {
    scaleFunc: giniScale,
    bounds: [70, 20],
    units: '',
  },
  density: {
    scaleFunc: densityScale,
    bounds: [25, 50, 75, 100, 200, 300, 1000, 27000],
    units: 'people / km²',
  },
};

const choroplethColor = (choropleth, geo) => {
  const { scaleFunc, bounds } = choroParams[choropleth];

  const choroplethNum = geo.properties[choropleth.toLowerCase()];

  if (choroplethNum) {
    if (bounds.length > 2) {
      const choroplethIndex = bounds.findIndex(x => x > choroplethNum);
      return scaleFunc(choroplethIndex);
    }
    return scaleFunc(choroplethNum);
  }
  return '#000000';
};

export { choroParams, choroplethColor };
