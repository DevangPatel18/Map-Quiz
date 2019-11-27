const geoPathLink = {
  'United States of America': {
    geoJSON:
      'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_1_states_provinces_shp.geojson',
    data:
      'https://res.cloudinary.com/dbeqp2lyo/raw/upload/v1574891508/Map%20Quiz/usData.csv',
    subRegionName: 'state',
    regionID: 'postal',
  },
  China: {
    geoJSON:
      'https://res.cloudinary.com/dbeqp2lyo/raw/upload/v1570134411/Map%20Quiz/China_provinces.json',
    data:
      'https://res.cloudinary.com/dbeqp2lyo/raw/upload/v1574891508/Map%20Quiz/China_data.csv',
    subRegionName: 'province',
    regionID: 'HASC_1',
  },
  India: {
    geoJSON:
      'https://res.cloudinary.com/dbeqp2lyo/raw/upload/v1570301819/Map%20Quiz/India_states.json',
    data:
      'https://res.cloudinary.com/dbeqp2lyo/raw/upload/v1574891508/Map%20Quiz/India_data.csv',
    subRegionName: 'state',
    regionID: 'HASC_1',
  },
  Germany: {
    geoJSON:
      'https://res.cloudinary.com/dbeqp2lyo/raw/upload/v1574191982/Map%20Quiz/Germany_states.json',
    data:
      'https://res.cloudinary.com/dbeqp2lyo/raw/upload/v1574891508/Map%20Quiz/Germany_data.csv',
    subRegionName: 'state',
    regionID: 'HASC_1',
  },
  France: {
    geoJSON:
      'https://res.cloudinary.com/dbeqp2lyo/raw/upload/v1574806439/Map%20Quiz/France_states.json',
    data:
      'https://res.cloudinary.com/dbeqp2lyo/raw/upload/v1574891508/Map%20Quiz/France_data.csv',
    subRegionName: 'region',
    regionID: 'HASC_1',
  },
};

export default geoPathLink;
