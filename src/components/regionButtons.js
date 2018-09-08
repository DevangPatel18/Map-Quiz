import React from 'react';
import "../App.css"

const RegionButtons = (props) => {
  return (
    <div className="regionButtons">
      <button onClick={ () => props.regionFunc("world") }>World</button>
      <button onClick={ () => props.regionFunc("naca") }>North and Central America</button>
      <button onClick={ () => props.regionFunc("south") }>South America</button>
      <button onClick={ () => props.regionFunc("carrib") }>Carribean</button>
      <button onClick={ () => props.regionFunc("africa") }>Africa</button>
      <button onClick={ () => props.regionFunc("europe") }>Europe</button>
      <button onClick={ () => props.regionFunc("asia") }>Asia</button>
      <button onClick={ () => props.regionFunc("oceania") }>Oceania</button>
    </div>
  )
}

export default RegionButtons