const mapConfig = {
  World: { center: [10, 0], zoom: 1 },
  'North & Central America': { center: [-95, 30], zoom: 2.5 },
  'South America': { center: [-65, -28], zoom: 1.9 },
  Caribbean: { center: [-70, 17], zoom: 8.5 },
  Africa: { center: [10, -3], zoom: 1.8 },
  Europe: { center: [5, 50], zoom: 3.5 },
  Asia: { center: [90, 20], zoom: 2 },
  Oceania: { center: [-190, -22], zoom: 2 },
  'United States of America': { center: [-95, 35], zoom: 4 },
};

const mapViewsList = Object.keys(mapConfig);
const worldRegions = mapViewsList.slice(0, -1);

export { mapConfig, mapViewsList, worldRegions };