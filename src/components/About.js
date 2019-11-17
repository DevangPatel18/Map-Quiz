import React from 'react';
import AboutStyles from './styles/AboutStyles';

const About = () => {
  return (
    <AboutStyles>
      <div className="about-section">
        <h1>About</h1>
        <p>
          Map Quiz is a site for learning and testing geography, including
          country and subdivision names, capitals, and flags.
        </p>
      </div>
      <div className="about-section">
        <h1>References</h1>
        <p>Sources of data obtained for app.</p>
        <p>
          {'Country Data: '}
          <a href="https://restcountries.eu/">REST Countries API</a>
          {', '}
          <a href="https://en.wikipedia.org/wiki/Main_Page">Wikipedia</a>
        </p>
        <p>
          {'Map Data: '}
          <a href="https://github.com/topojson/world-atlas">
            World Atlas TopoJSON
          </a>
          {', '}
          <a href="https://github.com/LonnyGomes/CountryGeoJSONCollection">
            Country GeoJSON Collection
          </a>
          {', '}
          <a href="http://geojson.xyz/">geojson.xyz</a>
          {', '}
          <a href="https://gadm.org/index.html">GADM maps and data</a>
        </p>
        <p>
          {'Capital Coordinates: '}
          <a href="http://techslides.com/list-of-countries-and-capitals">
            Techslides
          </a>
          {', '}
          <a href="https://latitude.to/">latitude.to</a>
        </p>
        <p>
          {'Population Data: '}
          <a href="https://www.worldbank.org/">The World Bank</a>
        </p>
      </div>
    </AboutStyles>
  );
};

export default About;
