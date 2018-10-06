import { alpha3Codes, mapConfig } from '../assets/regionAlpha3Codes';

export default function handleRegionSelect(region) {
  const { center, zoom } = mapConfig[region];
  this.handleMapRefresh({
    zoom,
    center,
    defaultZoom: zoom,
    defaultCenter: center,
    currentMap: region,
    filterRegions: alpha3Codes[region],
    selectedProperties: '',
    markerToggle: '',
  });
}
