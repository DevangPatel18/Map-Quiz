import { feature } from 'topojson-client';
import projection from './projection';
import { geoPath } from 'd3-geo';
import Papa from 'papaparse';
import store from '../store';
import capitalData from '../assets/country_capitals';
import geoPathLinks from '../assets/geoPathLinks';
import { worldRegions } from '../assets/mapViewSettings';
import {
  DataFix,
  CountryMarkersFix,
  CapitalMarkersFix,
} from '../helpers/attributeFix';

const restDataFields = [
  'name',
  'alpha3Code',
  'alpha2Code',
  'numericCode',
  'area',
  'population',
  'gini',
  'capital',
  'flag',
  'altSpellings',
  'translations',
  'region',
  'subregion',
];

export const getWorldTopology = async () =>
  await fetch('/world-50m.json').then(response => {
    if (response.status !== 200) {
      console.log(`There was a problem: ${response.status}`);
      return;
    }
    return response.json();
  });

export const getWorldGeographyPaths = worldTopology =>
  feature(worldTopology, worldTopology.objects.countries).features;

export const copyWorldGeographyPaths = () =>
  store.getState().data.geographyPaths.map(a => ({ ...a }));

export const getRestCountryData = async () =>
  fetch(
    `https://restcountries.eu/rest/v2/all?fields=${restDataFields.join(';')}`
  ).then(restCountries => {
    if (restCountries.status !== 200) {
      console.log(`There was a problem: ${restCountries.status}`);
      return;
    }
    return restCountries.json();
  });

export const getPopulationData = async () => {
  const populationData = {};
  await fetch('popdata.csv')
    .then(response => response.text())
    .then(csvtext => {
      Papa.parse(csvtext, {
        header: true,
        skipEmptyLines: true,
        step: row => {
          populationData[row.data['Country Code']] = row.data;
        },
      });
    });
  return populationData;
};

const checkGeoPathValidId = geographyPath => +geographyPath.id !== -99;

export const addRestDataToGeoPaths = (restData, geographyPaths) =>
  geographyPaths.filter(checkGeoPathValidId).forEach(geography => {
    const countryData = restData.find(c => +c.numericCode === +geography.id);

    geography.properties = countryData;
    geography.properties.spellings = [
      countryData.name,
      ...countryData.altSpellings,
      ...Object.values(countryData.translations),
    ];
  });

export const updatePopDataInGeoPaths = (populationData, geographyPaths) =>
  geographyPaths.filter(checkGeoPathValidId).forEach(geography => {
    const { alpha3Code, area } = geography.properties;
    if (populationData[alpha3Code]) {
      geography.properties.population = +populationData[alpha3Code]['2018'];
    }
    geography.properties.density = +(geography.properties.population / area);
  });

export const getWorldCapitalMarkers = geographyPaths =>
  geographyPaths
    .filter(checkGeoPathValidId)
    .reduce((capitalMarkers, geography) => {
      const { capital, alpha2Code, alpha3Code } = geography.properties;
      const capObject = capitalData.find(
        capitalObj => capitalObj.CountryCode === alpha2Code
      );
      if (capObject) {
        capitalMarkers.push({
          name: capital,
          alpha3Code,
          coordinates: [
            +capObject.CapitalLongitude,
            +capObject.CapitalLatitude,
          ],
          markerOffset: -7,
        });
      }
      return capitalMarkers;
    }, []);

export const getCountryMarkers = geographyPaths =>
  geographyPaths.map(x => {
    const { name, alpha3Code } = x.properties;
    const path = geoPath().projection(projection());
    return {
      name,
      alpha3Code,
      coordinates: projection().invert(path.centroid(x)),
      markerOffset: 0,
    };
  });

export const getWorldDataSet = async populationData => {
  let geographyPaths = copyWorldGeographyPaths();
  let restData = await getRestCountryData();
  restData = DataFix(restData);

  addRestDataToGeoPaths(restData, geographyPaths);
  updatePopDataInGeoPaths(populationData, geographyPaths);

  let regionMarkers = getCountryMarkers(geographyPaths);
  let capitalMarkers = getWorldCapitalMarkers(geographyPaths);

  regionMarkers = CountryMarkersFix(regionMarkers);
  capitalMarkers = CapitalMarkersFix(capitalMarkers);

  return {
    geographyPaths,
    regionMarkers,
    capitalMarkers,
    subRegionName: 'country',
  };
};

