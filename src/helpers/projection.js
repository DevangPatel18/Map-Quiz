import { geoTimes } from 'd3-geo-projection';
import store from '../store';

const projection = () => {
  const { dimensions, scale } = store.getState().map;
  return geoTimes()
    .translate(dimensions.map(x => x / 2))
    .scale(scale);
};

export default projection;
