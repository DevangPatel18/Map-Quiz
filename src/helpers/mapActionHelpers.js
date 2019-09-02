import { geoPath } from 'd3-geo';
import Papa from 'papaparse';
import projection from '../helpers/projection';
import store from '../store';
import { alpha3Codes, mapConfig } from '../assets/regionAlpha3Codes';

const geoPathLinks = {
  'United States of America': {
    geoJSON:
      'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_1_states_provinces_shp.geojson',
    data:
      'https://res.cloudinary.com/dbeqp2lyo/raw/upload/v1566493791/Map%20Quiz/usData.csv',
    capitalLatLng:
      'https://res.cloudinary.com/dbeqp2lyo/raw/upload/v1566487851/Map%20Quiz/usLatLng.csv',
    subRegionName: 'state',
  },
};

export const getStatesForRegionSelect = regionName => {
  const { center, zoom } = mapConfig[regionName];
  const map = {
    zoom,
    center,
    defaultZoom: zoom,
    defaultCenter: center,
    currentMap: regionName,
    filterRegions: alpha3Codes[regionName],
    markerToggle: '',
  };
  const quiz = {
    selectedProperties: '',
    markerToggle: '',
  };
  return { map, quiz };
};

export const getGeographyPaths = async regionName => {
  const geographyPaths = await fetch(geoPathLinks[regionName].geoJSON)
    .then(response => response.json())
    .then(featureCollection => featureCollection.features);

  await addRegionDataToGeographyPaths(geographyPaths, regionName);

  return geographyPaths;
};

export const getRegionMarkers = geographyPaths =>
  geographyPaths.map(x => {
    const { name, postal } = x.properties;
    const path = geoPath().projection(projection());
    return {
      name,
      regionID: postal,
      coordinates: projection().invert(path.centroid(x)),
      markerOffset: 0,
    };
  });

export const addRegionDataToGeographyPaths = async (
  geographyPaths,
  regionName
) => {
  await fetch(geoPathLinks[regionName].data)
    .then(response => response.text())
    .then(csvtext => {
      Papa.parse(csvtext, {
        header: true,
        skipEmptyLines: true,
        step: row => {
          let geo = geographyPaths.find(
            obj => obj.properties.postal === row.data['regionID']
          );
          if (geo) {
            geo.properties = { ...geo.properties, ...row.data };
            const { area, population, name } = geo.properties;
            geo.properties.area = +area;
            geo.properties.population = +population;
            geo.properties.spellings = [name];
          }
        },
      });
    });
};

export const getCapitalMarkers = async (geographyPaths, regionName) => {
  const newCapitalMarkers = [];
  await fetch(geoPathLinks[regionName].capitalLatLng)
    .then(response => response.text())
    .then(csvtext => {
      Papa.parse(csvtext, {
        header: true,
        skipEmptyLines: true,
        step: row => {
          let geo = geographyPaths.find(
            obj => obj.properties.postal === row.data['regionID']
          );
          if (geo) {
            newCapitalMarkers.push({
              name: geo.properties.capital,
              regionID: row.data['regionID'],
              coordinates: [+row.data['lng'], +row.data['lat']],
              markerOffset: -7,
            });
          }
        },
      });
    });
  return newCapitalMarkers;
};

export const getSubRegionName = regionName =>
  geoPathLinks[regionName].subRegionName;

export const getGeoPathCenterAndZoom = geographyPath => {
  const { regionMarkers } = store.getState().data;
  const { dimensions, regionKey } = store.getState().map;
  const { properties } = geographyPath;

  const center = regionMarkers.find(x => x[regionKey] === properties[regionKey])
    .coordinates;
  const path = geoPath().projection(projection());
  const bounds = path.bounds(geographyPath);
  const width = bounds[1][0] - bounds[0][0];
  const height = bounds[1][1] - bounds[0][1];
  let zoom = 0.7 / Math.max(width / dimensions[0], height / dimensions[1]);

  zoom = properties[regionKey] === 'USA' ? zoom * 6 : zoom;
  zoom = Math.min(zoom, 64);
  return { center, zoom };
};

export const getNewRegionDataSet = async regionKey => {
  const geographyPaths = await getGeographyPaths(regionKey);
  const regionMarkers = getRegionMarkers(geographyPaths);
  const capitalMarkers = await getCapitalMarkers(geographyPaths, regionKey);
  const subRegionName = getSubRegionName(regionKey);
  return { geographyPaths, regionMarkers, capitalMarkers, subRegionName };
};

export const getUpdatedRegionDataSets = async regionKey => {
  const { regionDataSets } = store.getState().data;
  const newRegionDataSet = await getNewRegionDataSet(regionKey);
  return { ...regionDataSets, [regionKey]: newRegionDataSet };
};