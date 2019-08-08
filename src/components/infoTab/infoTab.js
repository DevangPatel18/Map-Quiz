import React from 'react';
import { connect } from 'react-redux';
import InfoTabStyles from '../styles/InfoTabStyles';

const InfoTab = props => {
  const { countryData } = props;
  const { infoTabShow } = props.quiz;
  const { geographyPaths } = props.data;
  let { name, capital, population, area, regionOf } = countryData;
  let regionOfStr = '';
  population = population ? `${population.toLocaleString()}` : 'N/A';
  area = area ? `${area.toLocaleString()} km²` : 'N/A';
  if (regionOf) {
    const regionName = geographyPaths.find(
      x => x.properties.alpha3Code === regionOf
    ).properties.name;
    regionOfStr = `${regionName}`;
  }
  return (
    <InfoTabStyles infoTabShow={infoTabShow}>
      <img
        className="infoTab-flag"
        src={countryData.flag}
        alt={`${name}-flag`}
      />
      <div className="infoTab-desc">
        <li>{name}</li>
        <li>Capital: {capital}</li>
        <li>Population: {population}</li>
        <li>Area: {area}</li>
        {regionOfStr !== '' ? <li>Region of {regionOfStr}</li> : ''}
      </div>
    </InfoTabStyles>
  );
};

const mapStateToProps = state => ({
  data: state.data,
  quiz: state.quiz,
});

export default connect(mapStateToProps)(InfoTab);
