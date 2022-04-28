import { feature } from 'topojson-client';
import projection from './projection';
import { geoPath } from 'd3-geo';
import Papa from 'papaparse';
import store from '../store';
import capitalData from '../assets/country_capitals';
import geoPathLinks from '../assets/geoPathLinks';
import { worldRegions } from '../assets/mapViewSettings';
import { getFirebaseRegionData } from '../firebase';
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

export const getWorldDataSet = async populationData => {
  let geographyPaths = copyWorldGeographyPaths();
  let restData = await getRestCountryData();
  restData = DataFix(restData);

  addRestDataToGeoPaths(restData, geographyPaths);
  updatePopDataInGeoPaths(populationData, geographyPaths);
  
  const regionIdUniqueGeoPaths = getRegionIdUniqueGeoPaths(geographyPaths)
  let regionMarkers = getCountryMarkers(regionIdUniqueGeoPaths);
  let capitalMarkers = getWorldCapitalMarkers(regionIdUniqueGeoPaths);

  regionMarkers = CountryMarkersFix(regionMarkers);
  capitalMarkers = CapitalMarkersFix(capitalMarkers);

  return {
    geographyPaths,
    regionMarkers,
    capitalMarkers,
    subRegionName: 'country',
  };
};

const copyWorldGeographyPaths = () =>
  store.getState().data.geographyPaths.map(a => ({ ...a }));

const getRestCountryData = async () =>
  fetch(
    `https://restcountries.com/v2/all?fields=${restDataFields.join(',')}`
  ).then(restCountries => {
    if (restCountries.status !== 200) {
      console.log(`There was a problem: ${restCountries.status}`);
      return;
    }
    return restCountries.json();
  });

const addRestDataToGeoPaths = (restData, geographyPaths) =>
  geographyPaths.filter(checkGeoPathValidId).forEach(geography => {
    const countryData = restData.find(c => +c.numericCode === +geography.id);

    geography.properties = countryData;
    geography.properties.spellings = [
      countryData.name,
      ...countryData.altSpellings,
      ...Object.values(countryData.translations),
    ];
    geography.properties.regionID = countryData.alpha3Code;
  });

const updatePopDataInGeoPaths = (populationData, geographyPaths) =>
  geographyPaths.filter(checkGeoPathValidId).forEach(geography => {
    const { regionID, area } = geography.properties;
    if (populationData[regionID]) {
      geography.properties.population = +populationData[regionID]['2018'];
    }
    geography.properties.density = +(geography.properties.population / area);
  });

const getCountryMarkers = geographyPaths =>
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

const getWorldCapitalMarkers = geographyPaths =>
  geographyPaths
    .filter(checkGeoPathValidId)
    .reduce((capitalMarkers, geography) => {
      const { capital, alpha2Code, regionID } = geography.properties;
      const capObject = capitalData.find(
        capitalObj => capitalObj.CountryCode === alpha2Code
      );
      if (capObject) {
        capitalMarkers.push({
          name: capital,
          regionID,
          coordinates: [
            +capObject.CapitalLongitude,
            +capObject.CapitalLatitude,
          ],
          markerOffset: -7,
        });
      }
      return capitalMarkers;
    }, []);

const checkGeoPathValidId = geographyPath => {
  switch(+geographyPath.id) {
    case -99:
      return false;
    default:
      return true;
  }
};

