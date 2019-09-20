import { LOAD_PATHS, LOAD_DATA, DISABLE_OPT, GET_ELLIPSES } from './types';
import { modifyWorldGeographyPaths } from '../helpers/attributeFix';
import {
  getWorldTopology,
  getWorldGeographyPaths,
  getPopulationData,
  getWorldDataSet,
  getMapViewRegionIds,
} from '../helpers/dataActionHelpers';
import {
  getFilterFunction,
  getEllipseMarkerProperties,
  getCaribbeanMarkerProperties,
} from '../helpers/regionEllipsesHelpers';
import store from '../store';

export const loadPaths = () => async dispatch => {
  const worldTopology = await getWorldTopology();
  let geographyPaths = getWorldGeographyPaths(worldTopology);
  geographyPaths = modifyWorldGeographyPaths(geographyPaths);

  await dispatch({ type: LOAD_PATHS, geographyPaths });
  dispatch({ type: DISABLE_OPT });
};

export const loadData = () => async dispatch => {
  const populationData = await getPopulationData();
  const worldDataSet = await getWorldDataSet(populationData);
  const mapViewRegionIds = getMapViewRegionIds(worldDataSet);
  const regionDataSets = { World: { ...worldDataSet } };

  await dispatch({
    type: LOAD_DATA,
    ...worldDataSet,
    regionDataSets,
    populationData,
    mapViewRegionIds,
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
