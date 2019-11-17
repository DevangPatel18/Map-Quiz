
## [Map Quiz](https://objective-ramanujan-b71cd2.netlify.com/)

Map Quiz is a website that allows users to view country information, and features quizzes on region names, capitals, and flags for different parts of the globe. It was built using Create React App and utilizes the Rest Countries API, React-Simple-Maps library, and components from Semantic-UI-React.

## Features

- Full map includes 248 regions which include sovereign countries and their dependencies.
- Sub-division maps are available for certain countries
- Clicked regions display the associated flag, name, capital, population, area, and administrative status if relevant.
- Each map view features 5 different quizzes.
  - Click quizzes involve clicking the appropriate area given the region name, capital, or flag.
  - Type quizzes require a typed response for the respective name or capital of the highlighted region.
- All map views feature a region dropdown to immediately zoom to the selected region and display it's information.
- All region specific map views feature toggles to view text labels for each name or capital.

## Built With

- [Create React App](https://github.com/facebook/create-react-app) - Development environment
- [React-Simple-Maps](https://github.com/zcreativelabs/react-simple-maps/) - Used for rendering map
- [Semantic-UI-React](https://react.semantic-ui.com/) - Components for user interface

## Data Sources

- [Rest Countries API](https://restcountries.eu/) - Used for fetching country data
- [World Atlas TopoJSON](https://github.com/topojson/world-atlas) - GeoJSON for world map
- [GADM maps and data](https://gadm.org/index.html) - GeoJSON for country sub-divisions
- [Country GeoJSON Collection](https://github.com/LonnyGomes/CountryGeoJSONCollection) - GeoJSON for individual regions
- [Techslides](http://techslides.com/list-of-countries-and-capitals) - Capital Coordinates
- [The World Bank](https://www.worldbank.org/) - Population Data