export const getMapViewIds = worldDataSet => {
  const regionIdUniqueGeoPaths = getRegionIdUniqueGeoPaths(worldDataSet.geographyPaths)
  const dataArr = regionIdUniqueGeoPaths.map(obj => obj.properties);
  const mapViewRegionIds = {
    'North & Central America': dataArr.filter(obj =>
      ['Northern America', 'North America', 'Central America'].includes(
        obj.subregion)
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
    mapViewRegionIds[mapView] = mapViewRegionIds[mapView].map(obj => obj.regionID);
  }

  return { mapViewRegionIds, mapViewCountryIds };
};

export const getRegionIdUniqueGeoPaths = geographyPaths => {
  const regionIDs = []
  const uniqueGeoPaths = geographyPaths.filter(obj => {
    if(regionIDs.includes(obj.properties.regionID)){
      return false
    }
    regionIDs.push(obj.properties.regionID)
    return true
  })
  return uniqueGeoPaths
}

const getMapViewCountryIds = mapViewRegionIds => {
  const mapViewCountryIds = {};
  for (let mapView in mapViewRegionIds) {
    mapViewCountryIds[mapView] = mapViewRegionIds[mapView]
      .filter(obj => !obj.regionOf)
      .map(obj => obj.regionID);
  }
  return mapViewCountryIds;
};

export const checkMapViewsBetweenWorldRegions = regionName => {
  const { currentMap } = store.getState().map;
  return worldRegions.includes(currentMap) && worldRegions.includes(regionName);
};

export const getNewRegionDataSet = async regionName => {
  const geographyPaths = await getRegionGeographyPaths(regionName);
  if (!geographyPaths) return null;
  const regionMarkers = getRegionMarkers(geographyPaths);
  const capitalMarkers = await getRegionCapitalMarkers(geographyPaths);
  const subRegionName = geoPathLinks[regionName].subRegionName;
  return { geographyPaths, regionMarkers, capitalMarkers, subRegionName };
};

const getRegionGeographyPaths = async regionName => {
  const geographyPaths = await fetch(geoPathLinks[regionName].geoJSON)
    .then(response => response.json())
    .then(featureCollection => featureCollection.features);

  const isDataValid = await addRegionDataToGeographyPaths(geographyPaths, regionName);

  return isDataValid ? geographyPaths : null;
};

const addRegionDataToGeographyPaths = async (geographyPaths, regionName) => {
  const regionData = await getFirebaseRegionData(regionName)
  if (!regionData) return false;
  const regionDataObj = regionData.reduce((obj, regionData) => {
    if(regionData.regionID) {
      obj[regionData.regionID] = regionData
    }
    return obj
  }, {});

  const regionKey = geoPathLinks[regionName].regionID
  for (let geoPath of geographyPaths) {
    if(regionDataObj[geoPath.properties[regionKey]]) {
      geoPath.properties = {...geoPath.properties, ...regionDataObj[geoPath.properties[regionKey]]}
      let { area, population, name } = geoPath.properties;
      geoPath.properties.area = +area;
      geoPath.properties.population = +population;
      geoPath.properties.spellings = [name];
      geoPath.properties.density = parseInt(population/area);
    }
  }
  return true;
};

const getRegionMarkers = geographyPaths =>
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

const getRegionCapitalMarkers = async geographyPaths => {
  const newCapitalMarkers = [];
  for (let geoPath of geographyPaths) {
    if (geoPath.properties) {
    const { regionID, capital, lat, lng } = geoPath.properties
      newCapitalMarkers.push({
        name: capital,
        regionID,
        coordinates: [+lng, +lat],
        markerOffset: -7,
      });
    }
  }
  return newCapitalMarkers;
};

export const getRegionSearchObjectArray = mapRegions =>
  mapRegions
    .map(getRegionSearchObject)
    .filter(x => x.key)
    .filter(
      x =>
        !['bl', 'cw', 'gg', 'im', 'je', 'mf', 'ss', 'sx', 'bq'].includes(
          x.key
        )
    )
    .sort((a, b) => (a.text > b.text ? 1 : -1));

const getRegionSearchObject = properties => {
  let key;
  let flag;
  if (properties.alpha2Code) {
    key = properties.alpha2Code.toString().toLowerCase();
    flag = { flag: key };
  } else {
    key = properties.regionID;
  }

  return {
    key,
    ...flag,
    text: properties.name,
    value: properties.regionID,
  };
};
