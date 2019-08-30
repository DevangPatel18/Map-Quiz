import { LOAD_PATHS, LOAD_DATA, DISABLE_OPT } from './types';
import {
  DataFix,
  CountryMarkersFix,
  CapitalMarkersFix,
  modifyWorldGeographyPaths,
} from '../helpers/attributeFix';
import capitalData from '../assets/country_capitals';
import {
  getWorldTopology,
  getWorldGeographyPaths,
  copyWorldGeographyPaths,
  getRestCountryData,
  getPopulationData,
  getRegionMarkers,
} from '../helpers/dataActionHelpers';

export const loadPaths = () => async dispatch => {
  const worldTopology = await getWorldTopology();
  let geographyPaths = getWorldGeographyPaths(worldTopology);
  geographyPaths = modifyWorldGeographyPaths(geographyPaths);

  await dispatch({ type: LOAD_PATHS, geographyPaths });
  dispatch({ type: DISABLE_OPT });
};

export const loadData = () => async dispatch => {
  let geographyPaths = copyWorldGeographyPaths();
  let restData = await getRestCountryData();
  const populationData = await getPopulationData();

  let capitalMarkers = [];

  [restData, capitalMarkers] = DataFix({ data: restData, capitalMarkers });

  geographyPaths
    .filter(x => (+x.id !== -99 ? 1 : 0))
    .forEach(geography => {
      const countryData = restData.find(c => +c.numericCode === +geography.id);

      geography.properties = countryData;
      geography.properties.spellings = [
        countryData.name,
        ...countryData.altSpellings,
        ...Object.values(countryData.translations),
      ];

      // Update population to 2018 figures

      if (populationData[countryData.alpha3Code]) {
        geography.properties.population = +populationData[
          countryData.alpha3Code
        ]['2018'];
      }

      geography.properties.density = +(
        geography.properties.population / geography.properties.area
      );

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

  let regionMarkers = getRegionMarkers(geographyPaths);

  regionMarkers = CountryMarkersFix(regionMarkers);
  capitalMarkers = CapitalMarkersFix(capitalMarkers);

  const World = {
    geographyPaths,
    regionMarkers,
    capitalMarkers,
    subRegionName: 'country',
  };

  const regionDataSets = { World };

  await dispatch({
    type: LOAD_DATA,
    ...World,
    regionDataSets,
    populationData,
  });

  dispatch({ type: DISABLE_OPT });
};
