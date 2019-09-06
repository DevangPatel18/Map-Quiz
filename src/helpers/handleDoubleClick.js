import store from '../store';
import projectionFunc from './projection';

export default function handleDoubleClick(evt) {
  const { dimensions, center } = store.getState().map;
  const [width, height] = dimensions;
  const projection = projectionFunc();
  const svg = this._wrapper.querySelector('svg');
  const box = svg.getBoundingClientRect();

  const resizeFactorX = (1 / width) * box.width;
  const resizeFactorY = (1 / height) * box.height;

  const originalCenter = [width / 2, height / 2];
  const prevCenter = projection(center);

  const offsetX = prevCenter[0] - originalCenter[0];
  const offsetY = prevCenter[1] - originalCenter[1];

  const { top, left } = box;
  const clientX = (evt.clientX - left) / resizeFactorX;
  const clientY = (evt.clientY - top) / resizeFactorY;

  const x = clientX + offsetX;
  const y = clientY + offsetY;

  const clickPosition = projection.invert([x, y]);

  console.log(clickPosition);
   
}
