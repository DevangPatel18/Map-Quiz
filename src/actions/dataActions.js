import { LOAD_PATHS, LOAD_DATA, DISABLE_OPT } from './types';
import { modifyWorldGeographyPaths } from '../helpers/attributeFix';
import {
  getWorldTopology,
  getWorldGeographyPaths,
  getPopulationData,
  getWorldDataSet,
} from '../helpers/dataActionHelpers';

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

  const regionDataSets = { World: { ...worldDataSet } };

  await dispatch({
    type: LOAD_DATA,
    ...worldDataSet,
    regionDataSets,
    populationData,
  });

  dispatch({ type: DISABLE_OPT });
};
