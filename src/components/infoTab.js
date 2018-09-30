import React from 'react';
import './infoTab.css';

const InfoTab = (props) => {
  let name, capital, population, area;

  if ((Object.keys(props.country).length === 0)) {
    return null
  } else {
    name = props.country.name
    capital = props.country.capital
    population = props.country.population.toLocaleString()
    area = props.country.area ? props.country.area.toLocaleString():"N/A"
  }
  return (
    <div className="infoTab">
      <img className="infoTab-flag" src={props.country.flag} alt="" />
      <div className="infoTab-desc">
        <li>{name}</li>
        <li>Capital: {capital}</li>
        <li>Population: {population}</li>
        <li>Area: {area} km<sup style={{fontSize: ".6em"}}>2</sup></li>
      </div>
    </div>
  )
}

export default InfoTab