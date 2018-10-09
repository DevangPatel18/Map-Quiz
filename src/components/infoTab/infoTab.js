import React from 'react';
import { isMobile } from 'react-device-detect';
import './infoTab.css';

const InfoTab = (props) => {
  const { country, geoPaths, loadData } = props;
  if ((Object.keys(country).length === 0)) {
    return null;
  }
  const {
    name, capital, population, area, regionOf,
  } = country;
  if (!population) {
    loadData(country);
    return null;
  }
  const capitalStr = `Capital: ${capital}`;
  const populationStr = `Population: ${population.toLocaleString()}`;
  const areaStr = area ? `Area: ${area.toLocaleString()} km` : 'N/A';
  let regionOfStr;
  if (regionOf) {
    const regionName = geoPaths
      .find(x => x.properties.alpha3Code === regionOf).properties.name;
    regionOfStr = `Region of ${regionName}`;
  }
  const fontSize = isMobile ? 12 : 16;
  return (
    <div className="infoTab" style={{ fontSize: `${fontSize}px` }}>
      <img className="infoTab-flag" src={country.flag} alt="" />
      <div className="infoTab-desc">
        <li>{name}</li>
        <li>{capitalStr}</li>
        <li>{populationStr}</li>
        <li>
          {areaStr}
          <sup style={{ fontSize: '.6em' }}>2</sup>
        </li>
        {regionOf !== '' ? (<li>{regionOfStr}</li>) : ''}
      </div>
    </div>
  );
};

export default InfoTab;
