import React from 'react';
import './infoTab.css';

const InfoTab = (props) => {
  if ((Object.keys(props.country).length === 0)) {
    return null
  } else {
    var { name, capital, population, area, regionOf } = props.country;
    population = population.toLocaleString()
    area = area ? area.toLocaleString():"N/A"
    if(regionOf) {
      let regionObj = props.geoPaths.find(x => x.properties.alpha3Code === regionOf);
      let regionName = regionObj.properties.name;
      regionOf = `Region of ${regionName}`;
    }
  }
  return (
    <div className="infoTab">
      <img className="infoTab-flag" src={props.country.flag} alt="" />
      <div className="infoTab-desc">
        <li>{name}</li>
        <li>Capital: {capital}</li>
        <li>Population: {population}</li>
        <li>Area: {area} km<sup style={{fontSize: ".6em"}}>2</sup></li>
        {regionOf !== "" ? (<li>{regionOf}</li>):""}
      </div>
    </div>
  )
}

export default InfoTab