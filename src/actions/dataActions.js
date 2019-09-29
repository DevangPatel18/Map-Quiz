import {
  LOAD_PATHS,
  LOAD_DATA,
  DISABLE_OPT,
  GET_ELLIPSES,
  GET_REGION_SEARCH_LIST,
} from './types';
import { modifyWorldGeographyPaths } from '../helpers/attributeFix';
import {
  getWorldTopology,
  getWorldGeographyPaths,
  getPopulationData,
  getWorldDataSet,
  getMapViewIds,
  getRegionSearchObjectArray,
} from '../helpers/dataActionHelpers';
import {
  getFilterFunction,
  getEllipseMarkerProperties,
  getCaribbeanMarkerProperties,
} from '../helpers/regionEllipsesHelpers';
import store from '../store';

export const loadGeographyPaths = () => async dispatch => {
  const worldTopology = await getWorldTopology();
  let geographyPaths = getWorldGeographyPaths(worldTopology);
  geographyPaths = modifyWorldGeographyPaths(geographyPaths);

  await dispatch({ type: LOAD_PATHS, geographyPaths });
  dispatch({ type: DISABLE_OPT });
};

export const loadRegionData = () => async dispatch => {
  const populationData = await getPopulationData();
  const worldDataSet = await getWorldDataSet(populationData);
  const { mapViewRegionIds, mapViewCountryIds } = getMapViewIds(worldDataSet);
  const regionDataSets = { World: { ...worldDataSet } };

  await dispatch({
    type: LOAD_DATA,
    ...worldDataSet,
    regionDataSets,
    populationData,
    mapViewRegionIds,
    mapViewCountryIds,
  });

  dispatch({ type: DISABLE_OPT });
};

export const getRegionEllipses = currentMap => dispatch => {
  const { map, data } = store.getState();
  const { filterRegions } = map;
  const { geographyPaths, regionEllipsesData } = data;
  const filterFunc = getFilterFunction(currentMap);
  const markersArray = geographyPaths
    .filter(x => filterRegions.includes(x.properties.alpha3Code))
    .filter(filterFunc)
    .map(region => {
      const { alpha3Code } = region.properties;
      const caribbeanMap = currentMap === 'Caribbean';
      const markerData = caribbeanMap
        ? getCaribbeanMarkerProperties(alpha3Code)
        : getEllipseMarkerProperties(region);
      markerData.region = region;
      return markerData;
    });

  dispatch({
    type: GET_ELLIPSES,
    regionEllipsesData: {
      ...regionEllipsesData,
      [currentMap]: markersArray,
    },
  });
};

export const getRegionSearchOptions = currentMap => dispatch => {
  const { map, data } = store.getState();
  const { regionKey } = map;
  const { geographyPaths, mapViewRegionIds } = data;

  let mapRegions = geographyPaths.map(x => x.properties);

  if (currentMap !== 'World') {
    mapRegions = mapRegions.filter(x =>
      mapViewRegionIds[currentMap].includes(x[regionKey])
    );
  }

  const regionSearchOptions = getRegionSearchObjectArray(mapRegions, regionKey);

  dispatch({
    type: GET_REGION_SEARCH_LIST,
    currentMap,
    regionSearchOptions,
  });
};