export const getMapViewIds = worldDataSet => {
  const dataArr = worldDataSet.geographyPaths.map(obj => obj.properties);
  const mapViewRegionIds = {
    'North & Central America': dataArr.filter(obj =>
      ['Northern America', 'Central America'].includes(obj.subregion)
    ),
    'South America': dataArr.filter(obj => obj.subregion === 'South America'),
    Caribbean: dataArr.filter(obj => obj.subregion === 'Caribbean'),
    Africa: dataArr.filter(obj => obj.region === 'Africa'),
    Europe: dataArr.filter(obj => obj.region === 'Europe'),
    Asia: dataArr.filter(obj => obj.region === 'Asia'),
    Oceania: dataArr.filter(obj => obj.region === 'Oceania'),
  };

  const mapViewCountryIds = getMapViewCountryIds(mapViewRegionIds);

  for (let mapView in mapViewRegionIds) {
    mapViewRegionIds[mapView] = mapViewRegionIds[mapView].map(obj => obj.alpha3Code);
  }

  return { mapViewRegionIds, mapViewCountryIds };
};

const getRegionIdUniqueGeoPaths = geographyPaths => {
  const regionIDs = []
  const uniqueGeoPaths = geographyPaths.filter(obj => {
    if(regionIDs.includes(obj.properties.alpha3Code)){
      return false
    }
    regionIDs.push(obj.properties.alpha3Code)
    return true
  })
  return uniqueGeoPaths
}

export const checkMapViewsBetweenWorldRegions = regionName => {
  const { currentMap } = store.getState().map;
  return worldRegions.includes(currentMap) && worldRegions.includes(regionName);
};

export const getNewRegionDataSet = async regionKey => {
  const geographyPaths = await getRegionGeographyPaths(regionKey);
  const regionMarkers = getRegionMarkers(geographyPaths);
  const capitalMarkers = await getRegionCapitalMarkers(geographyPaths, regionKey);
  const subRegionName = geoPathLinks[regionKey].subRegionName
  return { geographyPaths, regionMarkers, capitalMarkers, subRegionName };
};

export const getRegionGeographyPaths = async regionName => {
  const geographyPaths = await fetch(geoPathLinks[regionName].geoJSON)
    .then(response => response.json())
    .then(featureCollection => featureCollection.features);

  await addRegionDataToGeographyPaths(geographyPaths, regionName);

  return geographyPaths;
};

export const addRegionDataToGeographyPaths = async (
  geographyPaths,
  regionName
) => {
  let csvData = {}
  await fetch(geoPathLinks[regionName].data)
    .then(response => response.text())
    .then(csvtext => {
      Papa.parse(csvtext, {
        header: true,
        skipEmptyLines: true,
        step: row => {
          csvData[row.data['regionID']] = row.data
        },
      });
    });
    const regionKey = geoPathLinks[regionName].regionID
    for (let geoPath of geographyPaths) {
      if(csvData[geoPath.properties[regionKey]]) {
        geoPath.properties = {...geoPath.properties, ...csvData[geoPath.properties[regionKey]]}
        let { area, population, name } = geoPath.properties;
        geoPath.properties.area = +area;
        geoPath.properties.population = +population;
        geoPath.properties.spellings = [name];
      }
    }
};

export const getRegionMarkers = geographyPaths =>
  geographyPaths.map(x => {
    const { name, regionID } = x.properties;
    const path = geoPath().projection(projection());
    return {
      name,
      regionID,
      coordinates: projection().invert(path.centroid(x)),
      markerOffset: 0,
    };
  });

export const getRegionCapitalMarkers = async (geographyPaths, regionName) => {
  const newCapitalMarkers = [];
  await fetch(geoPathLinks[regionName].capitalLatLng)
    .then(response => response.text())
    .then(csvtext => {
      Papa.parse(csvtext, {
        header: true,
        skipEmptyLines: true,
        step: row => {
          let geo = geographyPaths.find(
            obj => obj.properties.regionID === row.data['regionID']
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

const getMapViewCountryIds = mapViewRegionIds => {
  const mapViewCountryIds = {};
  for (let mapView in mapViewRegionIds) {
    mapViewCountryIds[mapView] = mapViewRegionIds[mapView]
      .filter(obj => !obj.regionOf)
      .map(obj => obj.alpha3Code);
  }
  return mapViewCountryIds;
};

export const getRegionSearchObjectArray = (mapRegions, regionKey) =>
  mapRegions
    .map(x => getRegionSearchObject(x, regionKey))
    .filter(x => x !== null)
    .filter(
      x =>
        !['bl', 'cw', 'gg', 'im', 'je', 'mf', 'ss', 'sx', 'bq', 'ko'].includes(
          x.key
        )
    )
    .sort((a, b) => (a.text > b.text ? 1 : -1));

export const getRegionSearchObject = (properties, regionKey) => {
  let key;
  let flag;
  if (regionKey === 'alpha3Code') {
    if (!properties.alpha2Code) {
      return null;
    }
    key = properties.alpha2Code.toString().toLowerCase();
    flag = { flag: key };
  } else {
    key = properties[regionKey];
  }

  return {
    key,
    ...flag,
    text: properties.name,
    value: properties[regionKey],
  };
};
