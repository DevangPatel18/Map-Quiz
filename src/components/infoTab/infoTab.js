import React from 'react';
import { connect } from 'react-redux';
import InfoTabStyles from '../styles/InfoTabStyles';

const InfoTab = props => {
  const { selectedProperties } = props.quiz;
  const { geographyPaths } = props.data;
  if (Object.keys(selectedProperties).length === 0) {
    return null;
  }
  const { name, capital, population, area, regionOf } = selectedProperties;
  const capitalStr = `Capital: ${capital}`;
  const populationStr = `Population: ${population.toLocaleString()}`;
  const areaStr = area ? `Area: ${area.toLocaleString()} km` : 'N/A';
  let regionOfStr;
  if (regionOf) {
    const regionName = geographyPaths.find(
      x => x.properties.alpha3Code === regionOf
    ).properties.name;
    regionOfStr = `Region of ${regionName}`;
  }
  return (
    <InfoTabStyles>
      <img className="infoTab-flag" src={selectedProperties.flag} alt="" />
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

const mapStateToProps = state => ({
  data: state.data,
  quiz: state.quiz,
});

export default connect(mapStateToProps)(InfoTab);
