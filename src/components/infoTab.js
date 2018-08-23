import React from 'react';

const InfoTab = (props) => {
  let name, capital, population, area;

  if ((Object.keys(props.country).length === 0)) {
    name = capital = population = area = "N/A"
  } else {
    name = props.country.name
    capital = props.country.capital
    population = props.country.population.toLocaleString()
    area = props.country.area ? props.country.area.toLocaleString():"N/A"
  }
  return (
    <div style={{
      position: "absolute",
      left: "1em",
      top: "calc(150px + 1em)",
      textAlign: "left",
    }}>
      <img src={props.country.flag}
        style={{
          display: "block",
          maxWidth:"250px",
          maxHeight: "150px",
          background: "white",
          border: "1px solid black",
        }}
        alt=""
      />
      <div style={{
        background: "rgba(0,0,0,.6)",
        listStyleType: "none", 
        padding: ".3em",
        color: "white",
        lineHeight: "1.4",
        letterSpacing: "1px"
      }}>
        <li>{name}</li>
        <li>Capital: {capital}</li>
        <li>Population: {population}</li>
        <li>Area: {area} km<sup style={{fontSize: ".6em"}}>2</sup></li>
      </div>
    </div>
  )
}

export default InfoTab