import { feature } from 'topojson-client';
import projection from './projection';
import { geoPath } from 'd3-geo';
import Papa from 'papaparse';
import store from '../store';
import capitalData from '../assets/country_capitals';
import {
  DataFix,
  CountryMarkersFix,
  CapitalMarkersFix,
} from '../helpers/attributeFix';

const restDataFields = [
  'name',
  'alpha3Code',
  'alpha2Code',
  'numericCode',
  'area',
  'population',
  'gini',
  'capital',
  'flag',
  'altSpellings',
  'translations',
];

export const getWorldTopology = async () =>
  await fetch('/world-50m.json').then(response => {
    if (response.status !== 200) {
      console.log(`There was a problem: ${response.status}`);
      return;
    }
    return response.json();
  });

export const getWorldGeographyPaths = worldTopology =>
  feature(worldTopology, worldTopology.objects.countries).features;

export const copyWorldGeographyPaths = () =>
  store.getState().data.geographyPaths.map(a => ({ ...a }));

export const getRestCountryData = async () =>
  fetch(
    `https://restcountries.eu/rest/v2/all?fields=${restDataFields.join(';')}`
  ).then(restCountries => {
    if (restCountries.status !== 200) {
      console.log(`There was a problem: ${restCountries.status}`);
      return;
    }
    return restCountries.json();
  });

export const getPopulationData = async () => {
  const populationData = {};
  await fetch('popdata.csv')
    .then(response => response.text())
    .then(csvtext => {
      Papa.parse(csvtext, {
        header: true,
        skipEmptyLines: true,
        step: row => {
          populationData[row.data['Country Code']] = row.data;
        },
      });
    });
  return populationData;
};

const checkGeoPathValidId = geographyPath => +geographyPath.id !== -99;

export const addRestDataToGeoPaths = (restData, geographyPaths) =>
  geographyPaths.filter(checkGeoPathValidId).forEach(geography => {
    const countryData = restData.find(c => +c.numericCode === +geography.id);

    geography.properties = countryData;
    geography.properties.spellings = [
      countryData.name,
      ...countryData.altSpellings,
      ...Object.values(countryData.translations),
    ];
  });

export const updatePopDataInGeoPaths = (populationData, geographyPaths) =>
  geographyPaths.filter(checkGeoPathValidId).forEach(geography => {
    const { alpha3Code, area } = geography.properties;
    if (populationData[alpha3Code]) {
      geography.properties.population = +populationData[alpha3Code]['2018'];
    }
    geography.properties.density = +(geography.properties.population / area);
  });

export const getCapitalMarkers = geographyPaths =>
  geographyPaths
    .filter(checkGeoPathValidId)
    .reduce((capitalMarkers, geography) => {
      const { capital, alpha2Code, alpha3Code } = geography.properties;
      const capObject = capitalData.find(
        capitalObj => capitalObj.CountryCode === alpha2Code
      );
      if (capObject) {
        capitalMarkers.push({
          name: capital,
          alpha3Code,
          coordinates: [
            +capObject.CapitalLongitude,
            +capObject.CapitalLatitude,
          ],
          markerOffset: -7,
        });
      }
      return capitalMarkers;
    }, []);

export const getRegionMarkers = geographyPaths =>
  geographyPaths.map(x => {
    const { name, alpha3Code } = x.properties;
    const path = geoPath().projection(projection());
    return {
      name,
      alpha3Code,
      coordinates: projection().invert(path.centroid(x)),
      markerOffset: 0,
    };
  });

export const getWorldDataSet = async populationData => {
  let geographyPaths = copyWorldGeographyPaths();
  let restData = await getRestCountryData();
  restData = DataFix(restData);

  addRestDataToGeoPaths(restData, geographyPaths);
  updatePopDataInGeoPaths(populationData, geographyPaths);

  let regionMarkers = getRegionMarkers(geographyPaths);
  let capitalMarkers = getCapitalMarkers(geographyPaths);

  regionMarkers = CountryMarkersFix(regionMarkers);
  capitalMarkers = CapitalMarkersFix(capitalMarkers);

  return {
    geographyPaths,
    regionMarkers,
    capitalMarkers,
    subRegionName: 'country',
  };
};
