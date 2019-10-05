import {
  LOAD_PATHS,
  LOAD_DATA,
  DISABLE_OPT,
  GET_ELLIPSES,
  GET_REGION_SEARCH_LIST,
  ADD_REGION_DATA,
  LOAD_REGION_DATA,
} from './types';
import { modifyWorldGeographyPaths } from '../helpers/attributeFix';
import {
  getWorldTopology,
  getWorldGeographyPaths,
  getPopulationData,
  getWorldDataSet,
  getMapViewIds,
  getNewRegionDataSet,
  checkMapViewsBetweenWorldRegions,
  getRegionSearchObjectArray,
} from '../helpers/dataActionHelpers';
import {
  getFilterFunction,
  getEllipseMarkerProperties,
  getCaribbeanMarkerProperties,
} from '../helpers/regionEllipsesHelpers';
import { worldRegions } from '../assets/mapViewSettings';
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

export const checkMapDataUpdate = regionName => async dispatch => {
  if (checkMapViewsBetweenWorldRegions(regionName)) return;

  let { regionDataSets } = store.getState().data;
  const regionDataSetKey = worldRegions.includes(regionName)
    ? 'World'
    : regionName;
  if (!regionDataSets[regionDataSetKey]) {
    const newRegionDataSet = await getNewRegionDataSet(regionName);
    const { geographyPaths } = newRegionDataSet;
    const newRegionIdList = geographyPaths.map(x => x.properties.regionID);

    await dispatch({
      type: ADD_REGION_DATA,
      regionName,
      newRegionDataSet,
      newRegionIdList,
    });
    regionDataSets = store.getState().data.regionDataSets;
  }
  await dispatch({
    type: LOAD_REGION_DATA,
    currentMap: regionDataSetKey,
    subRegionName: regionDataSets[regionDataSetKey].subRegionName,
  });
};

export const getRegionEllipses = currentMap => dispatch => {
  const { map, data } = store.getState();
  const { filterRegions, regionKey } = map;
  const { geographyPaths } = data;
  const filterFunc = getFilterFunction(currentMap);
  const markersArray = geographyPaths
    .filter(x => filterRegions.includes(x.properties[regionKey]))
    .filter(filterFunc)
    .map(region => {
      const regionID = region.properties[regionKey];
      const caribbeanMap = currentMap === 'Caribbean';
      const markerData = caribbeanMap
        ? getCaribbeanMarkerProperties(regionID)
        : getEllipseMarkerProperties(region);
      markerData.region = region;
      return markerData;
    });

  dispatch({
    type: GET_ELLIPSES,
    currentMap,
    markersArray,
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
