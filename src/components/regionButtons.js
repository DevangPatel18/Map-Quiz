import React from 'react';
import { Dropdown } from 'semantic-ui-react'
import "../App.css"

const regions = [
  { text:"World", value:"World" },
  { text:"North and Central America", value:"North and Central America" },
  { text:"South America", value:"South America" },
  { text:"Carribean", value:"Carribean" },
  { text:"Africa", value:"Africa" },
  { text:"Europe", value:"Europe" },
  { text:"Asia", value:"Asia" },
  { text:"Oceania", value:"Oceania" }
]

const RegionButtons = (props) => {
  return (
    <div className="regionButtons">
      <Dropdown placeholder="Select Region" fluid selection options={regions} 
        onChange={e => {
          switch(e.target.innerText) {
            case "World": props.regionFunc("world"); break;
            case "North and Central America": props.regionFunc("naca"); break;
            case "South America": props.regionFunc("south"); break;
            case "Carribean": props.regionFunc("carrib"); break;
            case "Africa": props.regionFunc("africa"); break;
            case "Europe": props.regionFunc("europe"); break;
            case "Asia": props.regionFunc("asia"); break;
            case "Oceania": props.regionFunc("oceania"); break;
            default: ;
          }
        }}
      />
    </div>
  )
}

export default RegionButtons
