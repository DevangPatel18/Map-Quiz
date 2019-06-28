import { LOAD_PATHS, LOAD_DATA, DISABLE_OPT } from './types';
import { feature } from 'topojson-client';
import {
  DataFix,
  CountryMarkersFix,
  CapitalMarkersFix,
  GeoPathsMod,
} from '../helpers/attributeFix';
import { geoPath } from 'd3-geo';
import capitalData from '../assets/country_capitals';
import projection from '../helpers/projection';
import store from '../store';

export const loadPaths = () => async dispatch => {
  const worldData = await fetch('/world-50m.json').then(response => {
    if (response.status !== 200) {
      console.log(`There was a problem: ${response.status}`);
      return;
    }
    return response.json();
  });

  let data = feature(worldData, worldData.objects.countries).features;

  // Remove Antarctica and invalid iso codes
  data = data.filter(x => (+x.id !== 10 ? 1 : 0));

  // Create geopaths for external regions and other changes
  data = GeoPathsMod(data);

  await dispatch({ type: LOAD_PATHS, geographyPaths: data });
  dispatch({ type: DISABLE_OPT });
};

export const loadData = () => async dispatch => {
  let data = store.getState().data.geographyPaths.map(a => ({ ...a }));
  let restData = await fetch(
    'https://restcountries.eu/rest/v2/all?fields=name;alpha3Code;alpha2Code;numericCode;area;population;gini;capital;flag;altSpellings;translations'
  ).then(restCountries => {
    if (restCountries.status !== 200) {
      console.log(`There was a problem: ${restCountries.status}`);
      return;
    }
    return restCountries.json();
  });

  let countryMarkers = [];
  let capitalMarkers = [];

  [restData, capitalMarkers] = DataFix({ data: restData, capitalMarkers });

  data
    .filter(x => (+x.id !== -99 ? 1 : 0))
    .forEach(geography => {
      const countryData = restData.find(c => +c.numericCode === +geography.id);

      geography.properties = countryData;
      geography.properties.spellings = [
        ...countryData.altSpellings,
        ...Object.values(countryData.translations),
      ];

      geography.properties.density =
        geography.properties.population / geography.properties.area;

      const captemp = capitalData.find(
        capital => capital.CountryCode === countryData.alpha2Code
      );

      if (captemp) {
        const capitalCoords = [
          +captemp.CapitalLongitude,
          +captemp.CapitalLatitude,
        ];

        capitalMarkers.push({
          name: countryData.capital,
          alpha3Code: countryData.alpha3Code,
          coordinates: capitalCoords,
          markerOffset: -7,
        });
      }
    });

  data.forEach(x => {
    const { alpha3Code } = x.properties;
    const path = geoPath().projection(projection());
    countryMarkers.push([projection().invert(path.centroid(x)), alpha3Code]);
  });

  countryMarkers = countryMarkers.map(array => ({
    name: data.find(x => x.properties.alpha3Code === array[1]).properties.name,
    alpha3Code: array[1],
    coordinates: array[0],
    markerOffset: 0,
  }));

  countryMarkers = CountryMarkersFix(countryMarkers);
  capitalMarkers = CapitalMarkersFix(capitalMarkers);

  await dispatch({
    type: LOAD_DATA,
    geographyPaths: data,
    countryMarkers,
    capitalMarkers,
  });

  dispatch({ type: DISABLE_OPT });
};
