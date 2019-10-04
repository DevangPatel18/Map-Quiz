const geoPathLink = {
  'United States of America': {
    geoJSON:
      'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_1_states_provinces_shp.geojson',
    data:
      'https://res.cloudinary.com/dbeqp2lyo/raw/upload/v1566493791/Map%20Quiz/usData.csv',
    capitalLatLng:
      'https://res.cloudinary.com/dbeqp2lyo/raw/upload/v1566487851/Map%20Quiz/usLatLng.csv',
    subRegionName: 'state',
    regionID: 'postal',
  },
  China: {
    geoJSON:
      'https://res.cloudinary.com/dbeqp2lyo/raw/upload/v1570134411/Map%20Quiz/China_provinces.json',
    data:
      'https://res.cloudinary.com/dbeqp2lyo/raw/upload/v1570135001/Map%20Quiz/China_data.csv',
    capitalLatLng:
      'https://res.cloudinary.com/dbeqp2lyo/raw/upload/v1570134840/Map%20Quiz/China_capitals_LatLng.csv',
    subRegionName: 'province',
    regionID: 'HASC_1',
  },
  India: {
    geoJSON:
      'https://res.cloudinary.com/dbeqp2lyo/raw/upload/v1570223141/Map%20Quiz/India_states.json',
    data:
      'https://res.cloudinary.com/dbeqp2lyo/raw/upload/v1570223063/Map%20Quiz/India_data.csv',
    capitalLatLng:
      'https://res.cloudinary.com/dbeqp2lyo/raw/upload/v1570223063/Map%20Quiz/India_capital_LatLng.csv',
    subRegionName: 'state',
    regionID: 'HASC_1',
  },
};

export default geoPathLink;
