import React from 'react';
import { isMobile } from 'react-device-detect';
import InfoTabStyles from '../styles/InfoTabStyles';

const InfoTab = props => {
  const { country, geoPaths } = props;
  if (Object.keys(country).length === 0) {
    return null;
  }
  const { name, capital, population, area, regionOf } = country;
  const capitalStr = `Capital: ${capital}`;
  const populationStr = `Population: ${population.toLocaleString()}`;
  const areaStr = area ? `Area: ${area.toLocaleString()} km` : 'N/A';
  let regionOfStr;
  if (regionOf) {
    const regionName = geoPaths.find(x => x.properties.alpha3Code === regionOf)
      .properties.name;
    regionOfStr = `Region of ${regionName}`;
  }
  return (
    <InfoTabStyles isMobile={isMobile}>
      <img className="infoTab-flag" src={country.flag} alt="" />
      <div className="infoTab-desc">
        <li>{name}</li>
        <li>{capitalStr}</li>
        <li>{populationStr}</li>
        <li>{areaStr}²</li>
        {regionOf !== '' ? <li>{regionOfStr}</li> : ''}
      </div>
    </InfoTabStyles>
  );
};

export default InfoTab;
