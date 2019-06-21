import { SET_REGION_CHECKBOX, DISABLE_OPT } from './types';
import store from '../store';
import { alpha3CodesSov } from '../assets/regionAlpha3Codes';

export const setRegionCheckbox = regionName => dispatch => {
  const checkedRegions = { ...store.getState().map.checkedRegions };
  if (regionName) {
    checkedRegions[regionName] = !checkedRegions[regionName];
  }

  const filterRegions = Object.keys(checkedRegions)
    .filter(region => checkedRegions[region])
    .map(region => alpha3CodesSov[region])
    .reduce((a, b) => a.concat(b), []);

  dispatch({ type: SET_REGION_CHECKBOX, checkedRegions, filterRegions });
  dispatch({ type: DISABLE_OPT });
};
